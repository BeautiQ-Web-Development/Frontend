import React from 'react';
import { CircularProgress } from '@mui/material';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from 'recharts';

// dummy data for onboarding funnel
const dummyData = [
  { stage: 'Registered', count: 300 },
  { stage: 'Pending Approval', count: 65 },
  { stage: 'Approved', count: 220 },
  { stage: 'Rejected', count: 15 }
];

const ProviderFunnelChart = ({ data, loading }) => {
  if (loading) return <CircularProgress />;
  // choose real data or fallback
  const chartData = data && data.length > 0 ? data : dummyData;
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} layout="vertical" margin={{ top: 2, right: 50, left: 10, bottom: 15 }}>
        <CartesianGrid strokeDasharray="1 1 " />
        <XAxis type="number" />
        <YAxis dataKey="stage" type="category" width={80} />
        <Tooltip />
        <Bar dataKey="count" fill="rgba(0, 48, 71, 1)" label={{ position: 'right', fill: '#555' }} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ProviderFunnelChart;
