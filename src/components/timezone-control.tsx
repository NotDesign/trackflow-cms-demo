"use client";
import {useEffect,useState} from "react";
import * as Dropdown from "@radix-ui/react-dropdown-menu";
import {Globe2,ChevronDown,Check} from "lucide-react";
import {TIME_ZONES,normalizeTimeZone,timeZoneClock,timeZoneOffset} from "@/lib/timezones";
import {useWorkspace} from "./workspace";
import {useLocale} from "./localization";

export function TimezoneSetting({value,onChange}:{value:string;onChange:(value:string)=>void}){
 const {locale}=useLocale(),zh=locale==="zh-TW";
 return <label className="field"><span>{zh?"時區":"Time zone"}</span><select aria-label={zh?"時區":"Time zone"} value={normalizeTimeZone(value)} onChange={e=>onChange(e.target.value)}>{TIME_ZONES.map(z=><option key={z.id} value={z.id}>{zh?z.zh:z.en} · {timeZoneOffset(z.id)}</option>)}</select></label>;
}

export function TimezoneControl(){
 const w=useWorkspace(),{locale}=useLocale(),zh=locale==="zh-TW";
 const [zone,setZone]=useState("Asia/Taipei"),[now,setNow]=useState<Date|null>(null);
 useEffect(()=>{const sync=()=>{try{setZone(normalizeTimeZone(JSON.parse(localStorage.getItem(w.accountSettingsKey)||"{}").timezone))}catch{setZone("Asia/Taipei")}};sync();window.addEventListener("trackflow-preferences",sync);window.addEventListener("storage",sync);return()=>{window.removeEventListener("trackflow-preferences",sync);window.removeEventListener("storage",sync)}},[w.accountSettingsKey]);
 useEffect(()=>{const tick=()=>{if(!document.hidden)setNow(new Date())};tick();const timer=window.setInterval(tick,1000);document.addEventListener("visibilitychange",tick);return()=>{window.clearInterval(timer);document.removeEventListener("visibilitychange",tick)}},[]);
 const choice=TIME_ZONES.find(z=>z.id===zone)!,name=zh?choice.zh:choice.en,clock=now?timeZoneClock(now,zone,locale):null,offset=clock?.offset||timeZoneOffset(zone);
 function select(value:string){if(normalizeTimeZone(value)!==value)return;try{const settings=JSON.parse(localStorage.getItem(w.accountSettingsKey)||"{}");if(!settings||typeof settings!=="object"||Array.isArray(settings))throw Error();localStorage.setItem(w.accountSettingsKey,JSON.stringify({...settings,timezone:value}));setZone(value);window.dispatchEvent(new Event("trackflow-preferences"))}catch{w.notify(zh?"無法儲存時區，請稍後再試。":"Unable to save the time zone. Please try again.")}}
 return <Dropdown.Root><Dropdown.Trigger asChild><button type="button" className="cms-timezone-trigger" aria-label={`${zh?"目前時區":"Current time zone"}：${name} (${offset})`} title={`${name} · ${offset}`}><Globe2 size={16}/><span className="cms-timezone-trigger-copy" translate="no"><strong>{name}</strong><small>{offset}<span> · </span><time aria-live="off" dateTime={now?.toISOString()}>{clock?.time.slice(0,5)||"--:--"}</time></small></span><ChevronDown className="cms-timezone-chevron" size={12}/></button></Dropdown.Trigger><Dropdown.Portal><Dropdown.Content className="dropdown-menu cms-timezone-menu" align="end" sideOffset={10} collisionPadding={16}><Dropdown.Label className="cms-timezone-title">{zh?"目前時區":"Current time zone"}</Dropdown.Label><div className="cms-timezone-current" translate="no"><time aria-live="off" dateTime={now?.toISOString()}>{clock?`${clock.date} ${clock.time}`:"--:--:--"}</time><code>{zone} · {offset}</code></div><Dropdown.RadioGroup value={zone} onValueChange={select}>{TIME_ZONES.map(z=><Dropdown.RadioItem className="cms-timezone-option" key={z.id} value={z.id}><span className="cms-timezone-city">{zh?z.zh:z.en}</span><small translate="no">{timeZoneOffset(z.id,now||new Date())}</small><span className="cms-timezone-check"><Dropdown.ItemIndicator><Check size={16}/></Dropdown.ItemIndicator></span></Dropdown.RadioItem>)}</Dropdown.RadioGroup><Dropdown.Separator/><p className="cms-timezone-note">{zh?"此設定調整右上角時鐘；報表仍以台北時區（UTC+08:00）計算。":"This setting changes the header clock. Reports continue to use Asia/Taipei (UTC+08:00)."}</p></Dropdown.Content></Dropdown.Portal></Dropdown.Root>;
}
