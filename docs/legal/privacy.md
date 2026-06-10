# Privacy Policy

Effective date: pending production launch.

This Privacy Policy explains what Plenipo stores, what it does not store, and how operators can request export, correction, deletion, or delisting where applicable.

## Plaintext Non-Inspection

Plenipo Core and Registry do not inspect message plaintext and do not possess user decryption keys. Core routes encrypted envelopes and stores only the encrypted wire envelope when needed for offline delivery. Registry stores discovery metadata, not message content. Local SDK sidecars may decrypt messages on the operator's own machine because the sidecar runs under that operator's control.

## Data We Process

Depending on your use, Plenipo may process:

- DID identifiers, DID document URLs, service endpoints, capabilities, and route metadata.
- Sender DID, recipient DID, envelope ID, byte count, timestamps, delivery status, and billing metadata.
- Auth challenge/session metadata, including nonce hashes, timestamps, IP address, outcome, and correlation ID.
- Token balances, immutable token ledger entries, purchases, payment references, invoices, refunds, revenue entries, and reconciliation records.
- Audit events, operator actions, status changes, webhook subscription metadata, and abuse-control records.
- Registry crawl state, route freshness, delisting status, and public discovery metadata.
- Logs and metrics with low-cardinality operational labels.

## Data We Do Not Have

Plenipo Core and Registry do not have:

- Message plaintext.
- User private keys.
- Decryption keys for messages.
- Sidecar bearer tokens unless an operator separately provides them.
- Local sidecar runtime databases unless an operator exports or submits them.

## Sidecar Local Data

Sidecars may store local identity, outbox, receipts, events, and encrypted-at-rest inbound plaintext in the operator's filesystem. This data is controlled by the operator. Deleting local sidecar files removes local copies but does not delete Core, Registry, accounting, or audit records.

## Use Of Data

We use data to:

- Authenticate DIDs and route encrypted messages.
- Operate offline queues, receipts, reliability workflows, and registry discovery.
- Enforce rate limits, abuse controls, DID status, and registry moderation.
- Process prepaid token billing, purchases, refunds, invoices, and reconciliation.
- Maintain audit logs, detect incidents, and comply with lawful obligations.
- Improve operational reliability through metrics and logs.

## Retention

Retention depends on data type. Encrypted queued messages expire according to queue policy. Audit and auth rows are purged according to configured audit retention with signed checkpoints. Immutable ledgers, invoices, revenue records, and other accounting data are retained for legal/accounting needs. See the public product documentation or contact `privacy@plenipo.dev` for the current retention matrix.

## Sharing

We may share data with:

- Infrastructure providers needed to run Core, Registry, logs, metrics, backups, and security tooling.
- Payment facilitators or providers needed to verify and settle payments.
- Legal, compliance, security, or abuse-response reviewers.
- Authorities when required by valid lawful process.

We do not sell message content. Core and Registry cannot decrypt it.

## Export, Correction, Deletion, And Delisting

Operators can request exports of audit, billing, ledger, usage, and registry metadata. Some data can be corrected, deleted, or delisted. Immutable ledger entries, invoices, audit checkpoints, and legally required accounting records may be retained even when other data is deleted or suppressed.

See [Data Rights](/legal/data-rights).

## Security

Plenipo uses DID signatures, rate limits, audit redaction, scoped operator keys, registry write authentication, webhook signing, retention checkpoints, and encrypted sidecar inbox storage. Operators must secure their own keys, sidecar endpoints, and local systems.

## Contact

Privacy contact: `privacy@plenipo.dev`

Abuse contact: `abuse@plenipo.dev`
