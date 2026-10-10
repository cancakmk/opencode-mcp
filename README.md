# opencode-mcp

Model Context Protocol (MCP) server that exposes the **OpenCode V2 HTTP API** as
MCP tools, resources, and prompts — so any MCP client (Claude Desktop, Claude
Code, Codex, Cursor, Zed, or the n8n **AI Agent** via the MCP Client Tool) can
drive OpenCode.

> Status: early development. See `PROGRESS.md` for phase status.

## Why a new server

Existing community OpenCode MCP servers target the **OpenCode V1** API and do
not work against V2 (`sessions.map is not a function`, unknown version, etc.).
This server is written directly against the V2 `/api/*` surface.

## Design goals

- **Comprehensive** — sessions, prompts, messages, permissions, files, VCS,
  models/agents, MCP servers, web search, plus a generic API backstop.
- **Context-efficient** — a curated tool set, tool profiles, MCP resources for
  read-only data, and a code/API escape hatch instead of dumping every endpoint
  as a tool.
- **Observable** — configurable structured logging and activity summaries, so
  you can see what OpenCode actually did.
- **Shareable** — clean TypeScript, OOP, no private dependencies.

## Requirements

- Node.js >= 22 (developed on 24)
- A running OpenCode V2 server (`opencode serve`), for example the isolated
  container from the `opencode-agent` project.

## Configuration (environment)

| Variable | Default | Description |
|---|---|---|
| `OPENCODE_BASE_URL` | `http://127.0.0.1:4096` | OpenCode server base URL |
| `OPENCODE_SERVER_USERNAME` | `opencode` | HTTP Basic auth username |
| `OPENCODE_SERVER_PASSWORD` | — | HTTP Basic auth password (enables auth) |
| `MCP_TRANSPORT` | `stdio` | `stdio` \| `http` \| `both` |
| `MCP_HTTP_HOST` | `127.0.0.1` | HTTP transport bind host |
| `MCP_HTTP_PORT` | `8790` | HTTP transport port |
| `MCP_AUTH_TOKEN` | — | Inbound Bearer token (required for `http`) |
| `MCP_TOOL_PROFILE` | `essential` | `essential` (safe) \| `full` |
| `MCP_LOG_LEVEL` | `info` | `debug` \| `info` \| `warn` \| `error` |

## Usage (stdio)

Add to an MCP client that uses `mcpServers`:

```json
{
  "mcpServers": {
    "opencode": {
      "command": "npx",
      "args": ["-y", "opencode-mcp"],
      "env": {
        "OPENCODE_BASE_URL": "http://127.0.0.1:4096",
        "OPENCODE_SERVER_PASSWORD": "your-password"
      }
    }
  }
}
```

## Development

```bash
npm install
npm run typecheck
npm test
npm run build
```

Run locally against a server:

```bash
OPENCODE_BASE_URL=http://127.0.0.1:49374 OPENCODE_SERVER_PASSWORD=... node dist/index.js
```

## License

MIT
