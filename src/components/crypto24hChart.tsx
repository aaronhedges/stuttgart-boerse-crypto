"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/hooks";
import { fetchCrypto24h } from "@/lib/store/cryptoSlice";

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
  ChartArea,
  ScriptableContext,
} from "chart.js";
import "chartjs-adapter-date-fns";

ChartJS.register(TimeScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler, Title);

const Line = dynamic(() => import("react-chartjs-2").then((m) => m.Line), { ssr: false });

export default function Crypto24hChart() {
  const dispatch = useAppDispatch();
  const { series, status, error } = useAppSelector((s) => s.crypto);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [chartKey, setChartKey] = useState(0);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);

  // first attempt to detect a resize, but wasn't working consistently
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let debounce: any;
    const ro = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
      clearTimeout(debounce);
      debounce = setTimeout(() => setChartKey((k) => k + 1), 120);
    });

    ro.observe(el);
    return () => {
      clearTimeout(debounce);
      ro.disconnect();
    };
  }, []);

  // fall back attempt to catch a resize based on the size of window
  useEffect(() => {
    let last = window.innerWidth;
    let t: any;
    const onResize = () => {
      if (window.innerWidth === last) return;
      last = window.innerWidth;
      clearTimeout(t);
      t = setTimeout(() => setChartKey((k) => k + 1), 120);
    };
    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    if (status === "idle") dispatch(fetchCrypto24h());
  }, [status, dispatch]);

  const chart = useMemo(() => {
    if (!series?.length) return null;

    const labels = series.map(([iso]) => iso);
    const values = series.map(([, p]) => p);

    // dynamically calculate background color of chart so it can update during resizing events
    const backgroundColor = (ctx: ScriptableContext<"line">) => {
      const { chart } = ctx;
      const area: ChartArea | undefined = chart.chartArea;
      if (!area) return null;
      const g = chart.ctx.createLinearGradient(0, area.top, 0, area.bottom);
      g.addColorStop(0, "rgba(66, 215, 245, 0.35)");
      g.addColorStop(1, "rgba(66, 215, 245, 0.00)");
      return g;
    };

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
            borderColor: "rgba(66, 215, 245, 1)",
            backgroundColor,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 0 },
        plugins: {
          legend: { display: false },
          tooltip: { mode: "index", intersect: false },
          title: { display: false, text: "" },
        },
        scales: {
          x: {
            type: "time" as const,
            time: { unit: "hour" as const, tooltipFormat: "MMM d, HH:mm" },
            ticks: { display: false },
            grid: { display: false },
          },
          y: {
            beginAtZero: false,
            position: "right",
            grid: { display: false },
          },
        },
      },
    };
  }, [series, containerWidth]);

  if (status === "loading") return <p>Loading BTC/EUR…</p>;
  if (status === "failed") return <p className="text-red-500">Error: {error}</p>;
  if (!chart) return <p>No data</p>;

  return (
    <div ref={containerRef} className="w-full h-64">
      <Line key={chartKey} data={chart.data} options={chart.options} />
    </div>
  );
}
