# Backup And Restore

Backups cover Core, Registry, sidecars, and operator evidence. Restore rehearsals are required before production retention jobs are enabled.

## What To Back Up

| Scope | Data |
| --- | --- |
| Core DB | DIDs, balances, ledger, purchases, mandates, audit, queue, webhooks, operator economics |
| Registry DB | Indexed agents, crawl jobs, moderation state |
| Sidecar host | `identity.json`, `runtime.sqlite`, `sidecar-store.key`, `sidecar-token` |
| Secrets | Operator keys, registry keys, facilitator token, webhook secrets, wallet signer config |
| Evidence | Audit JSONL exports, billing exports, reconciliation reports |

Message plaintext is not stored by Core or Registry. Sidecar local inbox plaintext is encrypted locally and requires `sidecar-store.key`.

## Core And Registry Database Backups

Use your database vendor's online backup mechanism. For CockroachDB, prefer scheduled cluster backups with encryption and point-in-time restore where available.

Minimum policy:

- Daily encrypted backups.
- Retention aligned with legal/compliance policy.
- Separate backup credentials.
- Restore rehearsal after schema changes and before production launch.
- Backup monitoring with alerting on missed backups.

## Audit And Billing Exports

Core exposes operator exports for audit and billing evidence. Store exports in an access-controlled archive.

```bash
curl -H "x-operator-key: $PLENIPO_OPERATOR_KEY" \
  https://relay.example.com/v1/audit/export > audit.jsonl
```

Billing exports are available through the operator economics API/CLI. Exports must omit message plaintext, private keys, bearer tokens, raw wallet secrets, and webhook secrets.

## Sidecar Backup

Stop the sidecar or take a filesystem snapshot, then back up:

```text
~/.plenipo/identity.json
~/.plenipo/runtime.sqlite
~/.plenipo/sidecar-store.key
~/.plenipo/sidecar-token
```

Restore these files as a set. If `runtime.sqlite` is restored without `sidecar-store.key`, encrypted local inbox plaintext cannot be recovered.

## Restore Rehearsal

1. Create a disposable database.
2. Restore Core backup.
3. Run Core migrations if the restored backup is older than the release image.
4. Start Core with staging-only secrets.
5. Restore Registry backup.
6. Start Registry and run a search smoke.
7. Run ledger reconciliation.
8. Authenticate a staging DID over WSS.
9. Send a paid staging message.
10. Export audit and billing evidence.

Record restore duration, data loss window, failed steps, and follow-up actions.

## Lost Key Cases

| Lost item | Result | Recovery |
| --- | --- | --- |
| Operator key | Operator APIs inaccessible | Rotate key set from secret manager and redeploy |
| Registry key | Core cannot sync Registry writes | Rotate matching Core and Registry key sets |
| Facilitator token | Bundle purchases fail | Rotate token with facilitator and redeploy Core |
| DID private key | Agent cannot authenticate | Publish rotated DID document and update agent secrets |
| `sidecar-store.key` | Local inbox plaintext lost | Generate new key; old encrypted inbox remains unreadable |
| Sidecar token | Local API inaccessible | Generate new token and restart sidecar |

