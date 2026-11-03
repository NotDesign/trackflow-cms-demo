// IANA zone snapshot and Traditional Chinese city names from Unicode CLDR.
// Sources: https://github.com/eggert/tz/blob/main/zone.tab
// https://github.com/unicode-org/cldr-json (see timezones.LICENSE.txt).
import data from "./timezones-data.json";
export type TimeZoneChoice={id:string;zh:string;en:string;region:string;country:string};
export const TIME_ZONE_REGIONS=[
 {id:"UTC",zh:"世界標準時間",en:"Coordinated Universal Time"},
 {id:"Asia",zh:"亞洲",en:"Asia"},{id:"Europe",zh:"歐洲",en:"Europe"},
 {id:"America",zh:"美洲",en:"Americas"},{id:"Africa",zh:"非洲",en:"Africa"},
 {id:"Australia",zh:"澳洲",en:"Australia"},{id:"Pacific",zh:"太平洋",en:"Pacific"},
 {id:"Atlantic",zh:"大西洋",en:"Atlantic"},{id:"Indian",zh:"印度洋",en:"Indian Ocean"},
 {id:"Antarctica",zh:"南極洲",en:"Antarctica"},{id:"Arctic",zh:"北極",en:"Arctic"},
 {id:"Other",zh:"其他時區",en:"Other time zones"},
];
function validZone(value:unknown):value is string{
 if(typeof value!=="string"||!value||/^[+-]/.test(value))return false;
 try{new Intl.DateTimeFormat("en",{timeZone:value});return true}catch{return false}
}
export function normalizeTimeZone(value:unknown):string{if(!validZone(value))return "Asia/Taipei";const key=canonicalZone(value);return primaryIds.get(key)||value}
export function timeZoneChoice(id:string):TimeZoneChoice{
 const metadata=(data as Record<string,string[]>)[id];
 const english=id==="UTC"?"UTC":id.split("/").slice(1).join(" / ").replaceAll("_"," ")||id;
 return {id,zh:id==="UTC"?"世界標準時間":metadata?.[0]||english,en:english,region:id==="UTC"?"UTC":TIME_ZONE_REGIONS.some(r=>r.id===id.split("/")[0])?id.split("/")[0]:"Other",country:metadata?.[1]||""};
}
function browserTimeZones():string[]{try{return (Intl as typeof Intl&{supportedValuesOf?:(key:string)=>string[]}).supportedValuesOf?.("timeZone")||[]}catch{return []}}
// Bundled fallback also covers browsers without supportedValuesOf; validate against their tzdb.
function canonicalZone(id:string):string{return new Intl.DateTimeFormat("en",{timeZone:id}).resolvedOptions().timeZone}
const zoneIds=[...new Set(["UTC",...Object.keys(data).filter(id=>(data as Record<string,string[]>)[id][2]==="1"),...Object.keys(data),...browserTimeZones()])].filter(validZone);
const primaryIds=new Map<string,string>();for(const id of zoneIds){const key=canonicalZone(id);if(!primaryIds.has(key))primaryIds.set(key,id)}
export const TIME_ZONES=[...primaryIds.values()].sort().map(timeZoneChoice);
const offsetFormatters=new Map<string,Intl.DateTimeFormat>();
export function timeZoneOffset(zone:string,date=new Date()):string{
 let formatter=offsetFormatters.get(zone);if(!formatter){formatter=new Intl.DateTimeFormat("en",{timeZone:zone,timeZoneName:"longOffset"});offsetFormatters.set(zone,formatter)}
 const name=formatter.formatToParts(date).find(p=>p.type==="timeZoneName")?.value||"GMT";
 return name==="GMT"?"UTC+00:00":name.replace("GMT","UTC");
}
export function timeZoneClock(date:Date,zone:string,locale:string){
 const language=locale==="zh-TW"?"zh-TW":"en-GB";
 return {date:new Intl.DateTimeFormat(language,{timeZone:zone,year:"numeric",month:"2-digit",day:"2-digit"}).format(date),time:new Intl.DateTimeFormat(language,{timeZone:zone,hour:"2-digit",minute:"2-digit",second:"2-digit",hourCycle:"h23"}).format(date),offset:timeZoneOffset(zone,date)};
}
export function timeZoneCountry(zone:TimeZoneChoice,locale:string):string{
 if(!zone.country)return "";
 try{return new Intl.DisplayNames([locale==="zh-TW"?"zh-Hant":"en"],{type:"region"}).of(zone.country)||zone.country}catch{return zone.country}
}
export function filterTimeZones<T extends TimeZoneChoice&{offset:string;countryLabel:string;countryEnglish:string}>(zones:T[],query:string):T[]{
 const simplify=(s:string)=>s.toLowerCase().replace(/臺/g,"台").replace(/[_\s/−–]/g,"");
 const terms=query.trim().split(/\s+/).map(simplify).filter(Boolean);
 return zones.filter(z=>{const haystack=simplify([z.id,z.zh,z.en,z.region,z.country,z.countryLabel,z.countryEnglish,z.offset].join(" "));return terms.every(t=>haystack.includes(t))});
}
