import { describe, expect, it, vi } from "vitest";
import { SessionWaiter } from "../../src/opencode/SessionWaiter.js";
import { Logger } from "../../src/logging/Logger.js";
import type { OpenCodeClient } from "../../src/opencode/OpenCodeClient.js";
import type { MessageListResponse } from "../../src/opencode/types.js";

const logger = new Logger("error");

function clientReturning(responses: MessageListResponse[]): OpenCodeClient {
  const listMessages = vi.fn();
  responses.forEach((response) => listMessages.mockResolvedValueOnce(response));
  listMessages.mockResolvedValue(responses[responses.length - 1]);
  return { listMessages } as unknown as OpenCodeClient;
}

describe("SessionWaiter", () => {
  it("resolves when an idle message newer than the baseline appears", async () => {
    const client = clientReturning([
      {
        data: [
          { id: "a1", type: "assistant", time: { created: 200 }, content: [{ type: "text", text: "done" }] },
          { id: "i1", type: "idle", time: { created: 300 }, outcome: "succeeded" },
        ],
      },
    ]);
    const waiter = new SessionWaiter(client, logger, 1);

    const result = await waiter.waitForSettled("ses_x", 100, 5_000);
    expect(result.outcome).toBe("succeeded");
    expect(result.text).toBe("done");
  });

  it("reports failure when the idle outcome is failed", async () => {
    const client = clientReturning([
      { data: [{ id: "i1", type: "idle", time: { created: 300 }, outcome: "failed" }] },
    ]);
    const waiter = new SessionWaiter(client, logger, 1);

    const result = await waiter.waitForSettled("ses_x", 100, 5_000);
    expect(result.outcome).toBe("failed");
  });

  it("times out when no idle appears", async () => {
    const client = clientReturning([{ data: [{ id: "u1", type: "user", time: { created: 50 } }] }]);
    const waiter = new SessionWaiter(client, logger, 1);

    const result = await waiter.waitForSettled("ses_x", 100, 50);
    expect(result.outcome).toBe("timeout");
  });
});
