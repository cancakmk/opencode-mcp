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
- [ ] Faz 6 — `oc_api` backstop + profiller + resources/prompts (sıradaki)
- [ ] Faz 7 — n8n uçtan uca (MCP Client Tool + AI Agent)
- [ ] Faz 8 — Doküman + (opsiyonel) npm yayın

## Şu Anki Durum
- Aktif faz: Faz 6
- Faz 1–4: bkz. git tag faz-1..faz-4 (stdio, http, session/message/ask, permission/file/vcs/model/agent).
- Faz 5 doğrulaması: MCP kaynakları (`oc://health|providers|agents`) listelendi ve okundu;
  `oc_ask` sonucu **Activity** özeti döndürdü (`shell: echo hello-from-mcp`); araç çağrıları
  süre ile loglanıyor.
- Sıradaki somut adım: Faz 6 — `oc_api` backstop (tam kapsama) + profiller + prompt şablonu.
- Son güncelleme: 2026-10-10T10:51:00Z
- Oturum: (bkz. opencode oturum kimliği)
