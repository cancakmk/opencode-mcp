import { BaseTool, type ToolResult } from "../BaseTool.js";

/** Şu anda etkin (çalışan) oturumları listeler. */
export class SessionActiveTool extends BaseTool {
  readonly name = "oc_session_active";
  readonly title = "List Active Sessions";
  readonly description = "List OpenCode sessions that are currently active.";
  readonly parameters = {};

  override async execute(): Promise<ToolResult> {
    const result = await this.deps.client.activeSessions();
    return this.text(JSON.stringify(result.data, null, 2));
  }
}
