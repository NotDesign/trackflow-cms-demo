import {landingForCampaign,seedLandingPages,UNASSIGNED_LANDING} from "./landing-pages";
import {normalizeTraffic,trafficMatches,trafficSources,canonicalSource} from "./traffic";
export {adPlatforms,platforms,trafficTypes,normalizeTraffic,normalizePlatforms,canonicalSource,trafficMatches} from "./traffic";
import * as catalog from "./mock-data";

export const DEMO_TODAY = "2026-10-16";
export const DEMO_START = "2026-08-18";
export const DAY = 86_400_000;
export type Scope = {landing?:string;platform?:string;trafficType?:string;from:string;to:string;country:string;source:string;campaign:string;creative:string;device:string;affiliate:string};
export const DEFAULT_SCOPE:Scope={platform:"",trafficType:"",landing:"",from:"2026-09-17",to:DEMO_TODAY,country:"",source:"",campaign:"",creative:"",device:"",affiliate:""};
export type Dimensions={platform?:string;trafficType?:string;landingPageId?:string;campaignId:string;linkId:string;creativeId:string;affiliateId:string;country:string;source:string;device:string};
export type Visit=Dimensions & {id:string;visitorId:string;time:string;date:string;clicks:number;duration:number;isNew:boolean;browser:string;os:string;city:string;region:string;timezone:string;language:string;ip:string;landing:string;ctaClicks?:number};
export type Event=Dimensions & {id:string;visitorId:string;visitId:string;time:string;date:string;type:"Register"|"FTD"|"Deposit"|"Revenue";amount:number;revenue:number;commission:number;status:"Approved"|"Pending"|"Rejected"};
export type Metrics={clicks:number;unique:number;register:number;ftd:number;deposits:number;revenue:number;commission:number;cvr:number;epc:number};
export type Campaign=catalog.Campaign & {gameId?:string;platforms?:string[]};
export type TrackingLink=catalog.TrackingLink & {campaignId?:string;creativeId?:string;affiliateId?:string;landingPageId?:string;platform?:string;trafficType?:string};
export type Creative=catalog.Creative & {campaignId?:string;created?:string};
export const seedCampaigns:Campaign[]=catalog.campaigns.map((c,i)=>({...c,platforms:[],created:`2026-08-${String(i+1).padStart(2,"0")}`}));
export const seedCreatives:Creative[]=catalog.creatives.map((c,i)=>({...c,campaignId:seedCampaigns[i].id,created:"2026-08-10"}));
export const seedLinks:TrackingLink[]=catalog.trackingLinks.map((l,i)=>({...l,...normalizeTraffic(l),campaignId:seedCampaigns[i%12].id,creativeId:seedCreatives[i%12].id,creative:seedCreatives[i%12].name,affiliateId:catalog.affiliates[i%8].id,landingPageId:landingForCampaign(seedCampaigns[i%12].id),destination:seedLandingPages.find(p=>p.campaignId===seedCampaigns[i%12].id)?.url||l.destination,created:"2026-08-17"}));
export const affiliates=catalog.affiliates;
export const countries=catalog.countries;
export const sources=trafficSources;
export const brands=catalog.brands;
export const flags=catalog.flags;
export function shiftDate(date:string,days:number){return new Date(Date.parse(date+"T00:00:00Z")+days*DAY).toISOString().slice(0,10)}
export function daysBetween(from:string,to:string){return Math.round((Date.parse(to+"T00:00:00Z")-Date.parse(from+"T00:00:00Z"))/DAY)+1}
export function dates(scope:Pick<Scope,"from"|"to">){return Array.from({length:Math.max(0,daysBetween(scope.from,scope.to))},(_,i)=>shiftDate(scope.from,i))}
export function previousScope(scope:Scope):Scope {const days=daysBetween(scope.from,scope.to);return {...scope,from:shiftDate(scope.from,-days),to:shiftDate(scope.from,-1)}}
export function validDate(value:string){return /^\d{4}-\d{2}-\d{2}$/.test(value)&&!Number.isNaN(Date.parse(value))&&new Date(value+"T00:00:00Z").toISOString().slice(0,10)===value}
export function readScope(params:URLSearchParams):Scope {const scope={...DEFAULT_SCOPE};for(const key of Object.keys(scope) as (keyof Scope)[]){if(params.has(key))scope[key]=params.get(key)||""}scope.source=canonicalSource(scope.source)==="Unknown"&&!scope.source?"":canonicalSource(scope.source);if(!validDate(scope.from)||!validDate(scope.to)||scope.from>scope.to||scope.from<DEMO_START||scope.to>DEMO_TODAY)return {...scope,from:DEFAULT_SCOPE.from,to:DEFAULT_SCOPE.to};return scope}
export function scopeURL(path:string,scope:Scope,extra:Record<string,string>={}){const params=new URLSearchParams();for(const [key,value] of Object.entries(scope))if(value)params.set(key,value);for(const [key,value] of Object.entries(extra))if(value)params.set(key,value);return path+"?"+params.toString()}
export function matchesDimensions(row:Dimensions,scope:Scope){return (!scope.landing||(row.landingPageId||UNASSIGNED_LANDING)===scope.landing)&&(!scope.country||row.country===scope.country)&&trafficMatches(row,scope)&&(!scope.campaign||row.campaignId===scope.campaign)&&(!scope.creative||row.creativeId===scope.creative)&&(!scope.device||row.device===scope.device)&&(!scope.affiliate||row.affiliateId===scope.affiliate)}
export function inScope<T extends Dimensions&{date:string}>(data:readonly T[],scope:Scope){return data.filter(row=>row.date>=scope.from&&row.date<=scope.to&&matchesDimensions(row,scope))}
export function metrics(visits:readonly Visit[],events:readonly Event[]):Metrics {
 const approved=events.filter(e=>e.status==="Approved");
 const clicks=visits.reduce((sum,v)=>sum+v.clicks,0),ftd=approved.filter(e=>e.type==="FTD").length;
 const revenue=Math.round(approved.reduce((sum,e)=>sum+e.revenue,0)*100)/100,commission=Math.round(approved.reduce((sum,e)=>sum+e.commission,0)*100)/100;
 return {clicks,unique:new Set(visits.map(v=>v.visitorId)).size,register:approved.filter(e=>e.type==="Register").length,ftd,deposits:approved.filter(e=>e.type==="FTD"||e.type==="Deposit").reduce((sum,e)=>sum+e.amount,0),revenue,commission,cvr:clicks?ftd/clicks*100:0,epc:clicks?commission/clicks:0};
}
export function change(current:number,previous:number){return previous?{value:(current-previous)/previous*100,label:`${current>=previous?"+":""}${((current-previous)/previous*100).toFixed(1)}%`}:{value:0,label:current?"New data":"—"}}
function generate(){
 const visits:Visit[]=[],events:Event[]=[],people:Visit[]=[];let counter=0;
 for(let d=0;d<60;d++){const date=shiftDate(DEMO_START,d);for(let j=0;j<72+Math.floor(d/2);j++){
 const link=seedLinks[(d*37+j*7+Math.floor(j/11))%24];const c=seedCampaigns.find(c=>c.id===link.campaignId)!;if(c.status==="Draft"||(c.status==="Ended"&&d>=53)||(c.status==="Paused"&&d>=57)||(link.status==="Disabled"&&d>=58))continue;const returned=j%6===1&&people.length>20;const person=returned?people[(d*13+j*3)%people.length]:undefined;
 const visitorId=person?.visitorId||`VIS-${String(++counter).padStart(6,"0")}`;
 const country=link.country,ci=countries.indexOf(country),device=(d+j)%3===0?"Desktop":"Mobile",minute=(j*7+d)%60,hour=8+Math.floor(j/8)%13;
 const time=`${date}T${String(hour).padStart(2,"0")}:${String(minute).padStart(2,"0")}:00+08:00`;
 const v:Visit={id:`SESSION-${d}-${j}`,visitorId,date,time,clicks:1+(j+d)%5,duration:35+(j*17+d*11)%285,isNew:!person,campaignId:link.campaignId!,linkId:link.id,creativeId:link.creativeId!,affiliateId:link.affiliateId!,country,source:link.source,platform:link.platform,trafficType:link.trafficType,device,browser:["Chrome","Safari","Firefox"][(j+d)%3],os:device==="Desktop"?"macOS":j%2?"iOS":"Android",city:["Taipei","Bangkok","Ho Chi Minh City","Tokyo","Kuala Lumpur"][ci],region:["Taipei","Bangkok","Ho Chi Minh","Tokyo","Selangor"][ci],timezone:["Asia/Taipei","Asia/Bangkok","Asia/Ho_Chi_Minh","Asia/Tokyo","Asia/Kuala_Lumpur"][ci],language:["zh-TW","th-TH","vi-VN","ja-JP","ms-MY"][ci],ip:`103.xxx.xxx.${24+(counter%200)}`,landingPageId:landingForCampaign(c.id),ctaClicks:landingForCampaign(c.id)===UNASSIGNED_LANDING?0:Number((d+j)%3!==0),landing:seedLandingPages.find(p=>p.campaignId===c.id)?.url||"/welcome/autumn"};
 visits.push(v);if(!person)people.push(v);
 let eventOffset=0; const add=(type:Event["type"],amount=0,status:Event["status"]="Approved",revenue=0,commission=0)=>{const n=events.length;events.push({id:`CV-${302481+n}`,visitorId,visitId:v.id,time:new Date(Date.parse(time)+(++eventOffset)*60000).toISOString(),date,type,amount,revenue,commission,status,landingPageId:v.landingPageId,campaignId:v.campaignId,linkId:v.linkId,creativeId:v.creativeId,affiliateId:v.affiliateId,country:v.country,source:v.source,platform:v.platform,trafficType:v.trafficType,device:v.device})};
 if(!person&&j%4===0){add("Register");if(j%8===0){const amount=100+(d+j)%6*50;add("FTD",amount);const cents=Math.round(amount*32)/100;add("Revenue",0,"Approved",cents,Math.round(cents*20)/100)}}
 if(j%9===2){const amount=75+(d+j)%7*25,status:Event["status"]=j%27===2?"Pending":j%27===11?"Rejected":"Approved";add("Deposit",amount,status);const earned=amount*.28;add("Revenue",0,status,earned,Math.round(earned*20)/100)}
 }}
 return {visits,events};
}
const activity=generate();
export const allVisits=activity.visits;
export const allEvents=activity.events;
export type MetricRow=Metrics&{id:string;name:string};
export function groupRows(visits:readonly Visit[],events:readonly Event[],dimension:"platform"|"trafficType"|"country"|"source"|"campaignId"|"creativeId"|"device"|"affiliateId"|"linkId"|"landingPageId"|"date",names:Record<string,string>={}):MetricRow[]{
 const keyOf=(row:Dimensions&{date:string})=>dimension==="source"||dimension==="platform"||dimension==="trafficType"?normalizeTraffic(row)[dimension]:String(row[dimension]||UNASSIGNED_LANDING);
 const keys=new Set([...visits.map(keyOf),...events.map(keyOf)]);
 return [...keys].map(id=>({id,name:names[id]||id,...metrics(visits.filter(v=>keyOf(v)===id),events.filter(e=>keyOf(e)===id))})).sort((a,b)=>b.clicks-a.clicks);
}
export function timeline(visits:readonly Visit[],events:readonly Event[],scope:Scope){return dates(scope).map(date=>({date,...metrics(visits.filter(v=>v.date===date),events.filter(e=>e.date===date))}))}
export function asOfCreated(created:string,scope:Scope){return created.slice(0,10)>=scope.from&&created.slice(0,10)<=scope.to}

