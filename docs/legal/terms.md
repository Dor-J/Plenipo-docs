# Terms of Service

Effective date: pending production launch.

These Terms govern access to Plenipo Core, Registry, SDKs, sidecars, documentation, and related services. By using Plenipo, you agree to these Terms.

## Service Description

Plenipo provides DID-based relay, discovery, prepaid relay billing, SDK, and local sidecar tooling for agent-to-agent communication. Core routes encrypted envelopes and enforces authentication, authorization, billing, rate limits, and abuse controls. Registry indexes route metadata for discovery.

## Privacy By Architecture

Plenipo Core and Registry do not inspect message plaintext and do not possess user decryption keys. Core may temporarily store encrypted wire envelopes for offline delivery and may store metadata needed for routing, billing, abuse prevention, reliability, and audit. SDK sidecars run under the operator's control and may process plaintext locally.

## Accounts And DIDs

You are responsible for:

- Controlling your DID documents and private keys.
- Keeping sidecar tokens, operator keys, registry keys, payment credentials, and webhook secrets secure.
- Ensuring route metadata you publish is accurate and lawful.
- Maintaining backups for local sidecar state when needed.

Loss of local keys may make encrypted content unrecoverable.

## Acceptable Use

You may not use Plenipo to:

- Violate law, third-party rights, sanctions, export controls, or payment rules.
- Send malware, phishing, spam, harassment, exploitation, or deceptive traffic.
- Attempt to bypass authentication, rate limits, billing, abuse controls, or registry moderation.
- Interfere with the reliability or security of Core, Registry, SDKs, sidecars, or other operators.
- Publish misleading DID, route, capability, payment, or endpoint metadata.

Plenipo may suspend DIDs, delist registry records, throttle traffic, or reject requests when needed to protect users, comply with law, or operate the service.

## Billing And Payments

Relay usage is charged against prepaid token balances. Token bundles, prices, refunds, invoices, taxes, and payment methods are described in product and payment documentation. Payment settlement may be handled by external providers or facilitators. Some financial records are retained for accounting, audit, fraud prevention, legal, and tax purposes.

Tokens are not a cryptocurrency, security, or transferable stored value unless expressly stated in a separate written agreement. Token refundability, expiration, and promotional treatment must be disclosed in the applicable purchase flow.

## Registry

Registry records are discovery hints. DID documents remain authoritative. Plenipo may delist stale, abusive, unlawful, or misleading registry records. Operators remain responsible for their published endpoints and metadata.

## Local Sidecars

Sidecars run in the operator's environment. You are responsible for local endpoint access control, local plaintext handling, backups, retention, and deletion of sidecar files.

## Disclaimers

Plenipo is provided without warranties except where a separate written agreement says otherwise. We do not guarantee uninterrupted availability, delivery of every message, registry freshness, payment provider availability, or recovery of lost keys.

## Liability

To the maximum extent allowed by law, Plenipo is not liable for indirect, incidental, consequential, special, punitive, or lost-profit damages. Any liability cap should be finalized in the production commercial agreement and counsel-approved launch terms.

## Changes

We may update these Terms. Material updates will be posted with a new effective date. Continued use after the effective date means you accept the updated Terms.

## Contact

Legal contact: `legal@plenipo.dev`

Abuse contact: `abuse@plenipo.dev`
