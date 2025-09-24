import { configureStore } from "@reduxjs/toolkit";
import account from "@/lib/store/accountSlice";
import transactions from "@/lib/store/transactionsSlice";
import crypto from "@/lib/store/cryptoSlice";

export const store = configureStore({
  reducer: {
    account,
    transactions,
    crypto,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
