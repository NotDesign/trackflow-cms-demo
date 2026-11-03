export const TIME_ZONES=[
 {id:"Asia/Taipei",zh:"台北",en:"Taipei"},
 {id:"Asia/Hong_Kong",zh:"香港",en:"Hong Kong"},
 {id:"Asia/Tokyo",zh:"東京",en:"Tokyo"},
 {id:"Asia/Bangkok",zh:"曼谷",en:"Bangkok"},
 {id:"Asia/Singapore",zh:"新加坡",en:"Singapore"},
 {id:"UTC",zh:"世界標準時間",en:"UTC"},
] as const;
export function normalizeTimeZone(value:unknown):string{return TIME_ZONES.some(z=>z.id===value)?String(value):"Asia/Taipei"}
export function timeZoneOffset(zone:string,date=new Date()):string{
 const name=new Intl.DateTimeFormat("en",{timeZone:zone,timeZoneName:"longOffset"}).formatToParts(date).find(p=>p.type==="timeZoneName")?.value||"GMT";
 return name==="GMT"?"UTC+00:00":name.replace("GMT","UTC");
}
export function timeZoneClock(date:Date,zone:string,locale:string){
 const language=locale==="zh-TW"?"zh-TW":"en-GB";
 return {date:new Intl.DateTimeFormat(language,{timeZone:zone,year:"numeric",month:"2-digit",day:"2-digit"}).format(date),time:new Intl.DateTimeFormat(language,{timeZone:zone,hour:"2-digit",minute:"2-digit",second:"2-digit",hourCycle:"h23"}).format(date),offset:timeZoneOffset(zone,date)};
}
