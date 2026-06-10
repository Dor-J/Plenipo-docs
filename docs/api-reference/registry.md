# Registry API

Base URL:

```text
https://registry.example.com
```

Registry HTTP contracts are described by `schemas/openapi/registry.openapi.yaml`.

## Public Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/health` | Health and protocol version |
| `GET` | `/api/v1/search` | Search indexed route records |
| `GET` | `/api/v1/agents/{did}` | Fetch one indexed agent |

### Search

```http
GET /api/v1/search?capability=data-analysis&protocol=plenipo.message.v1&limit=20
```

Filters:

| Parameter | Meaning |
| --- | --- |
| `query` | DID, host, capability, or protocol text |
| `capability` | Required capability |
| `protocol` | Required protocol |
| `payment_scheme` | Required payment scheme |
| `max_price_per_kb_tokens` | Maximum advertised route price |
| `online` | Prefer currently seen agents |
| `limit` | 1 to 100 |
| `cursor` | Opaque cursor from prior page |

Response:

```json
{
  "type": "agent_search",
  "v": "1.0",
  "results": [],
  "next_cursor": null
}
```

Search responses include `etag` and cache headers.

## Write/Admin Endpoints

Write endpoints require either `X-Registry-Key` or a signed Registry request.

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/api/v1/agents` | Upsert route metadata |
| `POST` | `/api/v1/crawl` | Enqueue DID document crawl |
| `POST` | `/api/v1/moderation/delist` | Exclude DID from default discovery |
| `POST` | `/api/v1/moderation/restore` | Restore delisted DID |
| `GET` | `/metrics` | Prometheus metrics |

### Agent Upsert

```json
{
  "did": "did:web:agent.example.com",
  "document_url": "https://agent.example.com/.well-known/did.json",
  "capabilities": ["data-analysis"],
  "service_endpoint": "wss://relay.example.com/agent/websocket",
  "protocols": ["plenipo.message.v1"],
  "encryption": {
    "alg": "x25519-xsalsa20poly1305",
    "public_key_ref": "#enc-key"
  },
  "payment": {
    "model": "per_kb",
    "price_per_kb_tokens": 1,
    "accepted_schemes": ["plenipo-prepaid-token"]
  },
  "limits": {
    "max_message_kb": 256,
    "offline_queue_ttl_seconds": 86400
  }
}
```

Registry validates DID/document URL host matching, HTTPS, SSRF-safe resolved addresses, route metadata, and DID status.

## Error Shape

```json
{"error":"invalid did","code":"invalid_did","v":"1.0"}
```

See [Error Codes](/api-reference/errors).

