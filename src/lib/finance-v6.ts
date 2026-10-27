import * as A from "./analytics";
export type BusinessRole="affiliate"|"platform";
export type Cost={id:string;date:string;campaignId:string;role:BusinessRole;category:"Ads"|"Creative"|"Other";cents:number;note:string};
export type Review={id:string;eventIds:string[];status:"Approved"|"Rejected";reason:string;actor:string;at:string};
export function applyReviews(events:readonly A.Event[],history:readonly Review[]):A.Event[]{
 const decisions=new Map<string,Review>();for(const entry of history)for(const id of entry.eventIds)if(!decisions.has(id))decisions.set(id,entry);
 return events.map(event=>event.status==="Pending"&&decisions.has(event.id)?{...event,status:decisions.get(event.id)!.status}:event);
}
// A deposit and its revenue event describe the same business action and are reviewed together.
export function reviewTargets(events:readonly A.Event[],ids:readonly string[]):A.Event[]{
 const chosen=events.filter(e=>ids.includes(e.id)&&e.status==="Pending");
 const visits=new Set(chosen.filter(e=>e.type==="Deposit"||e.type==="Revenue").map(e=>e.visitId));
 return events.filter(e=>e.status==="Pending"&&(chosen.some(c=>c.id===e.id)||(visits.has(e.visitId)&&["Deposit","Revenue"].includes(e.type))));
}
export function costDimensionsSupported(scope:A.Scope){return ![scope.landing,scope.country,scope.source,scope.device,scope.creative,scope.affiliate].some(Boolean)}
export function scopedCosts(costs:readonly Cost[],scope:A.Scope,role:BusinessRole){return costs.filter(c=>c.role===role&&c.date>=scope.from&&c.date<=scope.to&&(!scope.campaign||c.campaignId===scope.campaign))}
export function financialSummary(events:readonly A.Event[],costs:readonly Cost[],scope:A.Scope,role:BusinessRole){
 const revenueEvents=A.inScope(events,scope).filter(e=>e.status==="Approved"&&e.type==="Revenue");
 const revenue=revenueEvents.reduce((s,e)=>s+Math.round(e.revenue*100),0),commission=revenueEvents.reduce((s,e)=>s+Math.round(e.commission*100),0);
 const entries=scopedCosts(costs,scope,role),expense=entries.reduce((s,c)=>s+c.cents,0),income=role==="affiliate"?commission:revenue,payout=role==="platform"?commission:0;
 const campaignIds=[...new Set(revenueEvents.filter(e=>e.revenue>0).map(e=>e.campaignId))],covered=campaignIds.filter(id=>entries.some(c=>c.campaignId===id)).length;
 const supported=costDimensionsSupported(scope),complete=supported&&(campaignIds.length?covered===campaignIds.length:entries.length>0);
 const spending=payout+expense,net=complete?income-spending:null;
 return {income,payout,expense,spending,net,roi:net!==null&&spending>0?net/spending*100:null,supported,complete,covered,campaigns:campaignIds.length,entries};
}
export function parseCostAmount(value:string):number|null{if(!/^(0|[1-9]\d{0,6})(\.\d{1,2})?$/.test(value))return null;const [whole,fraction=""]=value.split(".");const cents=Number(whole)*100+Number(fraction.padEnd(2,"0"));return Number.isSafeInteger(cents)?cents:null}
