import { createSlice, PayloadAction, nanoid } from "@reduxjs/toolkit";

export type TransactionAction = "buy" | "sell";

export interface CryptoTransaction {
  id: string; 
  action: TransactionAction;
  btc: number; 
  eur: number; 
  timestamp: string; 
}

interface TransactionsState {
  items: CryptoTransaction[];
  isInitialized: boolean;
}

const initialState: TransactionsState = {
  items: [],
  isInitialized: false
};

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    setTransactions(state, action: PayloadAction<CryptoTransaction[]>) {
      state.items = [...action.payload].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      state.isInitialized = true;
    },
    addTransaction: {
      prepare(partial: Omit<CryptoTransaction, "id"> & { id?: string }) {
        return {
          payload: {
            id: partial.id ?? nanoid(),
            ...partial
          } as CryptoTransaction
        };
      },
      reducer(state, action: PayloadAction<CryptoTransaction>) {
        const tx = action.payload;
        const t = new Date(tx.timestamp).getTime();
        const idx = state.items.findIndex(
          (x) => new Date(x.timestamp).getTime() < t
        );
        if (idx === -1) state.items.push(tx);
        else state.items.splice(idx, 0, tx);
      }
    },
    insertTransaction: {
      prepare(input: {
        action: TransactionAction;
        btc: number;
        eur: number;
        timestamp?: string;
        id?: string;
      }) {
        console.log('insert transaction trig')
        const { action } = input;

        const absBtc = Math.abs(input.btc);
        const absEur = Math.abs(input.eur);

        const btc = action === "buy" ? +absBtc : -absBtc;
        const eur = action === "buy" ? -absEur : +absEur;

        return {
          payload: {
            id: input.id ?? nanoid(),
            action,
            btc,
            eur,
            timestamp: input.timestamp ?? new Date().toISOString()
          } as CryptoTransaction
        };
      },
      reducer(state, action: PayloadAction<CryptoTransaction>) {
        const tx = action.payload;
        const t = new Date(tx.timestamp).getTime();
        const idx = state.items.findIndex(
          (x) => new Date(x.timestamp).getTime() < t
        );
        if (idx === -1) state.items.push(tx);
        else state.items.splice(idx, 0, tx);
      }
    },
    clearTransactions(state) {
      state.items = [];
      state.isInitialized = false;
    }
  }
});

export const { setTransactions, addTransaction, insertTransaction, clearTransactions } =
  transactionsSlice.actions;

export default transactionsSlice.reducer;
