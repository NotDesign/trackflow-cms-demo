"use client";
import {useEffect,useRef,useState,type KeyboardEvent} from "react";
import {Home,Plus,X,CopyX,type LucideIcon} from "lucide-react";
import {useWorkspace} from "./workspace";
import {translateText} from "./localization";
type WorkTab={path:string;extra:Record<string,string>};
const home:WorkTab={path:"/overview",extra:{}};
export function WorkspaceTabs({pages,onNew}:{pages:{id:string;name:string;icon:LucideIcon}[];onNew:()=>void}){
 const w=useWorkspace(),zh=w.locale==="zh-TW",path=w.pathname,query=w.params.toString();
 const key="trackflow-work-tabs:"+(w.accountIdentity?.id||"demo");
 const [tabs,setTabs]=useState<WorkTab[]>([home]),[ready,setReady]=useState("");
 const buttons=useRef<Record<string,HTMLButtonElement|null>>({});
 const valid=(p:string)=>pages.some(i=>"/"+i.id===p)||/^\/campaigns\/[A-Za-z0-9_-]+$/.test(p);
 useEffect(()=>{let saved:WorkTab[]=[];try{const data=JSON.parse(sessionStorage.getItem(key)||"[]");if(Array.isArray(data))saved=data.filter(t=>t&&typeof t.path==="string"&&valid(t.path)&&t.path!==home.path).map(t=>({path:t.path,extra:{}}))}catch{}setTabs([home,...saved.filter((t,i,a)=>a.findIndex(x=>x.path===t.path)===i)]);setReady(key)},[key]);
 useEffect(()=>{if(ready!==key)return;const extra=Object.fromEntries(["view","group","type","tab","visitor","compare"].map(k=>[k,w.params.get(k)||""]));setTabs(previous=>{const next=previous.some(t=>t.path===path)?previous.map(t=>t.path===path?{path,extra}:t):[...previous,{path,extra}];return next})},[path,query,ready,key]);
 useEffect(()=>{if(ready===key)try{sessionStorage.setItem(key,JSON.stringify(tabs))}catch{}},[tabs,ready,key]);
 useEffect(()=>{buttons.current[path]?.scrollIntoView({block:"nearest",inline:"nearest"})},[path,tabs.length]);
 const name=(p:string)=>{const page=pages.find(i=>"/"+i.id===p);return page?(zh?translateText(page.name):page.name):(zh?"活動詳情 · ":"Campaign · ")+p.split("/").pop()};
 const navigate=(tab:WorkTab)=>w.router.push(w.href(tab.path,tab.path.startsWith("/campaigns/")?{campaign:tab.path.split("/")[2]}:{},tab.extra));
 const close=(target:string)=>{if(target===home.path)return;const perform=()=>{const index=tabs.findIndex(t=>t.path===target),next=tabs.filter(t=>t.path!==target);setTabs(next);if(target===path){const destination=next[Math.max(0,index-1)]||home;navigate(destination);requestAnimationFrame(()=>buttons.current[destination.path]?.focus())}};if(target===path)w.protect(perform);else perform()};
 const keyboard=(e:KeyboardEvent<HTMLButtonElement>,index:number)=>{let next=index;if(e.key==="ArrowRight")next=(index+1)%tabs.length;else if(e.key==="ArrowLeft")next=(index-1+tabs.length)%tabs.length;else if(e.key==="Home")next=0;else if(e.key==="End")next=tabs.length-1;else if(e.key==="Delete"){e.preventDefault();close(tabs[index].path);return}else return;e.preventDefault();buttons.current[tabs[next].path]?.focus()};
 return <div className="cms-workspace-bar"><div className="cms-workspace-tabs" role="tablist" aria-label={zh?"工作分頁":"Workspace tabs"}>{tabs.map((t,i)=>{const Icon=t.path===home.path?Home:pages.find(p=>"/"+p.id===t.path)?.icon||Home;return <div key={t.path} className={"cms-work-tab"+(path===t.path?" active":"")} role="presentation"><button ref={el=>{buttons.current[t.path]=el}} id={"workspace-tab-"+t.path.replaceAll("/","-")} role="tab" aria-selected={path===t.path} aria-controls="workspace-panel" tabIndex={path===t.path?0:-1} title={name(t.path)} onKeyDown={e=>keyboard(e,i)} onClick={()=>w.protect(()=>navigate(t))}><Icon size={15}/><span>{name(t.path)}</span></button>{t.path!==home.path&&<button className="cms-tab-close" aria-label={(zh?"關閉分頁：":"Close tab: ")+name(t.path)} onClick={()=>close(t.path)}><X size={13}/></button>}</div>})}</div><div className="cms-workspace-actions"><button aria-label={zh?"新增工作分頁":"Open workspace tab"} title={zh?"新增工作分頁":"Open workspace tab"} onClick={onNew}><Plus size={18}/></button><button disabled={tabs.length===1} aria-label={zh?"關閉所有分頁（保留總覽）":"Close all tabs (keep overview)"} title={zh?"關閉所有分頁（保留總覽）":"Close all tabs (keep overview)"} onClick={()=>w.protect(()=>{setTabs([home]);navigate(home)})}><CopyX size={18}/></button></div></div>
}
