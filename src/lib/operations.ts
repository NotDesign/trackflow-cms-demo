import * as A from "./analytics";
export const SETTLEMENT_CUTOFF="2026-10-09";
export type HealthFinding={linkId:string;kind:"Destination unavailable"|"Missing campaign tags";severity:"High"|"Medium"};
// Explicit, deterministic fixtures. No HTTP request or live uptime check is performed.
export function healthFindings(links:readonly A.TrackingLink[]):HealthFinding[]{return links.flatMap<HealthFinding>(l=>l.id==="LNK-2003"||l.id==="LNK-2017"?[{linkId:l.id,kind:"Destination unavailable",severity:"High"}]:l.id==="LNK-2008"||l.id==="LNK-2022"?[{linkId:l.id,kind:"Missing campaign tags",severity:"Medium"}]:[])}
export type Alert={id:string;title:string;detail:string;severity:"High"|"Medium"|"Low";kind:"Conversions"|"Traffic"|"Links";count:number;campaignId?:string;linkId?:string};
export function buildAlerts(visits:readonly A.Visit[],events:readonly A.Event[],scope:A.Scope,links:readonly A.TrackingLink[],rules:{drop:number;minClicks:number}):Alert[]{
 const list:Alert[]=[];const pending=events.filter(e=>e.status==="Pending");if(pending.length)list.push({id:"pending:"+A.scopeURL("",scope),title:"Conversions awaiting review",detail:"Review the pending records before approving commission.",severity:"Medium",kind:"Conversions",count:pending.length});
 const relevant=links.filter(l=>(!scope.campaign||l.campaignId===scope.campaign)&&(!scope.country||l.country===scope.country)&&A.trafficMatches(l,scope)&&(!scope.creative||l.creativeId===scope.creative)&&(!scope.affiliate||l.affiliateId===scope.affiliate)&&(!scope.device||visits.some(v=>v.linkId===l.id))&&(!scope.landing||l.landingPageId===scope.landing||visits.some(v=>v.linkId===l.id)));
 for(const h of healthFindings(relevant))list.push({id:"health:"+h.linkId,title:h.kind,detail:"Simulated link health fixture. Open the link configuration to inspect.",severity:h.severity,kind:"Links",count:1,linkId:h.linkId});
 if(A.daysBetween(scope.from,scope.to)>=14){const split=A.shiftDate(scope.to,-6),prevStart=A.shiftDate(scope.to,-13),last=visits.filter(v=>v.date>=split).reduce((s,v)=>s+v.clicks,0),before=visits.filter(v=>v.date>=prevStart&&v.date<split).reduce((s,v)=>s+v.clicks,0),drop=before?(before-last)/before*100:0;
 if(before>=rules.minClicks&&drop>=rules.drop)list.push({id:"drop:"+A.scopeURL("",scope)+":"+rules.drop,title:"Recent traffic declined",detail:"The last 7 days have fewer clicks than the preceding 7 days within this scope.",severity:"High",kind:"Traffic",count:Math.round(drop)})}
 for(const c of A.groupRows(visits,events,"campaignId"))if(c.clicks>=rules.minClicks&&c.ftd===0)list.push({id:"no-ftd:"+c.id+":"+scope.from+":"+scope.to,title:"Clicks without a first deposit",detail:"This campaign reached the click threshold with no approved first deposit.",severity:"Medium",kind:"Traffic",count:c.clicks,campaignId:c.id});
 return list;
}
export type SettlementLine={id:string;affiliateId:string;cents:number;date:string};
export type Batch={id:string;affiliateId:string;created:string;from:string;to:string;scopeLabel:string;lines:SettlementLine[];status:"Draft"|"Approved"|"Simulated complete"|"Cancelled"};
export function cents(value:number){return Math.round(value*100)}
export function batchCents(batch:Batch){return batch.lines.reduce((sum,l)=>sum+l.cents,0)}
export function reservedIds(batches:readonly Batch[]){return new Set(batches.filter(b=>b.status!=="Cancelled").flatMap(b=>b.lines.map(l=>l.id)))}
export function availableLines(events:readonly A.Event[],batches:readonly Batch[],affiliateId?:string):SettlementLine[]{const reserved=reservedIds(batches);return events.filter(e=>e.type==="Revenue"&&e.status==="Approved"&&e.date<=SETTLEMENT_CUTOFF&&e.commission>0&&(!affiliateId||e.affiliateId===affiliateId)&&!reserved.has(e.id)).map(e=>({id:e.id,affiliateId:e.affiliateId,cents:cents(e.commission),date:e.date}))}
export type Funnel={visitors:number;registered:number;ftd:number;registrationRate:number;depositRate:number;completionRate:number};
const firstVisits=new Map<string,A.Visit>();for(const visit of A.allVisits){const previous=firstVisits.get(visit.visitorId);if(!previous||visit.time<previous.time)firstVisits.set(visit.visitorId,visit)}
export function funnel(scope:A.Scope,campaignId?:string,eventSource:readonly A.Event[]=A.allEvents):Funnel{
 const cohort=[...firstVisits.values()].filter(v=>v.date>=scope.from&&v.date<=scope.to&&A.matchesDimensions(v,scope)&&(!campaignId||v.campaignId===campaignId)),people=new Map(cohort.map(v=>[v.visitorId,v]));
 const events=eventSource.filter(e=>e.status==="Approved"&&e.date<=scope.to&&A.matchesDimensions(e,scope)&&(!campaignId||e.campaignId===campaignId)&&people.has(e.visitorId)&&Date.parse(e.time)>=Date.parse(people.get(e.visitorId)!.time));
 const registrations=new Map<string,number>();for(const e of events)if(e.type==="Register"){const time=Date.parse(e.time);registrations.set(e.visitorId,Math.min(time,registrations.get(e.visitorId)??Infinity))}
 const ftd=new Set(events.filter(e=>e.type==="FTD"&&registrations.has(e.visitorId)&&Date.parse(e.time)>=registrations.get(e.visitorId)!).map(e=>e.visitorId)).size;
 return {visitors:people.size,registered:registrations.size,ftd,registrationRate:people.size?registrations.size/people.size*100:0,depositRate:registrations.size?ftd/registrations.size*100:0,completionRate:people.size?ftd/people.size*100:0};
}

