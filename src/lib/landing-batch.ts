import {validLandingURL,type LandingPage} from "./landing-pages";
export type LandingDraft=Pick<LandingPage,"name"|"url"|"campaignId"|"status">;
export function validateLandingBatch(rows:readonly LandingDraft[],existing:readonly LandingPage[],campaignIds:readonly string[]):{index:number;message:string}|null{
 if(!rows.length||rows.length>50)return {index:0,message:"Add between 1 and 50 landing pages."};
 const seen=new Set(existing.filter(p=>validLandingURL(p.url)).map(p=>p.campaignId+"\0"+new URL(p.url).toString()));
 for(let i=0;i<rows.length;i++){const r=rows[i];if(!r.name.trim()||r.name.trim().length>80||!validLandingURL(r.url.trim())||!campaignIds.includes(r.campaignId)||!["Active","Disabled"].includes(r.status))return {index:i,message:"Enter a name up to 80 characters, an HTTP(S) URL and an existing campaign."};const key=r.campaignId+"\0"+new URL(r.url.trim()).toString();if(seen.has(key))return {index:i,message:"This URL already exists in the selected campaign or in this batch."};seen.add(key)}return null;
}
