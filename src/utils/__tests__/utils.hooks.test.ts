import { renderHook, waitFor } from "@testing-library/react";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

import { useRouter } from "next/router";
import {
  useQueryOperators,
  useQueryProducts,
  useQueryProperties,
  useValuesToQueryParameters,
} from "../utils.hooks";

describe("utils.hooks", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  test("useValuesToQueryParameters builds query string", () => {
    const push = jest.fn();
    const mockRouter = {
      query: { propertyId: "1", operator: "equals", search: "black" },
      push,
      prefetch: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
      beforePopState: jest.fn(),
      events: { on: jest.fn(), off: jest.fn(), emit: jest.fn() },
      pathname: "/",
      route: "/",
      asPath: "/",
      basePath: "",
      isReady: true,
      isFallback: false,
      isLocaleDomain: false,
      isPreview: false,
    } as any;

    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    const { result } = renderHook(() => useValuesToQueryParameters());
    expect(result.current).toBe("propertyId=1&operator=equals&search=black");
  });

  test("useQueryProperties fetches and sets data", async () => {
    const mockData = [{ id: 1, name: "color", type: "string" }];
    jest.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    } as any);

    const { result } = renderHook(() => useQueryProperties());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toBeNull();
    expect(result.current.properties).toEqual(mockData as any);
  });

  test("useQueryOperators fetches based on type", async () => {
    const mockData = [{ id: "equals", text: "Equals" }];
    jest.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    } as any);

    const { result, rerender } = renderHook(
      ({ type }) => useQueryOperators({ type }),
      {
        initialProps: { type: undefined as any },
      }
    );

    expect(result.current.isLoading).toBe(true);

    rerender({ type: "string" as any });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.operators).toEqual(mockData as any);
  });

  test("useQueryProducts fetches based on queryString", async () => {
    const mockData = [{ id: 1 }];
    jest.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    } as any);

    const { result, rerender } = renderHook(({ qs }) => useQueryProducts(qs), {
      initialProps: { qs: "propertyId=1&operator=equals&search=black" },
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.products).toEqual(mockData as any);
    expect(result.current.error).toBeNull();

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: 2 }],
    } as any);
    rerender({ qs: "propertyId=2&operator=equals&search=5" });
    await waitFor(() =>
      expect(result.current.products).toEqual([{ id: 2 }] as any)
    );
  });
});
