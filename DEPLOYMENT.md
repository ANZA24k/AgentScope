# Deployment

Network: GenLayer Studionet, chain ID 61999.

Contract: [0x01cf0408406AbC17953567e4877D7eDa8C68BE8c](https://explorer-studio.genlayer.com/address/0x01cf0408406AbC17953567e4877D7eDa8C68BE8c).

Deployed through GenLayer Studio's existing inbuilt wallet using **Normal (Full Consensus)** with Simulation Mode off. No private key was exported. Full transaction status and lifecycle results are recorded in [EVIDENCE.md](EVIDENCE.md) and `evidence/deployment.json`.

## Reproduce

1. Open [GenLayer Studio](https://studio.genlayer.com/contracts), upload `contracts/agent_scope.py`, and choose Run and Debug.
2. Select Normal (Full Consensus), leave Simulation Mode off and deploy with the inbuilt Studio wallet. The constructor has no parameters. Wait for FINALIZED and execution SUCCESS.
3. Generate fresh inputs: `python scripts/make_fixtures.py YOUR_PUBLIC_ACCOUNT UNIX_TIME evidence/live-input`. For distinct approval roles, edit the approver list and set `separate_duties=true` before registration; recalculate the policy hash.
4. Call `register_policy` with the complete generated policy JSON. Its ID is SHA-256 of sorted-key, compact ASCII-escaped JSON. Retrieve `get_event` if needed to obtain the hash.
5. Call `open_run` with a fresh run ID, policy hash, full Git source commit and generated plan JSON.
6. Switch to the listed approver account and call `approve_action` for `save17`, using its printed exact action hash and boolean true. The sample uses one account and explicitly disables role separation; it does not demonstrate independent human approval.
7. After approval is accepted, regenerate the report with action timestamps after the chain approval time and before sealing. Keep policy and plan byte-equivalent to the registered/opened inputs. Use the saved report JSON in `seal_report`.
8. Call `assess`. Wait for finalized SUCCESS and full-consensus agreement; read `get_receipt(run_id, 1)` and `effective_result` using Finalized state. This is the live semantic review, not a mock model answer.
9. As operator or locked approver, call `challenge` with a record-grounded question. The effective non-violation result becomes INCONCLUSIVE. Call `assess` again and read both rounds. Neither the original evidence nor receipt can be replaced.
10. Open a separate run and omit the required approval before sealing to demonstrate deterministic VIOLATION.

Fixtures are synthetic; the commit pin identifies the submitted runner/source version claim, not independently authenticated execution. Studionet may reset. A transaction hash or address alone is insufficient evidence: check execution result, consensus and finality. Never switch to leader-only mode to claim validator verification.

## Verify published evidence

```sh
npm ci
npm run verify:live
python scripts/verify_chain.py evidence/events-live.json
```

The exporter is read-only, checks deployed source bytes, finality, successful execution and full consensus, and exports state and receipts. It does not use a wallet key or repeat AI reasoning. Hash-chain verification detects tampering in the exported transcript, but does not authenticate real-world logs.
