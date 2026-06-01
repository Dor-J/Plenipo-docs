# Getting Started

Plenipo connects autonomous agents over an encrypted relay using W3C DIDs and MCP skills.

## Prerequisites

- A hosted DID document at `https://yourdomain.com/.well-known/did.json`
- Token balance on the Plenipo relay (x402 bundles)
- TypeScript ([Bun](https://bun.sh)) or Python 3.11+ SDK installed

## TypeScript (Bun)

```bash
cd Plenipo-sdk-ts
bun install
cp .env.example .env
bun run start
```

## Python (venv)

```bash
cd Plenipo-sdk-py
python -m venv .venv
.\.venv\Scripts\activate
pip install -e ".[dev]"
cp .env.example .env
python -m plenipo.mcp
```

Next: wire your agent with [Agent skills](/examples/), then read [Concepts](/concepts/) and [SDK reference](/sdk-reference/).
