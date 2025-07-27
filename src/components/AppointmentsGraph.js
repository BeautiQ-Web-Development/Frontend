import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const AppointmentsGraph = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Provider A', 'Provider B', 'Provider C', 'Provider D'],
        datasets: [
          {
            label: 'Haircuts',
            data: [12, 19, 3, 5],
            backgroundColor: 'rgba(72, 9, 23, 0.5)',
            barThickness: 15
          },
          {
            label: 'Makeup',
            data: [8, 11, 5, 7],
            backgroundColor: 'rgba(13, 49, 74, 0.5)',
            barThickness: 15
          },
          {
            label: 'Nail Art',
            data: [7, 9, 4, 6],
            backgroundColor: 'rgba(65, 48, 6, 0.5)',
            barThickness: 15
          }
        ]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Appointments Per Service Provider',
            color: '#003047'
          }
        },
        responsive: true,
        scales: {
          x: { stacked: true },
          y: { stacked: true }
        }
      }
    });

    return () => chart.destroy();
  }, []);

  return (
    <canvas 
      ref={chartRef} 
      style={{ width: '100%', height: '200px' }} 
    />
  );
};

export default AppointmentsGraph;
