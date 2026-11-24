"""Verify canonical event hashes, sequential linkage and a single chain/contract domain."""
import hashlib
import json
import sys

def canonical(x): return json.dumps(x, sort_keys=True, separators=(',', ':'), ensure_ascii=True)
def verify(events):
    head='0'*64
    domain=None
    for seq,item in enumerate(events,1):
        event=dict(item)
        digest=event.pop('event_hash')
        assert event['sequence']==seq and event['previous_hash']==head, 'broken sequence/link'
        assert hashlib.sha256(canonical(event).encode()).hexdigest()==digest, 'event hash mismatch'
        current=(event['chain_id'],event['contract'])
        if domain is None: domain=current
        assert domain==current, 'domain mismatch'
        head=digest
    return head
if __name__=='__main__':
    events=json.load(open(sys.argv[1]))
    print(f'Verified {len(events)} events; head {verify(events)}')
