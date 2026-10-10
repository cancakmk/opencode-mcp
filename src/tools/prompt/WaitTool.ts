import { z } from "zod";
import { BaseTool, type ToolResult } from "../BaseTool.js";
import { asOptionalNumber, asString } from "../../util/args.js";

/** Oturum boşalana (idle) kadar bekler. */
export class WaitTool extends BaseTool {
  readonly name = "oc_wait";
  readonly title = "Wait For Session";
  readonly description = "Wait until an OpenCode session becomes idle, then return its latest assistant text.";
  readonly parameters = {
    sessionId: z.string().min(1).describe("Session id (ses_...)"),
    timeoutMs: z.number().int().positive().optional().describe("Timeout in milliseconds (default 300000)"),
  };

  override async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const sessionId = asString(args.sessionId);
    const timeoutMs = asOptionalNumber(args.timeoutMs) ?? 300_000;
    const latest = await this.deps.client.listMessages(sessionId, { order: "desc", limit: 1 });
    const since = latest.data[0]?.time?.created ?? 0;
    const settled = await this.deps.waiter.waitForSettled(sessionId, since, timeoutMs);
    if (settled.outcome === "timeout") {
      return this.failure(`Session ${sessionId} did not become idle within ${timeoutMs} ms.`);
    }
    const body = settled.text || `Session ${sessionId} is idle (${settled.outcome}).`;
    return this.text(
      settled.activity.length > 0
        ? `${body}\n\nActivity:\n${settled.activity.map((line) => `- ${line}`).join("\n")}`
        : body,
    );
  }
}
