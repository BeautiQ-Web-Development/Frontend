// pages/admin/Admin.ChatPage.js - Admin chat page
import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
  Drawer,
  IconButton
} from '@mui/material';
import { Menu as MenuIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useChat } from '../../context/ChatContext';
import ChatSidebar from '../../components/ChatSidebar';
import ChatWindow from '../../components/ChatWindow';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header';
import Footer from '../../components/footer';
import AdminSidebar from '../../components/AdminSidebar';
import useSidebar from '../../hooks/useSidebar';

const AdminChatPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useAuth();
  const { sidebarOpen: navSidebarOpen, toggleSidebar } = useSidebar();
  const [chatSidebarOpen, setChatSidebarOpen] = React.useState(!isMobile);
  const {
    contacts,
    selectedContact,
    messages,
    onlineUsers,
    typingUsers,
    loading,
    loadContacts,
    loadChatHistory,
    sendMessage,
    sendTypingIndicator,
    deleteContact,
    setSelectedContact
  } = useChat();

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  useEffect(() => {
    if (selectedContact) {
      loadChatHistory(selectedContact._id);
      if (isMobile) {
        setChatSidebarOpen(false);
      }
    }
  }, [selectedContact, loadChatHistory, isMobile]);

  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
  };

  const handleDeleteContact = (contactId) => {
    deleteContact(contactId);
  };

  const handleBackToContacts = () => {
    setSelectedContact(null);
    setChatSidebarOpen(true);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header toggleSidebar={toggleSidebar} pageTitle="Chat" />
      <AdminSidebar open={navSidebarOpen} onClose={toggleSidebar} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          transition: 'margin-left 0.3s',
          marginLeft: navSidebarOpen && !isMobile ? '240px' : 0,
        }}
      >
        <Container maxWidth="xl" sx={{ py: 3 }}>
          <Paper elevation={3} sx={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <Box
              sx={{
                p: 2,
                borderBottom: 1,
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              {!isMobile && (
                <IconButton 
                  onClick={() => setChatSidebarOpen(!chatSidebarOpen)}
                  edge="start"
                  sx={{ mr: 1 }}
                >
                  <MenuIcon />
                </IconButton>
              )}
              {isMobile && !selectedContact && (
                <IconButton 
                  onClick={() => setChatSidebarOpen(!chatSidebarOpen)}
                  edge="start"
                  sx={{ mr: 1 }}
                >
                  <MenuIcon />
                </IconButton>
              )}
              {isMobile && selectedContact && (
                <IconButton onClick={handleBackToContacts} edge="start" sx={{ mr: 1 }}>
                  <ArrowBackIcon />
                </IconButton>
              )}
              <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
                Chat Application
              </Typography>
            </Box>

        {/* Chat Content */}
        <Box sx={{ flexGrow: 1, display: 'flex', overflow: 'hidden' }}>
          {isMobile ? (
            <>
              {/* Mobile Drawer */}
              <Drawer
                variant="temporary"
                open={chatSidebarOpen}
                onClose={() => setChatSidebarOpen(false)}
                ModalProps={{
                  keepMounted: true, // Better mobile performance
                }}
                sx={{
                  '& .MuiDrawer-paper': {
                    width: '80%',
                    maxWidth: 320
                  }
                }}
              >
                <ChatSidebar
                  contacts={contacts}
                  selectedContact={selectedContact}
                  onSelectContact={handleSelectContact}
                  onlineUsers={onlineUsers}
                />
              </Drawer>

              {/* Mobile Chat Window */}
              {selectedContact && (
                <Box sx={{ flexGrow: 1, display: 'flex' }}>
                  <ChatWindow
                    contact={selectedContact}
                    messages={messages}
                    currentUserId={user?.id}
                    onSendMessage={sendMessage}
                    onTyping={sendTypingIndicator}
                    typingUsers={typingUsers}
                    isOnline={onlineUsers.has(selectedContact._id)}
                    loading={loading}
                    onDeleteContact={handleDeleteContact}
                  />
                </Box>
              )}

              {!selectedContact && (
                <Box
                  sx={{
                    flexGrow: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Typography variant="body1" color="text.secondary">
                    Select a service provider to start chatting
                  </Typography>
                </Box>
              )}
            </>
          ) : (
            <>
              {/* Desktop Layout */}
              <ChatSidebar
                contacts={contacts}
                selectedContact={selectedContact}
                onSelectContact={handleSelectContact}
                onlineUsers={onlineUsers}
              />
              <ChatWindow
                contact={selectedContact}
                messages={messages}
                currentUserId={user?.id}
                onSendMessage={sendMessage}
                onTyping={sendTypingIndicator}
                typingUsers={typingUsers}
                isOnline={selectedContact ? onlineUsers.has(selectedContact._id) : false}
                loading={loading}
                onDeleteContact={handleDeleteContact}
              />
            </>
          )}
        </Box>
      </Paper>
    </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default AdminChatPage;
