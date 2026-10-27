/** Keep campaign plans separate from the classification recorded on each visit. */
export const adPlatforms=["Google Ads","Meta Ads","TikTok Ads","X Ads","Other Ads"] as const;
export const platforms=[...adPlatforms,"Not applicable","Unclassified"];
export const trafficTypes=["Paid","Organic","Direct","Referral","Unclassified"] as const;
export type TrafficType=typeof trafficTypes[number];
export const trafficSources=["Google","Facebook","Instagram","TikTok","Telegram","X (Twitter)","Direct","Search engine (unspecified)","Other","Unknown"];
export type TrafficInput={source:string;platform?:string;trafficType?:string;medium?:string;destination?:string};
export function canonicalSource(source:string){return source==="SEO"?"Search engine (unspecified)":source||"Unknown"}
export function platformForSource(source:string){return source==="Google"?"Google Ads":["Facebook","Instagram"].includes(source)?"Meta Ads":source==="TikTok"?"TikTok Ads":source==="X (Twitter)"?"X Ads":"Other Ads"}
export function utmSource(source:string){return ({Google:"google",Facebook:"facebook",Instagram:"instagram",TikTok:"tiktok",Telegram:"telegram","X (Twitter)":"x",Direct:"direct",Other:"other"} as Record<string,string>)[source]||""}
export function utmMedium(type:string,platform:string){return type==="Paid"?(platform==="Google Ads"?"cpc":["Meta Ads","TikTok Ads","X Ads"].includes(platform)?"paid_social":"paid"):type==="Organic"?"organic":type==="Direct"?"(none)":type==="Referral"?"referral":""}
export function normalizeTraffic(input:TrafficInput){
 let medium=input.medium||"";if(!medium&&input.destination){try{medium=new URL(input.destination).searchParams.get("utm_medium")||""}catch{}}
 const source=canonicalSource(input.source),m=medium.toLowerCase();
 const explicit=trafficTypes.includes(input.trafficType as TrafficType)?input.trafficType as TrafficType:undefined;
 const trafficType:TrafficType=explicit||(["cpc","ppc","paid","paid_social","paid_search","display","cpm"].includes(m)?"Paid":m==="organic"||input.source==="SEO"?"Organic":m==="referral"?"Referral":source==="Direct"?"Direct":"Unclassified");
 const platform=trafficType==="Paid"?(adPlatforms.includes(input.platform as typeof adPlatforms[number])?input.platform!:platformForSource(source)):trafficType==="Unclassified"?"Unclassified":"Not applicable";
 return {source,trafficType,platform};
}
export function normalizePlatforms(value:unknown):string[]{return Array.isArray(value)?[...new Set(value.filter((v):v is string=>typeof v==="string"&&adPlatforms.includes(v as typeof adPlatforms[number])))]:[]}
export function validTraffic(input:TrafficInput){const t=normalizeTraffic(input);return trafficSources.includes(input.source)&&trafficTypes.includes(input.trafficType as TrafficType)&&platforms.includes(input.platform||"")&&t.trafficType===input.trafficType&&t.platform===input.platform&&(t.trafficType!=="Paid"||t.platform===platformForSource(t.source))&&(t.trafficType!=="Direct"||t.source==="Direct")&&(t.source!=="Direct"||t.trafficType==="Direct");}
export function trafficMatches(row:TrafficInput,scope:{source?:string;platform?:string;trafficType?:string}){const t=normalizeTraffic(row);return (!scope.source||t.source===canonicalSource(scope.source))&&(!scope.platform||scope.platform.split("|").includes(t.platform))&&(!scope.trafficType||t.trafficType===scope.trafficType)}
