import * as storeModule from "./store";
const store: any = (storeModule as any).store ?? (storeModule as any).default;

describe("Redux store", () => {
  test("is created and exposes getState/dispatch/subscribe", () => {
    expect(store).toBeTruthy();
    expect(typeof store.getState).toBe("function");
    expect(typeof store.dispatch).toBe("function");
    expect(typeof store.subscribe).toBe("function");
  });

  test("has an initial state object", () => {
    const state = store.getState();
    expect(state).toBeDefined();
    expect(typeof state).toBe("object");
  });

  test("dispatch returns something truthy and unknown action leaves state reference unchanged", () => {
    const prevRef = store.getState();
    const result = store.dispatch({ type: "__TEST_UNKNOWN_ACTION__" } as any);
    expect(result).toBeTruthy();

    const nextRef = store.getState();
    expect(nextRef).toBe(prevRef);
  });

  test("subscribe notifies on dispatch and unsubscribe stops notifying", () => {
    let calls = 0;
    const unsubscribe = store.subscribe(() => {
      calls += 1;
    });

    store.dispatch({ type: "__TEST_PING__" } as any);
    expect(calls).toBe(1);

    unsubscribe();
    store.dispatch({ type: "__TEST_PING_2__" } as any);
    expect(calls).toBe(1);
  });
});
