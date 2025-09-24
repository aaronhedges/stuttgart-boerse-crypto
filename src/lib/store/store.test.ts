import { configureStore } from "@reduxjs/toolkit";
import accountReducer, {
  applyTrade,
  fetchUserAccount,
} from "@/lib/store/accountSlice";
import transactionsReducer, {
  addTransaction,
  setTransactions,
} from "@/lib/store/transactionsSlice";
import cryptoReducer from "@/lib/store/cryptoSlice";
import { recordTrade } from "@/utils/recordTrade";

type RootState = ReturnType<typeof makeStore>["getState"];

function makeStore() {
  return configureStore({
    reducer: {
      account: accountReducer,
      transactions: transactionsReducer,
      crypto: cryptoReducer,
    },
  });
}

describe("store integration", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("initial state has expected slices and defaults", () => {
    const store = makeStore();
    const s = store.getState() as RootState;

    expect(s).toHaveProperty("account");
    expect(s).toHaveProperty("transactions");
    expect(s).toHaveProperty("crypto");

    expect(s.account.availableBtc).toBeNull();
    expect(s.account.availableEur).toBeNull();
    expect(s.account.status).toBe("idle");

    expect(Array.isArray(s.transactions.items)).toBe(true);
    expect(s.transactions.items.length).toBe(0);
  });

  test("fetchUserAccount populates balances and statuses", async () => {
    const store = makeStore();

    const mockJson = {
      userId: "demo-user",
      balances: {
        availableBtc: 0.12345678,
        availableEur: 242.51,
      },
      updatedAt: "2025-09-24T11:00:00Z",
    };
    const fetchSpy = jest
      .spyOn(global, "fetch" as any)
      .mockResolvedValue({
        ok: true,
        json: async () => mockJson,
      } as any);

    const run = store.dispatch(fetchUserAccount());
    expect(store.getState().account.status).toBe("loading");

    await run;

    const s = store.getState();
    expect(fetchSpy).toHaveBeenCalledWith("/mock/userAccount.json", { cache: "no-store" });
    expect(s.account.status).toBe("succeeded");
    expect(s.account.availableBtc).toBeCloseTo(0.12345678);
    expect(s.account.availableEur).toBeCloseTo(242.51);
  });

  test("applyTrade adjusts balances (null treated as 0, then accumulates)", () => {
    const store = makeStore();

    store.dispatch(applyTrade({ eur: -1000, btc: 0.05 }));
    let s = store.getState();

    expect(s.account.availableEur).toBe(-1000);
    expect(s.account.availableBtc).toBeCloseTo(0.05, 8);

    store.dispatch(applyTrade({ eur: 200, btc: -0.01 }));
    s = store.getState();

    expect(s.account.availableEur).toBe(-800);
    expect(s.account.availableBtc).toBeCloseTo(0.04, 8);
  });

  test("addTransaction unshifts and maintains newest-first by timestamp", () => {
    const store = makeStore();

    store.dispatch(
      setTransactions([
        {
          id: "a",
          action: "buy",
          eur: -100,
          btc: 0.005,
          timestamp: "2025-09-24T10:00:00Z",
        },
        {
          id: "b",
          action: "sell",
          eur: 50,
          btc: -0.0025,
          timestamp: "2025-09-24T09:00:00Z",
        },
      ])
    );

    store.dispatch(
      addTransaction({
        id: "c",
        action: "buy",
        eur: -200,
        btc: 0.01,
        timestamp: "2025-09-24T12:00:00Z",
      })
    );

    const items = store.getState().transactions.items;
    expect(items.map((t) => t.id)).toEqual(["c", "a", "b"]);
  });

  test("recordTrade end-to-end: adds transaction and applies account balances", () => {
    const store = makeStore();
    const dispatch = store.dispatch;

    recordTrade(dispatch as any, {
      action: "buy",
      eur: 1000,
      btc: 0.05,
      timestamp: "2025-09-24T12:30:00Z",
    });

    let s = store.getState();
    expect(s.transactions.items.length).toBe(1);
    expect(s.transactions.items[0]).toEqual(
      expect.objectContaining({
        action: "buy",
        eur: -1000,
        btc: 0.05,
        timestamp: "2025-09-24T12:30:00Z",
      })
    );
    expect(s.account.availableEur).toBe(-1000);
    expect(s.account.availableBtc).toBeCloseTo(0.05, 8);

    recordTrade(dispatch as any, {
      action: "sell",
      eur: 500,
      btc: 0.02,
      timestamp: "2025-09-24T12:45:00Z",
    });

    s = store.getState();
    expect(s.transactions.items.length).toBe(2);
    expect(s.transactions.items[0]).toEqual(
      expect.objectContaining({
        action: "sell",
        eur: 500,
        btc: -0.02,
        timestamp: "2025-09-24T12:45:00Z",
      })
    );
    expect(s.account.availableEur).toBe(-500);
    expect(s.account.availableBtc).toBeCloseTo(0.03, 8);
  });
});
