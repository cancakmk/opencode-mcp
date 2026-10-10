import { z } from "zod";
import { BaseTool, type ToolResult } from "../BaseTool.js";
import { asOptionalNumber, asOptionalString } from "../../util/args.js";

/** VCS bilgisi. */
export class VcsInfoTool extends BaseTool {
  readonly name = "oc_vcs_info";
  readonly title = "VCS Info";
  readonly description = "Get version control information for the working directory.";
  readonly parameters = { directory: z.string().optional().describe("Project directory (location)") };

  override async execute(args: Record<string, unknown>): Promise<ToolResult> {
    return this.text(JSON.stringify(await this.deps.client.vcsInfo(asOptionalString(args.directory)), null, 2));
  }
}

/** VCS durumu (status). */
export class VcsStatusTool extends BaseTool {
  readonly name = "oc_vcs_status";
  readonly title = "VCS Status";
  readonly description = "Show the working tree status.";
  readonly parameters = { directory: z.string().optional().describe("Project directory (location)") };

  override async execute(args: Record<string, unknown>): Promise<ToolResult> {
    return this.text(JSON.stringify(await this.deps.client.vcsStatus(asOptionalString(args.directory)), null, 2));
  }
}

/** VCS diff. */
export class VcsDiffTool extends BaseTool {
  readonly name = "oc_vcs_diff";
  readonly title = "VCS Diff";
  readonly description = "Show a diff: working tree, branch, or committed.";
  readonly parameters = {
    mode: z.enum(["working", "branch", "committed"]).describe("Diff mode"),
    base: z.string().optional().describe("Base ref for branch/committed diffs"),
    context: z.string().optional().describe("Context lines or ref"),
    directory: z.string().optional().describe("Project directory (location)"),
  };

  override async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const mode = args.mode === "branch" || args.mode === "committed" ? args.mode : "working";
    const data = await this.deps.client.vcsDiff(
      mode,
      asOptionalString(args.base),
      asOptionalString(args.context),
      asOptionalString(args.directory),
    );
    return this.text(JSON.stringify(data, null, 2));
  }
}

/** Dalları listeler. */
export class VcsBranchTool extends BaseTool {
  readonly name = "oc_vcs_branch";
  readonly title = "VCS Branches";
  readonly description = "List branches.";
  readonly parameters = {
    search: z.string().optional().describe("Filter branches by name"),
    limit: z.number().int().positive().optional().describe("Maximum results"),
    directory: z.string().optional().describe("Project directory (location)"),
  };

  override async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const data = await this.deps.client.vcsBranches(
      asOptionalString(args.search),
      asOptionalNumber(args.limit),
      asOptionalString(args.directory),
    );
    return this.text(JSON.stringify(data, null, 2));
  }
}

/** VCS deposu başlatır (yıkıcı). */
export class VcsInitTool extends BaseTool {
  readonly name = "oc_vcs_init";
  readonly title = "Init VCS";
  readonly description = "Initialize a version control repository in the working directory.";
  override readonly profile = "full" as const;
  readonly parameters = {
    provider: z.string().optional().describe("VCS provider (e.g. git)"),
    directory: z.string().optional().describe("Project directory (location)"),
  };

  override async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const data = await this.deps.client.vcsInit(asOptionalString(args.provider), asOptionalString(args.directory));
    return this.text(JSON.stringify(data, null, 2));
  }
}
