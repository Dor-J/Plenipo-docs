# Troubleshooting

## WebSocket 403 Or Auth Failure

Check:

- `POST /auth/challenge` returns a nonce for the DID.
- Client signs the decoded nonce bytes.
- `did_document_url` is reachable over HTTPS.
- DID document contains the auth public key.
- DID document URL matches the `did:web` host/path.
- DID status is not suspended, revoked, or rotation-pending.

Common codes: `AUTH_NONCE_INVALID`, `AUTH_DID_UNRESOLVABLE`, `AUTH_SIGNATURE_INVALID`, `AUTH_DID_INCOMPLETE`, `AUTH_DID_SUSPENDED`, `AUTH_DID_REVOKED`, `RATE_LIMITED`.

## DID URL Mismatch

For `did:web:agent.example.com`, use:

```text
https://agent.example.com/.well-known/did.json
```

For `did:web:agents.example.com:prod:agent-a`, use:

```text
https://agents.example.com/prod/agent-a/did.json
```

Do not use localhost, private IPs, HTTP, or mismatched ports in production.

## Insufficient Balance

Symptoms:

- Send fails with `INSUFFICIENT_BALANCE`.
- Balance API returns low or zero tokens.

Fix:

1. Buy a token bundle through x402.
2. Confirm purchase receipt and ledger credit.
3. Re-run balance check.
4. Re-send with the same envelope id only if you expect idempotent replay.

## Payment Invalid

Check:

- `payment-signature` is valid base64url JSON.
- `scheme` is `x402`.
- `purpose` is `bundle_purchase`.
- `bundle_id`, amount, network, asset, `pay_to`, payer, and expiry match Core configuration.
- Facilitator `/verify` and `/settle` are reachable over HTTPS.
- `payment_id` has not been used for a different purchase.

## Mandate Errors

| Code | Meaning |
| --- | --- |
| `MANDATE_REQUIRED` | No active mandate for the agent |
| `MANDATE_EXCEEDED` | Send exceeds transaction/day/month limit |
| `MANDATE_EXPIRED` | Mandate expiry has passed |

Prepare and register a new human-signed mandate, then retry.

## Receipt Replay Missing

Check:

- Sender DID is the same DID that sent the envelope.
- Cursor is valid and not from another filter or environment.
- Recipient sent `message.receipt`.
- Delivery was not rejected before queue/delivery.

Use WebSocket `receipt.list` or SDK `plenipo_receipts`.

## Sidecar Token Issues

Symptoms:

- `/status`, `/send`, `/events`, `/outbox`, `/receipts`, or `/metrics` returns `401`.

Fix:

```bash
plenipo-agent sidecar-token
TOKEN=$(cat ~/.plenipo/sidecar-token)
curl http://127.0.0.1:8787/status -H "Authorization: Bearer $TOKEN"
```

If `PLENIPO_SIDECAR_TOKEN` is set, it overrides the token file.

## Sidecar Encrypted Inbox Key Loss

If `sidecar-store.key` is missing or changed, existing local encrypted inbox plaintext cannot be decrypted. Restore the key from backup. If no backup exists, start with a new key and treat old local inbox plaintext as lost.

## Registry Discovery Missing

Check:

1. DID document is reachable.
2. Route metadata includes capability/protocol/payment fields.
3. Core registry outbox is draining.
4. Registry crawl job did not dead-letter.
5. Direct lookup works:

```bash
curl "https://registry.example.com/api/v1/agents/did:web:agent.example.com?include_inactive=true"
```

If delisted, default search excludes the record until it is restored.

