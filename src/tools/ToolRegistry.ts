import type { ToolProfile } from "../config/Config.js";
import type { BaseTool, ToolDependencies } from "./BaseTool.js";
import { HealthTool } from "./HealthTool.js";
import { SessionActiveTool } from "./session/SessionActiveTool.js";
import { SessionCreateTool } from "./session/SessionCreateTool.js";
import { SessionDeleteTool } from "./session/SessionDeleteTool.js";
import { SessionDiffTool } from "./session/SessionDiffTool.js";
import { SessionGetTool } from "./session/SessionGetTool.js";
import { SessionListTool } from "./session/SessionListTool.js";
import { MessageGetTool } from "./message/MessageGetTool.js";
import { MessageListTool } from "./message/MessageListTool.js";
import { AskTool } from "./prompt/AskTool.js";
import { InterruptTool } from "./prompt/InterruptTool.js";
import { PromptTool } from "./prompt/PromptTool.js";
import { WaitTool } from "./prompt/WaitTool.js";
import {
  PermissionListTool,
  PermissionReplyTool,
  SavedPermissionListTool,
  SavedPermissionRemoveTool,
} from "./permission/PermissionTools.js";
import { FileFindTool, FileListTool, FileReadTool, FileWriteTool } from "./file/FileTools.js";
import { VcsBranchTool, VcsDiffTool, VcsInfoTool, VcsInitTool, VcsStatusTool } from "./vcs/VcsTools.js";
import { ModelDefaultTool, ModelListTool, SwitchModelTool } from "./model/ModelTools.js";
import { AgentListTool, ProviderListTool, SwitchAgentTool } from "./agent/AgentTools.js";
import { ApiTool } from "./api/ApiTool.js";

/**
 * Kullanılabilir araçları toplar ve aktif profile göre filtreler.
 * Yeni araçlar buraya eklenir.
 */
export class ToolRegistry {
  private readonly tools: readonly BaseTool[];

  constructor(deps: ToolDependencies, private readonly profile: ToolProfile) {
    this.tools = [
      // Sunucu
      new HealthTool(deps),
      // Oturum
      new SessionCreateTool(deps),
      new SessionListTool(deps),
      new SessionGetTool(deps),
      new SessionActiveTool(deps),
      new SessionDeleteTool(deps),
      new SessionDiffTool(deps),
      // Mesaj / prompt
      new PromptTool(deps),
      new AskTool(deps),
      new WaitTool(deps),
      new InterruptTool(deps),
      new MessageListTool(deps),
      new MessageGetTool(deps),
      // İzinler
      new PermissionListTool(deps),
      new PermissionReplyTool(deps),
      new SavedPermissionListTool(deps),
      new SavedPermissionRemoveTool(deps),
      // Dosya
      new FileReadTool(deps),
      new FileListTool(deps),
      new FileFindTool(deps),
      new FileWriteTool(deps),
      // VCS
      new VcsInfoTool(deps),
      new VcsStatusTool(deps),
      new VcsDiffTool(deps),
      new VcsBranchTool(deps),
      new VcsInitTool(deps),
      // Model / Agent / Provider
      new ModelListTool(deps),
      new ModelDefaultTool(deps),
      new SwitchModelTool(deps),
      new AgentListTool(deps),
      new SwitchAgentTool(deps),
      new ProviderListTool(deps),
      // Kapsama backstop (full profilde)
      new ApiTool(deps),
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
