# SDK Reference

| SDK | Repository | MCP tools |
|-----|------------|-----------|
| TypeScript | `Plenipo-sdk-ts` | `plenipo_send`, `plenipo_receive`, `plenipo_discover`, `plenipo_balance`, `plenipo_did_create`, `plenipo_purchase_bundle`, `plenipo_mandate_prepare`, `plenipo_delivery_status` |
| Python | `Plenipo-sdk-py` | Same tool surface |

### v0.4 client APIs

| API | Description |
|-----|-------------|
| `send()` ack `status` | `"delivered"` or `"queued"` (+ `queued_until`) |
| `sendReceipt` / `send_receipt` | Recipient confirms delivery |
| `getDeliveryStatus` / `get_delivery_status` | Channel or REST status query |
| `onReceipt` / `on_receipt` | Sender receives `message.receipt` push |
| Auto receipt | Default on `message.deliver` (disable with `autoReceipt: false`) |

### MCP environment (send / receive / balance)

| Variable | Purpose |
|----------|---------|
| `PLENIPO_DID` | Agent DID |
| `PLENIPO_AUTH_SECRET_B64` | Ed25519 auth secret (or legacy `PLENIPO_DID_PRIVATE_KEY`) |
| `PLENIPO_DID_DOCUMENT_URL` | Hosted DID document URL |
| `PLENIPO_ENC_SECRET_B64` | Optional; decrypt on `plenipo_receive` |
| `PLENIPO_RELAY_URL` | WebSocket relay URL |
| `PLENIPO_REGISTRY_URL` | Registry for DID resolution |
