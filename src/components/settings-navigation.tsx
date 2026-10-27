"use client";
import {UserRound,Users,Settings2} from "lucide-react";
import {Localize} from "./localization";
const groups=[
 {id:"personal",title:"Personal profile",description:"Profile and sign-in preferences",icon:UserRound,tabs:["Profile","Security"]},
 {id:"team",title:"Team accounts",description:"Administrators, agents and roles",icon:Users,tabs:["Users","Permissions"]},
 {id:"workspace",title:"Workspace setup",description:"General settings and tracking connections",icon:Settings2,tabs:["General","Tracking","Domains","Postback"]},
];
export function SettingsNavigation({tab,onChange}:{tab:string;onChange:(tab:string)=>void}){
 const active=groups.find(g=>g.tabs.includes(tab))||groups[0];
 return <Localize><nav className="settings-navigation" aria-label="Settings groups"><div className="settings-group-list">{groups.map(g=><button key={g.id} type="button" aria-current={active.id===g.id?"page":undefined} onClick={()=>onChange(g.tabs[0])}><g.icon size={20}/><span><strong>{g.title}</strong><small>{g.description}</small></span></button>)}</div><div className="settings-subnav cms-tab-bar" role="tablist" aria-label="Settings sections">{active.tabs.map(t=><button type="button" key={t} role="tab" aria-selected={tab===t} tabIndex={tab===t?0:-1} onKeyDown={e=>{const i=active.tabs.indexOf(t);const n=e.key==="ArrowRight"?(i+1)%active.tabs.length:e.key==="ArrowLeft"?(i-1+active.tabs.length)%active.tabs.length:e.key==="Home"?0:e.key==="End"?active.tabs.length-1:-1;if(n>=0){e.preventDefault();const parent=e.currentTarget.parentElement;onChange(active.tabs[n]);(parent?.querySelectorAll<HTMLButtonElement>("button")[n])?.focus()}}} onClick={()=>onChange(t)}>{t}</button>)}</div></nav></Localize>;
}
