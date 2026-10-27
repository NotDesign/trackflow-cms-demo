import * as A from "./analytics";
import * as O from "./operations";

export type CampaignInsight=A.Campaign&A.Metrics&{
 markets:string;rpc:number;previousRevenue:number;revenueDifference:number;revenueChange:number|null;
 previousClicks:number;issues:number;signal:string;needsReview:boolean;reasons:string[];
};
export function campaignInsights(campaigns:readonly A.Campaign[],links:readonly A.TrackingLink[],visits:readonly A.Visit[],events:readonly A.Event[],previousVisits:readonly A.Visit[],previousEvents:readonly A.Event[],scope:A.Scope):CampaignInsight[]{
 const portfolio=A.metrics(visits,events);
 const relatedLinks=links.filter(l=>(!scope.campaign||l.campaignId===scope.campaign)&&(!scope.country||l.country===scope.country)&&(!scope.source||l.source===scope.source)&&(!scope.creative||l.creativeId===scope.creative)&&(!scope.affiliate||l.affiliateId===scope.affiliate)&&(!scope.device||visits.some(v=>v.linkId===l.id))&&(!scope.landing||l.landingPageId===scope.landing||visits.some(v=>v.linkId===l.id)));
 const health=O.healthFindings(relatedLinks);
 return campaigns.filter(c=>(!scope.campaign||c.id===scope.campaign)).map(c=>{
  const mine=visits.filter(v=>v.campaignId===c.id),current=A.metrics(mine,events.filter(e=>e.campaignId===c.id));
  const before=A.metrics(previousVisits.filter(v=>v.campaignId===c.id),previousEvents.filter(e=>e.campaignId===c.id));
  const issues=health.filter(h=>relatedLinks.find(l=>l.id===h.linkId)?.campaignId===c.id).length;
  const revenueChange=before.revenue>0?(current.revenue-before.revenue)/before.revenue*100:null;
  const reasons:string[]=[];
  if(c.status==="Active"){
   if(issues)reasons.push("Simulated link issues exist for this campaign.");
   if(current.clicks>=100&&current.ftd===0)reasons.push("At least 100 clicks with no approved first deposit.");
   else if(current.clicks>=100&&portfolio.cvr>0&&current.cvr<portfolio.cvr*.8)reasons.push("CVR is over 20% below the current portfolio reference.");
   if(current.clicks>=100&&before.clicks>=100&&revenueChange!==null&&revenueChange<=-15)reasons.push("Approved revenue fell at least 15% versus the previous equal period.");
  }
  const needsReview=reasons.length>0;
  const signal=c.status!=="Active"?"Inactive":needsReview?"Review needed":current.clicks===0?"No activity":current.clicks<100?"Learning":portfolio.epc>0&&current.epc>=portfolio.epc*1.1?"Above reference":"Within reference";
  return {...c,...current,markets:[...new Set(mine.map(v=>v.country))].join(", ")||c.country,rpc:current.clicks?current.revenue/current.clicks:0,previousRevenue:before.revenue,revenueDifference:current.revenue-before.revenue,revenueChange,previousClicks:before.clicks,issues,signal,needsReview,reasons,related:relatedLinks.some(l=>l.campaignId===c.id)};
 }).filter(c=>(!scope.country&&!scope.source&&!scope.creative&&!scope.affiliate&&!scope.device&&!scope.landing||c.related||c.clicks>0)&&(!scope.device||c.clicks>0));
}

export function revenueDrivers(visits:readonly A.Visit[],events:readonly A.Event[],dimension:"source"|"country"|"affiliateId"|"landingPageId",metric:"revenue"|"commission"){
 const total=A.metrics(visits,events)[metric];
 return A.groupRows(visits,events,dimension).sort((a,b)=>b[metric]-a[metric]||a.id.localeCompare(b.id)).map(row=>({...row,share:total?row[metric]/total*100:0}));
}
