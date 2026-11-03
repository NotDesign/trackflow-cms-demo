"use client";
import {datePresets,type DateRange} from "@/lib/date-presets";
import {DEMO_TODAY} from "@/lib/analytics";
import {useLocale} from "./localization";
export function DateRangePresets({value,onChange,disabled=false,showNote=true}:{value:DateRange;onChange:(range:DateRange)=>void;disabled?:boolean;showNote?:boolean}){
 const {locale}=useLocale(),zh=locale==="zh-TW";
 return <div className="cms-date-presets"><div role="group" aria-label={zh?"日期快速篩選":"Quick date filters"} className="cms-date-preset-options">{datePresets().map(p=><button type="button" key={p.id} disabled={disabled} aria-pressed={value.from===p.from&&value.to===p.to} onClick={()=>onChange({from:p.from,to:p.to})}>{zh?p.zh:p.en}</button>)}</div>{showNote&&<p className="demo-note">{zh?`以示範資料最新日期 ${DEMO_TODAY.replaceAll("-","/")} 為基準；每週從週一開始。`:`Based on the demo date ${DEMO_TODAY}; weeks start on Monday.`}</p>}</div>;
}
