# Reliability (v0.4)

Plenipo v0.4 adds **delivery receipts**, a **bounded offline queue**, and optional **multi-node relay clustering** — without changing the privacy model (the relay still stores ciphertext only).

## Offline queue

When the recipient is not connected on any cluster node, the relay **queues** the encrypted envelope instead of returning `RECIPIENT_OFFLINE`.

- Per-recipient limits: max messages, max queued bytes, TTL (default 24h)
- Billing (tokens, mandate, x402) is verified **at enqueue time**; TTL expiry does not refund tokens
- On `relay:inbox` join, the relay drains pending messages FIFO by `envelope_id`

## Acknowledgements

`message.send` replies with:

| Field | Meaning |
|-------|---------|
| `status: "delivered"` | Recipient received `message.deliver` immediately |
| `status: "queued"` | Stored until recipient connects; see `queued_until` |

Recipients should send `message.receipt` with `{ "envelope_id" }` after handling a delivery. The relay records the receipt and pushes `message.receipt` to the sender when online.

## Delivery status

Query via WebSocket `delivery.get` or REST `GET /v1/delivery/:envelope_id`:

- `queued`
- `delivered`
- `receipt_confirmed`
- `expired`

## Cluster (operators)

Two or more relay pods can share Redis-backed Phoenix PubSub and libcluster peer discovery. Clients use the same WebSocket URL; routing is transparent.

See [RELIABILITY.md](https://github.com/plenipo/plenipo-core/blob/main/docs/RELIABILITY.md) in Plenipo-core for environment variables and Kubernetes notes.

## SDK usage

```typescript
const ack = await client.send(recipientDid, 'hello', recipientEncKey);
if (ack.status === 'queued') {
  console.log('Queued until', ack.queued_until);
}
// autoReceipt: true (default) sends message.receipt on deliver
client.onReceipt((r) => console.log('Receipt', r.envelope_id));
```

Python: `PlenipoClient.send()` returns a `SendAck` dict; `auto_receipt=True` by default.
