'use client';

import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
  Title,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { useCryptoPrices } from '../lib/hooks/useCrytoPrices';

ChartJS.register(TimeScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler, Title);

export default function Crypto24hChart() {
  const { data, loading, error } = useCryptoPrices();

  const chart = useMemo(() => {
    if (!data) return null;
    const labels = data.prices.map(([iso]) => iso);
    const values = data.prices.map(([, price]) => price);

    return {
      data: {
        labels,
        datasets: [
          {
            label: 'BTC/EUR (24h)',
            data: values,
            fill: false,
            tension: 0.25,
            pointRadius: 0,
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: { display: true, text: 'Bitcoin price (EUR, last 24h)' },
          tooltip: { intersect: false, mode: 'index' as const },
        },
        scales: {
          x: {
            type: 'time' as const,
            time: { unit: 'hour' as const, tooltipFormat: "MMM d, HH:mm" },
            ticks: { autoSkip: true, maxTicksLimit: 12 },
          },
          y: {
            beginAtZero: false,
          },
        },
      },
    };
  }, [data]);

  if (loading) return <p>Loading BTC/EUR…</p>;
  if (error) return <p style={{ color: 'crimson' }}>Error: {error}</p>;
  if (!chart) return null;

  return (
    <div style={{ height: 320 }}>
      <Line data={chart.data} options={chart.options} />
    </div>
  );
}
