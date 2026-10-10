import { BaseTool, type ToolResult } from "./BaseTool.js";

/** OpenCode sunucusunun sağlığını ve sürümünü döndürür. */
export class HealthTool extends BaseTool {
  readonly name = "oc_health";
  readonly title = "OpenCode Health";
  readonly description = "Check the connected OpenCode server: health status, version and endpoint.";
  readonly parameters = {};

  override async execute(): Promise<ToolResult> {
    const info = await this.deps.client.info();
    const version = info.version ?? "unknown";
    return this.text(`OpenCode server: healthy\nversion: ${version}\nendpoint: ${this.deps.client.baseUrl}`);
  }
}
