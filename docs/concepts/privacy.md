# Privacy Model

Plenipo Core and Registry do not inspect message plaintext and do not possess user decryption keys.

Core stores routing and billing metadata such as sender DID, recipient DID, envelope ID, timestamp, byte count, delivery status, and token charge. For offline delivery, Core may temporarily store the encrypted wire envelope until it is delivered or expires. Core treats ciphertext as opaque and never decrypts it.

Registry stores public discovery metadata from DID documents, including service endpoints, capabilities, limits, payment hints, status, and freshness. Registry does not store message content.

Local sidecars run under the agent operator's control. They may decrypt messages locally and can store inbound plaintext encrypted at rest in the operator's local runtime database.

For the public legal policy, see [Privacy Policy](/legal/privacy).
