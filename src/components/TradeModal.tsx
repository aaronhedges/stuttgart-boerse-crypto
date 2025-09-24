import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import { X } from "lucide-react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/lib/store/store";
import { recordTrade } from "@/utils/recordTrade";

export type TradeSide = "buy" | "sell";

export interface TradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  exchangeRateEurPerBtc?: number;
  onSubmit?: (payload: { side: TradeSide; eur: number; btc: number }) => void;
}

const deNumber = new Intl.NumberFormat("de-DE", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 8,
});

const deCurrency = new Intl.NumberFormat("de-DE", {
  style: "decimal",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function parseLocaleNumber(input: string): number | null {
  if (!input) return null;

  const raw = input.replace(/\s|[€]/g, "");
  const hasComma = raw.includes(",");
  const hasDot = raw.includes(".");

  let normalized = raw;

  if (hasComma && hasDot) {
    const lastComma = raw.lastIndexOf(",");
    const lastDot = raw.lastIndexOf(".");
    const decimalIsComma = lastComma > lastDot;

    if (decimalIsComma) {
      normalized = raw.replace(/\./g, "").replace(",", ".");
    } else {
      normalized = raw.replace(/,/g, "");
    }
  } else if (hasComma) {
    normalized = raw.replace(/\./g, "").replace(",", ".");
  } else if (hasDot) {
    normalized = raw.replace(/,/g, "");
  } else {
    normalized = raw;
  }

  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}

export function TradeModal({ isOpen, onClose, exchangeRateEurPerBtc, onSubmit }: TradeModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const dialogRef = useRef<HTMLDivElement>(null);
  const eurInputRef = useRef<HTMLInputElement>(null);
  const [eurRaw, setEurRaw] = useState<string>("");
  const [btcRaw, setBtcRaw] = useState<string>("");
  const labelId = useId();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => eurInputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  const syncFromEur = useCallback(
    (eurVal: number | null) => {
      if (!eurVal || !exchangeRateEurPerBtc) return;
      const btc = eurVal / exchangeRateEurPerBtc;
      setBtcRaw(btc.toFixed(8));
    },
    [exchangeRateEurPerBtc]
  );

  const syncFromBtc = useCallback(
    (btcVal: number | null) => {
      if (!btcVal || !exchangeRateEurPerBtc) return;
      const eur = btcVal * exchangeRateEurPerBtc;
      setEurRaw(eur.toFixed(2));
    },
    [exchangeRateEurPerBtc]
  );

  const closeOnBackdrop = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleBlurFormatEur = () => {
    const n = parseLocaleNumber(eurRaw);
    if (n === null) return;
    setEurRaw(deCurrency.format(n));
  };

  const handleFocusUnformatEur = () => {
    const n = parseLocaleNumber(eurRaw);
    if (n === null) return;
    setEurRaw(deNumber.format(n));
  };

  const handleBlurFormatBtc = () => {
    const n = parseLocaleNumber(btcRaw);
    if (n === null) return;
    setBtcRaw(deNumber.format(n));
  };

  const clearForm = useCallback(() => {
    setEurRaw("");
    setBtcRaw("");
  }, []);

  const handleAction = (side: TradeSide) => {
    const eur = parseLocaleNumber(eurRaw) ?? 0;
    const btc = parseLocaleNumber(btcRaw) ?? 0;

    if (eur > 0 && btc > 0) {
      let decimalEur = Math.abs(eur);
      let decimalBTC = Math.abs(btc);
      // convert positive number to be saved as negative on sell, so state/format of transactions matches mock api
      if (side === 'buy') {
        decimalEur = -Math.abs(eur)
      } else {
        decimalBTC = -Math.abs(btc)
      }
      recordTrade(dispatch, {
        action: side,
        eur: decimalEur,
        btc: decimalBTC,
        timestamp: new Date().toISOString(),
      });
    }

    clearForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={closeOnBackdrop}
      aria-labelledby={labelId}
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={dialogRef}
        className="w-full max-w-md rounded-lg bg-white p-5 shadow-2xl outline-none dark:bg-neutral-900"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div id={labelId} className="tracking-tight"></div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-black/20 dark:hover:bg-neutral-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <div className="w-full flex items-center rounded-lg w-80 bg-gray-100 overflow-hidden">
            <input
              ref={eurInputRef}
              inputMode="decimal"
              placeholder={deCurrency.format(0)}
              value={eurRaw}
              onChange={(e) => {
                setEurRaw(e.target.value);
                const n = parseLocaleNumber(e.target.value);
                if (n !== null) syncFromEur(n);
              }}
              onBlur={handleBlurFormatEur}
              onFocus={handleFocusUnformatEur}
              className="flex-1 p-2 text-right outline-none placeholder:text-neutral-400"
            />
            <div className="px-3 py-2 text-blue-700 text-sm">EUR</div>
          </div>

          <div className="w-full flex items-center rounded-lg w-80 bg-gray-100 overflow-hidden">
            <input
              inputMode="decimal"
              placeholder={deNumber.format(0)}
              value={btcRaw}
              onChange={(e) => {
                setBtcRaw(e.target.value);
                const n = parseLocaleNumber(e.target.value);
                if (n !== null) syncFromBtc(n);
              }}
              onBlur={handleBlurFormatBtc}
              className="flex-1 p-2 text-right outline-none placeholder:text-neutral-400"
            />
            <div className="px-3 py-2 text-blue-700 text-sm">BTC</div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              onClick={() => handleAction("buy")}
              className="rounded-lg bg-[#153243] dark:bg-[#42D7F5] px-4 py-2 text-white shadow hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              Buy
            </button>
            <button
              onClick={() => handleAction("sell")}
              className="rounded-lg bg-[#153243] dark:bg-[#42D7F5] px-4 py-2 text-white shadow hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-rose-400"
            >
              Sell
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TradeWidget(props: Omit<TradeModalProps, "isOpen" | "onClose">) {
  const [open, setOpen] = useState(false);

  return (
    <div className="py-4">
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg w-full bg-[#153243] dark:bg-[#42D7F5] px-5 py-3 text-white shadow-md transition hover:translate-y-[-1px] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-black/20 dark:bg-white dark:text-black"
      >
        Trade
      </button>
      <TradeModal isOpen={open} onClose={() => setOpen(false)} {...props} />
    </div>
  );
}
