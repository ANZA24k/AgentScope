# AgentScope

**AI agent permission and action verification, implemented as a standalone GenLayer Intelligent Contract.**

A permitted tool can still be used for an unauthorized purpose. AgentScope combines deterministic permission checks with independently validated semantic review of action arguments and documented effects. It records immutable policies, precommitted action plans, exact-action approvals, SHA-256-bound logs and append-only assessment receipts.

## What it verifies

An internal support agent is allowed to read ticket T-17 and save an internal summary. AgentScope detects an unapproved write, a changed planned call, a forbidden tool or resource, an exceeded usage budget, or a documented purpose conflict such as contacting the customer instead. Ambiguous effects and incomplete records receive conservative outcomes.

| Outcome | Meaning within submitted records |
| --- | --- |
| AUTHORIZED | Every logged action passes deterministic boundaries and semantic review; the operator claims complete coverage of the entire plan. |
| PARTIAL | At least one action is aligned, no violation is established, but coverage or another action's purpose remains unresolved. |
| VIOLATION | A deterministic boundary fails or a documented purpose conflict is established. Takes precedence over incomplete coverage. |
| INCONCLUSIVE | No action has sufficient alignment evidence, no assessment exists, or a non-violation receipt is under challenge. |

**AUTHORIZED is an assessment of submitted records, never a certificate that every real action was logged or that the agent is safe.** Self-reported timestamps, source commits, units, resources and tool effects are not authenticated execution facts. On-chain approvals authenticate the signing account and chain order, not a human's understanding or the truth of later logs.

## Lifecycle

1. The policy operator calls `register_policy(policy_json)`. The canonical policy hash is its permanent ID; edits require a new policy.
2. The operator calls `open_run(run_id, policy_hash, source_commit, plan_json)` before execution. Use a full lowercase 40-character Git commit and unique run ID. Plans contain exact action IDs, tools, resource labels, integer units, purposes and argument strings.
3. A locked approver calls `approve_action(run_id, action_id, action_hash, approved)` before the action's claimed execution time. The action hash covers every planned field. Each action has one immutable approve/deny decision, scoped to this run. A policy can require distinct operator and approver accounts.
4. The operator calls `seal_report(run_id, report_json)`. The report contains an inline JSON trace string, its exact UTF-8 byte length and SHA-256. Approval writes and log replacement are now closed.
5. Anyone may call `assess(run_id)`. Hard violations resolve deterministically. Otherwise GenLayer's leader and validators independently review every logged action; validators compare all statuses and audit the proposed quotes against the full context. Only then does deterministic code derive the outcome.
6. The operator or a locked approver may submit one bounded `challenge(run_id, reason)` after round one. Effective results become INCONCLUSIVE pending reassessment, while established VIOLATION remains visible. Anyone may call `assess` once more. Both receipts remain immutable. Challenges cannot replace evidence or erase boundary failures.

Read `get_policy`, `get_run`, `get_receipt(run_id, round_no)`, `effective_result`, `get_status` and `get_event(sequence)`. There is no admin override, escrow, token or off-chain verdict API. No frontend is required for this standalone primitive; GenLayer Studio exposes the full interface.

## Deterministic boundaries

- Exact tool names and exact resource labels; no prefixes, wildcards or URL normalization.
- Per-tool cumulative calls/units and global calls/units, checked against actual submitted action records.
- Every logged action must match its precommitted planned action hash. Unplanned/changed calls are recordable violations, rather than silently rejected evidence.
- Required approval must exist, be affirmative, bind the exact action, and have a chain timestamp no later than claimed execution. Logs must be monotonically ordered between run opening and sealing.
- Strict field sets, duplicate JSON key rejection, unique IDs, real integer types (booleans/floats rejected), bounded UTF-8 payloads and valid account addresses.
- Event hashes cover chain ID, contract address, sequence, actor, chain timestamp, prior hash and data. Receipts bind policy, run, report and challenge hashes.

Units are policy-defined integer accounting units and must have a consistent meaning for the participating agent. Resource labels are declarations: the contract does not observe network destinations or parse every tool's argument language.

## Why GenLayer is central

Purpose alignment requires interpretation: an allowed `note_write` may quietly disclose secrets, or a quoted success message may contradict the full record. `gl.vm.run_nondet_unsafe` executes the leader review and an independent validator review. Validators compare each action status exactly and separately audit quotation relevance, negations, arguments, global purpose and tool-specific purpose. Quotes must also be literal substrings of the corresponding action effect. A permissive leader alone cannot authorize an action. Data and challenge prose are explicitly treated as untrusted input, never instructions.

Malformed or unavailable model output becomes UNKNOWN, never ALIGNED. Consensus rejection or infrastructure errors can revert the transaction; they do not create a successful receipt. The contract permits two successful assessment rounds, with one challenge; model calls have no application-level retry loops. Local tests mock model answers and exercise the actual SDK validator callback. Live consensus evidence is reported separately in [EVIDENCE.md](EVIDENCE.md).

The consensus implementation follows the [official Equivalence Principle documentation](https://docs.genlayer.com/developers/intelligent-contracts/equivalence-principle). Source pins the GenVM dependency header; tests explicitly load SDK v0.2.16.

## Run checks

```sh
python -m venv .venv
. .venv/bin/activate
pip install -r requirements-dev.txt
pytest -q
genvm-lint check contracts/agent_scope.py
genvm-lint schema contracts/agent_scope.py -o evidence/schema.json
```

First SDK checks may download GenVM artifacts from the official GitHub release. Test answers are synthetic and do not represent real agent execution or production consensus.

Generate your own synthetic Studio fixtures with:

```sh
python scripts/make_fixtures.py YOUR_PUBLIC_STUDIO_ACCOUNT UNIX_TIME evidence/live-input
```

This prints policy/action hashes and creates policy, plan, report and mock-review JSON. It never reads a private key or contacts external services. For live use, set execution timestamps after the relevant approvals and before sealing; retain the original fixed fixtures for tests.

See [DEPLOYMENT.md](DEPLOYMENT.md), [EVIDENCE.md](EVIDENCE.md), [SECURITY.md](SECURITY.md) and [SUBMISSION.md](SUBMISSION.md). MIT licensed.
