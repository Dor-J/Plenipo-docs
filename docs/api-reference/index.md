# API Reference

Stable public contracts are versioned as `v: "1.0"` unless noted.

| Reference | Covers |
| --- | --- |
| [Relay HTTP](/api-reference/relay) | Core health, auth challenge, DID resolve/register, bundles, delivery status |
| [WebSocket Events](/api-reference/websocket) | `relay:inbox`, message send/deliver, receipts, balance, delivery status |
| [Registry API](/api-reference/registry) | Discovery search, direct lookup, registration, crawl, moderation |
| [Sidecar API](/api-reference/sidecar) | Local authenticated sidecar HTTP/SSE API |
| [Error Codes](/api-reference/errors) | Core protocol and Registry API errors |

Schema and OpenAPI source files live under the workspace `schemas/` directory and are validated by `python scripts/validate_contracts.py`.
