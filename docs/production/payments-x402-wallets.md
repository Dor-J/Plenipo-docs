# Payments And x402 Wallets

Plenipo production uses prepaid token bundles funded by x402 payments. Message relay debits tokens from the prepaid ledger at enqueue/delivery time. Direct per-message wallet settlement is intentionally not part of v1.

## Billing Model

| Item | Behavior |
| --- | --- |
| Relay unit | 1 billable KiB is `ceil(ciphertext_bytes / 1024)` |
| Default price | `PLENIPO_RELAY_PRICE_PER_KB_TOKENS`, default `1` |
| Route Record price | Informational in v1 |
| Offline expiry | Default policy is no refund after queued message expiry |
| Ledger | Immutable entries; reversals use compensating entries |

## Bundle Purchase Flow

1. Operator chooses a bundle from `GET /v1/bundles`.
2. Wallet/facilitator creates an x402 payment signature.
3. Agent or operator posts purchase request with `payment-signature`.
4. Core validates payload shape, calls facilitator `/verify`, calls facilitator `/settle`, credits tokens, writes purchase and ledger rows, and returns a receipt.
5. Replaying the same `payment_id` returns the stored receipt and does not settle again.

Example `payment-signature` payload:

```json
{
  "scheme": "x402",
  "payment_id": "pay_unique_id",
  "agent_did": "did:web:agent.example.com",
  "purpose": "bundle_purchase",
  "bundle_id": "starter",
  "amount_cents": 100,
  "network": "base-mainnet",
  "asset": "USDC",
  "pay_to": "0x...",
  "payer": "0x...",
  "expires_at": "2026-06-10T12:00:00Z",
  "signature": "0x..."
}
```

## Core Payment Configuration

| Variable | Required | Notes |
| --- | --- | --- |
| `PLENIPO_FACILITATOR_URL` | yes | HTTPS only |
| `PLENIPO_FACILITATOR_AUTH_TOKEN` | yes | Bearer token sent to facilitator |
| `PLENIPO_FACILITATOR_ALLOWED_HOSTS` | recommended | Comma-separated allowlist |
| `PLENIPO_PAYMENT_NETWORK` | yes | Example: `base-mainnet` |
| `PLENIPO_PAYMENT_ASSET` | yes | Example: `USDC` |
| `PLENIPO_PAYMENT_PAY_TO` | yes | Settlement address |
| `PLENIPO_RELAY_PRICE_PER_KB_TOKENS` | no | Defaults to `1` |
| `PLENIPO_LEDGER_RECONCILIATION_ENABLED` | recommended | Keep enabled in production |

Production rejects dev facilitator modules, `x402-dev`, localhost facilitators, and missing settlement configuration.

## Wallet Custody

Core does not need wallet private keys. Keep signing keys in a wallet service, HSM-backed signer, or operator-controlled payment service that produces x402 payment proofs. Store only public settlement references and payment ids in Plenipo.

Minimum controls:

- Separate staging and production wallets.
- Limit hot-wallet balances.
- Require human approval for new recurring top-up rules.
- Log payment ids, bundle ids, DIDs, and amounts; never log private keys or raw wallet secrets.
- Reconcile facilitator settlement records against Core ledger exports.

## Auto-Topup Pattern

Auto-topup is an operator workflow built on webhooks and an external wallet controller:

1. Subscribe to low-balance events.
2. Wallet controller verifies the agent DID and mandate.
3. Controller creates an x402 bundle purchase proof within allowed limits.
4. Controller calls Core purchase endpoint.
5. Controller records the payment id and refuses duplicate top-ups for the same threshold event.

Do not allow an agent to sign unlimited top-ups for itself. Use human-approved spending mandates and explicit daily/monthly caps.

## Refunds And Failures

| Case | Expected handling |
| --- | --- |
| Facilitator `/verify` fails | No token credit |
| Facilitator `/settle` fails | No token credit |
| Duplicate `payment_id` | Stored receipt replayed |
| Refund/reversal | Compensating ledger entry and refund record |
| Queued message expires | No refund by default |

Export accounting evidence through the operator billing export. Exports include amounts, token counts, invoice numbers, DIDs, and correlation ids, but not message plaintext or wallet secrets.

