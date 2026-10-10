# opencode-mcp

Model Context Protocol (MCP) server that exposes the **OpenCode V2 HTTP API** as
MCP tools, resources, and prompts — so any MCP client (Claude Desktop, Claude
Code, Codex, Cursor, Zed, or the n8n **AI Agent** via the MCP Client Tool) can
drive OpenCode.

## Why a new server

Existing community OpenCode MCP servers target the **OpenCode V1** API and fail
against V2 (`sessions.map is not a function`, unknown version, `config` returning
HTML). This server is written directly against the V2 `/api/*` surface.

## Design goals

- **Comprehensive** — sessions, prompts, messages, permissions, files, VCS,
  models/agents, plus a generic API backstop (`oc_api`).
- **Context-efficient** — a curated tool set, tool profiles, MCP resources for
  read-only data, and an API escape hatch instead of dumping every endpoint.
- **Observable** — structured logging and an activity summary that shows what
  OpenCode actually did (tool calls).
- **Shareable** — clean TypeScript (OOP, dependency injection), no private
  dependencies, MIT licensed.

## Requirements

- Node.js >= 22 (developed on 24)
- A running OpenCode V2 server (`opencode serve`)

## Install

Run from source:

```bash
npm install && npm run build && node dist/index.js
```

Or via Docker (see `docker-compose.yml`) on a network shared with your MCP client.

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

## Transports

- **stdio** — for local MCP clients (`command`/`args`).
- **http** — Streamable HTTP at `POST /mcp`, stateful sessions
  (`Mcp-Session-Id`), Bearer auth. Use this for n8n and remote clients.

## Tools

`essential` exposes read-only and coordinated actions; destructive/advanced
tools are only in `full`.

| Tool | Profile | Description |
|---|---|---|
| `oc_health` | essential | Server health and version |
| `oc_session_create` | essential | Create a session |
| `oc_session_list` | essential | List sessions |
| `oc_session_get` | essential | Get a session |
| `oc_session_active` | essential | List active sessions |
| `oc_session_diff` | essential | Diff a session's turns |
| `oc_session_delete` | full | Delete a session |
| `oc_prompt` | essential | Send a prompt (no wait) |
| `oc_ask` | essential | Send a task and wait for the answer |
| `oc_wait` | essential | Wait for a session to become idle |
| `oc_interrupt` | essential | Interrupt a running session |
| `oc_message_list` | essential | List messages |
| `oc_message_get` | essential | Get a message |
| `oc_permission_list` | essential | List pending permission requests |
| `oc_permission_reply` | essential | Reply to a permission request |
| `oc_saved_permission_list` | essential | List saved permission rules |
| `oc_saved_permission_remove` | full | Remove a saved permission |
| `oc_file_read` / `oc_file_list` / `oc_file_find` | essential | Read/list/find files |
| `oc_file_write` | full | Write a file |
| `oc_vcs_info` / `oc_vcs_status` / `oc_vcs_diff` / `oc_vcs_branch` | essential | VCS inspection |
| `oc_vcs_init` | full | Initialize a VCS repository |
| `oc_model_list` / `oc_model_default` | essential | List/see models |
| `oc_switch_model` | essential | Switch a session's model |
| `oc_agent_list` / `oc_switch_agent` | essential | List/switch agents |
| `oc_provider_list` | essential | List providers |
| `oc_api` | full | Call any `/api/*` endpoint (full-coverage backstop) |

## Resources

- `oc://health`, `oc://providers`, `oc://agents`
- `oc://session/{sessionId}/transcript`
- `oc://session/{sessionId}/diff`

## Prompts

- `delegate_to_opencode` — takes a `task` and instructs the client to use
  `oc_ask` and summarize the outcome.

## Usage (stdio)

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

## Usage (n8n / HTTP)

Run the server as an HTTP container on a network shared with n8n (see
`docker-compose.yml`). It listens on `POST /mcp` and requires a Bearer token.

In n8n:

- **Standalone MCP Client** (`@n8n/n8n-nodes-langchain.mcpClient`): endpoint
  `http://opencode-mcp:8790/mcp`, transport `httpStreamable`, authentication
  `bearerAuth`, then pick a tool (e.g. `oc_ask`) and pass JSON input.
- **AI Agent + MCP Client Tool** (`@n8n/n8n-nodes-langchain.mcpClientTool`): the
  same endpoint/credential as an agent tool, so an n8n AI Agent can delegate to
  OpenCode.

## Security

- The `essential` profile omits destructive tools (`*_delete`, `*_write`,
  `*_init`, `oc_api`); enable them with `MCP_TOOL_PROFILE=full`.
- The HTTP transport always requires `MCP_AUTH_TOKEN` (Bearer, constant-time
  compared). The server refuses to start without it.
- Secrets are read from the environment; nothing is written to the repository.

## Development

```bash
npm install
npm run typecheck
npm test
npm run build
```

## License

MIT
