"use client";
import * as Dropdown from "@radix-ui/react-dropdown-menu";
import {Check,ChevronDown} from "lucide-react";
import {Localize,useLocale,translateText} from "./localization";
export function MultiSelect({label,value,options,onChange,placeholder="None selected",disabled=false}:{label:string;value:string[];options:{value:string;label:string}[];onChange:(value:string[])=>void;placeholder?:string;disabled?:boolean}){
 const {locale}=useLocale(),text=(s:string)=>locale==="zh-TW"?translateText(s):s;
 const names=value.map(v=>text(options.find(o=>o.value===v)?.label||v));
 return <Localize><Dropdown.Root><Dropdown.Trigger asChild><button type="button" className="button button-outline cms-multi-select" aria-label={label} disabled={disabled} title={names.join("、")}><span>{names.length?names.join("、"):text(placeholder)}</span><ChevronDown size={16}/></button></Dropdown.Trigger><Dropdown.Portal><Dropdown.Content className="dropdown-menu cms-multi-menu" align="start" sideOffset={8} collisionPadding={16}><Dropdown.Label>{label}</Dropdown.Label>{options.map(o=><Dropdown.CheckboxItem key={o.value} checked={value.includes(o.value)} onSelect={e=>e.preventDefault()} onCheckedChange={checked=>onChange(checked?[...value,o.value]:value.filter(v=>v!==o.value))}><span className="cms-option-check"><Dropdown.ItemIndicator><Check size={14}/></Dropdown.ItemIndicator></span><span>{o.label}</span></Dropdown.CheckboxItem>)}<Dropdown.Separator/><Dropdown.Item disabled={!value.length} onSelect={e=>{e.preventDefault();onChange([])}}>Clear selection</Dropdown.Item></Dropdown.Content></Dropdown.Portal></Dropdown.Root></Localize>;
}
