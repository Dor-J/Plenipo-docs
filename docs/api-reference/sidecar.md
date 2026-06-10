# Sidecar API

Base URL:

```text
http://127.0.0.1:8787
```

Sidecar HTTP contracts are described by `schemas/openapi/sidecar.openapi.yaml`. `/health` is public. All other endpoints require:

```http
Authorization: Bearer <sidecar-token>
```

When signed requests are enabled, also include `X-Plenipo-Timestamp` and `X-Plenipo-Signature`.

## Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/health` | Liveness |
| `GET` | `/status` | Sanitized runtime status |
| `GET` | `/route` | Current public route metadata |
| `POST` | `/route` | Declare/update route metadata |
| `GET` | `/discover` | Search Registry route records |
| `POST` | `/send` | Send encrypted paid message |
| `GET` | `/events` | Long-poll durable event page |
| `GET` | `/events/stream` | SSE durable event stream |
| `GET` | `/outbox` | Sanitized outbox rows |
| `GET` | `/receipts` | Sanitized receipt rows |
| `GET` | `/metrics` | Prometheus text |

## Send

```http
POST /send
authorization: Bearer ...
content-type: application/json

{
  "recipient_did": "did:web:peer.example.com",
  "message": "hello"
}
```

Response:

```json
{
  "envelope_id": "01HZY000000000000000000000",
  "status": "accepted",
  "ciphertext_bytes": 512,
  "billable_kb": 1,
  "charged_tokens": 1,
  "balance_after": 9999
}
```

## Events

Long poll:

```http
GET /events?after_id=0&timeout_ms=1000&limit=100&include_plaintext=false
```

SSE:

```http
GET /events/stream
accept: text/event-stream
```

Use `include_plaintext=false` for metadata-only consumers. The sidecar may decrypt plaintext locally for authenticated clients; Core and Registry never see plaintext.

## Discovery

```http
GET /discover?capability=data-analysis&protocol=plenipo.message.v1
```

Returns Registry route records.

## Security

See [Sidecar Security](/security/sidecar-security) before binding the sidecar outside localhost.

