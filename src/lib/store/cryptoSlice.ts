import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export type Point = [string, number];
export type ApiResponse = { prices: Point[] };

type CryptoState = {
  series: Point[];
  latestPrice: number | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: string | null;
};

const initialState: CryptoState = {
  series: [],
  latestPrice: null,
  status: "idle",
  error: null,
};

export const fetchCrypto24h = createAsyncThunk<ApiResponse>("crypto/fetch24h", async () => {
  const res = await fetch("/api/crypto", { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as ApiResponse;
});

const cryptoSlice = createSlice({
  name: "crypto",
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchCrypto24h.pending, (s) => {
      s.status = "loading";
      s.error = null;
    });
    b.addCase(fetchCrypto24h.fulfilled, (s, { payload }) => {
      s.status = "succeeded";
      s.series = payload.prices;
      const last = payload.prices[payload.prices.length - 1];
      s.latestPrice = last ? last[1] : null;
    });
    b.addCase(fetchCrypto24h.rejected, (s, a) => {
      s.status = "failed";
      s.error = a.error.message ?? "Failed to load";
    });
  },
});

export default cryptoSlice.reducer;
