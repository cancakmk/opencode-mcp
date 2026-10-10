import { z } from "zod";
import { BaseTool, type ToolResult } from "../BaseTool.js";
import { asOptionalString, asString } from "../../util/args.js";

/** Bekleyen izin taleplerini listeler (oturuma özel veya genel). */
export class PermissionListTool extends BaseTool {
  readonly name = "oc_permission_list";
  readonly title = "List Pending Permissions";
  readonly description = "List pending permission requests, optionally scoped to a session.";
  readonly parameters = {
    sessionId: z.string().optional().describe("Session id; omit for the global pending list"),
    directory: z.string().optional().describe("Project directory (location) for the global list"),
  };

  override async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const sessionId = asOptionalString(args.sessionId);
    const data =
      sessionId !== undefined
        ? await this.deps.client.listSessionPermissions(sessionId)
        : await this.deps.client.listPendingPermissions(asOptionalString(args.directory));
    return this.text(JSON.stringify(data, null, 2));
  }
}

/** Bekleyen bir izin talebine yanıt verir. */
export class PermissionReplyTool extends BaseTool {
  readonly name = "oc_permission_reply";
  readonly title = "Reply To Permission";
  readonly description = "Reply to a pending permission request: allow once, allow always, or reject.";
  readonly parameters = {
    sessionId: z.string().min(1).describe("Session id (ses_...)"),
    requestId: z.string().min(1).describe("Permission request id"),
    decision: z.enum(["once", "always", "reject"]).describe("Decision for the request"),
    message: z.string().optional().describe("Optional feedback, useful when rejecting"),
  };

  override async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const decision =
      args.decision === "always" || args.decision === "reject" ? args.decision : "once";
    const data = await this.deps.client.replyPermission(
      asString(args.sessionId),
      asString(args.requestId),
      decision,
      asOptionalString(args.message),
    );
    return this.text(JSON.stringify(data, null, 2));
  }
}

/** Kayıtlı (kalıcı) izinleri listeler. */
export class SavedPermissionListTool extends BaseTool {
  readonly name = "oc_saved_permission_list";
  readonly title = "List Saved Permissions";
  readonly description = "List saved (durable) permission rules.";
  readonly parameters = {
    projectID: z.string().optional().describe("Filter by project id"),
  };

  override async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const data = await this.deps.client.listSavedPermissions(asOptionalString(args.projectID));
    return this.text(JSON.stringify(data, null, 2));
  }
}

/** Kayıtlı bir izni siler (yıkıcı). */
export class SavedPermissionRemoveTool extends BaseTool {
  readonly name = "oc_saved_permission_remove";
  readonly title = "Remove Saved Permission";
  readonly description = "Remove a saved permission rule by id. This is destructive.";
  override readonly profile = "full" as const;
  readonly parameters = {
    id: z.string().min(1).describe("Saved permission id"),
  };

  override async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const id = asString(args.id);
    await this.deps.client.removeSavedPermission(id);
    return this.text(`Removed saved permission ${id}.`);
  }
}
