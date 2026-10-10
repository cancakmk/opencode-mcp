import { describe, expect, it, vi } from "vitest";
import { OpenCodeApiError, OpenCodeClient } from "../../src/opencode/OpenCodeClient.js";
import { Logger } from "../../src/logging/Logger.js";

const logger = new Logger("error");

describe("OpenCodeClient", () => {
  it("parses /api/info and sends HTTP Basic auth", async () => {
    const fetchImpl = vi.fn(async (url: URL | RequestInfo, init?: RequestInit) => {
      expect(String(url)).toBe("http://host:4096/api/info");
      const headers = init?.headers as Record<string, string>;
      expect(headers["authorization"]).toBe(
        `Basic ${Buffer.from("opencode:secret").toString("base64")}`,
      );
      return new Response(JSON.stringify({ version: "2.0.26" }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    });

    const client = new OpenCodeClient({
      baseUrl: "http://host:4096/",
      username: "opencode",
      password: "secret",
      logger,
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });

    const info = await client.info();
    expect(info.version).toBe("2.0.26");
    expect(client.baseUrl).toBe("http://host:4096");
  });

  it("throws OpenCodeApiError on a non-2xx response", async () => {
    const fetchImpl = vi.fn(async () => new Response("boom", { status: 500 }));
    const client = new OpenCodeClient({
      baseUrl: "http://host:4096",
      username: "opencode",
      password: "x",
      logger,
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });

    await expect(client.info()).rejects.toBeInstanceOf(OpenCodeApiError);
  });

  it("omits the authorization header when no password is configured", async () => {
    const fetchImpl = vi.fn(async (_url: URL | RequestInfo, init?: RequestInit) => {
      const headers = (init?.headers ?? {}) as Record<string, string>;
      expect(headers["authorization"]).toBeUndefined();
      return new Response("{}", { status: 200 });
    });

    const client = new OpenCodeClient({
      baseUrl: "http://host:4096",
      username: "opencode",
      password: undefined,
      logger,
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });

    await expect(client.info()).resolves.toBeDefined();
  });
});
