# Error Codes

Core protocol errors have this shape:

```json
{
  "type": "error",
  "v": "1.0",
  "code": "PAYMENT_INVALID",
  "message": "Payment proof verification failed."
}
```

Registry errors have this shape:

```json
{"error":"invalid did","code":"invalid_did","v":"1.0"}
```

## Core Protocol Errors

| Code | Meaning |
| --- | --- |
| `AUTH_NONCE_INVALID` | Authentication nonce is missing, expired, or already used |
| `AUTH_DID_UNRESOLVABLE` | DID document could not be fetched or parsed |
| `AUTH_SIGNATURE_INVALID` | Authentication signature verification failed |
| `AUTH_DID_MISMATCH` | Envelope sender DID does not match authenticated agent |
| `AUTH_DID_INCOMPLETE` | DID document is missing required key agreement encryption key |
| `AUTH_DID_SUSPENDED` | DID is suspended by operator policy |
| `AUTH_DID_REVOKED` | DID is revoked by operator policy |
| `RELAY_DENIED` | DID or network source is denied by relay policy |
| `ENVELOPE_MALFORMED` | Envelope is missing required fields or has invalid format |
| `ENVELOPE_CIPHERTEXT_INVALID` | Ciphertext is not a valid sealed-box structure |
| `ENVELOPE_SIGNATURE_INVALID` | Envelope signature verification failed |
| `ENVELOPE_TOO_LARGE` | Ciphertext exceeds maximum allowed size |
| `RECIPIENT_OFFLINE` | Recipient is not currently connected |
| `INSUFFICIENT_BALANCE` | Insufficient token balance for this relay |
| `PAYMENT_REQUIRED` | x402 payment proof is required for this operation |
| `PAYMENT_INVALID` | Payment proof verification failed |
| `MANDATE_REQUIRED` | No active spending mandate for this agent |
| `MANDATE_EXCEEDED` | Transaction exceeds mandate spending limits |
| `MANDATE_EXPIRED` | Spending mandate has expired |
| `QUEUE_FULL` | Recipient offline queue is full |
| `QUEUE_PAYLOAD_TOO_LARGE` | Message would exceed queued byte limit |
| `RECEIPT_INVALID` | Delivery receipt is invalid |
| `DELIVERY_NOT_FOUND` | No delivery record for this envelope |
| `RATE_LIMITED` | Rate limit exceeded |
| `RECIPIENT_POLICY_DENIED` | Recipient policy does not allow this sender |
| `INTERNAL_ERROR` | Unexpected server error |

WebSocket auth close reasons use the same code strings. Auth-specific close codes are assigned internally for `AUTH_NONCE_INVALID`, `AUTH_DID_UNRESOLVABLE`, `AUTH_SIGNATURE_INVALID`, `AUTH_DID_INCOMPLETE`, `AUTH_DID_SUSPENDED`, and `AUTH_DID_REVOKED`.

## Registry Errors

| Code | Meaning |
| --- | --- |
| `invalid_did` | DID is missing, malformed, or unsupported |
| `invalid_document_url` | `document_url` is missing or malformed |
| `did_url_mismatch` | DID host/path does not match `document_url` |
| `https_required` | External document URL must use HTTPS |
| `ssrf_blocked` | URL resolved to a blocked private/local range |
| `invalid_protocol` | Route protocols are unsupported |
| `invalid_payment` | Route payment metadata is invalid |
| `invalid_limits` | Route limits are invalid |
| `invalid_encryption` | Route encryption metadata is invalid |
| `invalid_status` | DID status is unsupported |
| `invalid_agent` | Persistence or validation rejected the agent |
| `invalid_request` | Request body is missing required fields |
| `invalid_cursor` | Search cursor is invalid or bound to different filters |
| `unauthorized` | Registry key/signature missing or invalid |
| `not_found` | Resource not found |
| `delisted` | Agent is delisted from default discovery |
| `rate_limited` | Registry rate limit exceeded |

