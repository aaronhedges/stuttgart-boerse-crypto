"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/hooks";
import { fetchCrypto24h } from "@/lib/features/crypto/cryptoSlice";
import Crypto24hChart from "@/components/crypto24hChart";

function formatEUR(n: number | null) {
  if (n == null) return "—";
  return n.toLocaleString("de-DE", { style: "currency", currency: "EUR" });
}

export default function Home() {
  const dispatch = useAppDispatch();
  const { latest, status } = useAppSelector((s) => s.crypto);

  useEffect(() => {
    if (status === "idle") dispatch(fetchCrypto24h());
  }, [status, dispatch]);

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="flex gap-4 items-center flex-row sm:flex-row">
          <h1>BTC</h1>
          <h2>{formatEUR(latest)} EUR</h2>
        </div>
        <section style={{ marginTop: 32 }}>
          <Crypto24hChart />
        </section>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center"></footer>
    </div>
  );
}
