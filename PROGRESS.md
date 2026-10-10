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
- [ ] Faz 4 — Permission, file, vcs, model/agent araçları (sıradaki)
- [ ] Faz 5 — Gözlemlenebilirlik (aktivite özeti, yapısal log, log/diff resources)
- [ ] Faz 6 — `oc_api` backstop + profiller + resources/prompts
- [ ] Faz 7 — n8n uçtan uca (MCP Client Tool + AI Agent)
- [ ] Faz 8 — Doküman + (opsiyonel) npm yayın

## Şu Anki Durum
- Aktif faz: Faz 4
- Faz 1: typecheck/test/audit/build temiz; stdio `oc_health` → V2 `2.0.26`.
- Faz 2: konteyner `n8n_default` (http :8790/mcp); yetkisiz → 401; Bearer ile oturum;
  `oc_health` → izole `opencode-agent`'ten `2.0.26`.
- Faz 3 doğrulaması: `essential` profilde 11 araç; n8n konteynerinden `oc_ask`
  ("Reply with exactly OK") → **"OK"** (oturum aç → prompt → bekle → metin).
- Sıradaki somut adım: Faz 4 — permission/file/vcs/model/agent araçları.
- Son güncelleme: 2026-10-10T10:45:00Z
- Oturum: (bkz. opencode oturum kimliği)
