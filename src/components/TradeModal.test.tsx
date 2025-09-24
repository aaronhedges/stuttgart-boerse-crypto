import React from "react";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import { TradeModal } from "@/components/TradeModal";

const dispatchMock = jest.fn();
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: () => dispatchMock,
}));

const recordTradeMock = jest.fn();
jest.mock("@/utils/recordTrade", () => ({
  recordTrade: (...args: any[]) => (recordTradeMock as any)(...args),
}));

describe("TradeModal", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    dispatchMock.mockReset();
    recordTradeMock.mockReset();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  const setup = async (props?: Partial<React.ComponentProps<typeof TradeModal>>) => {
    const onClose = jest.fn();
    render(<TradeModal isOpen={true} onClose={onClose} exchangeRateEurPerBtc={20000} {...props} />);
    await act(async () => {
      jest.runAllTimers();
    });
    const user = userEvent.setup({
      advanceTimers: jest.advanceTimersByTime.bind(jest),
    });
    return { onClose, user };
  };

  test("does not render when closed", () => {
    const onClose = jest.fn();
    const { container } = render(
      <TradeModal isOpen={false} onClose={onClose} exchangeRateEurPerBtc={20000} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  test("renders when open and focuses the EUR input", async () => {
    await setup();
    const inputs = screen.getAllByRole("textbox");
    const eurInput = inputs[0];
    expect(eurInput).toHaveFocus();
  });

  test("closes when pressing Escape", async () => {
    const { onClose, user } = await setup();
    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalled();
  });

  test("closes when clicking backdrop", async () => {
    const { onClose, user } = await setup();
    const dialog = screen.getByRole("dialog");
    await user.click(dialog);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("does not close when clicking inside the dialog content", async () => {
    const { onClose, user } = await setup();

    const dialog = screen.getByRole("dialog");
    const content = dialog.querySelector("div.w-full.max-w-md") as HTMLElement;
    expect(content).toBeTruthy();

    await user.click(content);
    expect(onClose).not.toHaveBeenCalled();
  });

  test("typing EUR syncs BTC using the exchange rate", async () => {
    const { user } = await setup();
    const [eurInput, btcInput] = screen.getAllByRole("textbox");

    await user.clear(eurInput);
    await user.type(eurInput, "1000");
    expect(btcInput).toHaveValue("0.05000000");
  });

  test("typing BTC syncs EUR using the exchange rate", async () => {
    const { user } = await setup();
    const [eurInput, btcInput] = screen.getAllByRole("textbox");

    await user.clear(btcInput);
    await user.type(btcInput, "0.1");
    expect(eurInput).toHaveValue("2000.00");
  });

  test("EUR input formats on blur and unformats on focus (de-DE style)", async () => {
    const { user } = await setup();
    const [eurInput] = screen.getAllByRole("textbox");

    await user.clear(eurInput);
    await user.type(eurInput, "1234.5");

    await user.tab();
    expect(eurInput).toHaveValue("1.234,50");

    await user.click(eurInput);
    expect(eurInput).toHaveValue("1.234,5");
  });

  test("BTC input formats on blur with de-DE digits", async () => {
    const { user } = await setup();
    const [, btcInput] = screen.getAllByRole("textbox");

    await user.clear(btcInput);
    await user.type(btcInput, "1.2345");
    await user.tab();
    expect(btcInput).toHaveValue("1,2345");
  });

  test("clicking Buy calls recordTrade, clears form, closes", async () => {
    const { onClose, user } = await setup();
    const [eurInput, btcInput] = screen.getAllByRole("textbox");
    const buyBtn = screen.getByRole("button", { name: /buy/i });

    await user.clear(eurInput);
    await user.type(eurInput, "1000");
    await user.clear(btcInput);
    await user.type(btcInput, "0.05");

    const before = Date.now();
    await user.click(buyBtn);
    const after = Date.now();

    expect(recordTradeMock).toHaveBeenCalledTimes(1);
    const [passedDispatch, payload] = recordTradeMock.mock.calls[0];
    expect(passedDispatch).toBe(dispatchMock);
    expect(payload.action).toBe("buy");
    expect(payload.eur).toBe(1000);
    expect(payload.btc).toBe(0.05);

    expect(typeof payload.timestamp).toBe("string");
    const tsMs = Date.parse(payload.timestamp);
    expect(tsMs).toBeGreaterThanOrEqual(before - 2000);
    expect(tsMs).toBeLessThanOrEqual(after + 2000);

    expect((eurInput as HTMLInputElement).value).toBe("");
    expect((btcInput as HTMLInputElement).value).toBe("");
    expect(onClose).toHaveBeenCalled();
  });

  test("clicking Sell calls recordTrade, clears form, closes", async () => {
    const { onClose, user } = await setup();
    const [eurInput, btcInput] = screen.getAllByRole("textbox");
    const sellBtn = screen.getByRole("button", { name: /sell/i });

    await user.clear(eurInput);
    await user.type(eurInput, "1000");
    await user.clear(btcInput);
    await user.type(btcInput, "0.05");

    await user.click(sellBtn);

    expect(recordTradeMock).toHaveBeenCalledTimes(1);
    const [passedDispatch, payload] = recordTradeMock.mock.calls[0];
    expect(passedDispatch).toBe(dispatchMock);
    expect(payload.action).toBe("sell");
    expect(payload.eur).toBe(1000);
    expect(payload.btc).toBe(0.05);

    expect(onClose).toHaveBeenCalled();
  });

  test("does not call recordTrade when inputs are empty or zero", async () => {
    const { user } = await setup();
    const buyBtn = screen.getByRole("button", { name: /buy/i });
    await user.click(buyBtn);
    expect(recordTradeMock).not.toHaveBeenCalled();
  });
});
