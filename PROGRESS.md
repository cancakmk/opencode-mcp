# opencode-mcp — İlerleme

## Özet
- Amaç: OpenCode V2 HTTP API'sini MCP araçları/kaynakları olarak sunan,
  paylaşılabilir MCP sunucusu (her MCP istemcisi + n8n AI Agent).
- Stack: Node.js 24 + TypeScript (strict, ESM) · @modelcontextprotocol/sdk ·
  Zod · Vitest · Docker.
- Çalıştırma: `npm run build && node dist/index.js` (stdio) / Faz 2'de HTTP.
- Test komutu: npm test

## Fazlar
- [x] Faz 1 — İskelet + Config + V2 istemci + stdio + `oc_health` (dosyalar: package.json,
      tsconfig.json, src/{index,version}.ts, src/config/Config.ts, src/logging/Logger.ts,
      src/opencode/{OpenCodeClient,types}.ts, src/tools/{BaseTool,HealthTool,ToolRegistry}.ts,
      src/server/OpenCodeMcpServer.ts, src/transport/StdioRunner.ts, tests/**)
- [x] Faz 2 — HTTP transport + Bearer + konteyner (n8n_default) (dosyalar:
      src/transport/{HttpRunner,BearerAuth}.ts, docker/Dockerfile, docker-compose.yml,
      tests/transport/BearerAuth.test.ts; index.ts http desteği)
- [x] Faz 3 — Session & message araçları + `oc_ask` (prompt & wait) (dosyalar:
      src/opencode/{OpenCodeClient,SessionWaiter,message,types}.ts, src/util/{args,sleep}.ts,
      src/tools/session/*, src/tools/message/*, src/tools/prompt/*, tests/opencode/*)
- [x] Faz 4 — Permission, file, vcs, model/agent araçları (dosyalar:
      src/tools/permission/*, src/tools/file/*, src/tools/vcs/*, src/tools/model/*,
      src/tools/agent/*, src/tools/session/SessionDiffTool.ts; OpenCodeClient metodları)
- [x] Faz 5 — Gözlemlenebilirlik (aktivite özeti, yapısal log, log/diff resources)
      (dosyalar: src/opencode/activity.ts, src/server/ResourceRegistry.ts,
      SessionWaiter aktivite, OpenCodeMcpServer süre logu, tests/opencode/activity.test.ts)
- [x] Faz 6 — `oc_api` backstop + profiller + resources/prompts (dosyalar:
      src/tools/api/ApiTool.ts, src/server/PromptRegistry.ts, ToolRegistry/Server güncellemeleri)
- [x] Faz 7 — n8n uçtan uca (MCP Client Tool + AI Agent) (n8n workflow ID `4tWn6voXvHjMn51a`;
      README n8n bölümü; Standalone MCP Client ile `oc_ask` → "OK")
- [ ] Faz 8 — Doküman + (opsiyonel) npm yayın (sıradaki)

## Şu Anki Durum
- Aktif faz: Faz 8
- Faz 1–6: bkz. git tag faz-1..faz-6.
- Faz 7 doğrulaması: n8n workflow `4tWn6voXvHjMn51a` (Manual Trigger → Standalone MCP
  Client → Result), Bearer kimliği `opencode-mcp` (httpBearerAuth) ile; çalıştırma
  **success**, çıktı `{"content":[{"type":"text","text":"OK"}]}` — yani n8n → MCP →
  izole OpenCode uçtan uca.
- Sıradaki somut adım: Faz 8 — doküman (README genişletme) ve opsiyonel npm yayın.
- Son güncelleme: 2026-10-10T11:33:00Z
- Oturum: (bkz. opencode oturum kimliği)
