# Security model

## Authorities and isolation

Only a policy's declared operator may register it and open/seal its runs. Policies and run IDs cannot be overwritten. Approvers are permanently listed in the policy; set `separate_duties=true` to reject operator self-approval. One listed approver is sufficient for a required action: this is not an all-approvers or threshold signature scheme. Approval decisions are immutable and scoped by run ID plus exact action digest. A denial requires a new run to obtain a different decision. Anyone may assess sealed evidence, but cannot alter it. Only the precommitted operator/approvers can file the single challenge.

A policy creator controls their own policy, and may choose permissive limits. Consumers must inspect the policy hash, author, approver identities and desired separation. This contract does not impose a universal agent safety policy.

## Evidence assumptions

Logs and effects are untrusted, inline, byte-bounded data. They remain public forever: redact secrets before submission. No external URL retrieval is implemented, eliminating contract-side SSRF, redirects and mutable web evidence. The SHA-256 binds exact trace bytes; canonical hashes bind policy, planned actions and report envelopes. A source commit is a declared version pin, not a verified GitHub fetch, code signature or build attestation. No runtime signatures or cryptographic log completeness proof are claimed.

Execution times are operator claims, bounded by chain timestamps. An operator can lie about a tool's actual execution time, units, destination or effects. Exact tool/target checks apply to declared fields; semantic review interprets the argument and effect strings, but cannot observe omitted calls or independently establish real-world execution. Same-block timestamps cannot prove strict sub-second action ordering. Require an external trusted recorder or signed instrumentation when stronger execution authenticity is necessary.

The plan may contain forbidden actions so that violations can be recorded. Opening a run or granting an approval is never itself an authorization verdict. Approver consent cannot expand tool boundaries or override purpose restrictions. Every AUTHORIZED result is scoped to the submitted records and claimed coverage.

## Model and consensus controls

Leader/validator reasoning is independent. Exact stable statuses must agree; a separate validator audit tests evidence relevance. Unknown answers are conservative. Literal quotation and JSON schema checks alone cannot establish semantic truth, which is why independent full-context review is required. Prompt injection may still influence multiple models; consensus is not a proof of truth. Local mocks deliberately exercise disagreement, invalid quotations, malformed audits and false affirmative strings. Deterministic failures short-circuit AI and cannot be overturned by a challenge.

An authorized party can suspend a non-violation result once with a challenge, a deliberate accountability tradeoff. A second assessment is final within the contract, while both receipts and the challenge remain visible. No automatic timeout or fairness guarantee is provided. Infrastructure failures revert and require another transaction; application successful rounds remain bounded to two.

## Resource bounds

Policies: 14,000 encoded JSON bytes, at most 10 tools, 10 exact targets per tool and 5 approvers. Plans: 20,000 encoded bytes and 1–20 actions. Trace: 24,000 UTF-8 bytes and at most 20 actions; enclosing report: 30,000 bytes. Challenge: 2,000 bytes. Model response: 18,000 bytes; audit: 1,000 bytes. Canonical normalized storage is also checked where escape expansion matters. Global/per-tool unit limits are at most 1 billion. Event history can grow across distinct runs; callers pay normal network execution costs.

Do not submit confidential logs, credentials, wallet keys or personal customer data. Report implementation vulnerabilities privately through the repository owner's GitHub contact rather than posting secrets in an issue.
