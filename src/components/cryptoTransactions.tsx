"use client";

import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/lib/store/store";
import { setTransactions } from "@/lib/store/transactionsSlice";
import mockData from "../../public/mock/transactions.json";

// @TODO consolidate/move euro and btc format to shared functions for whole app
function formatEUR(value: number) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2
  }).format(value);
}

function formatBTC(value: number) {
  return `${value.toFixed(5)} BTC`;
}

function formatTime(timestamp: string) {
  const date = new Date(timestamp);
  return date.toISOString().substring(11, 19);
}

export default function CryptoTransactions() {
  const dispatch = useDispatch<AppDispatch>();
  const initializedRef = useRef(false);

  const items = useSelector((s: RootState) => s.transactions.items);
  const isInitialized = useSelector((s: RootState) => s.transactions.isInitialized);

  useEffect(() => {
    if (!initializedRef.current && !isInitialized) {
      initializedRef.current = true;
      dispatch(setTransactions(mockData));
    }
  }, [dispatch, isInitialized]);

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[300px] w-full border-collapse bg-gray-100 dark:bg-white rounded-lg py-2">
        <div>
          {items.map((tx) => {
            const date = new Date(tx.timestamp);
            return (
              <div key={tx.id} className="grid grid-cols-5 text-sm dark:text-neutral-700">
                <div className="py-2 pl-4 capitalize">
                  {tx.action}
                </div>
                <div className="py-2 pr-2 col-span-3">{formatBTC(tx.btc)} / {formatEUR(tx.eur)}</div>
                <div className="py-2 pr-4">{formatTime(tx.timestamp)}</div>
              </div>
            );
          })}
          {items.length === 0 && (
            <div>
              <div className="py-6 text-center text-sm text-gray-500">
                No transactions yet.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
