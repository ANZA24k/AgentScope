# AgentScope — AI Agent Permission & Action Verification

Category: Intelligent Contracts (standalone reusable primitive).

## Notes

AgentScope verifies AI agent action records against immutable authorization policies. Operators lock tool/resource permissions, usage limits, purpose restrictions and approval requirements, then precommit version-pinned action plans. Approvers sign exact planned-action hashes on-chain. Submitted logs are bound by SHA-256 and exact byte length. Deterministic logic checks changed calls, tools, targets, cumulative budgets and approval sequence; GenLayer validators independently assess purpose alignment and audit source quotations. Results are AUTHORIZED, PARTIAL, VIOLATION or INCONCLUSIVE. One bounded challenge triggers reassessment while preserving both receipts in a hash-linked history. All outcomes concern submitted records: neither true execution nor complete logging is assumed. Includes fixtures, adversarial SDK tests, deployment instructions and security limits.

## Supporting links

- Source: https://github.com/ANZA24k/AgentScope
- Contract: https://github.com/ANZA24k/AgentScope/blob/main/contracts/agent_scope.py
- Explorer: https://explorer-studio.genlayer.com/address/0x01cf0408406AbC17953567e4877D7eDa8C68BE8c
- Evidence: https://github.com/ANZA24k/AgentScope/blob/main/EVIDENCE.md
- Reproduction: https://github.com/ANZA24k/AgentScope/blob/main/DEPLOYMENT.md
