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
- [ ] Faz 2 — HTTP transport + Bearer + konteyner (n8n_default) (sıradaki)
- [ ] Faz 3 — Session & message araçları + `oc_ask` (prompt & wait)
- [ ] Faz 4 — Permission, file, vcs, model/agent araçları
- [ ] Faz 5 — Gözlemlenebilirlik (aktivite özeti, yapısal log, log/diff resources)
- [ ] Faz 6 — `oc_api` backstop + profiller + resources/prompts
- [ ] Faz 7 — n8n uçtan uca (MCP Client Tool + AI Agent)
- [ ] Faz 8 — Doküman + (opsiyonel) npm yayın

## Şu Anki Durum
- Aktif faz: Faz 2
- Faz 1 doğrulaması: `npm run typecheck` temiz; `npm test` 4/4; `npm audit` 0 açık;
  `npm run build` başarılı. stdio smoke: `tools/list` → `oc_health`; `tools/call oc_health`
  gerçek V2 sunucusundan `version: 2.0.26` döndü.
- Sıradaki somut adım: Faz 2 — Streamable HTTP transport + Bearer auth + Docker/compose
  (n8n_default ağı), n8n konteynerinden erişim doğrulaması.
- Son güncelleme: 2026-10-10T10:37:00Z
- Oturum: (bkz. opencode oturum kimliği)
