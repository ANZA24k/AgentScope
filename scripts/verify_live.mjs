// Read-only: requires no signing key and never submits a transaction.
import fs from 'node:fs';
import crypto from 'node:crypto';
import {createClient} from 'genlayer-js';
import {studionet} from 'genlayer-js/chains';
import {TransactionHashVariant} from 'genlayer-js/types';
const d=JSON.parse(fs.readFileSync('evidence/deployment.json','utf8'));
const client=createClient({chain:studionet});
// Studionet permits 30 standard requests/minute; pace exports below that limit.
let nextRequestAt=0;
const paced=async(fn)=>{
 for(let attempt=0;attempt<3;attempt++){
  const wait=Math.max(0,nextRequestAt-Date.now());
  if(wait)await new Promise(resolve=>setTimeout(resolve,wait));
  nextRequestAt=Date.now()+5000;
  try{return await fn();}catch(error){
   if(attempt===2||!String(error).includes('Rate limit exceeded'))throw error;
   const retry=error?.cause?.data?.retry_after_seconds??error?.data?.retry_after_seconds??30;
   const pause=Math.min(60,Math.max(5,Number(retry)+2));
   console.log(`RPC rate limit; waiting ${pause}s before bounded retry`);
   nextRequestAt=Date.now()+pause*1000;
  }
 }
};
const local=fs.readFileSync('contracts/agent_scope.py');
const remote=await paced(()=>client.getContractCode(d.address));
const bytes=remote.startsWith('0x')?Buffer.from(remote.slice(2),'hex'):Buffer.from(remote);
if(!bytes.equals(local))throw Error('Deployed source does not match');
const read=async(fn,args=[])=>JSON.parse(await paced(()=>client.readContract({address:d.address,functionName:fn,args,transactionHashVariant:TransactionHashVariant.LATEST_FINAL})));
const verified=[];
for(const t of d.transactions){
 const r=await paced(()=>client.getTransaction({hash:t.hash}));
 if((r.statusName??r.status_name)!=='FINALIZED'||r.result_name!=='MAJORITY_AGREE'||r.leader_only!==false||!r.consensus_data?.leader_receipt?.some(x=>x.execution_result==='SUCCESS'))throw Error('Not finalized successful full consensus: '+t.action);
 verified.push({action:t.action,hash:t.hash,status:'FINALIZED',result:r.result_name,leader_only:r.leader_only,votes:r.consensus_data.votes});
}
console.log('Verified deployed source and all finalized full-consensus transactions');
const status=await read('get_status');
const events=[];
for(let n=1;n<=status.events;n++)events.push(await read('get_event',[n]));
const runs={};
for(const id of (d.run_ids??[d.run_id])){
 const run=await read('get_run',[id]); const receipts=[];
 for(let n=1;n<=run.rounds;n++)receipts.push(await read('get_receipt',[id,n]));
 runs[id]={...run,receipts,effective:await read('effective_result',[id])};
}
const endStatus=await read('get_status');
if(endStatus.events!==status.events||endStatus.head!==status.head)throw Error('State changed while exporting; retry after transactions finalize');
for(const r of Object.values(runs))for(const receipt of r.receipts)if(!events.some(e=>e.event_hash===receipt.event_hash))throw Error('Receipt missing from exported event history');
fs.writeFileSync('evidence/events-live.json',JSON.stringify(events,null,2)+'\n');
fs.writeFileSync('evidence/runs-live.json',JSON.stringify(runs,null,2)+'\n');
fs.writeFileSync('evidence/verified-live.json',JSON.stringify({source_matches:true,source_sha256:crypto.createHash('sha256').update(local).digest('hex'),status,transactions:verified,outcomes:Object.fromEntries(Object.entries(runs).map(([id,r])=>[id,r.effective]))},null,2)+'\n');
console.log(JSON.stringify({source_matches:true,events:status.events,transactions:verified.length,outcomes:Object.fromEntries(Object.entries(runs).map(([id,r])=>[id,r.effective.outcome]))},null,2));
