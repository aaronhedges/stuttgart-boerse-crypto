import { createSlice, PayloadAction, nanoid } from "@reduxjs/toolkit";

export type TxAction = "buy" | "sell";

export interface Transaction {
  id: string;
  action: TxAction;
  eur: number;
  btc: number;
  timestamp: string;
}

type State = {
  items: Transaction[];
  isInitialized: boolean;
};

const initialState: State = {
  items: [],
  isInitialized: false,
};

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    setTransactions(state, action: PayloadAction<Transaction[]>) {
      state.items = [...action.payload].sort(
        (a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp)
      );
      state.isInitialized = true;
    },
    addTransaction(state, action: PayloadAction<Omit<Transaction, "id"> & { id?: string }>) {
      const id = action.payload.id ?? nanoid();
      state.items.unshift({ ...action.payload, id });
    },
  },
});

export const { setTransactions, addTransaction } = transactionsSlice.actions;
export default transactionsSlice.reducer;
