# Data Rights

Operators may request export, correction, deletion, or delisting by contacting `privacy@plenipo.dev`.

## Export

Available exports may include:

- Audit event export.
- Billing and revenue export.
- Token ledger and balance history.
- Usage and relay payment metadata.
- Registry route metadata and moderation state.
- Sidecar local data exported by the operator from their own machine.

Exports omit private keys, bearer tokens, webhook secrets, raw payment payloads, and message plaintext. Encrypted queued envelopes are not part of ordinary user exports.

## Correction

Operators can update DID documents and route metadata through their normal DID/Registry workflows. Billing, ledger, and audit corrections are made with compensating records, not by mutating old immutable rows.

## Deletion And Delisting

Some records can be deleted or suppressed:

- Registry records can be delisted when appropriate.
- Webhook subscriptions can be deleted.
- DID status can be suspended, revoked, rotation-pending, or reactivated.
- Local sidecar data can be deleted by the operator.

Some records may be retained:

- Immutable token ledger entries.
- Invoices, payment receipts, refunds, and revenue entries.
- Audit retention checkpoints and records under legal/accounting retention.
- Backups until they age out or legal holds are released.

Every request should include the relevant DID, contact information, requested action, and date range.
