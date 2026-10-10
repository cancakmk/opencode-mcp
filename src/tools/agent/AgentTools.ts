import { z } from "zod";
import { BaseTool, type ToolResult } from "../BaseTool.js";
import { asOptionalString, asString } from "../../util/args.js";

/** Kullanılabilir ajanları listeler. */
export class AgentListTool extends BaseTool {
  readonly name = "oc_agent_list";
  readonly title = "List Agents";
  readonly description = "List agents available to the OpenCode server.";
  readonly parameters = { directory: z.string().optional().describe("Project directory (location)") };

  override async execute(args: Record<string, unknown>): Promise<ToolResult> {
    return this.text(JSON.stringify(await this.deps.client.listAgents(asOptionalString(args.directory)), null, 2));
  }
}

/** Oturumun ajanını değiştirir. */
export class SwitchAgentTool extends BaseTool {
  readonly name = "oc_switch_agent";
  readonly title = "Switch Agent";
  readonly description = "Switch the agent of an OpenCode session.";
  readonly parameters = {
    sessionId: z.string().min(1).describe("Session id (ses_...)"),
    agent: z.string().min(1).describe("Agent id (e.g. build, plan)"),
  };

  override async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const data = await this.deps.client.switchAgent(asString(args.sessionId), asString(args.agent));
    return this.text(JSON.stringify(data, null, 2));
  }
}

/** Sağlayıcıları listeler. */
export class ProviderListTool extends BaseTool {
  readonly name = "oc_provider_list";
  readonly title = "List Providers";
  readonly description = "List configured providers.";
  readonly parameters = { directory: z.string().optional().describe("Project directory (location)") };

  override async execute(args: Record<string, unknown>): Promise<ToolResult> {
    return this.text(JSON.stringify(await this.deps.client.listProviders(asOptionalString(args.directory)), null, 2));
  }
}
