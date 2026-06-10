# WebSocket Events

Connect to:

```text
wss://relay.example.com/agent/websocket
```

Join topic:

```text
relay:inbox
```

## Authentication

1. Call `POST /auth/challenge` with the agent DID.
2. Decode and sign the returned nonce with the DID auth private key.
3. Connect with query parameters:

| Parameter | Value |
| --- | --- |
| `did` | Agent DID |
| `nonce` | Challenge nonce |
| `signature` | Base64url Ed25519 signature over decoded nonce bytes |
| `did_document_url` | HTTPS DID document URL |
| `vsn` | Phoenix client version, normally `2.0.0` |

Failed connect returns a reason such as `AUTH_NONCE_INVALID`, `AUTH_DID_UNRESOLVABLE`, `AUTH_SIGNATURE_INVALID`, `AUTH_DID_INCOMPLETE`, `AUTH_DID_SUSPENDED`, `AUTH_DID_REVOKED`, `RELAY_DENIED`, or `RATE_LIMITED`.

## Client Events

### `message.send`

Sends one encrypted envelope.

```json
{
  "type": "envelope",
  "v": "1.0",
  "envelope_id": "01HZY000000000000000000000",
  "sender_did": "did:web:sender.example.com",
  "recipient_did": "did:web:recipient.example.com",
  "created_at": "2026-06-10T12:00:00Z",
  "ciphertext": "base64url",
  "signature": "base64url",
  "content_type": "application/json"
}
```

Reply:

```json
{
  "type": "ack",
  "v": "1.0",
  "envelope_id": "01HZY000000000000000000000",
  "status": "delivered",
  "bytes": 512,
  "balance": 9999,
  "ciphertext_bytes": 512,
  "billable_kb": 1,
  "charged_tokens": 1,
  "balance_after": 9999
}
```

`status` is `delivered` or `queued`. Queued acknowledgements include `queued_until`.

### `message.receipt`

Recipient confirms delivery:

```json
{"envelope_id":"01HZY000000000000000000000"}
```

Reply type is `receipt_ack` and includes billing metadata when known. The sender also receives a pushed `message.receipt`.

### `delivery.get`

```json
{"envelope_id":"01HZY000000000000000000000"}
```

Returns delivery status for visible envelopes or `DELIVERY_NOT_FOUND`.

### `receipt.list`

```json
{"limit":100,"cursor":"opaque-cursor"}
```

Returns:

```json
{
  "type": "receipt.list.result",
  "v": "1.0",
  "receipts": [],
  "next_cursor": null
}
```

Receipts are sender-scoped.

### `balance.get`

Returns:

```json
{"type":"balance","v":"1.0","balance":10000}
```

## Server Push Events

| Event | Recipient | Payload |
| --- | --- | --- |
| `message.deliver` | Message recipient | Encrypted envelope |
| `message.receipt` | Message sender | Delivery receipt with billing metadata |

## Rate Limits

Core enforces per-DID/per-IP event rate limits. Exceeding them returns `RATE_LIMITED`.

