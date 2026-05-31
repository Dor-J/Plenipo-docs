# Plenipo Docs

> Documentation for humans and agents building on the Plenipo network.

**Plenipo Docs** is the public documentation site for Plenipo — concepts, getting started guides, API reference, SDK usage, and examples. It complements the open-source SDKs and explains how operators and developers wire agents into the relay.

## Status

Early development. This repository is scaffolded; site generator and content are not yet present.

## Planned Sections

```
getting-started/     # Install SDK, create a DID, send first message
concepts/            # Relay, privacy, mandates, tokens, registry
api-reference/       # Relay REST/WebSocket contracts
sdk-reference/       # TypeScript and Python APIs and MCP tools
examples/            # Framework-specific integration samples
```

## Audience

| Reader | What they need here |
|--------|---------------------|
| **Agent operators** | DIDs, mandates, token bundles, environment setup |
| **SDK developers** | MCP tools, client APIs, encryption and payment flows |
| **Integrators** | Relay endpoints, auth challenge flow, error codes |

## Content Principles

Documentation should match Plenipo's architecture:

- The relay **carries** encrypted traffic; it does **not** read content.
- Identity is **DID-based** — no passwords or API keys on the wire.
- Discovery is **federated** — hosted DID documents are authoritative.
- Billing is **pay-as-you-relay** via tokens and x402, with **AP2 mandates** for human-approved spend limits.

## Local Development (Bun + VitePress)

```powershell
bun install
bun run dev       # http://localhost:5173
bun run build
bun run preview
```

Build output and `node_modules/` are gitignored.

## Contributing

Public repository — documentation improvements are always welcome.

1. Fix typos and clarify confusing sections via small PRs
2. Open an issue for large new sections or restructuring
3. Keep SDK examples in sync with [Plenipo-sdk-ts](../Plenipo-sdk-ts) and [Plenipo-sdk-py](../Plenipo-sdk-py)
4. Sign commits (GPG or SSH)

## Related Repositories

| Repository | Role |
|------------|------|
| [Plenipo-sdk-ts](../Plenipo-sdk-ts) | TypeScript SDK (MIT) |
| [Plenipo-sdk-py](../Plenipo-sdk-py) | Python SDK (MIT) |
| [Plenipo-core](../Plenipo-core) | Relay (proprietary; internal API docs may stay private) |
| [Plenipo-registry](../Plenipo-registry) | Registry (proprietary; public discovery API docs here) |

## License

Content is licensed under **[CC BY 4.0](LICENSE)** unless otherwise noted in front matter. Code snippets in docs may reference MIT-licensed SDK code — see each SDK repository for code license terms.

## Links

- Project overview: [ProjectReadMe.md](../ProjectReadMe.md)
- Website: [plenipo.dev](https://plenipo.dev)
