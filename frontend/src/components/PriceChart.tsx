import React, { useEffect, useRef } from 'react';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Title,
} from 'chart.js';
import 'chartjs-adapter-date-fns';

Chart.register(LineController, LineElement, PointElement, LinearScale, TimeScale, Tooltip, Title);

interface Props {
  card: { id: number; card_name: string };
  data: { timestamp: string; price: number }[];
}

const PriceChart: React.FC<Props> = ({ card, data }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const chart = new Chart(canvasRef.current, {
      type: 'line',
      data: {
        labels: data.map(d => d.timestamp),
        datasets: [{
          label: card.card_name,
          data: data.map(d => d.price),
          borderColor: '#4ade80',
          backgroundColor: 'rgba(74,222,128,0.2)',
        }],
      },
      options: {
        scales: {
          x: { type: 'time', ticks: { color: '#e5e7eb' }, grid: { color: '#374151' } },
          y: { ticks: { color: '#e5e7eb' }, grid: { color: '#374151' } },
        },
        plugins: { legend: { labels: { color: '#e5e7eb' } } }
      }
    });
    return () => chart.destroy();
  }, [card, data]);

  return <canvas ref={canvasRef} />;
};

export default PriceChart;
