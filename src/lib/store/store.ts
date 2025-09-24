import { configureStore } from "@reduxjs/toolkit";
import cryptoReducer from "@/lib/store/cryptoSlice";
import transactionsReducer from "@/lib/store/transactionsSlice";
import accountReducer from "@/lib/store/accountSlice";

export const store = configureStore({
  reducer: {
    crypto: cryptoReducer,
    transactions: transactionsReducer,
    account: accountReducer,
  },
});

export type AppStore = ReturnType<typeof store.makeStore>;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
