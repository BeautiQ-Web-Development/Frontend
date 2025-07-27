import React from 'react';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { styled } from '@mui/material/styles';

const ChartContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 12,
  background: '#FFFFFF',
  boxShadow: '0 2px 8px rgba(0, 31, 63, 0.08)',
  border: '1px solid rgba(0, 31, 63, 0.05)',
  height: 320,
}));

const RevenueChart = ({ data, loading = false, title = "Revenue Overview", type = "area" }) => {
  if (loading) {
    return (
      <ChartContainer>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <CircularProgress size={60} sx={{ color: '#075B5E' }} />
        </Box>
      </ChartContainer>
    );
  }

  if (!data || data.length === 0) {
    return (
      <ChartContainer>
        <Typography variant="h6" gutterBottom sx={{ color: '#075B5E', fontWeight: 700 }}>
          {title}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
          <Typography color="text.secondary">No revenue data available</Typography>
        </Box>
      </ChartContainer>
    );
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box sx={{
          bgcolor: '#FFFFFF',
          border: '1px solid rgba(0, 31, 63, 0.2)',
          borderRadius: 2,
          p: 1.5,
          boxShadow: '0 4px 12px rgba(0, 31, 63, 0.15)',
          fontSize: '0.75rem'
        }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#001F3F', fontSize: '0.75rem' }}>
            {label}
          </Typography>
          {payload.map((entry, index) => (
            <Typography key={index} variant="body2" sx={{ color: '#001F3F', fontSize: '0.7rem' }}>
              {entry.name}: {formatCurrency(entry.value)}
            </Typography>
          ))}
        </Box>
      );
    }
    return null;
  };

  return (
    <ChartContainer>
      <Typography variant="h6" gutterBottom sx={{ 
        color: '#001F3F', 
        fontWeight: 600, 
        fontSize: '1rem',
        mb: 2 
      }}>
        {title}
      </Typography>
      
      <ResponsiveContainer width="100%" height="80%">
        {type === "area" ? (
          <AreaChart data={data}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#001F3F" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#001F3F" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="2 2" stroke="rgba(0, 31, 63, 0.1)" />
            <XAxis 
              dataKey="name" 
              stroke="#001F3F" 
              fontSize={10}
              tick={{ fontSize: 10 }}
            />
            <YAxis 
              tickFormatter={formatCurrency} 
              stroke="#001F3F" 
              fontSize={10}
              tick={{ fontSize: 10 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#001F3F"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#revenueGradient)"
              name="Revenue"
            />
          </AreaChart>
        ) : (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="2 2" stroke="rgba(0, 31, 63, 0.1)" />
            <XAxis 
              dataKey="name" 
              stroke="#001F3F" 
              fontSize={10}
              tick={{ fontSize: 10 }}
            />
            <YAxis 
              tickFormatter={formatCurrency} 
              stroke="#001F3F" 
              fontSize={10}
              tick={{ fontSize: 10 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#001F3F"
              strokeWidth={2}
              dot={{ fill: '#001F3F', strokeWidth: 1, r: 3 }}
              activeDot={{ r: 5, stroke: '#001F3F', strokeWidth: 1 }}
              name="Revenue"
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default RevenueChart;
