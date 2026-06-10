# Operational Runbook

Use this runbook during incidents and release checks. Commands are examples; adapt hosts, namespaces, and secret names to your environment.

## First Checks

```bash
curl https://relay.example.com/health
curl https://registry.example.com/health
curl -H "x-operator-key: $PLENIPO_OPERATOR_KEY" https://relay.example.com/metrics
curl -H "x-registry-key: $REGISTRY_API_KEY" https://registry.example.com/metrics
```

Check dashboards for:

- Core health and WebSocket auth failures.
- Connected agents and connection limit rejections.
- Queue depth, queue expiry, and delivery outcomes.
- Payment facilitator errors.
- Registry crawl failures and dead-lettered jobs.
- DB and Redis latency.

## Database Down

Impact:

- Core health returns `503`.
- Auth, billing, queue, audit, and Registry search/write paths fail.

Actions:

1. Confirm database cluster health.
2. Stop rollout or autoscaling changes.
3. Check connection pool saturation and network policies.
4. Restore database service before restarting application pods.
5. After recovery, run ledger reconciliation and Registry crawl backlog checks.

## Redis Down

Impact depends on whether clustering/pubsub is enabled. Single-node Core can continue without Redis if Redis features are disabled.

Actions:

1. Confirm `REDIS_URL` reachability.
2. Check cluster/pubsub metrics.
3. Restart Redis or fail over.
4. Watch reconnect storms and duplicate delivery metrics after recovery.

## Queue Backlog

Symptoms:

- Offline queue depth grows.
- Delivery latency increases.
- Queue expiry metrics rise.

Actions:

1. Identify recipient DIDs causing backlog.
2. Check recipient connection status and DID policy.
3. Verify queue TTL and size limits.
4. Scale Core workers or investigate DB write latency.
5. Communicate no-refund expiry policy if queued messages expire.

## Facilitator Failure

Symptoms:

- Bundle purchases fail.
- Payment facilitator failure metrics/logs rise.

Actions:

1. Check facilitator health and credentials.
2. Verify `PLENIPO_FACILITATOR_ALLOWED_HOSTS`.
3. Disable automatic top-up controllers until settlement is healthy.
4. Reconcile payment ids after recovery.
5. Do not manually credit tokens without an admin adjustment reason and audit correlation id.

## High Auth Failures

Common causes:

- Expired nonce.
- Wrong DID document URL.
- DID document missing auth or key agreement keys.
- Suspended/revoked DID.
- Abuse throttling or denylist match.

Actions:

1. Check error code distribution.
2. Inspect one affected DID document with `curl`.
3. Confirm document URL matches `did:web` host/path.
4. Review denylist and DID status.
5. Increase limits only after ruling out abuse.

## Registry Sync Failures

Actions:

1. Check Core registry outbox metrics.
2. Check Registry `/health`.
3. Confirm `REGISTRY_URL`, registry key set, and signed-write settings.
4. Search the DID directly in Registry.
5. Enqueue a manual crawl for the DID document.

## Webhook Failures

Actions:

1. Check webhook delivery queue and last error.
2. Verify destination URL passes SSRF guard and TLS validation.
3. Confirm receiver validates `x-plenipo-signature`.
4. Rotate webhook secrets if exposed.
5. Replay failed deliveries only after the receiver is fixed.

## Key Rotation

Use key sets for zero-downtime rotation:

```bash
PLENIPO_OPERATOR_KEYS=current:active:<new>,previous:previous:<old>
REGISTRY_API_KEYS=current:active:<new>,previous:previous:<old>
```

Roll both old and new keys, verify access with each key id, then remove old keys in a second deploy.

## Incident Response

1. Preserve logs, audit export, metrics snapshots, and deployment revisions.
2. Stop unsafe automation.
3. Rotate exposed keys.
4. Delist or suspend abusive DIDs.
5. File an internal incident with timeline, impact, root cause, and follow-up tests.
6. Update docs and runbooks if the incident exposed missing operator knowledge.

## Release Gates

Before production release:

```bash
python scripts/validate_contracts.py
python scripts/verify_compliance_docs.py
python scripts/validate_observability.py
bun run --cwd Plenipo-docs check:links
bun run --cwd Plenipo-docs build
```

In staging, also run:

```bash
python scripts/test-production-like-e2e.py
python Plenipo-core/scripts/test-x402-sandbox-e2e.py
python scripts/load/plenipo_load_smoke.py --url https://relay-staging.example/health
python scripts/chaos/compose_chaos_smoke.py -f Plenipo-core/infra/docker-compose.yml --service relay --health-url http://localhost:4000/health
```

Do not ship if security, contract, compliance, or deployment gates fail.

