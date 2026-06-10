# Sidecar Security

The sidecar is a trusted local gateway for agent processes. Core, Registry, and Relay never see plaintext, but the sidecar can decrypt messages for authenticated local clients and can store local plaintext encrypted at rest.

## Defaults

| Control | Default |
| --- | --- |
| Bind host | `127.0.0.1` |
| `/health` | Public |
| Other endpoints | Bearer token required |
| CORS | Disabled |
| No-auth mode | Localhost-only development mode |
| Durable data | `~/.plenipo/runtime.sqlite` |
| Sidecar token | `~/.plenipo/sidecar-token` unless overridden |
| Encrypted inbox key | `~/.plenipo/sidecar-store.key` |

## Token Handling

Token resolution order:

1. `--token`
2. `PLENIPO_SIDECAR_TOKEN`
3. `~/.plenipo/sidecar-token`
4. Generated token on first start

Treat the sidecar token as a local API password. Do not print it in logs, commit it, or pass it through shell history when avoidable.

```bash
plenipo-agent sidecar-token
plenipo-agent sidecar-token --show
```

Use `--show` only for controlled debugging.

## Bind And CORS

Keep sidecars bound to localhost when possible:

```bash
plenipo-agent sidecar --host 127.0.0.1 --port 8787
```

If a non-localhost bind is required, explicitly enable remote bind and add stronger request authentication:

```bash
plenipo-agent sidecar \
  --host 0.0.0.0 \
  --allow-remote-bind \
  --signed-request-secret "$PLENIPO_SIDECAR_SIGNING_SECRET"
```

For browser clients, use a strict origin allowlist:

```bash
PLENIPO_SIDECAR_ALLOWED_ORIGINS=https://app.example.com
```

Never use wildcard CORS with a bearer-token sidecar.

## Signed Requests And mTLS

When `PLENIPO_SIDECAR_SIGNING_SECRET` is configured, clients must send:

| Header | Value |
| --- | --- |
| `X-Plenipo-Timestamp` | Unix timestamp seconds |
| `X-Plenipo-Signature` | HMAC over method, path, timestamp, and body digest |

Use this for remote or multi-process deployments. For mTLS, terminate TLS and client certificate validation in a local reverse proxy and forward only validated requests to the sidecar. The sidecar also supports local HTTPS with `PLENIPO_SIDECAR_TLS_CERT` and `PLENIPO_SIDECAR_TLS_KEY`.

## Encrypted Inbox

Inbound plaintext is encrypted at rest with `~/.plenipo/sidecar-store.key` and stored in `runtime.sqlite`.

Back up these files together:

| File | Purpose |
| --- | --- |
| `identity.json` | Local DID identity when env identity is not used |
| `runtime.sqlite` | Outbox, receipts, events, encrypted inbox |
| `sidecar-store.key` | Decrypts local inbox plaintext |
| `sidecar-token` | Local API bearer token |

If `sidecar-store.key` is lost, existing encrypted local inbox plaintext cannot be decrypted. Delivery receipts, outbox metadata, and Core/Registry records remain usable.

## Running As A Service

Use the packaging assets under `infra/sidecar` for production service installs:

| Platform | Asset |
| --- | --- |
| Linux | systemd units |
| Windows | service scripts |
| Docker | Compose profiles for Python and TypeScript sidecars |

Service hardening recommendations:

- Run as a dedicated user.
- Restrict file permissions on `~/.plenipo`.
- Keep logs sanitized; do not log request bodies, tokens, plaintext, or private keys.
- Restart on failure with backoff.
- Mount data volumes explicitly in Docker.
- Send metrics to your local collector if `/metrics` is enabled.

## Security Checklist

- [ ] Sidecar binds to localhost unless remote access is required.
- [ ] Bearer token is generated and stored outside source control.
- [ ] Remote bind uses signed requests and TLS or mTLS proxying.
- [ ] CORS allowlist is explicit.
- [ ] `runtime.sqlite` and `sidecar-store.key` are backed up together.
- [ ] Lost-key recovery procedure is known by operators.
- [ ] Logs are checked for token/body redaction.

