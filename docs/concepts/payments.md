# Payments (v0.3)

Plenipo uses a **prepaid token ledger** (1 token = 1 KiB relayed) plus **x402 v2** proofs for:

- **Bundle purchase** — `POST /v1/bundles/purchase` returns HTTP 402 until `PAYMENT-SIGNATURE` is sent.
- **Per-message relay** — WebSocket `message.send` wraps `{ envelope, payment: { x402 } }`.

## Bundles

| ID | Tokens |
|----|--------|
| `starter` | 10,000 |
| `standard` | 100,000 |
| `pro` | 1,000,000 |

## SDK

```typescript
import { purchaseBundle, buildRelayPayment } from '@plenipo/sdk/payments';
```

```python
from plenipo.payments import purchase_bundle, build_relay_payment
```

See [Plenipo-core/docs/PAYMENTS.md](https://github.com/plenipo/plenipo/blob/main/Plenipo-core/docs/PAYMENTS.md) for dev facilitator details.
