"use client";

import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/hooks";
import { fetchCrypto24h } from "@/lib/store/cryptoSlice";

import { Line } from "react-chartjs-2";
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
} from "chart.js";
import "chartjs-adapter-date-fns";

ChartJS.register(TimeScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler, Title);

export default function Crypto24hChart() {
  const dispatch = useAppDispatch();
  const { series, status, error } = useAppSelector((s) => s.crypto);

  useEffect(() => {
    if (status === "idle") dispatch(fetchCrypto24h());
  }, [status, dispatch]);

  const chart = useMemo(() => {
    if (!series.length) return null;
    const labels = series.map(([iso]) => iso);
    const values = series.map(([, p]) => p);

    return {
      data: {
        labels,
        datasets: [
          {
            label: "BTC/EUR (24h)",
            data: values,
            fill: true,
            tension: 0.25,
            pointRadius: 0,
            borderWidth: 2,
            borderColor: "blue",
            backgroundColor: (ctx) => {
              const chart = ctx.chart;
              const { ctx: canvasCtx, chartArea } = chart;
    
              if (!chartArea) {
                return null;
              }
    
              const gradient = canvasCtx.createLinearGradient(
                0,
                chartArea.top,
                0,
                chartArea.bottom
              );
              gradient.addColorStop(0, "rgba(66, 215, 245, 1)");
              gradient.addColorStop(1, "rgba(0, 0, 255, 0)");
              return gradient;
            },
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: { intersect: false, mode: "index" as const },
        },
        scales: {
          x: {
            type: "time" as const,
            time: { unit: "hour" as const, tooltipFormat: "MMM d, HH:mm" },
            ticks: {
              display: false,
            },
            grid: {
              display: false,
            },
          },
          y: { 
            beginAtZero: false,
            position: "right",
            grid: {
              display: false,
            },
          },
        },
      },
    };
  }, [series]);

  if (status === "loading") return <p>Loading BTC/EUR…</p>;
  if (status === "failed") return <p className="text-red-500">Error: {error}</p>;
  if (!chart) return <p>No data</p>;

  return (
    <div className="w-full">
      <Line data={chart.data} options={chart.options} />
    </div>
  );
}
