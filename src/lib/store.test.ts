import type { Store } from "@reduxjs/toolkit";

jest.mock("@/lib/features/crypto/cryptoSlice", () => {
  const initialState = { value: 0 };
  const reducer = (state = initialState, action: { type: string }) => {
    switch (action.type) {
      case "crypto/increment":
        return { value: state.value + 1 };
      default:
        return state;
    }
  };
  return { __esModule: true, default: reducer };
});

const getFreshStore = async (): Promise<Store> => {
  jest.resetModules();
  const mod = await import("./store");
  return mod.store as Store;
};

describe("Redux store", () => {
  it("mounts the crypto reducer at key 'crypto' with expected initial state", async () => {
    const store = await getFreshStore();
    expect(store.getState()).toEqual({ crypto: { value: 0 } });
  });

  it("dispatch routes to the crypto reducer", async () => {
    const store = await getFreshStore();
    store.dispatch({ type: "crypto/increment" });
    expect((store.getState() as any).crypto.value).toBe(1);
  });

  it("unknown actions leave state unchanged", async () => {
    const store = await getFreshStore();
    const before = store.getState();
    store.dispatch({ type: "unknown/action" });
    expect(store.getState()).toEqual(before);
  });

  it("exposes getState and dispatch", async () => {
    const store = await getFreshStore();
    expect(typeof store.getState).toBe("function");
    expect(typeof store.dispatch).toBe("function");
  });
});
