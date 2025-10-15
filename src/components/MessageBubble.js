// components/MessageBubble.js - Individual message bubble
import React from 'react';
import { Box, Typography, Paper, Avatar } from '@mui/material';
import { format, isToday, isYesterday } from 'date-fns';

const MessageBubble = ({ message, isOwnMessage, senderName, senderAvatar }) => {
  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    
    try {
      const date = new Date(timestamp);
      
      if (isToday(date)) {
        return format(date, 'h:mm a');
      } else if (isYesterday(date)) {
        return `Yesterday ${format(date, 'h:mm a')}`;
      } else {
        return format(date, 'MMM dd, h:mm a');
      }
    } catch {
      return '';
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
        mb: 2,
        px: 2
      }}
    >
      {!isOwnMessage && (
        <Avatar
          src={senderAvatar}
          alt={senderName}
          sx={{ width: 32, height: 32, mr: 1 }}
        >
          {senderName?.charAt(0).toUpperCase()}
        </Avatar>
      )}
      
      <Box
        sx={{
          maxWidth: '70%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: isOwnMessage ? 'flex-end' : 'flex-start'
        }}
      >
        {!isOwnMessage && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mb: 0.5, ml: 0.5 }}
          >
            {senderName}
          </Typography>
        )}
        
        <Paper
          elevation={1}
          sx={{
            px: 2,
            py: 1.5,
            bgcolor: isOwnMessage ? 'primary.main' : 'background.paper',
            color: isOwnMessage ? 'primary.contrastText' : 'text.primary',
            borderRadius: isOwnMessage 
              ? '18px 18px 4px 18px' 
              : '18px 18px 18px 4px',
            wordBreak: 'break-word'
          }}
        >
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {message.message}
          </Typography>
        </Paper>
        
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 0.5, mx: 0.5 }}
        >
          {formatMessageTime(message.createdAt)}
        </Typography>
      </Box>

      {isOwnMessage && (
        <Avatar
          src={senderAvatar}
          alt={senderName}
          sx={{ width: 32, height: 32, ml: 1 }}
        >
          {senderName?.charAt(0).toUpperCase()}
        </Avatar>
      )}
    </Box>
  );
};

export default MessageBubble;
