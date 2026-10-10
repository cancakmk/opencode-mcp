import { z } from "zod";
import { BaseTool, type ToolResult } from "../BaseTool.js";
import { asOptionalNumber, asOptionalString, asString } from "../../util/args.js";

/**
 * Kompozit araç: bir görevi OpenCode'a iletir ve **yanıtı bekler**.
 * Oturum verilmezse yeni bir oturum açar; yanıt metnini döndürür.
 */
export class AskTool extends BaseTool {
  readonly name = "oc_ask";
  readonly title = "Ask OpenCode";
  readonly description =
    "Send a task to OpenCode and wait for the answer. Creates a session if sessionId is omitted. Returns the assistant text.";
  readonly parameters = {
    text: z.string().min(1).describe("The task or question for OpenCode"),
    sessionId: z.string().optional().describe("Existing session id to continue"),
    title: z.string().optional().describe("Title for a newly created session"),
    timeoutMs: z.number().int().positive().optional().describe("Timeout in milliseconds (default 300000)"),
  };

  override async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const timeoutMs = asOptionalNumber(args.timeoutMs) ?? 300_000;
    const text = asString(args.text);

    let sessionId = asOptionalString(args.sessionId);
    if (sessionId === undefined) {
      const created = await this.deps.client.createSession({ title: asOptionalString(args.title) });
      sessionId = created.data.id;
    }

    const latest = await this.deps.client.listMessages(sessionId, { order: "desc", limit: 1 });
    const since = latest.data[0]?.time?.created ?? 0;

    await this.deps.client.promptSession(sessionId, text);
    const settled = await this.deps.waiter.waitForSettled(sessionId, since, timeoutMs);

    if (settled.outcome === "timeout") {
      return this.failure(`OpenCode did not finish within ${timeoutMs} ms (session ${sessionId}).`);
    }
    if (settled.outcome === "failed") {
      return this.failure(`OpenCode reported a failure in session ${sessionId}:\n${settled.text}`);
    }
    return this.text(settled.text || "(no text output)");
  }
}
