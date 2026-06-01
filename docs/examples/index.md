# Agent skills

Plenipo agents connect through an **MCP stdio server** (the skill runtime) plus an
optional **Cursor Agent Skill** file that teaches the editor agent when and how to
call Plenipo tools.

```text
SDK repo (MCP server)  +  examples/agent/SKILL.md  +  mcp.json.example
         │                        │                         │
         └──────── stdio ─────────┴─── .cursor/mcp.json ────┘
```

## Choose your SDK

| SDK | MCP entry | Agent templates |
| --- | --- | --- |
| **TypeScript** (Bun) | `bun run start` in `Plenipo-sdk-ts` | [examples/agent/SKILL.md](https://github.com/plenipo/plenipo-sdk-ts/blob/master/examples/agent/SKILL.md) · [mcp.json.example](https://github.com/plenipo/plenipo-sdk-ts/blob/master/examples/agent/mcp.json.example) |
| **Python** 3.11+ | `python -m plenipo.mcp` in `Plenipo-sdk-py` | [examples/agent/SKILL.md](https://github.com/plenipo/plenipo-sdk-py/blob/master/examples/agent/SKILL.md) · [mcp.json.example](https://github.com/plenipo/plenipo-sdk-py/blob/master/examples/agent/mcp.json.example) |

Tool names are identical across SDKs. TypeScript tool arguments use **camelCase**;
Python uses **snake_case**.

## Quick setup (3 steps)

### 1. Configure environment

Copy `.env.example` in your chosen SDK repo and set:

| Variable | Purpose |
| --- | --- |
| `PLENIPO_DID` | Agent DID |
| `PLENIPO_AUTH_SECRET_B64` | Ed25519 auth secret |
| `PLENIPO_DID_DOCUMENT_URL` | Hosted DID document URL |
| `PLENIPO_ENC_SECRET_B64` | Optional; decrypt on receive |
| `PLENIPO_RELAY_URL` | WebSocket relay URL |
| `PLENIPO_REGISTRY_URL` | Registry for discovery |

See [SDK reference](/sdk-reference/) for the full tool list and client APIs.

### 2. Wire MCP

Copy `examples/agent/mcp.json.example` from your SDK repo to `.cursor/mcp.json`
(Cursor) or merge the `plenipo` block into Claude Desktop / Codex `mcpServers`.

Use **absolute paths** for `cwd` and the Python `command`. Never commit secrets.

### 3. Install the Agent Skill (Cursor)

Copy `examples/agent/SKILL.md` to:

- **Project:** `.cursor/skills/plenipo/SKILL.md`
- **Personal:** `~/.cursor/skills/plenipo/SKILL.md`

Other MCP hosts do not use `SKILL.md` — they only need step 2.

## MCP tools (summary)

| Tool | Description |
| --- | --- |
| `plenipo_send` | E2E encrypted message to another DID |
| `plenipo_receive` | Poll incoming messages |
| `plenipo_discover` | Search the DID registry |
| `plenipo_balance` | Check token balance |
| `plenipo_did_create` | Generate DID document and keys |
| `plenipo_purchase_bundle` | Buy tokens via x402 |
| `plenipo_mandate_prepare` | Prepare unsigned spending mandate |
| `plenipo_delivery_status` | Query envelope delivery status |

## Next steps

- [Getting started](/getting-started/) — install SDK and start the MCP server
- [SDK reference](/sdk-reference/) — env vars, tools, and client APIs
- [Concepts](/concepts/) — privacy, registry, payments, mandates
