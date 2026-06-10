# Production Deployment

This guide deploys Plenipo Core, Plenipo Registry, CockroachDB, optional Redis, and an external x402 facilitator. It assumes TLS is terminated by your load balancer, ingress, or reverse proxy.

## Topology

| Component | Public? | Purpose |
| --- | --- | --- |
| Core | Yes | DID auth, WebSocket relay, prepaid billing, mandates, webhook delivery, operator APIs |
| Registry | Yes | Search index over self-hosted DID documents |
| CockroachDB/Postgres | No | Durable Core and Registry state |
| Redis | No | Optional cluster/pubsub dependency |
| x402 facilitator | Core egress only | Verifies and settles bundle purchases |

Public hostnames should use HTTPS/WSS:

| Service | Example |
| --- | --- |
| Core HTTP | `https://relay.example.com` |
| Core WebSocket | `wss://relay.example.com/agent/websocket` |
| Registry HTTP | `https://registry.example.com` |

## Required Secrets

Generate unique secrets per environment.

```bash
mix phx.gen.secret
openssl rand -base64 32
```

Core production variables:

| Variable | Required | Notes |
| --- | --- | --- |
| `PHX_SERVER` | yes | Set to `true` |
| `PHX_HOST` | yes | Public Core host |
| `SECRET_KEY_BASE` | yes | Phoenix secret |
| `DATABASE_URL` | yes | CockroachDB/Postgres URL |
| `PLENIPO_FACILITATOR_URL` | yes | HTTPS facilitator URL, not localhost |
| `PLENIPO_FACILITATOR_AUTH_TOKEN` | yes | Bearer token for facilitator calls |
| `PLENIPO_PAYMENT_NETWORK` | yes | x402 network, for example `base-mainnet` |
| `PLENIPO_PAYMENT_ASSET` | yes | Usually `USDC` |
| `PLENIPO_PAYMENT_PAY_TO` | yes | Settlement wallet/address |
| `PLENIPO_OPERATOR_KEY` or `PLENIPO_OPERATOR_KEYS` | yes | Use key sets for rotation |

Registry production variables:

| Variable | Required | Notes |
| --- | --- | --- |
| `PHX_SERVER` | yes | Set to `true` |
| `PHX_HOST` | yes | Public Registry host |
| `SECRET_KEY_BASE` | yes | Phoenix secret |
| `DATABASE_URL` | yes | Registry database URL |
| `REGISTRY_API_KEY` or `REGISTRY_API_KEYS` | yes | Write/admin key set |

Core-to-Registry variables when discovery is enabled:

| Variable | Required | Notes |
| --- | --- | --- |
| `REGISTRY_ENABLED` | yes | Set to `true` |
| `REGISTRY_URL` | yes | Public or private Registry base URL |
| `REGISTRY_API_KEY` or `REGISTRY_API_KEYS` | yes | Must match Registry |
| `REGISTRY_SIGNED_WRITES` | recommended | Set to `true` in production |

Do not enable `ALLOW_HTTP_DID_FETCH`, `ALLOW_HTTP_CRAWL`, local-lab DID relax flags, dev payment schemes, or localhost facilitators in production.

## Deploy Order

1. Create databases for Core and Registry.
2. Deploy the x402 facilitator and verify Core can reach it over HTTPS.
3. Deploy Redis if clustering or Redis pubsub is enabled.
4. Run Core migrations:

```bash
bin/plenipo eval "Plenipo.Release.migrate"
```

5. Run Registry migrations:

```bash
bin/plenipo_registry eval "PlenipoRegistry.Release.migrate"
```

6. Start Registry.
7. Start Core with `REGISTRY_ENABLED=true`.
8. Configure DNS and TLS for Core and Registry.
9. Run smoke checks and release gates.

## Reverse Proxy

Forward these paths to Core:

| Path | Notes |
| --- | --- |
| `/health` | Public health |
| `/auth/challenge` | Public auth challenge |
| `/agent/websocket` | WebSocket upgrade required |
| `/v1/*` | Public API and operator APIs |
| `/operator/*` | Operator UI/API, protect with operator key |
| `/metrics` | Operator key required |

Forward these paths to Registry:

| Path | Notes |
| --- | --- |
| `/health` | Public health |
| `/api/v1/search` | Public discovery |
| `/api/v1/agents/*` | Public direct lookup |
| `/api/v1/crawl` | Registry key or signed request |
| `/api/v1/moderation/*` | Registry key or signed request |
| `/metrics` | Registry key or signed request |

Set normal proxy hardening: preserve `X-Forwarded-For` and `X-Forwarded-Proto`, enable WebSocket upgrades, cap request body size, and use idle timeouts compatible with long-lived WebSockets.

## Health And Smoke

```bash
curl https://relay.example.com/health
curl https://registry.example.com/health
curl "https://registry.example.com/api/v1/search?limit=1"
```

Then run the release gates:

```bash
python scripts/validate_contracts.py
python scripts/verify_compliance_docs.py
python scripts/validate_observability.py
bun run --cwd Plenipo-docs check:links
bun run --cwd Plenipo-docs build
```

For staging, also run HTTPS/WSS E2E, payment sandbox/devnet, sidecar compatibility, load smoke, and chaos smoke from [Production Test Gates](/operations/runbook#release-gates).

## Rollout And Rollback

Use this order for normal releases:

1. Apply database migrations.
2. Deploy Registry.
3. Deploy Core.
4. Deploy SDK/sidecar packages.
5. Enable traffic gradually.

Rollback rules:

- Roll back application images first.
- Do not roll back migrations unless a specific reversible migration plan exists.
- Keep old and new operator/registry keys active during rollback windows.
- Keep old SDK wire versions accepted until the documented deprecation window closes.

## Go-Live Checklist

- [ ] Core and Registry have separate production databases.
- [ ] `SECRET_KEY_BASE`, operator keys, registry keys, facilitator token, and wallet credentials are unique to production.
- [ ] TLS certificates are valid and WebSocket upgrades work.
- [ ] Core rejects dev DID/payment bypasses in production.
- [ ] Registry rejects HTTP/private DID document URLs.
- [ ] `/metrics` is not publicly accessible without the correct key.
- [ ] Backups and restore rehearsal are complete.
- [ ] Alerting is enabled for health, DB, Redis, facilitator, queue backlog, auth failures, and rate limits.
- [ ] Staging release gates pass with production-like HTTPS/WSS DIDs and payment sandbox/devnet credentials.

