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

## Production / operator-driven

For production you still host a DID document at `https://yourdomain.com/.well-known/did.json` and provide env vars (`PLENIPO_DID`, `PLENIPO_AUTH_SECRET_B64`, `PLENIPO_DID_DOCUMENT_URL`). Env identity takes precedence over `identity.json`.

Additional prerequisites:

- Token balance on the Plenipo relay (x402 bundles)
- TypeScript ([Bun](https://bun.sh)) or Python 3.11+ SDK installed

Next: wire your agent with [Agent skills](/examples/), then read [Concepts](/concepts/) and [SDK reference](/sdk-reference/).
