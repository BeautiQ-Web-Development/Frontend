import React from 'react';
import { Box, Typography, CircularProgress, Tooltip, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const hours = Array.from({ length: 24 }, (_, i) => i);

const HeatmapContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 12,
  background: '#FFFFFF',
  boxShadow: '0 2px 8px rgba(0, 31, 63, 0.08)',
  border: '1px solid rgba(0, 31, 63, 0.05)',
}));

const HeatmapCell = styled(Box)(({ theme, intensity, value }) => ({
  width: 24,
  height: 24,
  margin: 1,
  borderRadius: 4,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  fontSize: '0.6rem',
  fontWeight: 500,
  border: '1px solid rgba(0, 31, 63, 0.1)',
  background: intensity > 0 
    ? `rgba(0, 31, 63, ${0.1 + intensity * 0.8})` 
    : '#FFFFFF',
  color: intensity > 0.5 ? 'white' : '#001F3F',
  '&:hover': {
    transform: 'scale(1.1)',
    boxShadow: '0 2px 8px rgba(0, 31, 63, 0.2)',
    zIndex: 10,
  }
}));

const DayLabel = styled(Box)(({ theme }) => ({
  width: 40,
  height: 24,
  margin: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 600,
  fontSize: '0.7rem',
  color: '#001F3F',
  background: 'rgba(0, 31, 63, 0.05)',
  borderRadius: 4,
}));

const HourLabel = styled(Box)(({ theme }) => ({
  width: 24,
  height: 16,
  margin: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.5rem',
  fontWeight: 500,
  color: 'rgba(0, 31, 63, 0.7)',
}));

const BookingHeatmapChart = ({ data, loading = false, title = "Booking Utilization" }) => {
  if (loading) {
    return (
      <HeatmapContainer>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
          <CircularProgress size={60} sx={{ color: '#003047' }} />
        </Box>
      </HeatmapContainer>
    );
  }

  if (!data || data.length === 0) {
    return (
      <HeatmapContainer>
        <Typography variant="h6" gutterBottom sx={{ color: '#003047', fontWeight: 700 }}>
          {title}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
          <Typography color="text.secondary">No booking data available</Typography>
        </Box>
      </HeatmapContainer>
    );
  }

  const maxVal = Math.max(...data.flatMap(d => d.values || []));
  
  const getIntensity = (value) => maxVal > 0 ? value / maxVal : 0;

  const formatTime = (hour) => {
    return hour === 0 ? '12AM' : hour < 12 ? `${hour}AM` : hour === 12 ? '12PM' : `${hour - 12}PM`;
  };

  return (
    <HeatmapContainer>
      <Typography variant="h6" gutterBottom sx={{ 
        color: '#001F3F', 
        fontWeight: 600, 
        fontSize: '1rem',
        mb: 2 
      }}>
        {title}
      </Typography>
      
      <Box sx={{ overflowX: 'auto', overflowY: 'hidden' }}>
        {/* Hour labels */}
        <Box sx={{ display: 'flex', mb: 1, ml: '41px' }}>
          {hours.map((hour) => (
            <HourLabel key={hour}>
              {hour % 6 === 0 ? formatTime(hour) : ''}
            </HourLabel>
          ))}
        </Box>

        {/* Heatmap rows */}
        {days.map((day, dayIndex) => (
          <Box key={day} sx={{ display: 'flex', mb: 0.5, alignItems: 'center' }}>
            <DayLabel>{day}</DayLabel>
            {hours.map((hour) => {
              const value = data[dayIndex]?.values?.[hour] || 0;
              const intensity = getIntensity(value);
              
              return (
                <Tooltip 
                  key={hour} 
                  title={`${day} ${formatTime(hour)}: ${value} bookings`}
                  arrow
                >
                  <HeatmapCell intensity={intensity} value={value}>
                    {value > 0 ? value : ''}
                  </HeatmapCell>
                </Tooltip>
              );
            })}
          </Box>
        ))}
      </Box>

      {/* Legend */}
      <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" sx={{ fontWeight: 500, fontSize: '0.7rem', color: '#001F3F' }}>
            Less
          </Typography>
          {[0, 0.3, 0.6, 1].map((intensity, index) => (
            <Box
              key={index}
              sx={{
                width: 16,
                height: 16,
                borderRadius: 1,
                background: intensity > 0 
                  ? `rgba(0, 31, 63, ${0.1 + intensity * 0.8})` 
                  : '#FFFFFF',
                border: '1px solid rgba(0, 31, 63, 0.1)'
              }}
            />
          ))}
          <Typography variant="caption" sx={{ fontWeight: 500, fontSize: '0.7rem', color: '#001F3F' }}>
            More
          </Typography>
        </Box>
        
        <Typography variant="caption" sx={{ color: 'rgba(0, 31, 63, 0.6)', fontSize: '0.65rem' }}>
          Peak: {maxVal} | Total: {data.reduce((sum, day) => sum + (day.values?.reduce((a, b) => a + b, 0) || 0), 0)}
        </Typography>
      </Box>
    </HeatmapContainer>
  );
};

export default BookingHeatmapChart;
