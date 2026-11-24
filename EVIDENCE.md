# Verification evidence

Local verification: 68 tests passed using genlayer-test 0.29.2, SDK v0.2.16 and pytest 9.2.0. `evidence/tests.txt` contains the complete output. Tests use mocked LLM responses and invoke the real SDK validator callback to check independent disagreement, quote grounding and audit rejection. They do not prove live validator consensus.

`genvm-lint check` passed both AST lint and SDK semantic validation. ABI extraction produced `evidence/schema.json`: six public write methods and six public view methods.

The contract is deployed on Studionet at [0x01cf0408406AbC17953567e4877D7eDa8C68BE8c](https://explorer-studio.genlayer.com/address/0x01cf0408406AbC17953567e4877D7eDa8C68BE8c). Deployment transaction: [0x7f2285e8c33ab8f6e03de85641121677ba0919a3d2bf9199d7429372df0ff1fb](https://explorer-studio.genlayer.com/tx/0x7f2285e8c33ab8f6e03de85641121677ba0919a3d2bf9199d7429372df0ff1fb).

Live lifecycle verification is in progress. The final deployment record and read-only exported receipts distinguish actual network results from local synthetic tests. No real support system, customer record or executing agent is involved in the synthetic evidence.
