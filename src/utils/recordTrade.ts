import type { AppDispatch } from "@/lib/store/store";
import { addTransaction } from "@/lib/store/transactionsSlice";
import { applyTrade } from "@/lib/store/accountSlice";

type TradePayload = {
  action: "buy" | "sell";
  eur: number;
  btc: number;
  timestamp: string;
};

export function recordTrade(dispatch: AppDispatch, payload: TradePayload) {
  const { action, eur, btc, timestamp } = payload;

  const normalized = {
    action,
    eur: action === "buy" ? -Math.abs(eur) : Math.abs(eur),
    btc: action === "buy" ? Math.abs(btc) : -Math.abs(btc),
    timestamp,
  };

  dispatch(addTransaction(normalized));

  dispatch(applyTrade({ eur: normalized.eur, btc: normalized.btc }));
}
