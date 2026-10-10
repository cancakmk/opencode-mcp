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
- [ ] Faz 5 — Gözlemlenebilirlik (aktivite özeti, yapısal log, log/diff resources) (sıradaki)
- [ ] Faz 6 — `oc_api` backstop + profiller + resources/prompts
- [ ] Faz 7 — n8n uçtan uca (MCP Client Tool + AI Agent)
- [ ] Faz 8 — Doküman + (opsiyonel) npm yayın

## Şu Anki Durum
- Aktif faz: Faz 5
- Faz 1–3: bkz. git tag faz-1..faz-3 (stdin/stdio, http, session/message/ask).
- Faz 4 doğrulaması: `essential` profilde **28 araç**; n8n konteynerinden
  `oc_model_list`, `oc_agent_list`, `oc_provider_list`, `oc_file_list` izole motordan
  gerçek veri döndürdü; `oc_vcs_status` boş (workspace bir repo değil), permission boş.
- Sıradaki somut adım: Faz 5 — aktivite özeti + yapısal log + log/diff kaynakları.
- Son güncelleme: 2026-10-10T10:48:00Z
- Oturum: (bkz. opencode oturum kimliği)
