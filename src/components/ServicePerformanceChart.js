import React from 'react';
import { Box, Typography, Paper, CircularProgress, Grid, Chip } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { styled } from '@mui/material/styles';
import { TrendingUp, TrendingDown, Star } from '@mui/icons-material';

const ChartContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 12,
  background: '#FFFFFF',
  boxShadow: '0 2px 8px rgba(0, 31, 63, 0.08)',
  border: '1px solid rgba(0, 31, 63, 0.05)',
}));

const MetricCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5),
  borderRadius: 8,
  background: 'rgba(0, 31, 63, 0.03)',
  border: '1px solid rgba(0, 31, 63, 0.05)',
  textAlign: 'center',
}));

const COLORS = ['#001F3F', 'rgba(0, 31, 63, 0.8)', 'rgba(0, 31, 63, 0.6)', 'rgba(0, 31, 63, 0.4)', 'rgba(0, 31, 63, 0.2)'];

const ServicePerformanceChart = ({ data, loading = false, title = "Service Performance", type = "bar" }) => {
  if (loading) {
    return (
      <ChartContainer>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
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
          <Typography color="text.secondary">No performance data available</Typography>
        </Box>
      </ChartContainer>
    );
  }

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
              {entry.name}: {entry.value} {entry.name === 'Rating' ? '★' : ''}
            </Typography>
          ))}
        </Box>
      );
    }
    return null;
  };

  // Calculate summary metrics
  const totalBookings = data.reduce((sum, item) => sum + (item.bookings || 0), 0);
  const avgRating = data.reduce((sum, item) => sum + (item.rating || 0), 0) / data.length;
  const topService = data.reduce((prev, current) => (prev.bookings > current.bookings) ? prev : current);
  const totalRevenue = data.reduce((sum, item) => sum + (item.revenue || 0), 0);

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

      {/* Summary Metrics */}
      <Grid container spacing={1.5} sx={{ mb: 2 }}>
        <Grid item xs={6} md={3}>
          <MetricCard>
            <Typography variant="h6" sx={{ color: '#001F3F', fontWeight: 600, fontSize: '1.2rem' }}>
              {totalBookings}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(0, 31, 63, 0.7)', fontSize: '0.65rem' }}>
              Bookings
            </Typography>
          </MetricCard>
        </Grid>
        <Grid item xs={6} md={3}>
          <MetricCard>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
              <Typography variant="h6" sx={{ color: '#001F3F', fontWeight: 600, fontSize: '1.2rem' }}>
                {avgRating.toFixed(1)}
              </Typography>
              <Star sx={{ color: '#001F3F', fontSize: 16 }} />
            </Box>
            <Typography variant="caption" sx={{ color: 'rgba(0, 31, 63, 0.7)', fontSize: '0.65rem' }}>
              Rating
            </Typography>
          </MetricCard>
        </Grid>
        <Grid item xs={6} md={3}>
          <MetricCard>
            <Typography variant="h6" sx={{ color: '#001F3F', fontWeight: 600, fontSize: '1rem' }}>
              LKR {(totalRevenue / 1000).toFixed(0)}K
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(0, 31, 63, 0.7)', fontSize: '0.65rem' }}>
              Revenue
            </Typography>
          </MetricCard>
        </Grid>
        <Grid item xs={6} md={3}>
          <MetricCard>
            <Typography variant="body2" sx={{ color: '#001F3F', fontWeight: 600, fontSize: '0.8rem' }}>
              {topService?.name}
            </Typography>
            <Chip 
              icon={<TrendingUp />} 
              label="Top" 
              size="small" 
              sx={{ 
                bgcolor: '#001F3F', 
                color: 'white', 
                mt: 0.5,
                fontSize: '0.6rem',
                height: 20
              }}
            />
          </MetricCard>
        </Grid>
      </Grid>

      {/* Chart */}
      <Box sx={{ height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          {type === "pie" ? (
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={60}
                fill="#8884d8"
                dataKey="bookings"
                fontSize={10}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          ) : (
            <BarChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="2 2" stroke="rgba(0, 31, 63, 0.1)" />
              <XAxis 
                dataKey="name" 
                stroke="#001F3F" 
                fontSize={9}
                tick={{ fontSize: 9 }}
              />
              <YAxis 
                stroke="#001F3F" 
                fontSize={9}
                tick={{ fontSize: 9 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="bookings" fill="#001F3F" name="Bookings" radius={[2, 2, 0, 0]} />
              <Bar dataKey="rating" fill="rgba(0, 31, 63, 0.6)" name="Rating" radius={[2, 2, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </Box>
    </ChartContainer>
  );
};

export default ServicePerformanceChart;
