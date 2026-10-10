import { z } from "zod";
import { BaseTool, type ToolResult } from "../BaseTool.js";
import { asString } from "../../util/args.js";

/** Bir oturuma prompt gönderir (yanıtı beklemez). */
export class PromptTool extends BaseTool {
  readonly name = "oc_prompt";
  readonly title = "Send Prompt";
  readonly description =
    "Send a prompt to an OpenCode session and return immediately (does not wait for the answer). Use oc_ask to wait for the reply.";
  readonly parameters = {
    sessionId: z.string().min(1).describe("Session id (ses_...)"),
    text: z.string().min(1).describe("Prompt text to send"),
  };

  override async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const result = await this.deps.client.promptSession(asString(args.sessionId), asString(args.text));
    return this.text(`Prompt queued (message ${result.data.id}) in session ${result.data.sessionID}.`);
  }
}
