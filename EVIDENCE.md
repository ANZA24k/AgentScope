# Verification evidence

AgentScope is deployed on GenLayer Studionet (chain ID 61999) at [0x01cf0408406AbC17953567e4877D7eDa8C68BE8c](https://explorer-studio.genlayer.com/address/0x01cf0408406AbC17953567e4877D7eDa8C68BE8c).

## Local and CI checks

- **68 SDK tests passed**, including permission boundaries, immutable policies/plans, exact-action approval binding, cross-run isolation, separate approvers, byte/hash checks, malformed evidence, validator disagreement, misleading quotation audits, conservative outcomes, challenge bounds and tamper detection.
- Tests use genlayer-test 0.29.2, SDK v0.2.16 and pytest 9.2.0. Mocked LLM answers exercise the actual validator callback; they are distinct from network consensus evidence.
- **GenVM lint and SDK validation passed**, with ABI extraction confirming six write methods and six view methods. The dependency header remains pinned; the informational newer-runner notice is not a validation failure.
- [GitHub CI passed](https://github.com/ANZA24k/AgentScope/actions/runs/45361283713) for commit `7e87cc3c602f7a28c7ae20416b5aeeb4fc2af546`. The initial CI attempt failed because the pip cache expected requirements.txt; the corrected workflow explicitly uses requirements-dev.txt.

See `evidence/tests.txt`, `evidence/validation.json` and `evidence/schema.json`.

## Live lifecycle results

The synthetic lifecycle ran on 2026-11-24 through Studio's existing inbuilt account `0xcD72fA5B6A496d84B4A10bCFF31D3B7c12346a9e`, with Normal (Full Consensus) selected and Simulation Mode off. No private key was exported.

| Run | Stage | Result |
| --- | --- | --- |
| AS-SUPPORT-001 | First independent semantic assessment | AUTHORIZED |
| AS-SUPPORT-001 | Challenge pending | INCONCLUSIVE; original receipt preserved |
| AS-SUPPORT-001 | Independent reassessment | AUTHORIZED; both receipts preserved |
| AS-SUPPORT-001AS-NOAPPROVAL-001 | Same planned tool calls without required approval | VIOLATION: missing_approval:save17 |

PARTIAL and ambiguous-evidence INCONCLUSIVE cases are covered by local tests, not additional live runs. The fixture uses the same account as operator and approver, with `separate_duties=false`; distinct-role enforcement is tested locally and is not claimed as independently exercised by humans on-chain.

The run source pin is the published commit `5e1aaff5802fe4f7a1a39150ed17afba5960c624`. Deployed contract bytes match `contracts/agent_scope.py`; its SHA-256 is `835e9903ea021f382308e7cea6e2a0e4b71dad1a0c17a585b953960675671b4e`.

## Transactions

| Action | Explorer transaction |
| --- | --- |
| deploy | [0x7f2285e8c3…](https://explorer-studio.genlayer.com/tx/0x7f2285e8c33ab8f6e03de85641121677ba0919a3d2bf9199d7429372df0ff1fb) |
| register_policy | [0x8a8aa6f0c4…](https://explorer-studio.genlayer.com/tx/0x8a8aa6f0c481526af00e0881c518932f9db4040be0797f329724b4f69c756c02) |
| open_run | [0xa89b153be2…](https://explorer-studio.genlayer.com/tx/0xa89b153be2f22aaf41d7d41c0aed76560fe7937c52d0bbaa4e415badd04c9590) |
| approve_action | [0xfb5bcba9d3…](https://explorer-studio.genlayer.com/tx/0xfb5bcba9d3426ad265c987f91de30034fbbf233ab46aba4df8096b8fdb56d185) |
| seal_report | [0xb421ee14af…](https://explorer-studio.genlayer.com/tx/0xb421ee14af1c2bba8fbfb27c917483564b5ada4e3a3e995559bc120326e112d1) |
| assess_round_1 | [0x6529ad4ded…](https://explorer-studio.genlayer.com/tx/0x6529ad4ded3b17230a4d318d20768850480722d0e88dc62e7f2410ef6478925b) |
| challenge | [0x5e3d0e64ff…](https://explorer-studio.genlayer.com/tx/0x5e3d0e64ffa79e047a8966221007596b4909872658f202f454707dd6bece167e) |
| open_without_approval | [0x443793b36d…](https://explorer-studio.genlayer.com/tx/0x443793b36d499bee8b22c70a1655f971153362eb3296599baebd84ffeed5b703) |
| assess_round_2 | [0xe6af72b41a…](https://explorer-studio.genlayer.com/tx/0xe6af72b41a2ee5c133b17308fd42ea5bd395719e6e180f9a2178baea9e29b06b) |
| seal_without_approval | [0xd802abcdeb…](https://explorer-studio.genlayer.com/tx/0xd802abcdebe2f1248498af8f08ebc033624f570ead28c919dbdd002a49f3e47f) |
| assess_without_approval | [0x954a56bc77…](https://explorer-studio.genlayer.com/tx/0x954a56bc77030095ebf8a9f9f7053f96925963dcf646988e9d7456ba5f6f3e7e) |

The read-only network recheck on 2026-11-25 confirmed all **11 transactions FINALIZED with MAJORITY_AGREE, successful execution and full consensus**, source equality, and all **10 hash-linked events**. Final history head: `d25a9b0b65aaa277fc190389e095a36cc52e93c0b0cfea355677273209c942e3`.

## Reproduce the evidence checks

`npm ci && npm run verify:live` verifies source equality, FINALIZED status, MAJORITY_AGREE, successful execution and full consensus for every listed transaction. It exports `evidence/events-live.json`, `evidence/runs-live.json` and `evidence/verified-live.json`. Requests are paced for Studionet's 30-request-per-minute limit, and the exporter rejects a changing snapshot. It requires no wallet key and submits no transactions.

`python scripts/verify_chain.py evidence/events-live.json` checks canonical SHA-256 event digests, consecutive sequence numbers, previous-hash links and a single chain/contract domain. The final transcript contains ten events. `evidence/challenge-pending-live.json` preserves the observed interim challenge state.

Policies, plans, effects and source pins are submitted claims. No real support system, customer record or executing agent was involved. Consensus assesses documentary alignment; it cannot prove actual execution, authenticate tool effects or establish that all actions were logged. AUTHORIZED applies only to the submitted records and claimed coverage. Studionet data may be reset; retained snapshots document the observed verification, while the read-only exporter checks present network state.
