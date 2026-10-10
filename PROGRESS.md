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
- [ ] Faz 3 — Session & message araçları + `oc_ask` (prompt & wait) (sıradaki)
- [ ] Faz 4 — Permission, file, vcs, model/agent araçları
- [ ] Faz 5 — Gözlemlenebilirlik (aktivite özeti, yapısal log, log/diff resources)
- [ ] Faz 6 — `oc_api` backstop + profiller + resources/prompts
- [ ] Faz 7 — n8n uçtan uca (MCP Client Tool + AI Agent)
- [ ] Faz 8 — Doküman + (opsiyonel) npm yayın

## Şu Anki Durum
- Aktif faz: Faz 3
- Faz 1 doğrulaması: `npm run typecheck` temiz; `npm test` geçti; `npm audit` 0 açık;
  build başarılı; stdio smoke `oc_health` → V2 `2.0.26`.
- Faz 2 doğrulaması: konteyner `n8n_default` ağında (http :8790/mcp); n8n konteynerinden
  yetkisiz istek → **401**; Bearer ile `initialize` → oturum; `tools/list` → `oc_health`;
  `tools/call oc_health` → izole `opencode-agent`'ten **2.0.26**.
- Sıradaki somut adım: Faz 3 — session & message araçları + `oc_ask` (prompt & wait).
- Son güncelleme: 2026-10-10T10:42:00Z
- Oturum: (bkz. opencode oturum kimliği)
