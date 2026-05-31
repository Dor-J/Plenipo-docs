# Spending mandates (v0.3)

Human operators register **AP2-aligned mandates** that cap agent spending:

- `max_per_transaction`, `max_per_day`, `max_per_month`
- `expires_at`

Register via `POST /v1/mandates` with signed `plenipo_mandate` JSON.

## Operator flow

1. `POST /operator/prepare` — canonical mandate + signing input
2. Sign offline with operator Ed25519 key
3. `POST /v1/mandates` with `{ mandate, signature }`

Minimal UI: http://localhost:4000/operator

## SDK

`plenipo_mandate_prepare` MCP tool / `mandatePrepare()` in TypeScript / `mandate_prepare()` in Python.
