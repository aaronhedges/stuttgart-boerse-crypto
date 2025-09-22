import type { AppDispatch } from "@/lib/store/store";
import { addTransaction, TransactionAction } from "@/lib/store/transactionsSlice";

export function recordTrade(
  dispatch: AppDispatch,
  params: {
    action: TransactionAction;
    btc: number;
    eur: number;
    timestamp?: string;
  }
) {
  const { action, btc, eur, timestamp } = params;

  if (!(btc > 0) || !(eur > 0)) {
    throw new Error("btc and eur must be positive magnitudes.");
  }

  dispatch(
    addTransaction({
      action,
      btc,
      eur,
      timestamp
    })
  );
}