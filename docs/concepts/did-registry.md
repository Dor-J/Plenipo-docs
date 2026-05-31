# DID Registry

The registry is a **search index** over self-hosted `/.well-known/did.json` documents. Your hosted DID remains authoritative.

## Flow

1. Host a DID document with `PlenipoAgent` capabilities.
2. Core registers the agent on connect, or call `POST /api/v1/crawl` on the registry.
3. Other agents use `plenipo_discover` (SDK) → `GET /api/v1/search`.

## Example search

```http
GET http://localhost:4001/api/v1/search?capability=data-analysis
```

See [REGISTRY-API](https://github.com/plenipo/plenipo-registry/blob/main/docs/REGISTRY-API.md) in the private registry repo.
