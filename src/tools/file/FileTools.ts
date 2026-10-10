import { z } from "zod";
import { BaseTool, type ToolResult } from "../BaseTool.js";
import { asOptionalNumber, asOptionalString, asString } from "../../util/args.js";

/** Bir dosyayı okur. */
export class FileReadTool extends BaseTool {
  readonly name = "oc_file_read";
  readonly title = "Read File";
  readonly description = "Read a file from the OpenCode working directory.";
  readonly parameters = {
    path: z.string().min(1).describe("File path relative to the working directory"),
    directory: z.string().optional().describe("Project directory (location)"),
  };

  override async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const content = await this.deps.client.readFile(asString(args.path), asOptionalString(args.directory));
    return this.text(typeof content === "string" ? content : JSON.stringify(content, null, 2));
  }
}

/** Bir dizini listeler. */
export class FileListTool extends BaseTool {
  readonly name = "oc_file_list";
  readonly title = "List Files";
  readonly description = "List a directory in the OpenCode working directory.";
  readonly parameters = {
    path: z.string().optional().describe("Directory path (default: working directory root)"),
    directory: z.string().optional().describe("Project directory (location)"),
  };

  override async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const data = await this.deps.client.listFiles(asOptionalString(args.path), asOptionalString(args.directory));
    return this.text(JSON.stringify(data, null, 2));
  }
}

/** Dosya arar. */
export class FileFindTool extends BaseTool {
  readonly name = "oc_file_find";
  readonly title = "Find Files";
  readonly description = "Find files by name/query in the working directory.";
  readonly parameters = {
    query: z.string().min(1).describe("Search query"),
    type: z.string().optional().describe("Entry type filter (e.g. file, directory)"),
    limit: z.number().int().positive().optional().describe("Maximum results"),
    directory: z.string().optional().describe("Project directory (location)"),
  };

  override async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const data = await this.deps.client.findFiles(
      asString(args.query),
      asOptionalString(args.type),
      asOptionalNumber(args.limit),
      asOptionalString(args.directory),
    );
    return this.text(JSON.stringify(data, null, 2));
  }
}

/** Bir dosyaya yazar (yıkıcı). */
export class FileWriteTool extends BaseTool {
  readonly name = "oc_file_write";
  readonly title = "Write File";
  readonly description = "Write content to a file in the working directory. This modifies files.";
  override readonly profile = "full" as const;
  readonly parameters = {
    path: z.string().min(1).describe("File path relative to the working directory"),
    content: z.string().describe("Content to write"),
    directory: z.string().optional().describe("Project directory (location)"),
  };

  override async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const path = asString(args.path);
    await this.deps.client.writeFile(path, asString(args.content), asOptionalString(args.directory));
    return this.text(`Wrote ${path}.`);
  }
}
