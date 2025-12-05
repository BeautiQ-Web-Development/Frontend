// components/ChatWindow.js - Main chat window showing messages
import React, { useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Paper,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Circle as CircleIcon
} from '@mui/icons-material';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import { formatDistanceToNow } from 'date-fns';

const ChatWindow = ({
  contact,
  messages,
  currentUserId,
  onSendMessage,
  onTyping,
  typingUsers,
  isOnline,
  loading,
  onDeleteContact
}) => {
  const messagesEndRef = useRef(null);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    if (window.confirm(`Remove ${contact.fullName} from your chat list?`)) {
      onDeleteContact(contact._id);
    }
    handleMenuClose();
  };

  const getDisplayName = () => {
    return contact.fullName || 'Unknown User';
  };

  const getDisplayId = () => {
    if (contact.role === 'customer') {
      return contact.customerId || '';
    } else if (contact.role === 'serviceProvider') {
      return contact.serviceProviderId || '';
    }
    return 'Admin';
  };

  const getOnlineStatus = () => {
    if (isOnline) {
      return 'Online';
    }
    if (contact.lastSeen) {
      try {
        return `Last seen ${formatDistanceToNow(new Date(contact.lastSeen), { addSuffix: true })}`;
      } catch {
        return 'Offline';
      }
    }
    return 'Offline';
  };

  if (!contact) {
    return (
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default'
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No chat selected
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Select a contact to start messaging
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        bgcolor: 'background.default'
      }}
    >
      {/* Chat Header */}
      <Paper
        elevation={2}
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderRadius: 0
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={contact.profilePhoto}
              alt={getDisplayName()}
              imgProps={{ 
                crossOrigin: 'anonymous',
                referrerPolicy: 'no-referrer'
              }}
              sx={{ width: 48, height: 48 }}
            >
              {getDisplayName().charAt(0).toUpperCase()}
            </Avatar>
            {isOnline && (
              <CircleIcon
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  fontSize: 14,
                  color: 'success.main',
                  bgcolor: 'background.paper',
                  borderRadius: '50%'
                }}
              />
            )}
          </Box>
          
          <Box>
            <Typography variant="h6">
              {getDisplayName()}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                label={getDisplayId()}
                size="small"
                variant="outlined"
              />
              <Typography variant="caption" color="text.secondary">
                {getOnlineStatus()}
              </Typography>
            </Box>
          </Box>
        </Box>

        <IconButton onClick={handleMenuOpen}>
          <MoreVertIcon />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleDelete}>
            Remove from chat list
          </MenuItem>
        </Menu>
      </Paper>

      {/* Messages Area */}
      <Box
        sx={{
          flexGrow: 1,
          overflow: 'auto',
          py: 2,
          bgcolor: 'background.default'
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%'
            }}
          >
            <CircularProgress />
          </Box>
        ) : messages.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%'
            }}
          >
            <Typography variant="body2" color="text.secondary">
              No messages yet. Start the conversation!
            </Typography>
          </Box>
        ) : (
          <>
            {messages.map((message, index) => {
              const isOwnMessage = message.senderId?._id === currentUserId;
              return (
                <MessageBubble
                  key={message._id || index}
                  message={message}
                  isOwnMessage={isOwnMessage}
                  senderName={message.senderId?.fullName}
                  senderAvatar={message.senderId?.profilePhoto}
                />
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}

        {/* Typing Indicator */}
        {typingUsers.has(contact._id) && (
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              {typingUsers.get(contact._id)} is typing...
            </Typography>
          </Box>
        )}
      </Box>

      {/* Message Input */}
      <ChatInput
        onSendMessage={onSendMessage}
        onTyping={onTyping}
        disabled={loading}
      />
    </Box>
  );
};

export default ChatWindow;
