"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/hooks";
import { fetchCrypto24h } from "@/lib/store/cryptoSlice";
import Header from "@/components/Header";
import Crypto24hChart from "@/components/crypto24hChart";
import TradeWidget from "@/components/TradeModal";
import CryptoTransactions from "@/components/CryptoTransactions";

function formatEUR(n: number | null) {
  if (n == null) return "—";
  return n.toLocaleString("de-DE", { style: "currency", currency: "EUR" });
}

export default function Home() {
  const dispatch = useAppDispatch();
  const { latestPrice, status } = useAppSelector((s) => s.crypto);

  useEffect(() => {
    if (status === "idle") {
      void dispatch(fetchCrypto24h());
    }
  }, [status, dispatch]);

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-5 pb-5 gap-5 sm:p-20">
      <Header />
      <main className="w-full max-w-screen-md">
        <div className="flex gap-1 items-center flex-column">
          <h1 className="font-semibold text-2xl">BTC</h1>
          <h2 className="font-semibold text-2xl">{formatEUR(latestPrice)}</h2>
          <h3 className="text-sm">
            PnL: <span className="font-color-green">+12,3 €</span>
          </h3>
        </div>
        <section>
          <Crypto24hChart />
          <TradeWidget
            exchangeRateEurPerBtc={latestPrice}
            onSubmit={({ side, eur, btc }) => {
              console.log("trade", { side, eur, btc });
            }}
          />
          <CryptoTransactions />
        </section>
      </main>
    </div>
  );
}
