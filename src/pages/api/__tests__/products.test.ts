import { datastore } from "@/datastore/datastore-server";
import { createMocks } from "node-mocks-http";
import handler from "../products";

describe("API /api/products", () => {
  test("returns 405 for non-GET", async () => {
    const { req, res } = createMocks({ method: "POST" });
    await handler(req as any, res as any);
    expect(res._getStatusCode()).toBe(405);
  });

  test("400 for invalid propertyId type", async () => {
    const { req, res } = createMocks({
      method: "GET",
      query: { propertyId: "abc" },
    });
    await handler(req as any, res as any);
    expect(res._getStatusCode()).toBe(400);
  });

  test("400 for non-existent propertyId", async () => {
    const { req, res } = createMocks({
      method: "GET",
      query: { propertyId: "999" },
    });
    await handler(req as any, res as any);
    expect(res._getStatusCode()).toBe(400);
  });

  test("400 when operator is not a string", async () => {
    const { req, res } = createMocks({
      method: "GET",
      query: { operator: ["equals"] as any },
    });
    await handler(req as any, res as any);
    expect(res._getStatusCode()).toBe(400);
  });

  test("400 for invalid operator id", async () => {
    const { req, res } = createMocks({
      method: "GET",
      query: { operator: "invalid" },
    });
    await handler(req as any, res as any);
    expect(res._getStatusCode()).toBe(400);
  });

  test("400 for invalid operator/property combination", async () => {
    const { req, res } = createMocks({
      method: "GET",
      query: { propertyId: "2", operator: "contains", search: "5" },
    });
    await handler(req as any, res as any);
    expect(res._getStatusCode()).toBe(400);
  });

  test("returns all products when operator requires search but search missing", async () => {
    const { req, res } = createMocks({
      method: "GET",
      query: { propertyId: "0", operator: "equals" },
    });
    await handler(req as any, res as any);
    expect(res._getStatusCode()).toBe(200);
    const body = res._getJSONData();
    expect(body).toHaveLength(datastore.getProducts().length);
  });

  test("equals on string property", async () => {
    const { req, res } = createMocks({
      method: "GET",
      query: { propertyId: "1", operator: "equals", search: "black" },
    });
    await handler(req as any, res as any);
    const body = res._getJSONData();
    expect(Array.isArray(body)).toBe(true);
    expect(body.map((p: any) => p.id).sort()).toEqual([0, 1]);
  });

  test("equals on number property", async () => {
    const { req, res } = createMocks({
      method: "GET",
      query: { propertyId: "2", operator: "equals", search: "5" },
    });
    await handler(req as any, res as any);
    const body = res._getJSONData();
    expect(body.map((p: any) => p.id).sort()).toEqual([0, 2]);
  });

  test("greater_than on number property", async () => {
    const { req, res } = createMocks({
      method: "GET",
      query: { propertyId: "2", operator: "greater_than", search: "4" },
    });
    await handler(req as any, res as any);
    const ids = res
      ._getJSONData()
      .map((p: any) => p.id)
      .sort();
    expect(ids).toEqual([0, 2, 5]);
  });

  test("less_than on number property", async () => {
    const { req, res } = createMocks({
      method: "GET",
      query: { propertyId: "2", operator: "less_than", search: "4" },
    });
    await handler(req as any, res as any);
    const ids = res
      ._getJSONData()
      .map((p: any) => p.id)
      .sort();
    expect(ids).toEqual([1, 3, 4]);
  });

  test("contains on string property", async () => {
    const { req, res } = createMocks({
      method: "GET",
      query: { propertyId: "0", operator: "contains", search: "phone" },
    });
    await handler(req as any, res as any);
    const ids = res
      ._getJSONData()
      .map((p: any) => p.id)
      .sort();
    expect(ids).toEqual([0, 1]);
  });

  test("any on property existence", async () => {
    const { req, res } = createMocks({
      method: "GET",
      query: { propertyId: "4", operator: "any" },
    });
    await handler(req as any, res as any);
    const ids = res
      ._getJSONData()
      .map((p: any) => p.id)
      .sort();
    expect(ids).toEqual([0, 1, 2]);
  });

  test("none on property absence", async () => {
    const { req, res } = createMocks({
      method: "GET",
      query: { propertyId: "4", operator: "none" },
    });
    await handler(req as any, res as any);
    const ids = res
      ._getJSONData()
      .map((p: any) => p.id)
      .sort();
    expect(ids).toEqual([3, 4, 5]);
  });

  test("in operator with string values", async () => {
    const { req, res } = createMocks({
      method: "GET",
      query: { propertyId: "3", operator: "in", search: "electronics, tools" },
    });
    await handler(req as any, res as any);
    const ids = res
      ._getJSONData()
      .map((p: any) => p.id)
      .sort();
    expect(ids).toEqual([0, 1, 2, 4, 5]);
  });
});
