import { datastore } from "@/datastore/datastore-server";
import { createMocks } from "node-mocks-http";
import handler, { isOperatorValid } from "../operators";

describe("API /api/operators", () => {
  test("returns 405 for non-GET", async () => {
    const { req, res } = createMocks({ method: "POST" });
    await handler(req as any, res as any);
    expect(res._getStatusCode()).toBe(405);
  });

  test("returns all operators for GET without type", async () => {
    const { req, res } = createMocks({ method: "GET" });
    await handler(req as any, res as any);
    expect(res._getStatusCode()).toBe(200);
    const body = res._getJSONData();
    expect(Array.isArray(body)).toBe(true);
    expect(body).toHaveLength(datastore.getOperators().length);
  });

  test("rejects invalid type", async () => {
    const { req, res } = createMocks({
      method: "GET",
      query: { type: "boolean" },
    });
    await handler(req as any, res as any);
    expect(res._getStatusCode()).toBe(400);
    const body = res._getJSONData();
    expect(body.message).toMatch(/Invalid propertyType/);
  });

  test("filters by type string", async () => {
    const { req, res } = createMocks({
      method: "GET",
      query: { type: "string" },
    });
    await handler(req as any, res as any);
    expect(res._getStatusCode()).toBe(200);
    const body = res._getJSONData();
    const ids = body.map((o: any) => o.id).sort();
    expect(ids).toEqual(["any", "contains", "equals", "in", "none"].sort());
  });
});

describe("isOperatorValid()", () => {
  test("valid combos", () => {
    expect(isOperatorValid("number", "equals")).toBe(true);
    expect(isOperatorValid("string", "contains")).toBe(true);
  });

  test("invalid combos", () => {
    expect(isOperatorValid("number", "contains")).toBe(false);
  });
});
