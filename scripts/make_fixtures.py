"""Generate synthetic, reproducible evidence; never reads credentials or calls tools."""
import hashlib
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
def canon(x): return json.dumps(x, sort_keys=True, separators=(',', ':'), ensure_ascii=True)
def sha(x): return hashlib.sha256(canon(x).encode()).hexdigest()
def make(account='0x1111111111111111111111111111111111111111', at=1795528800):
    p = {'agent':'support-summary-agent', 'purpose':'Read support ticket T-17 and save an internal issue summary. Never contact customers or expose secrets.',
         'operator':account,'approvers':[account],'separate_duties':False,'max_actions':3,'max_total_units':4,
         'tools':[{'name':'ticket_read','targets':['ticket:T-17'],'purpose':'Read the support issue for an internal summary.','max_calls':2,'max_units':2,'approval_required':False},
                  {'name':'note_write','targets':['internal:triage'],'purpose':'Save only an internal summary of ticket T-17 without customer contact or secrets.','max_calls':1,'max_units':2,'approval_required':True}]}
    plan = {'actions':[{'id':'read17','tool':'ticket_read','target':'ticket:T-17','units':1,'purpose':'Read T-17 for internal triage.','arguments':'ticket_id=T-17'},
                      {'id':'save17','tool':'note_write','target':'internal:triage','units':1,'purpose':'Save the internal issue summary.','arguments':'ticket_id=T-17; destination=internal:triage'}]}
    effects=['Read ticket T-17: customer reports an invoice display error. No other records were accessed.',
             'Saved the invoice display error summary for T-17 to internal:triage. No customer was contacted and no secrets were included.']
    trace={'complete':True,'coverage_note':'Synthetic fixture. Both planned calls recorded; completeness is an operator claim, not independently proven.',
           'actions':[{'action':a,'executed_at':at+60+i,'effect':effects[i]} for i,a in enumerate(plan['actions'])]}
    raw=canon(trace)
    report={'trace':raw,'trace_sha256':hashlib.sha256(raw.encode()).hexdigest(),'trace_bytes':len(raw.encode())}
    review={a['id']:{'status':'ALIGNED','quote':effects[i]} for i,a in enumerate(plan['actions'])}
    return p,plan,report,review
if __name__=='__main__':
    p,plan,report,review=make(sys.argv[1] if len(sys.argv)>1 else '0x1111111111111111111111111111111111111111',int(sys.argv[2]) if len(sys.argv)>2 else 1795528800)
    out=Path(sys.argv[3]) if len(sys.argv)>3 else ROOT/'fixtures'
    out.mkdir(parents=True,exist_ok=True)
    for name,data in [('policy',p),('plan',plan),('report',report),('review.mock',review)]:
        (out/(name+'.json')).write_text(json.dumps(data,indent=2)+'\n')
    print(canon({'policy_hash':sha(p),'action_hashes':{a['id']:sha(a) for a in plan['actions']}}))
