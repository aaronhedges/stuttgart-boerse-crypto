import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

type AccountState = {
  availableBtc: number | null;
  availableEur: number | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: string;
};

const initialState: AccountState = {
  availableBtc: null,
  availableEur: null,
  status: "idle",
};

export const fetchUserAccount = createAsyncThunk("account/fetchUserAccount", async () => {
  const res = await fetch("/mock/userAccount.json", { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load userAccount.json (${res.status})`);
  const data = await res.json();
  return {
    availableBtc: data?.balances?.availableBtc ?? 0,
    availableEur: data?.balances?.availableEur ?? 0,
  };
});

type ApplyTradePayload = {
  eur: number;
  btc: number;
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    applyTrade(state, action: PayloadAction<ApplyTradePayload>) {
      const { eur, btc } = action.payload;
      state.availableEur = (state.availableEur ?? 0) + eur;
      state.availableBtc = (state.availableBtc ?? 0) + btc;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserAccount.pending, (state) => {
        state.status = "loading";
        state.error = undefined;
      })
      .addCase(fetchUserAccount.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.availableBtc = action.payload.availableBtc;
        state.availableEur = action.payload.availableEur;
      })
      .addCase(fetchUserAccount.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { applyTrade } = accountSlice.actions;
export default accountSlice.reducer;
