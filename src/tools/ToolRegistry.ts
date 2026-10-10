import type { ToolProfile } from "../config/Config.js";
import type { BaseTool, ToolDependencies } from "./BaseTool.js";
import { HealthTool } from "./HealthTool.js";
import { SessionActiveTool } from "./session/SessionActiveTool.js";
import { SessionCreateTool } from "./session/SessionCreateTool.js";
import { SessionDeleteTool } from "./session/SessionDeleteTool.js";
import { SessionGetTool } from "./session/SessionGetTool.js";
import { SessionListTool } from "./session/SessionListTool.js";
import { MessageGetTool } from "./message/MessageGetTool.js";
import { MessageListTool } from "./message/MessageListTool.js";
import { AskTool } from "./prompt/AskTool.js";
import { InterruptTool } from "./prompt/InterruptTool.js";
import { PromptTool } from "./prompt/PromptTool.js";
import { WaitTool } from "./prompt/WaitTool.js";

/**
 * Kullanılabilir araçları toplar ve aktif profile göre filtreler.
 * Yeni araçlar buraya eklenir.
 */
export class ToolRegistry {
  private readonly tools: readonly BaseTool[];

  constructor(deps: ToolDependencies, private readonly profile: ToolProfile) {
    this.tools = [
      new HealthTool(deps),
      new SessionCreateTool(deps),
      new SessionListTool(deps),
      new SessionGetTool(deps),
      new SessionActiveTool(deps),
      new SessionDeleteTool(deps),
      new PromptTool(deps),
      new AskTool(deps),
      new WaitTool(deps),
      new InterruptTool(deps),
      new MessageListTool(deps),
      new MessageGetTool(deps),
    ];
  }

  /** Aktif profil için açığa çıkarılacak araçlar. */
  list(): BaseTool[] {
    if (this.profile === "full") {
      return [...this.tools];
    }
    return this.tools.filter((tool) => tool.profile === "essential");
  }
}
