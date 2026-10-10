import { z } from "zod";
import { BaseTool, type ToolResult } from "../BaseTool.js";
import { asOptionalString, asString } from "../../util/args.js";

/** Kullanılabilir modelleri listeler. */
export class ModelListTool extends BaseTool {
  readonly name = "oc_model_list";
  readonly title = "List Models";
  readonly description = "List models available to the OpenCode server.";
  readonly parameters = { directory: z.string().optional().describe("Project directory (location)") };

  override async execute(args: Record<string, unknown>): Promise<ToolResult> {
    return this.text(JSON.stringify(await this.deps.client.listModels(asOptionalString(args.directory)), null, 2));
  }
}

/** Varsayılan modeli döndürür. */
export class ModelDefaultTool extends BaseTool {
  readonly name = "oc_model_default";
  readonly title = "Default Model";
  readonly description = "Get the default model of the OpenCode server.";
  readonly parameters = { directory: z.string().optional().describe("Project directory (location)") };

  override async execute(args: Record<string, unknown>): Promise<ToolResult> {
    return this.text(JSON.stringify(await this.deps.client.defaultModel(asOptionalString(args.directory)), null, 2));
  }
}

/** Oturumun modelini değiştirir. */
export class SwitchModelTool extends BaseTool {
  readonly name = "oc_switch_model";
  readonly title = "Switch Model";
  readonly description = "Switch the model of an OpenCode session.";
  readonly parameters = {
    sessionId: z.string().min(1).describe("Session id (ses_...)"),
    providerID: z.string().min(1).describe("Provider id (e.g. opencode-go)"),
    modelId: z.string().min(1).describe("Model id (e.g. deepseek-v4.1-flash)"),
    variant: z.string().optional().describe("Optional model variant"),
  };

  override async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const variant = asOptionalString(args.variant);
    const model = {
      providerID: asString(args.providerID),
      id: asString(args.modelId),
      ...(variant !== undefined ? { variant } : {}),
    };
    const data = await this.deps.client.switchModel(asString(args.sessionId), model);
    return this.text(JSON.stringify(data, null, 2));
  }
}
