import { z } from "zod";
import { BaseTool, type ToolResult } from "../BaseTool.js";
import { asOptionalString, asString } from "../../util/args.js";

/** Bir oturumdaki dosya değişikliklerinin (diff) özetini döndürür. */
export class SessionDiffTool extends BaseTool {
  readonly name = "oc_session_diff";
  readonly title = "Session Diff";
  readonly description = "Diff the turns of an OpenCode session (what changed).";
  readonly parameters = {
    sessionId: z.string().min(1).describe("Session id (ses_...)"),
    from: z.string().optional().describe("Start message id (msg_...)"),
    to: z.string().optional().describe("End message id (msg_...)"),
    context: z.string().optional().describe("Context lines or ref"),
  };

  override async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const data = await this.deps.client.sessionDiff(asString(args.sessionId), {
      from: asOptionalString(args.from),
      to: asOptionalString(args.to),
      context: asOptionalString(args.context),
    });
    return this.text(JSON.stringify(data, null, 2));
  }
}
