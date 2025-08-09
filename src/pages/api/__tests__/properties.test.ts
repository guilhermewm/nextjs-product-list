import { datastore } from "@/datastore/datastore-server";
import { createMocks } from "node-mocks-http";
import handler from "../properties";

describe("API /api/properties", () => {
  test("returns 405 for non-GET", async () => {
    const { req, res } = createMocks({ method: "POST" });
    await handler(req as any, res as any);
    expect(res._getStatusCode()).toBe(405);
  });

  test("returns all properties for GET", async () => {
    const { req, res } = createMocks({ method: "GET" });
    await handler(req as any, res as any);
    expect(res._getStatusCode()).toBe(200);
    const body = res._getJSONData();
    expect(Array.isArray(body)).toBe(true);
    expect(body).toEqual(datastore.getProperties());
  });
});
