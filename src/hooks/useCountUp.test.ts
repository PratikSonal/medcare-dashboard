import { act,renderHook } from "@testing-library/react";

import { useCountUp } from "./useCountUp";

jest.useFakeTimers();

describe("useCountUp", () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  it("starts at 0", () => {
    const { result } = renderHook(() => useCountUp(100));
    expect(result.current).toBe(0);
  });

  it("reaches the target value after all timers have run", () => {
    const { result } = renderHook(() => useCountUp(100, 1000));
    act(() => {
      jest.runAllTimers();
    });
    expect(result.current).toBe(100);
  });

  it("counts upward incrementally before completing", () => {
    const { result } = renderHook(() => useCountUp(100, 1000));
    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(result.current).toBeGreaterThan(0);
    expect(result.current).toBeLessThan(100);
  });

  it("stays at 0 when target is 0", () => {
    const { result } = renderHook(() => useCountUp(0, 1000));
    act(() => {
      jest.runAllTimers();
    });
    expect(result.current).toBe(0);
  });

  it("resets and counts to new target when target changes", () => {
    const { result, rerender } = renderHook(({ target }) => useCountUp(target, 1000), {
      initialProps: { target: 50 },
    });
    act(() => {
      jest.runAllTimers();
    });
    expect(result.current).toBe(50);

    rerender({ target: 200 });
    act(() => {
      jest.runAllTimers();
    });
    expect(result.current).toBe(200);
  });

  it("clears the interval on unmount", () => {
    const { unmount } = renderHook(() => useCountUp(100, 1000));
    const clearIntervalSpy = jest.spyOn(globalThis, "clearInterval");
    unmount();
    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });
});
