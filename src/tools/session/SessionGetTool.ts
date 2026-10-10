import { z } from "zod";
import { BaseTool, type ToolResult } from "../BaseTool.js";
import { asString } from "../../util/args.js";

/** Tek bir oturumun ayrıntılarını döndürür. */
export class SessionGetTool extends BaseTool {
  readonly name = "oc_session_get";
  readonly title = "Get Session";
  readonly description = "Get details for a single OpenCode session.";
  readonly parameters = {
    sessionId: z.string().min(1).describe("Session id (ses_...)"),
  };

  override async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const session = await this.deps.client.getSession(asString(args.sessionId));
    return this.text(JSON.stringify(session.data, null, 2));
  }
}
