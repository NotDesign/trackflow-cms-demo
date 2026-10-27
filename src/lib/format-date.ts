export function formatTaipeiDate(value:string,locale:string,withTime=false){
 const parts=new Intl.DateTimeFormat("en-US",{year:"numeric",month:"2-digit",day:"2-digit",...(withTime?{hour:"2-digit",minute:"2-digit",hourCycle:"h23" as const}:{}),timeZone:"Asia/Taipei"}).formatToParts(new Date(value.includes("T")?value:value+"T00:00:00+08:00"));
 const values=Object.fromEntries(parts.map(p=>[p.type,p.value]));
 const date=locale==="zh-TW"?`${values.year}/${values.month}/${values.day}`:`${values.month}/${values.day}/${values.year}`;
 return date+(withTime?` ${values.hour}:${values.minute}`:"");
}
