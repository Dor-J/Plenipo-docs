# Three-Laptop Local Lab

This workflow tests real Plenipo relay behavior across a private LAN before adding model behavior.

## Roles

- Main laptop: Docker Desktop, Plenipo Core, Plenipo Registry, CockroachDB.
- Laptop A: Python SDK runner, Python agent keys, optional LM Studio.
- Laptop B: TypeScript SDK runner, TypeScript agent keys, optional LM Studio.

The main laptop does not own both agent private keys. MCP remains local stdio MCP unless you intentionally build a separate remote transport later.

## Main Laptop

From `C:\Users\DOR\Desktop\Dev\Plenipo`:

```powershell
bun run dev:local
bun run dev:local:status
```

Use loopback mode for local health checks. To expose only Core and Registry on the private LAN:

```powershell
bun run dev:local:lan
bun run dev:local:doctor
```

Expected exposed services:

- Core: `4000`
- Registry: `4001`

CockroachDB, Redis, x402 stubs, docs, MCP, and LM Studio should not be LAN-exposed.

## Identity

Run identity generation on the laptop that will own the private keys.

Laptop A:

```powershell
python scripts/create_local_identity.py --host agents.example.com --path local/python-a --relay-url ws://192.168.0.251:4000/agent/websocket --registry-url http://192.168.0.251:4001
```

Laptop B:

```powershell
bun run local-lab:identity -- --host agents.example.com --path local/typescript-b --relay-url ws://192.168.0.251:4000/agent/websocket --registry-url http://192.168.0.251:4001
```

Publish only each generated `did.json` under the controlled HTTPS DID host:

- `https://agents.example.com/local/python-a/did.json`
- `https://agents.example.com/local/typescript-b/did.json`

Do not publish `private.env`.

## Economics

After the public DID URLs are known, provision Core with balances and active local-lab mandates:

```powershell
bun run dev:local:provision -- --agent did:web:agents.example.com:local:python-a=https://agents.example.com/local/python-a/did.json --agent did:web:agents.example.com:local:typescript-b=https://agents.example.com/local/typescript-b/did.json --tokens 100000
```

The relay still verifies SDK-generated x402 payment payloads, charges balances, and enforces mandates.

## Deterministic Round Trip

Start the TypeScript responder on Laptop B:

```powershell
bun run local-lab:responder -- --env .plenipo-local/local-typescript-b/private.env --sender-did did:web:agents.example.com:local:python-a --sender-document-url https://agents.example.com/local/python-a/did.json
```

Send the Python ping from Laptop A:

```powershell
python scripts/local_lab_ping.py --env .plenipo-local/local-python-a/private.env --recipient-did did:web:agents.example.com:local:typescript-b --recipient-document-url https://agents.example.com/local/typescript-b/did.json
```

This is the first meaningful gate. It must pass before LM Studio is added.

## LM Studio Gate

Keep LM Studio bound to `127.0.0.1` on the laptop that calls it.

Start the TS LM responder on Laptop B:

```powershell
bun run local-lab:lm-responder -- --env .plenipo-local/local-typescript-b/private.env --sender-did did:web:agents.example.com:local:python-a --sender-document-url https://agents.example.com/local/python-a/did.json
```

Send a bounded task from Laptop A:

```powershell
python scripts/local_lab_lm_task.py --env .plenipo-local/local-python-a/private.env --recipient-did did:web:agents.example.com:local:typescript-b --recipient-document-url https://agents.example.com/local/typescript-b/did.json --prompt "Summarize the local lab status in one sentence."
```

## MCP

Use the `mcp.local-lab.json.example` files in each SDK only for local stdio MCP on the same laptop. They are not remote HTTP MCP bridge configs.

## Reset

Stop without deleting volumes:

```powershell
bun run dev:local:down
```

Delete local-lab Docker volumes only when you want a clean database:

```powershell
bun run dev:local:reset -- --confirm
```
