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
