import { describe, expect, it } from "vitest";
import { BearerAuth } from "../../src/transport/BearerAuth.js";

describe("BearerAuth", () => {
  it("accepts the correct bearer token", () => {
    const auth = new BearerAuth("secret-token");
    expect(auth.isAuthorized("Bearer secret-token")).toBe(true);
    expect(auth.isAuthorized("bearer secret-token")).toBe(true);
  });

  it("rejects wrong or malformed headers", () => {
    const auth = new BearerAuth("secret-token");
    expect(auth.isAuthorized("Bearer wrong")).toBe(false);
    expect(auth.isAuthorized("Basic secret-token")).toBe(false);
    expect(auth.isAuthorized("secret-token")).toBe(false);
    expect(auth.isAuthorized(undefined)).toBe(false);
  });

  it("is unconfigured without a token and rejects everything", () => {
    const auth = new BearerAuth(undefined);
    expect(auth.isConfigured()).toBe(false);
    expect(auth.isAuthorized("Bearer anything")).toBe(false);
  });
});
