import * as A from './analytics';
export type Destination='Website'|'App Store'|'Google Play';
export type RedirectAttempt=A.Dimensions&{id:string;requestId:string;visitId:string;time:string;date:string;target:string;destination:Destination;httpStatus:number;enabled:boolean;isTest:boolean;externalCampaignId:string;externalAdId:string};
export type RedirectRecord=RedirectAttempt&{result:'success'|'duplicate'|'blocked';reason:string};
export type FlowVisit=A.Visit&{platform:string;trafficType:string;spend:number};
export type FlowMetrics={visits:number;attempts:number;success:number;successfulVisits:number;rate:number;spend:number;cost:number;excluded:number;web:number;ios:number;android:number};
export const ZERO_FLOW:FlowMetrics={visits:0,attempts:0,success:0,successfulVisits:0,rate:0,spend:0,cost:0,excluded:0,web:0,ios:0,android:0};
export const destinationLabels:Record<Destination,string>={Website:'指定網站','App Store':'App Store','Google Play':'Google Play'};
export function validRedirectTarget(value:string){try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password}catch{return false}}
/** This validates a simulated redirect response, never destination-page loading. */
export function evaluateRedirects(attempts:readonly RedirectAttempt[]):RedirectRecord[]{
 const seen=new Set<string>();return attempts.map(a=>{
  const key=(a.isTest?'test:':'live:')+a.requestId;
  if(!a.requestId.trim()||!a.enabled||!validRedirectTarget(a.target)||![302,303,307,308].includes(a.httpStatus))return {...a,result:'blocked',reason:!a.requestId.trim()?'缺少 request_id':!a.enabled?'連結已停用':!validRedirectTarget(a.target)?'目的地網址無效':'尚未完成有效轉址'};
  if(seen.has(key))return {...a,result:'duplicate',reason:'相同 request_id 已計算，排除重送'};
  seen.add(key);return {...a,result:'success',reason:'追蹤服務已完成有效轉址；不代表目的頁已載入'};
 });
}
function classify(v:A.Visit,i:number):FlowVisit{
 const n=i%10,platform=n<4?'Google Ads':n<8?'Meta Ads':n===8?'Not applicable':'Not applicable',source=n<4?'Google':n<6?'Facebook':n<8?'Instagram':n===8?'Google':'Direct',trafficType=n<8?'Paid':n===8?'Organic':'Direct';
 return {...v,platform,source,trafficType,spend:n<8?(12+i%29)/100:0};
}
export const flowVisits:FlowVisit[]=A.allVisits.map(classify);
export const destinationForLink=(id:string):Destination=>(['Website','App Store','Google Play'] as const)[Math.max(0,A.seedLinks.findIndex(l=>l.id===id))%3];
const attempts:RedirectAttempt[]=[];
flowVisits.forEach((v,i)=>{
 if(i%7===0)return;const destination=destinationForLink(v.linkId),target=destination==='Website'?'https://play.example.com/game':destination==='App Store'?'https://apps.apple.com/app/id1517783697':'https://play.google.com/store/apps/details?id=com.miHoYo.GenshinImpact';
 const a:RedirectAttempt={id:'RD-'+String(i+1).padStart(6,'0'),requestId:'REQ-'+v.id,visitId:v.id,time:new Date(Date.parse(v.time)+15000).toISOString(),date:v.date,campaignId:v.campaignId,linkId:v.linkId,creativeId:v.creativeId,affiliateId:v.affiliateId,landingPageId:v.landingPageId,country:v.country,source:v.source,platform:v.platform,trafficType:v.trafficType,device:v.device,target,destination,httpStatus:i%19===0?400:302,enabled:i%31!==0,isTest:false,externalCampaignId:v.platform==='Google Ads'?'G-'+v.campaignId:v.platform==='Meta Ads'?'M-'+v.campaignId:'',externalAdId:v.trafficType==='Paid'?'AD-'+v.linkId:''};
 attempts.push(a);if(i%17===0)attempts.push({...a,id:a.id+'-retry',time:new Date(Date.parse(a.time)+500).toISOString()});
});
export const flowRecords=evaluateRedirects(attempts);
export function flowMetrics(visits:readonly FlowVisit[],records:readonly RedirectRecord[]):FlowMetrics{
 const counted=records.filter(r=>!r.isTest),ok=counted.filter(r=>r.result==='success'),visitIds=new Set(visits.map(v=>v.id)),successfulVisits=new Set(ok.filter(r=>visitIds.has(r.visitId)).map(r=>r.visitId)).size,spend=Math.round(visits.reduce((n,v)=>n+v.spend,0)*100)/100;
 return {visits:visits.length,attempts:counted.length,success:ok.length,successfulVisits,rate:visits.length?successfulVisits/visits.length*100:0,spend,cost:ok.length?spend/ok.length:0,excluded:counted.filter(r=>r.result!=='success').length,web:ok.filter(r=>r.destination==='Website').length,ios:ok.filter(r=>r.destination==='App Store').length,android:ok.filter(r=>r.destination==='Google Play').length};
}
export function scopeFlow(scope:A.Scope,dimension:Partial<A.Dimensions>={}){
 const match=(r:A.Dimensions&{date:string})=>A.inScope([r],scope).length>0&&Object.entries(dimension).every(([k,v])=>!v||r[k as keyof A.Dimensions]===v);
 const visits=flowVisits.filter(match),records=flowRecords.filter(match);return {visits,records,total:flowMetrics(visits,records)};
}
export function groupFlow(visits:readonly FlowVisit[],records:readonly RedirectRecord[],key:'platform'|'source'|'trafficType'|'destination'|'country'|'campaignId'|'linkId'|'landingPageId'|'date',names:Record<string,string>={}){
 const keys=key==='destination'?(['Website','App Store','Google Play'] as const):[...new Set([...visits,...records].map(r=>String(r[key as keyof typeof r]||'unassigned')))];
 return keys.map(id=>{const rs=records.filter(r=>String(r[key as keyof RedirectRecord])===id),vs=key==='destination'?visits.filter(v=>destinationForLink(v.linkId)===id):visits.filter(v=>String(v[key as keyof FlowVisit]||'unassigned')===id);return {id,name:names[id]||(destinationLabels as Record<string,string>)[id]||({Paid:'付費流量',Organic:'自然流量',Direct:'直接流量',Referral:'推薦流量','Not applicable':'不適用',Unclassified:'未分類'} as Record<string,string>)[id]||id,...flowMetrics(vs,rs)}}).sort((a,b)=>b.success-a.success);
}
export const PLATFORM_DEFAULTS={
 'Google Ads':{account:'Google Ads 示範帳戶 · 123-456-7890',source:'Google',campaign:'G-CMP-1001',event:'tf_redirect_success',parameters:'utm_source=google&utm_medium=cpc&ad_campaign_id={campaignid}&ad_id={creative}',identifiers:'gclid／gbraid／wbraid（保留實際收到的值）'},
 'Meta Ads':{account:'Meta Ads 示範帳戶 · act_120000000001',source:'動態辨識 Facebook／Instagram',campaign:'M-CMP-1001',event:'tf_redirect_success',parameters:'utm_source={{site_source_name}}&utm_medium=paid_social&ad_campaign_id={{campaign.id}}&ad_id={{ad.id}}',identifiers:'fbclid（如有）／內部 request_id'}
} as const;
export type AdPlatform=keyof typeof PLATFORM_DEFAULTS;
export type PlatformSettings={platform:AdPlatform;account:string;status:'未設定'|'示範已設定';destination:'網站與 App 商店'|'指定網站'|'App 商店';campaignId:string;eventName:string;dedupe:true;measurement:'redirect_response';updatedAt:string};
export function defaultPlatform(platform:AdPlatform):PlatformSettings{return {platform,account:PLATFORM_DEFAULTS[platform].account,status:'未設定',destination:'網站與 App 商店',campaignId:'',eventName:'tf_redirect_success',dedupe:true,measurement:'redirect_response',updatedAt:''}}
export function buildAdURL(target:string,platform:AdPlatform,campaignId:string){if(!validRedirectTarget(target))return '';const u=new URL(target);u.searchParams.set('utm_source',platform==='Google Ads'?'google':'{{site_source_name}}');u.searchParams.set('utm_medium',platform==='Google Ads'?'cpc':'paid_social');u.searchParams.set('tf_campaign',campaignId);u.searchParams.set('tf_platform',platform==='Google Ads'?'google':'meta');u.searchParams.set('ad_campaign_id',platform==='Google Ads'?'{campaignid}':'{{campaign.id}}');u.searchParams.set('ad_id',platform==='Google Ads'?'{creative}':'{{ad.id}}');return u.toString().replace(/%7B/gi,'{').replace(/%7D/gi,'}')}
