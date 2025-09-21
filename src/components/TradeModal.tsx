import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import { X } from "lucide-react";

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
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function parseGermanNumber(input: string): number | null {
  const sanitized = input
    .replace(/\s/g, "")
    .replace(/€/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  if (sanitized === "") return null;
  const n = Number(sanitized);
  return Number.isFinite(n) ? n : null;
}

export function TradeModal({ isOpen, onClose, exchangeRateEurPerBtc, onSubmit }: TradeModalProps) {
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
    const n = parseGermanNumber(eurRaw);
    if (n === null) return;
    setEurRaw(deCurrency.format(n));
  };

  const handleFocusUnformatEur = () => {
    const n = parseGermanNumber(eurRaw);
    if (n === null) return;
    setEurRaw(deNumber.format(n));
  };

  const handleBlurFormatBtc = () => {
    const n = parseGermanNumber(btcRaw);
    if (n === null) return;
    setBtcRaw(deNumber.format(n));
  };

  const handleAction = (side: TradeSide) => {
    const eur = parseGermanNumber(eurRaw) ?? 0;
    const btc = parseGermanNumber(btcRaw) ?? 0;
    onSubmit?.({ side, eur, btc });
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
        className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl outline-none dark:bg-neutral-900"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id={labelId} className="text-xl font-semibold tracking-tight">
            Trade
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-black/20 dark:hover:bg-neutral-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-300">
            EUR
            <input
              ref={eurInputRef}
              inputMode="decimal"
              placeholder={deCurrency.format(0)}
              value={eurRaw}
              onChange={(e) => {
                setEurRaw(e.target.value);
                const n = parseGermanNumber(e.target.value);
                if (n !== null) syncFromEur(n);
              }}
              onBlur={handleBlurFormatEur}
              onFocus={handleFocusUnformatEur}
              className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-base shadow-sm outline-none placeholder:text-neutral-400 focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200 dark:border-neutral-700 dark:bg-neutral-900"
            />
          </label>

          <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-300">
            BTC
            <input
              inputMode="decimal"
              placeholder={deNumber.format(0)}
              value={btcRaw}
              onChange={(e) => {
                setBtcRaw(e.target.value);
                const n = parseGermanNumber(e.target.value);
                if (n !== null) syncFromBtc(n);
              }}
              onBlur={handleBlurFormatBtc}
              className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-base shadow-sm outline-none placeholder:text-neutral-400 focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200 dark:border-neutral-700 dark:bg-neutral-900"
            />
          </label>

          {/* Actions */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              onClick={() => handleAction("buy")}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-white shadow hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              Buy
            </button>
            <button
              onClick={() => handleAction("sell")}
              className="rounded-xl bg-rose-600 px-4 py-2 text-white shadow hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-rose-400"
            >
              Sell
            </button>
          </div>

          {exchangeRateEurPerBtc && (
            <p className="mt-2 text-xs text-neutral-500">
              1 BTC ≈ {deCurrency.format(exchangeRateEurPerBtc)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TradeWidget(props: Omit<TradeModalProps, "isOpen" | "onClose">) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-2xl bg-primary px-5 py-3 text-white shadow-md transition hover:translate-y-[-1px] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-black/20 dark:bg-white dark:text-black"
      >
        Trade
      </button>
      <TradeModal
        isOpen={open}
        onClose={() => setOpen(false)}
        {...props}
      />
    </>
  );
}
