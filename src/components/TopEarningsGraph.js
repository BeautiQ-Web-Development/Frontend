import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const TopEarningsGraph = () => {
  const earningsChartRef = useRef(null);
  const appointmentsChartRef = useRef(null);

  useEffect(() => {
    const daysInQuarter = 90;
    // Earnings: single line over 90 days
    const ctxE = earningsChartRef.current.getContext('2d');
    const earningsChart = new Chart(ctxE, {
      type: 'line',
      data: {
        labels: Array.from({ length: daysInQuarter }, (_, i) => i + 1),
        datasets: [{
          label: 'Earnings',
          data: Array.from({ length: daysInQuarter }, () => Math.floor(Math.random() * 1000)),
          borderColor: '#003047',
          backgroundColor: 'rgba(96, 161, 218, 0.2)',
          fill: true,
          tension: 0.2
        }]
      },
      options: {
        plugins: {
          title: { display: true, text: 'Top Earnings Per Day (Quarter)' }
        },
        scales: { x: { ticks: { autoSkip: true } } }
      }
    });

    // Appointments: blue-shaded bars
    const ctxA = appointmentsChartRef.current.getContext('2d');
    const appointmentsChart = new Chart(ctxA, {
      type: 'bar',
      data: {
        labels: ['Provider A','B','C','D','E','F','G','H'],
        datasets: [
          { label:'Haircuts', data:[12,19,3,5,3,6,8,10], backgroundColor:'rgba(21, 43, 62, 0.5)' },
          { label:'Makeup',   data:[8,11,5,7,12,19,3,5],   backgroundColor:'rgba(21,101,192,0.5)' },
          { label:'Nail Art', data:[7,9,4,6,12,19,3,5],    backgroundColor:'rgba(82, 143, 235, 0.5)' }
        ]
      },
      options: {
        plugins: { title:{ display:true, text:'Appointments Per Provider' } },
        responsive:true,
        scales:{ x:{ stacked:true }, y:{ stacked:true } }
      }
    });

    return () => { earningsChart.destroy(); appointmentsChart.destroy(); };
  }, []);

  return (
    <div style={{ display:'flex', gap:'0.5rem' }}>
      <div style={{ flex:1, overflowX:'auto', height:'300px' }}>
        <canvas ref={earningsChartRef} />
      </div>
      <div style={{ flex:1, overflowX:'auto', height:'300px' }}>
        <canvas ref={appointmentsChartRef} />
      </div>
    </div>
  );
};

export default TopEarningsGraph;
         