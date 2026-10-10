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
    sessionId: z
      .string()
      .optional()
      .describe("Existing OpenCode session id (starts with 'ses'). Omit to create a new session; any other value is normalized."),
    title: z.string().optional().describe("Title for a newly created session"),
    timeoutMs: z.number().int().positive().optional().describe("Timeout in milliseconds (default 300000)"),
  };

  override async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const timeoutMs = asOptionalNumber(args.timeoutMs) ?? 300_000;
    const text = asString(args.text);

    const requestedSession = asOptionalString(args.sessionId);
    const created = await this.deps.client.createSession({
      ...(requestedSession !== undefined ? { id: requestedSession } : {}),
      title: asOptionalString(args.title),
    });
    const sessionId = created.data.id;

    const latest = await this.deps.client.listMessages(sessionId, { order: "desc", limit: 1 });
    const since = latest.data[0]?.time?.created ?? 0;

    await this.deps.client.promptSession(sessionId, text);
    const settled = await this.deps.waiter.waitForSettled(sessionId, since, timeoutMs);

    if (settled.outcome === "timeout") {
      return this.failure(`OpenCode did not finish within ${timeoutMs} ms (session ${sessionId}).`);
    }
    const body = settled.text || "(no text output)";
    const withActivity =
      settled.activity.length > 0
        ? `${body}\n\nActivity:\n${settled.activity.map((line) => `- ${line}`).join("\n")}`
        : body;
    if (settled.outcome === "failed") {
      return this.failure(`OpenCode reported a failure in session ${sessionId}:\n${withActivity}`);
    }
    return this.text(withActivity);
  }
}
