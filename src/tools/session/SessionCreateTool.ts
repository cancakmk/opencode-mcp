import { z } from "zod";
import { BaseTool, type ToolResult } from "../BaseTool.js";
import { asOptionalString } from "../../util/args.js";

/** Yeni bir OpenCode oturumu oluşturur. */
export class SessionCreateTool extends BaseTool {
  readonly name = "oc_session_create";
  readonly title = "Create Session";
  readonly description =
    "Create a new OpenCode session. Optionally set a title, agent, model or working directory.";
  readonly parameters = {
    title: z.string().min(1).optional().describe("Session title"),
    agent: z.string().min(1).optional().describe("Agent id to use for the session"),
    directory: z.string().min(1).optional().describe("Working directory the session runs in"),
  };

  override async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const created = await this.deps.client.createSession({
      title: asOptionalString(args.title),
      agent: asOptionalString(args.agent),
      directory: asOptionalString(args.directory),
    });
    return this.text(JSON.stringify(created.data, null, 2));
  }
}
