import React from 'react';
import { CircularProgress } from '@mui/material';
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Area } from 'recharts';

// dummy data when no real data is provided
const dummyData = [
  { month: 'Jan', hair: 400, makeup: 240, nails: 200 },
  { month: 'Feb', hair: 300, makeup: 139, nails: 221 },
  { month: 'Mar', hair: 200, makeup: 980, nails: 229 },
  { month: 'Apr', hair: 278, makeup: 390, nails: 200 },
  { month: 'May', hair: 189, makeup: 480, nails: 218 },
  { month: 'Jun', hair: 239, makeup: 380, nails: 250 },
  { month: 'Jul', hair: 349, makeup: 430, nails: 210 },
  { month: 'Aug', hair: 200, makeup: 300, nails: 180 },
  { month: 'Sep', hair: 300, makeup: 200, nails: 240 },
  { month: 'Oct', hair: 278, makeup: 400, nails: 260 },
  { month: 'Nov', hair: 189, makeup: 350, nails: 220 },
  { month: 'Dec', hair: 239, makeup: 300, nails: 200 }
];

const MonthlyRevenueByCategoryChart = ({ data, loading }) => {
  if (loading) return <CircularProgress />;
  // choose real data or fallback
  const chartData = data && data.length > 0 ? data : dummyData;
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend verticalAlign="top" />
        <Area type="monotone" dataKey="hair" stackId="1" stroke="#8884d8" fill="#8884d8" />
        <Area type="monotone" dataKey="makeup" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
        <Area type="monotone" dataKey="nails" stackId="1" stroke="#ffc658" fill="#ffc658" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default MonthlyRevenueByCategoryChart;
