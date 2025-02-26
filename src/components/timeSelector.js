import React from 'react';
import { Box, MenuItem, styled } from '@mui/material';

const TimeMenuItem = styled(MenuItem)(({ theme }) => ({
  padding: theme.spacing(1, 2),
}));

const TimeSelector = ({ handleClose }) => {
  const timeSlots = [
    'Early Morning',
    'Morning',
    'Afternoon',
    'Evening',
    'Night'
  ];

  return (
    <Box sx={{ width: 180 }}>
      {timeSlots.map((time, index) => (
        <TimeMenuItem key={index} onClick={handleClose}>
          {time}
        </TimeMenuItem>
      ))}
    </Box>
  );
};

export default TimeSelector;