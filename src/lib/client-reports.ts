import * as A from "./analytics";
export const clientMetrics=["clicks","unique","register","ftd","cvr","revenue"] as const;
export type ClientMetric=typeof clientMetrics[number];
export const clientMetricLabels:Record<ClientMetric,string>={clicks:"Clicks",unique:"Unique visitors",register:"Registrations",ftd:"FTD",cvr:"CVR",revenue:"Revenue"};
export const clientGroups={campaign:"Campaign",platform:"Ad platform",trafficType:"Traffic type",source:"Actual traffic source",country:"Country",day:"Date"};
export type ClientGroup=keyof typeof clientGroups;
export type ReportConfig={client:string;title:string;brand:string;note:string;locale:"zh-TW"|"en";scope:A.Scope;group:ClientGroup;metrics:ClientMetric[]};
export type ClientRow={name:string;values:Partial<Record<ClientMetric,number>>};
export type ClientSnapshot={id:string;created:string;config:ReportConfig;scopeLabels:string[];rows:ClientRow[];total:ClientRow;demo:true};
export function validReportConfig(c:ReportConfig){return !!c.client.trim()&&c.client.trim().length<=80&&!!c.title.trim()&&c.title.trim().length<=100&&!!c.brand.trim()&&c.brand.trim().length<=60&&c.note.length<=600&&["zh-TW","en"].includes(c.locale)&&Object.hasOwn(clientGroups,c.group)&&c.metrics.length>0&&c.metrics.length<=5&&new Set(c.metrics).size===c.metrics.length&&c.metrics.every(k=>clientMetrics.includes(k))&&A.validDate(c.scope.from)&&A.validDate(c.scope.to)&&c.scope.from<=c.scope.to&&c.scope.from>=A.DEMO_START&&c.scope.to<=A.DEMO_TODAY}
export function clientValue(key:ClientMetric,value:number,locale:"zh-TW"|"en"){return key==="revenue"?new Intl.NumberFormat(locale,{style:"currency",currency:"USD"}).format(value):key==="cvr"?value.toFixed(2)+"%":new Intl.NumberFormat(locale).format(value)}
export function makeClientSnapshot(c:ReportConfig,visits:readonly A.Visit[],events:readonly A.Event[],names:Record<string,string>,scopeLabels:string[],label:(s:string)=>string,id:string,created:string):ClientSnapshot{
 if(!validReportConfig(c))throw Error("Invalid customer report configuration");
 const config=JSON.parse(JSON.stringify({...c,client:c.client.trim(),title:c.title.trim(),brand:c.brand.trim(),note:c.note.trim()})) as ReportConfig;
 const v=A.inScope(visits,c.scope),e=A.inScope(events,c.scope),dimension={campaign:"campaignId",platform:"platform",trafficType:"trafficType",source:"source",country:"country",day:"date"} as const;
 const values=(m:A.Metrics)=>Object.fromEntries(c.metrics.map(k=>[k,m[k]]));
 const rows=A.groupRows(v,e,dimension[c.group],names).map(row=>({name:label(row.name),values:values(row)}));
 if(c.group==="day")rows.sort((a,b)=>a.name.localeCompare(b.name));
 // Never retain visits, conversion records, commissions, IPs or email addresses in the customer payload.
 return {id,created,config,scopeLabels:[...scopeLabels],rows,total:{name:label("Selected scope total"),values:values(A.metrics(v,e))},demo:true};
}
