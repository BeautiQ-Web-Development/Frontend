// components/ChatSidebar.js - Sidebar showing all chat contacts
import React, { useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Badge,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Divider,
  Chip
} from '@mui/material';
import {
  Search as SearchIcon,
  Circle as CircleIcon,
  PersonAdd as PersonAddIcon
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';

const ChatSidebar = ({ contacts, selectedContact, onSelectContact, onlineUsers }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const getDisplayName = (contact) => {
    return contact.fullName || 'Unknown User';
  };

  const getDisplayId = (contact) => {
    if (contact.role === 'customer') {
      return contact.customerId || '';
    } else if (contact.role === 'serviceProvider') {
      return contact.serviceProviderId || '';
    }
    return 'Admin';
  };

  const isOnline = (contact) => {
    return contact.isOnline || onlineUsers.has(contact._id);
  };

  const getLastSeenText = (contact) => {
    if (isOnline(contact)) {
      return 'Online';
    }
    if (contact.lastSeen) {
      try {
        return formatDistanceToNow(new Date(contact.lastSeen), { addSuffix: true });
      } catch {
        return 'Offline';
      }
    }
    return 'Offline';
  };

  const filteredContacts = contacts.filter(contact => {
    const name = getDisplayName(contact).toLowerCase();
    const id = getDisplayId(contact).toLowerCase();
    const query = searchQuery.toLowerCase();
    return name.includes(query) || id.includes(query);
  });

  return (
    <Box
      sx={{
        width: { xs: '100%', md: 320 },
        height: '100%',
        borderRight: { md: 1 },
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper'
      }}
    >
      {/* Search Bar */}
      <Box sx={{ p: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search contacts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
        />
      </Box>

      <Divider />

      {/* Contacts List */}
      <List sx={{ flexGrow: 1, overflow: 'auto', py: 0 }}>
        {filteredContacts.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <PersonAddIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              {searchQuery ? 'No contacts found' : 'No chats yet'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {searchQuery ? 'Try a different search' : 'Start a conversation'}
            </Typography>
          </Box>
        ) : (
          filteredContacts.map((contact) => (
            <React.Fragment key={contact._id}>
              <ListItem
                component="div"
                selected={selectedContact?._id === contact._id}
                onClick={() => onSelectContact(contact)}
                sx={{
                  py: 2,
                  cursor: 'pointer',
                  '&.Mui-selected': {
                    bgcolor: 'action.selected',
                    borderLeft: 3,
                    borderColor: 'primary.main'
                  },
                  '&:hover': {
                    bgcolor: 'action.hover'
                  }
                }}
              >
                <ListItemAvatar>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      isOnline(contact) ? (
                        <CircleIcon sx={{ fontSize: 12, color: 'success.main' }} />
                      ) : null
                    }
                  >
                    <Avatar
                      src={contact.profilePhoto}
                      alt={getDisplayName(contact)}
                    >
                      {getDisplayName(contact).charAt(0).toUpperCase()}
                    </Avatar>
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="subtitle2" noWrap sx={{ fontWeight: contact.unreadCount > 0 ? 600 : 400 }}>
                        {getDisplayName(contact)}
                      </Typography>
                      {contact.unreadCount > 0 && (
                        <Chip
                          label={contact.unreadCount}
                          size="small"
                          color="primary"
                          sx={{ height: 20, minWidth: 20, fontSize: '0.7rem' }}
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box component="span" sx={{ display: 'block' }}>
                      <Typography component="span" variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        {getDisplayId(contact)}
                      </Typography>
                      {contact.lastMessage && (
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.secondary"
                          noWrap
                          sx={{
                            display: 'block',
                            fontWeight: contact.unreadCount > 0 ? 600 : 400,
                            color: contact.unreadCount > 0 ? 'text.primary' : 'text.secondary'
                          }}
                        >
                          {contact.lastMessage}
                        </Typography>
                      )}
                      <Typography component="span" variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        {getLastSeenText(contact)}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))
        )}
      </List>
    </Box>
  );
};

export default ChatSidebar;
