"use client";
import {createContext,useContext,useEffect,useMemo,useRef,useState,useTransition,type ReactNode} from "react";
import {useRouter,usePathname,useSearchParams} from "next/navigation";
import {applyReviews,reviewTargets,type Review,type Cost} from "@/lib/finance-v6";
import {formatTaipeiDate} from "@/lib/format-date";
import {seedLandingPages} from "@/lib/landing-pages";
import {seedAgents,seedAgentTasks,transitionTask,type AgentTask,type TaskStatus} from "@/lib/agents-v8";
import type {RecordItem,RecordKind} from "@/lib/record-items";
import * as A from "@/lib/analytics";
import {useLocale} from "./localization";
import {Dialog} from "./ui/dialog";
import {useDemoAuth} from "./demo-auth";
import {Button} from "./ui/button";

export type Toast={message:string;undo?:()=>void;id:number};
function useStored<T>(key:string,initial:T){const [value,setValue]=useState(initial);const current=useRef(initial);useEffect(()=>{try{const saved=sessionStorage.getItem(key);if(saved){current.current=JSON.parse(saved);setValue(current.current)}}catch{}},[key]);const update:React.Dispatch<React.SetStateAction<T>>=action=>{const next=typeof action==="function"?(action as (old:T)=>T)(current.current):action;current.current=next;try{sessionStorage.setItem(key,JSON.stringify(next))}catch{}setValue(next)};return [value,update] as const}
export function useWorkspaceState(){
 const auth=useDemoAuth();
 const accountIdentity=auth.session?.identity;
 const accountSettingsKey=accountIdentity&&accountIdentity.id!=="ADM-1001"?"trackflow-settings-v2-"+accountIdentity.id:"trackflow-settings-v2";
 const [storedProfile,setProfile]=useState({name:"Diane Wang",color:"#365d4b"});
 useEffect(()=>{const sync=()=>{try{const data=JSON.parse(localStorage.getItem(accountSettingsKey)||"{}");setProfile({name:typeof data.displayName==="string"&&data.displayName.trim()?data.displayName:accountIdentity?.name||"Diane Wang",color:["#365d4b","#54518f","#285e83","#925e36"].includes(data.avatarColor)?data.avatarColor:"#365d4b"})}catch{}};sync();window.addEventListener("trackflow-preferences",sync);window.addEventListener("storage",sync);return()=>{window.removeEventListener("trackflow-preferences",sync);window.removeEventListener("storage",sync)}},[accountSettingsKey,accountIdentity?.name]);
 const profile=storedProfile;
 const [isPending,startTransition]=useTransition();const router=useRouter(),pathname=usePathname(),params=useSearchParams(),{locale}=useLocale();
 const scope=useMemo(()=>A.readScope(new URLSearchParams(params.toString())),[params]);
 const [campaigns,setCampaigns]=useStored("trackflow-v2-campaigns",A.seedCampaigns);
 const [storedLinks,setLinks]=useStored("trackflow-v2-links",A.seedLinks);
 const links=useMemo(()=>storedLinks.map(l=>({...l,landingPageId:l.landingPageId??"unassigned"})),[storedLinks]);
 const [creatives,setCreatives]=useStored("trackflow-v2-creatives",A.seedCreatives);
 const [agents,setAgents]=useStored("trackflow-agents-v8",seedAgents);
 const [agentTasks,setAgentTasks]=useStored("trackflow-agent-tasks-v8",seedAgentTasks);
 const [landingPages,setLandingPages]=useStored("trackflow-landing-v7",seedLandingPages);
 const [recordItems,setRecordItems]=useStored<RecordItem[]>("trackflow-record-items-v1",[]);
 const [itemEditor,setItemEditor]=useState<{kind:RecordKind;id:string;name:string}|null>(null);
 const [costs,setCosts]=useStored<Cost[]>("trackflow-costs-v6",[]);
 const [reviews,setReviews]=useStored<Review[]>("trackflow-reviews-v6",[]);
 const [reviewReady,setReviewReady]=useState(false);useEffect(()=>setReviewReady(true),[]);
 const allEvents=useMemo(()=>applyReviews(A.allEvents,reviews),[reviews]);
 const [accountSettingsRequest,setAccountSettingsRequest]=useState(0);
 const [query,setQuery]=useState(""),[toast,setToast]=useState<Toast|null>(null),[editor,setEditor]=useState<{type:"campaign"|"link"|"creative";id?:string}|null>(null);
 const [reveal,setReveal]=useState(""),[dirty,setDirty]=useState(false),[pending,setPending]=useState<null|(()=>void)>(null);
 const discardRef=useRef<null|(()=>void)>(null);const timeout=useRef<ReturnType<typeof setTimeout>|null>(null);
 useEffect(()=>{setQuery("")},[pathname]);
 useEffect(()=>()=>{if(timeout.current)clearTimeout(timeout.current)},[]);
 useEffect(()=>{const handler=(e:BeforeUnloadEvent)=>{if(dirty){e.preventDefault();e.returnValue=""}};window.addEventListener("beforeunload",handler);return ()=>window.removeEventListener("beforeunload",handler)},[dirty]);
 const notify=(message:string,undo?:()=>void)=>{if(timeout.current)clearTimeout(timeout.current);setToast({message,undo,id:Date.now()});timeout.current=setTimeout(()=>setToast(null),undo?12000:6000)};
 const protect=(action:()=>void)=>{if(dirty)setPending(()=>action);else action()};
 const openAccountSettings=()=>protect(()=>{setAccountSettingsRequest(n=>n+1);startTransition(()=>router.push(A.scopeURL("/settings",scope)))});
 const go=(path:string,patch:Partial<A.Scope>={},extra:Record<string,string>={})=>protect(()=>startTransition(()=>router.push(A.scopeURL(path,{...scope,...patch},extra))));
 const setScope=(patch:Partial<A.Scope>)=>protect(()=>startTransition(()=>router.replace(A.scopeURL(pathname.startsWith("/campaigns/")&&patch.campaign?"/campaigns/"+patch.campaign:pathname,{...scope,...patch},Object.fromEntries(["group","type","tab","visitor","view","compare"].map(key=>[key,params.get(key)||""]))),{scroll:false})));
 const visits=useMemo(()=>A.inScope(A.allVisits,scope),[scope]);
 const events=useMemo(()=>A.inScope(allEvents,scope),[scope,allEvents]);
 const previous=A.previousScope(scope);
 const previousVisits=useMemo(()=>A.inScope(A.allVisits,previous),[scope.from,scope.to,scope.country,scope.source,scope.campaign,scope.creative,scope.device,scope.affiliate,scope.landing]);
 const previousEvents=useMemo(()=>A.inScope(allEvents,previous),[allEvents,scope.from,scope.to,scope.country,scope.source,scope.campaign,scope.creative,scope.device,scope.affiliate,scope.landing]);
 const totals=useMemo(()=>A.metrics(visits,events),[visits,events]),before=useMemo(()=>A.metrics(previousVisits,previousEvents),[previousVisits,previousEvents]);
 const nameOf=(kind:"campaign"|"creative"|"affiliate"|"link",id:string)=>(kind==="campaign"?campaigns:kind==="creative"?creatives:kind==="link"?links:A.affiliates).find(item=>item.id===id)?.name||id;
 const statsFor=(dimension:keyof A.Dimensions,id:string)=>A.metrics(visits.filter(v=>v[dimension]===id),events.filter(e=>e[dimension]===id));
 const href=(path:string,patch:Partial<A.Scope>={},extra:Record<string,string>={})=>A.scopeURL(path,{...scope,...patch},extra);
 const formatDate=(value:string,withTime=false)=>formatTaipeiDate(value,locale,withTime);
 const scopeLabel=scope.from===scope.to?formatDate(scope.from):formatDate(scope.from)+" – "+formatDate(scope.to);
 const revealRecord=(kind:"campaign"|"link"|"creative",id:string)=>{setReveal(id);setQuery("");router.push(A.scopeURL(kind==="campaign"?"/campaigns":kind==="link"?"/tracking-links":"/creatives",{...A.DEFAULT_SCOPE,from:A.DEMO_TODAY,to:A.DEMO_TODAY},{reveal:id}));notify("Created and highlighted. Filters were reset to show the new record.")};
 const bulkStatus=(kind:"campaign"|"link",ids:string[],status:string)=>{
 const selected=new Set(ids);
 if(kind==="campaign"){const old=new Map(campaigns.filter(c=>selected.has(c.id)).map(c=>[c.id,c.status]));setCampaigns(items=>items.map(c=>selected.has(c.id)?{...c,status}:c));notify("Selected records updated. Historical analytics remain available.",()=>setCampaigns(items=>items.map(c=>old.has(c.id)?{...c,status:old.get(c.id)!}:c)))}
 else {const old=new Map(links.filter(c=>selected.has(c.id)).map(c=>[c.id,c.status]));setLinks(items=>items.map(c=>selected.has(c.id)?{...c,status}:c));notify("Selected records updated. Historical analytics remain available.",()=>setLinks(items=>items.map(c=>old.has(c.id)?{...c,status:old.get(c.id)!}:c)))}
 };
 const reviewConversions=(ids:string[],status:"Approved"|"Rejected",reason:string)=>{
 if(!reviewReady||!reason.trim()||reason.trim().length>200)return false;
 let changed=false;setReviews(current=>{const targets=reviewTargets(applyReviews(A.allEvents,current),ids);if(!targets.length)return current;changed=true;return [...current,{id:"REV-"+crypto.randomUUID().slice(0,8),eventIds:targets.map(e=>e.id),status,reason:reason.trim(),actor:profile.name,at:new Date().toISOString()}]});
 if(changed)notify("Review recorded. Analytics and settlement eligibility have been updated.");return changed;
 };
 const changeAgentTask=(id:string,agentId:string,actor:"admin"|"agent",status:TaskStatus,note:string)=>{let changed=false;const agent=agents.find(a=>a.id===agentId);setAgentTasks(old=>old.map(t=>{if(t.id!==id||!campaigns.some(c=>c.id===t.campaignId))return t;const updated=transitionTask(t,agent,actor,status,note,actor==="admin"?profile.name:agent?.name||"Agent",new Date().toISOString());if(updated)changed=true;return updated||t}));if(changed)notify("Agent task updated.");return changed;};
 const changeCampaignStatus=(id:string)=>{const row=campaigns.find(c=>c.id===id);if(!row)return;const old=row.status;setCampaigns(items=>items.map(c=>c.id===id?{...c,status:old==="Active"?"Paused":"Active"}:c));notify("Campaign status updated. Historical analytics remain available.",()=>setCampaigns(items=>items.map(c=>c.id===id?{...c,status:old}:c)))};
 const changeLinkStatus=(id:string)=>{const row=links.find(c=>c.id===id);if(!row)return;const old=row.status;setLinks(items=>items.map(c=>c.id===id?{...c,status:old==="Active"?"Disabled":"Active"}:c));notify("Link status updated. You can undo this change.",()=>setLinks(items=>items.map(c=>c.id===id?{...c,status:old}:c)))};
 return {accountSettingsRequest,openAccountSettings,accountSettingsKey,accountIdentity,recordItems,setRecordItems,itemEditor,setItemEditor,agents,setAgents,agentTasks,setAgentTasks,changeAgentTask,landingPages,setLandingPages,costs,setCosts,reviews,reviewReady,allEvents,reviewConversions,bulkStatus,profile,isPending,router,pathname,params,locale,scope,setScope,scopeLabel,formatDate,visits,events,previousVisits,previousEvents,totals,before,campaigns,setCampaigns,links,setLinks,creatives,setCreatives,query,setQuery,toast,setToast,notify,editor,setEditor,reveal,revealRecord,dirty,setDirty,pending,setPending,discardRef,protect,go,href,nameOf,statsFor,changeCampaignStatus,changeLinkStatus};
}
type Workspace=ReturnType<typeof useWorkspaceState>;
const Context=createContext<Workspace|null>(null);
export const WorkspaceProvider=({value,children}:{value:Workspace;children:ReactNode})=><Context.Provider value={value}>{children}</Context.Provider>;
export function useWorkspace(){const value=useContext(Context);if(!value)throw Error("Workspace missing");return value}
export function NavigationGuard(){const w=useWorkspace();return <Dialog open={!!w.pending} onOpenChange={open=>{if(!open)w.setPending(null)}} title="Unsaved changes" description="You have changes that have not been saved."><p className="muted">Leave without saving?</p><div className="dialog-footer"><Button variant="outline" onClick={()=>w.setPending(null)}>Keep editing</Button><Button variant="destructive" onClick={()=>{const next=w.pending;w.discardRef.current?.();w.setDirty(false);w.setPending(null);next?.()}}>Discard and leave</Button></div></Dialog>}

