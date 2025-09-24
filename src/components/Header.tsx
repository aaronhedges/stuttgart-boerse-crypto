"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/hooks";
import { fetchUserAccount } from "@/lib/store/accountSlice";

// @TODO refactor to external util
function formatBtc(v: number | null) {
  if (v == null) return "— BTC";
  return `${v.toFixed(8).replace(/\.?0+$/, "")} BTC`;
}

function formatEur(v: number | null) {
  if (v == null) return "—";
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(v);
}

export default function Header() {
  const dispatch = useAppDispatch();
  const { availableBtc, availableEur, status, error } = useAppSelector(
    (s) => s.account
  );

  useEffect(() => {
    if (status === "idle") dispatch(fetchUserAccount());
  }, [dispatch, status]);

  const btc = formatBtc(availableBtc);
  const eur = formatEur(availableEur);

  return (
    <header className="w-full max-w-screen-md flex items-center justify-between">
      <div className="flex-shrink-0">
        <Image
          src="/images/bison.png" 
          alt="Bison Logo"
          width={56}
          height={52}
          className="object-contain"
          priority
        />
      </div>

      <div className="text-right text-sm">
        <p>Available</p>
        {status === "loading" && (
          <div className="animate-pulse">
            <p className="h-4 w-28 rounded bg-neutral-200 dark:bg-neutral-800 mb-1" />
            <p className="h-4 w-20 rounded bg-neutral-200 dark:bg-neutral-800" />
          </div>
        )}

        {status === "failed" && (
          <p className="text-red-500">Error: {error ?? "Could not load account"}</p>
        )}

        {status === "succeeded" && (
          <>
            <p>{btc}</p>
            <p>{eur}</p>
          </>
        )}
      </div>
    </header>
  );
}
