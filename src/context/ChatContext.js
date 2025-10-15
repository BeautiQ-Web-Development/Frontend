// context/ChatContext.js - Chat context for managing chat state
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { getChatAccounts, getChatHistory, sendMessage as sendMessageAPI, markMessagesAsRead } from '../services/chat';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [typingUsers, setTypingUsers] = useState(new Map());
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Initialize socket connection
  useEffect(() => {
    if (!user) return;

    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    const token = localStorage.getItem('token');

    const newSocket = io(API_URL, {
      auth: { token },
      query: { token }
    });

    newSocket.on('connect', () => {
      console.log('✅ Socket connected');
      newSocket.emit('register', user.id);
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
    });

    // Listen for incoming messages
    newSocket.on('receiveMessage', (data) => {
      console.log('📨 Received message:', data);
      
      // Add message to current chat if it's from the selected contact
      if (selectedContact && data.senderId === selectedContact._id) {
        setMessages(prev => [...prev, {
          senderId: { _id: data.senderId, fullName: data.senderName },
          message: data.message,
          createdAt: data.timestamp
        }]);
        
        // Mark as read
        markMessagesAsRead(data.senderId).catch(console.error);
      } else {
        // Update unread count
        setUnreadCount(prev => prev + 1);
      }

      // Update last message in contacts list
      setContacts(prev => {
        const updated = prev.map(contact => {
          if (contact._id === data.senderId) {
            return {
              ...contact,
              lastMessage: data.message,
              lastMessageTime: data.timestamp,
              unreadCount: selectedContact?._id === data.senderId ? 0 : (contact.unreadCount || 0) + 1
            };
          }
          return contact;
        });
        
        // Sort by last message time
        return updated.sort((a, b) => {
          if (a.lastMessageTime && b.lastMessageTime) {
            return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
          }
          if (a.lastMessageTime) return -1;
          if (b.lastMessageTime) return 1;
          return 0;
        });
      });
    });

    // Listen for user online status
    newSocket.on('userOnline', (data) => {
      console.log('🟢 User online:', data.userId);
      setOnlineUsers(prev => new Set([...prev, data.userId]));
      
      // Update contact status
      setContacts(prev => prev.map(contact => 
        contact._id === data.userId ? { ...contact, isOnline: true } : contact
      ));
    });

    // Listen for user offline status
    newSocket.on('userOffline', (data) => {
      console.log('🔴 User offline:', data.userId);
      setOnlineUsers(prev => {
        const updated = new Set(prev);
        updated.delete(data.userId);
        return updated;
      });
      
      // Update contact status
      setContacts(prev => prev.map(contact => 
        contact._id === data.userId ? { ...contact, isOnline: false } : contact
      ));
    });

    // Listen for typing indicators
    newSocket.on('userTyping', (data) => {
      if (data.isTyping) {
        setTypingUsers(prev => new Map(prev).set(data.senderId, data.senderName));
      } else {
        setTypingUsers(prev => {
          const updated = new Map(prev);
          updated.delete(data.senderId);
          return updated;
        });
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [user]);

  // Load contacts
  const loadContacts = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await getChatAccounts();
      if (response.success) {
        setContacts(response.contacts);
        
        // Update online users
        const online = new Set(
          response.contacts
            .filter(contact => contact.isOnline)
            .map(contact => contact._id)
        );
        setOnlineUsers(online);
        
        // Calculate unread count
        const totalUnread = response.contacts.reduce((sum, contact) => sum + (contact.unreadCount || 0), 0);
        setUnreadCount(totalUnread);
      }
    } catch (error) {
      console.error('Error loading contacts:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load chat history for a contact
  const loadChatHistory = useCallback(async (contactId) => {
    if (!contactId) {
      console.log('❌ No contactId provided to loadChatHistory');
      return;
    }
    
    console.log('📋 Loading chat history for contact:', contactId);
    
    try {
      setLoading(true);
      const response = await getChatHistory(contactId);
      console.log('✅ Chat history response:', response);
      
      if (response.success) {
        setMessages(response.messages || []);
        // Don't call setSelectedContact here - it's already set by the ChatPage
        // and would cause an infinite loop due to useEffect dependencies
        
        // Mark messages as read
        try {
          await markMessagesAsRead(contactId);
        } catch (markReadError) {
          console.error('Error marking messages as read:', markReadError);
          // Continue even if mark as read fails
        }
        
        // Update unread count in contacts
        setContacts(prev => {
          const updated = prev.map(contact => 
            contact._id === contactId ? { ...contact, unreadCount: 0 } : contact
          );
          
          // Recalculate total unread count
          const totalUnread = updated.reduce((sum, contact) => {
            return sum + (contact.unreadCount || 0);
          }, 0);
          setUnreadCount(totalUnread);
          
          return updated;
        });
      } else {
        console.error('❌ Chat history response not successful:', response);
        setMessages([]);
      }
    } catch (error) {
      console.error('❌ Error loading chat history:', error);
      console.error('Error details:', error.response?.data || error.message);
      setMessages([]);
    } finally {
      setLoading(false);
      console.log('✅ Loading complete');
    }
  }, []);

  // Send a message
  const sendMessage = useCallback(async (message) => {
    if (!selectedContact || !message.trim() || !socket) return;

    try {
      // Send via API
      const response = await sendMessageAPI(selectedContact._id, message);
      
      if (response.success) {
        // Add to local messages
        setMessages(prev => [...prev, response.message]);
        
        // Send via socket for real-time delivery
        socket.emit('sendMessage', {
          receiverId: selectedContact._id,
          senderId: user.id,
          senderName: user.fullName,
          message
        });
        
        // Update last message in contacts
        setContacts(prev => {
          const updated = prev.map(contact => {
            if (contact._id === selectedContact._id) {
              return {
                ...contact,
                lastMessage: message,
                lastMessageTime: new Date()
              };
            }
            return contact;
          });
          
          // Sort by last message time
          return updated.sort((a, b) => {
            if (a.lastMessageTime && b.lastMessageTime) {
              return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
            }
            if (a.lastMessageTime) return -1;
            if (b.lastMessageTime) return 1;
            return 0;
          });
        });
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  }, [selectedContact, socket, user]);

  // Send typing indicator
  const sendTypingIndicator = useCallback((isTyping) => {
    if (!selectedContact || !socket) return;
    
    socket.emit('typing', {
      receiverId: selectedContact._id,
      senderId: user.id,
      senderName: user.fullName,
      isTyping
    });
  }, [selectedContact, socket, user]);

  // Delete a contact
  const deleteContact = useCallback((contactId) => {
    setContacts(prev => prev.filter(contact => contact._id !== contactId));
    
    if (selectedContact?._id === contactId) {
      setSelectedContact(null);
      setMessages([]);
    }
  }, [selectedContact]);

  const value = {
    socket,
    contacts,
    selectedContact,
    messages,
    onlineUsers,
    typingUsers,
    unreadCount,
    loading,
    loadContacts,
    loadChatHistory,
    sendMessage,
    sendTypingIndicator,
    deleteContact,
    setSelectedContact
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
