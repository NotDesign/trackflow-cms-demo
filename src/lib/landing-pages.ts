export type LandingPage={id:string;name:string;url:string;campaignId:string;status:"Active"|"Disabled";created:string};
export const UNASSIGNED_LANDING="unassigned";
export const seedLandingPages:LandingPage[]=Array.from({length:6},(_,i)=>({id:`LP-${1001+i}`,name:["Autumn welcome","Search offer","Creator welcome","Discovery page","Taiwan growth page","Weekend offer"][i],url:`https://pages.example.com/welcome-${i+1}`,campaignId:`CMP-${1001+i}`,status:"Active",created:"2026-08-17"}));
export function landingForCampaign(campaignId:string){return seedLandingPages.find(p=>p.campaignId===campaignId)?.id||UNASSIGNED_LANDING}
export function validLandingURL(value:string){try{const u=new URL(value);return ["http:","https:"].includes(u.protocol)&&!u.username&&!u.password}catch{return false}}
export function landingLinkError(page:LandingPage|undefined,campaignId:string){return !page||page.status!=="Active"||page.campaignId!==campaignId}

export function sameLandingDestination(a:string,b:string){try{const clean=(value:string)=>{const u=new URL(value);for(const key of ["utm_source","utm_medium","utm_campaign","utm_content"])u.searchParams.delete(key);return u.toString()};return clean(a)===clean(b)}catch{return false}}
