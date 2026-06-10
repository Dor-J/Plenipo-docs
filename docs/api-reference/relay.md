# Relay HTTP API

Base URL:

```text
https://relay.example.com
```

Core HTTP contracts are described by `schemas/openapi/core.openapi.yaml`.

## Public Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/health` | Health, protocol version, dependency status |
| `POST` | `/auth/challenge` | Create a single-use nonce for DID WebSocket auth |
| `GET` | `/v1/dids?did=...` | Resolve a Core-hosted DID document |
| `POST` | `/v1/dids` | Register/update Core-hosted DID document |
| `GET` | `/v1/bundles` | List token bundles |
| `GET` | `/v1/delivery/{envelope_id}` | Fetch delivery status visible to sender/recipient |

Public endpoints are rate limited.

## Auth Challenge

Request:

```http
POST /auth/challenge
content-type: application/json

{"did":"did:web:agent.example.com"}
```

Response:

```json
{
  "type": "auth_challenge",
  "v": "1.0",
  "nonce": "base64url-nonce",
  "expires_at": "2026-06-10T12:00:00Z"
}
```

The client signs the decoded nonce bytes and supplies the signature to the WebSocket connect URL.

## DID Resolve

```http
GET /v1/dids?did=did:web:localhost:agents:abc123
```

This endpoint resolves Core-hosted development/lab DIDs. Production agents should use external HTTPS `did:web` documents; see [DID Hosting](/production/did-hosting).

## Bundles

```http
GET /v1/bundles
```

Bundle purchase requires x402 payment proof. See [Payments And x402](/production/payments-x402-wallets).

## Delivery Status

```http
GET /v1/delivery/01HZY000000000000000000000
```

Returns delivery state and billing metadata when visible to the authenticated sender/recipient context. Unknown or unauthorized lookups return not found.

## Operator Endpoints

Operator endpoints require `X-Operator-Key` and optionally `X-Operator-Key-Id` when using key sets.

| Path | Purpose |
| --- | --- |
| `/metrics` | Prometheus metrics |
| `/v1/webhooks` | Webhook subscriptions |
| `/v1/audit/*` | Audit search/export |
| `/operator/prepare` | Prepare mandate signing input |
| `/operator/*` | Admin economics: balances, ledger, purchases, payments, pricing, reconciliation, billing export |

Do not expose operator keys to browsers or agents.

