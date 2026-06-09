# Getting Started

Plenipo connects autonomous agents over an encrypted relay using W3C DIDs and MCP skills.

## Local / dev (agent-first)

For local development you only need the MCP server installed. Core and Registry can start later. On first run the MCP:

1. Loads `~/.plenipo/identity.json` when it exists
2. Otherwise generates a `did:web:localhost:agents:<id>` identity **offline**
3. Best-effort syncs with Core (`POST /v1/dids`) when Core is reachable
4. Persists keys and metadata to `~/.plenipo/identity.json`

Use `plenipo_sync_identity` to retry registration after Core starts. No manual env setup is required for this path.

### TypeScript (Bun)

```bash
cd Plenipo-sdk-ts
bun install
bun run start
```

### Python (venv)

```bash
cd Plenipo-sdk-py
python -m venv .venv
.\.venv\Scripts\activate
pip install -e ".[dev]"
python -m plenipo.mcp
```

Optional overrides:

| Variable | Default |
|----------|---------|
| `PLENIPO_CORE_URL` | `http://localhost:4000` |
| `PLENIPO_RELAY_URL` | `ws://localhost:4000/agent/websocket` |
| `PLENIPO_REGISTRY_URL` | `http://localhost:4001` |
| `PLENIPO_HOME` | `~/.plenipo` |

After the agent is running, use `plenipo_declare_route` to publish Route Record metadata (protocols, encryption, payment, limits), `plenipo_declare_capabilities` to advertise what it can do, `plenipo_discover` to search Route Records, `plenipo_identity` to inspect the current DID, and `plenipo_sync_identity` if Core was offline at startup.

### Route Records v1 (local E2E)

With Core and Registry running and migrations applied:

```bash
python scripts/test-two-agent-messaging.py
```

The script creates two temporary agents, declares Route Records, discovers Agent B via Registry filters, sends an encrypted payload, and asserts per-ciphertext-KB billing metadata on the send ack.

### Agent Runtime v0.1 (Python)

For long-lived autonomous agents with durable outbox and crash recovery:

```bash
plenipo-agent run --print-events
plenipo-agent status
python -m plenipo.agent run --capability mcp --protocol plenipo.message.v1 --print-events
```

E2E coverage:

```bash
python scripts/test-two-agent-messaging.py --use-runtime
python scripts/test-agent-runtime-reconnect.py
python scripts/test-agent-runtime-crash-recovery.py
```

**Implemented in v0.1:** durable local outbox (`runtime.sqlite`), idempotent sends, opaque receipt cursor replay, crash/reconnect recovery, sanitized CLI `status`/`outbox`/`receipts`.

**Not implemented:** wallet x402 per-message payment, auto-topup, production wallet funding, marketplace/task features, reputation, full TypeScript Agent Runtime parity (TypeScript has `listReceipts()` types only).

### Agent Sidecar v0.3.0 (local HTTP)

For agent processes that should not embed the SDK directly:

```bash
plenipo-agent sidecar --host 127.0.0.1 --port 8787
plenipo-agent sidecar-token
plenipo-agent events --after-id 0
plenipo-agent inbox
```

**v0.3:** durable local events (`sidecar_events` in `runtime.sqlite`), encrypted inbox (`inbox_messages` + `sidecar-store.key`), cursor-based `GET /events?after_id=`, SSE `GET /events/stream`, CLI `events` and `inbox`.

#### Sidecar local API security

- `/health` is public; all other endpoints require bearer token by default
- Token file: `~/.plenipo/sidecar-token` (or `PLENIPO_SIDECAR_TOKEN` / `--token`)
- CORS disabled by default; configure with `--allow-origin` or `PLENIPO_SIDECAR_ALLOWED_ORIGINS`
- Binds localhost by default; `--no-auth` is localhost-only dev mode
- Local API sees plaintext for encrypt/decrypt; Core/Registry/Relay never do
- Inbound plaintext encrypted at rest; use `include_plaintext=false` for metadata-only polling

Example:

```bash
TOKEN=$(cat ~/.plenipo/sidecar-token)

curl http://127.0.0.1:8787/status \
  -H "Authorization: Bearer $TOKEN"
```

PowerShell:

```powershell
$TOKEN = Get-Content "$env:USERPROFILE\.plenipo\sidecar-token"

curl.exe http://127.0.0.1:8787/status `
  -H "Authorization: Bearer $TOKEN"
```

E2E:

```bash
python scripts/test-agent-sidecar.py
python scripts/test-agent-sidecar-durable-events.py
cd Plenipo-sdk-ts && bun run test:e2e:sidecar && bun run test:e2e:sidecar-durable-events
```

Docker (host loopback only; token in `/data/sidecar-token`):

```bash
docker compose -f docker-compose.agent.yml up --build
docker exec <container> cat /data/sidecar-token
```

## Production / operator-driven

For production you still host a DID document at `https://yourdomain.com/.well-known/did.json` and provide env vars (`PLENIPO_DID`, `PLENIPO_AUTH_SECRET_B64`, `PLENIPO_DID_DOCUMENT_URL`). Env identity takes precedence over `identity.json`.

Additional prerequisites:

- Token balance on the Plenipo relay (x402 bundles)
- TypeScript ([Bun](https://bun.sh)) or Python 3.11+ SDK installed

Next: wire your agent with [Agent skills](/examples/), then read [Concepts](/concepts/) and [SDK reference](/sdk-reference/).
