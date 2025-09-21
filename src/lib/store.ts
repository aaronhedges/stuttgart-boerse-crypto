import { configureStore } from "@reduxjs/toolkit";
import cryptoReducer from "./features/crypto/cryptoSlice";
// import counterReducer from './features/counter/counterSlice'; // optional

export const store = configureStore({
  reducer: {
    crypto: cryptoReducer,
    // counter: counterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
