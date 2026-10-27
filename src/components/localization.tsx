"use client";
import { Children, createContext, useContext, useEffect, useState, isValidElement, cloneElement, type ReactNode, type ReactElement } from "react";
import * as Dropdown from "@radix-ui/react-dropdown-menu";
import { Languages, ChevronDown, Check } from "lucide-react";
import {cmsCopy} from "./cms-copy";
import zh from "@/lib/zh-TW.json";
type Locale="zh-TW"|"en";
const dictionary:Record<string,string>={...zh,...cmsCopy};
const translatedTerms=[...new Set(Object.values(dictionary))].filter(value=>/[A-Za-z]/.test(value)&&/[^\x00-\x7F]/.test(value)).sort((a,b)=>b.length-a.length);
const LocaleContext=createContext<{locale:Locale;setLocale:(value:Locale)=>void}>({locale:"zh-TW",setLocale:()=>{}});
function translate(value:string){if(dictionary[value])return dictionary[value];const lead=(value.match(/^\s*/)||[""])[0],tail=(value.match(/\s*$/)||[""])[0],clean=value.trim();if(dictionary[clean])return lead+dictionary[clean]+tail;let result=clean;
result=result.replace(/^Performance by (.+)$/i,(_,g)=>'依'+(dictionary[g]||dictionary[g[0].toUpperCase()+g.slice(1)]||g)+'分析成效');
result=result.replace(/^Showing (\d+)–(\d+) of (\d+) records$/, '顯示第 $1–$2 筆，共 $3 筆');
result=result.replace(/^Page (\d+) of (\d+)$/, '第 $1 頁，共 $2 頁');
result=result.replace(/^(\d+) total$/, '共 $1 筆');
result=result.replace(/^(\d+) groups · (\d+) metrics$/, '$1 個分組 · $2 項指標');
result=result.replace(/^Copy (.+)$/, '複製 $1');
result=result.replace(/^Permission preview for (.+)$/,(_,role)=>'預覽'+(dictionary[role[0].toUpperCase()+role.slice(1)]||role)+'的存取權限');
if(result!==clean)return lead+result+tail;
const keys=Object.keys(dictionary).sort((a,b)=>b.length-a.length);
const protectedParts:string[]=[];
for(const term of translatedTerms){if(result.includes(term)){const token="\uE000"+protectedParts.length+"\uE001";protectedParts.push(term);result=result.split(term).join(token)}}
for(const key of keys){if(key.length>=3&&result.includes(key)){const escaped=key.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');result=result.replace(new RegExp('(?<![A-Za-z])'+escaped+'(?![A-Za-z])','g'),dictionary[key])}}
return lead+result.replace(/\uE000(\d+)\uE001/g,(_,index)=>protectedParts[Number(index)])+tail;
}
const cache=new Map<string,string>();
export function useLocale(){return useContext(LocaleContext)}
export function LocaleProvider({children}:{children:ReactNode}){const [locale,setLocale]=useState<Locale>("zh-TW"),[ready,setReady]=useState(false);useEffect(()=>{try{const migrated=localStorage.getItem("trackflow-locale-default-zh-v2");const saved=localStorage.getItem("trackflow-locale");if(migrated&&(saved==="en"||saved==="zh-TW"))setLocale(saved);else{localStorage.setItem("trackflow-locale","zh-TW");localStorage.setItem("trackflow-locale-default-zh-v2","1")}}catch{}setReady(true)},[]);useEffect(()=>{if(!ready)return;document.documentElement.lang=locale==="zh-TW"?"zh-Hant":"en";try{localStorage.setItem("trackflow-locale",locale)}catch{}},[locale,ready]);return <LocaleContext.Provider value={{locale,setLocale}}>{children}</LocaleContext.Provider>}
function localizeNode(node:ReactNode):ReactNode {
 if(typeof node==="string"){if(!cache.has(node))cache.set(node,translate(node));return cache.get(node)}
 if(Array.isArray(node)){if(!node.length)return null;if(node.every(child=>child==null||["string","number","boolean"].includes(typeof child)))return localizeNode(node.map(child=>child==null||typeof child==="boolean"?"":String(child)).join(""));return Children.map(node,child=>localizeNode(child));}
 if(!isValidElement(node))return node;
 const element=node as ReactElement<Record<string,unknown>>;
 if(element.props.translate==="no")return element;
 // Status values are interpreted by Badge before its own localized rendering.
 
 const props:Record<string,unknown>={};
 for(const key of ["placeholder","aria-label","title"]){if(typeof element.props[key]==="string")props[key]=translate(element.props[key] as string)}
 if(element.type==="option"&&element.props.value===undefined&&typeof element.props.children==="string")props.value=element.props.children;
 if(element.props.children!==undefined)props.children=localizeNode(element.props.children as ReactNode);
 return cloneElement(element,props);
}
export function Localize({children}:{children:ReactNode}){const {locale}=useLocale();return <>{locale==="zh-TW"?localizeNode(children):children}</>}
export function LanguageSwitcher(){const {locale,setLocale}=useLocale();return <Dropdown.Root><Dropdown.Trigger asChild><button type="button" className="button button-outline language-switcher" aria-label={locale==="zh-TW"?"選擇語系":"Choose language"}><Languages size={17}/><span>{locale==="zh-TW"?"繁體中文":"English"}</span><ChevronDown size={14}/></button></Dropdown.Trigger><Dropdown.Portal><Dropdown.Content className="dropdown-menu cms-language-menu" align="end" sideOffset={10}><Dropdown.Label>{locale==="zh-TW"?"介面語系":"Interface language"}</Dropdown.Label><Dropdown.RadioGroup value={locale} onValueChange={v=>{if(v==="zh-TW"||v==="en")setLocale(v)}}>{([['zh-TW','繁體中文'],['en','English']] as const).map(([v,name])=><Dropdown.RadioItem key={v} value={v} className="cms-language-option"><span>{name}</span><Dropdown.ItemIndicator><Check size={16}/></Dropdown.ItemIndicator></Dropdown.RadioItem>)}</Dropdown.RadioGroup></Dropdown.Content></Dropdown.Portal></Dropdown.Root>}

export function translateText(value:string){if(!cache.has(value))cache.set(value,translate(value));return cache.get(value)!;}
