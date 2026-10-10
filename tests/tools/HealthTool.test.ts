import { describe, expect, it } from "vitest";
import { HealthTool } from "../../src/tools/HealthTool.js";
import { SessionWaiter } from "../../src/opencode/SessionWaiter.js";
import { Logger } from "../../src/logging/Logger.js";
import type { OpenCodeClient } from "../../src/opencode/OpenCodeClient.js";

const logger = new Logger("error");

describe("HealthTool", () => {
  it("reports the version from the OpenCode client", async () => {
    const client = {
      info: async () => ({ version: "2.0.26" }),
      baseUrl: "http://x:4096",
    } as unknown as OpenCodeClient;

    const tool = new HealthTool({ client, waiter: new SessionWaiter(client, logger), logger });
    const result = await tool.execute({});

    expect(result.isError).toBeUndefined();
    expect(result.content[0]?.text).toContain("2.0.26");
    expect(tool.name).toBe("oc_health");
    expect(tool.profile).toBe("essential");
  });
});
