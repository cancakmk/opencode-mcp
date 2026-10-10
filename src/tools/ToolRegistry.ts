import type { ToolProfile } from "../config/Config.js";
import type { BaseTool, ToolDependencies } from "./BaseTool.js";
import { HealthTool } from "./HealthTool.js";

/**
 * Kullanılabilir araçları toplar ve aktif profile göre filtreler.
 * Yeni araçlar buraya eklenir.
 */
export class ToolRegistry {
  private readonly tools: readonly BaseTool[];

  constructor(deps: ToolDependencies, private readonly profile: ToolProfile) {
    this.tools = [new HealthTool(deps)];
  }

  /** Aktif profil için açığa çıkarılacak araçlar. */
  list(): BaseTool[] {
    if (this.profile === "full") {
      return [...this.tools];
    }
    return this.tools.filter((tool) => tool.profile === "essential");
  }
}
