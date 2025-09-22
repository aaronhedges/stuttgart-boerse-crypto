import { configureStore } from "@reduxjs/toolkit";
import cryptoReducer from "@/lib/store/cryptoSlice";
import transactionsReducer from "./transactionsSlice";

export const store = configureStore({
  reducer: {
    crypto: cryptoReducer,
    transactions: transactionsReducer,
  },
});

export type AppStore = ReturnType<typeof store.makeStore>;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
