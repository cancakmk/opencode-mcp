import { z } from "zod";
import { BaseTool, type ToolResult } from "../BaseTool.js";
import { asString } from "../../util/args.js";

/** Bir oturumu siler (yıkıcı). */
export class SessionDeleteTool extends BaseTool {
  readonly name = "oc_session_delete";
  readonly title = "Delete Session";
  readonly description = "Delete an OpenCode session. This is destructive.";
  override readonly profile = "full" as const;
  readonly parameters = {
    sessionId: z.string().min(1).describe("Session id (ses_...)"),
  };

  override async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const sessionId = asString(args.sessionId);
    await this.deps.client.deleteSession(sessionId);
    return this.text(`Deleted session ${sessionId}.`);
  }
}
