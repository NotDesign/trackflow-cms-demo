"use client";
import {MetricIcon} from "./metric-icon";
import {useWorkspace} from "./workspace";
import {useSession} from "./growth-v3";
import {Localize} from "./localization";
import {ArrowRight,ClipboardCheck,Link2,Coins,TrendingUp} from "lucide-react";
import * as O from "@/lib/operations";
import type {CampaignInsight} from "@/lib/growth-insights";
import {money,number} from "@/lib/utils";

export function TodayFocus({rows,onInspect}:{rows:CampaignInsight[];onInspect:(row:CampaignInsight)=>void}){
 const w=useWorkspace(),[rules]=useSession("trackflow-rules-v3",{drop:10,minClicks:100}),[states]=useSession<Record<string,{status:string}>>("trackflow-tasks-v3",{}),[batches]=useSession<O.Batch[]>("trackflow-settlements-v3",[]);
 const pending=w.events.filter(e=>e.status==="Pending").length,issues=O.buildAlerts(w.visits,w.events,w.scope,w.links,rules).filter(a=>a.kind==="Links"&&states[a.id]?.status!=="Resolved").length,available=O.availableLines(w.events,batches).reduce((s,l)=>s+l.cents,0)/100;
 const leader=[...rows].filter(r=>r.status==="Active"&&r.clicks>=100&&r.revenue>0).sort((a,b)=>b.epc-a.epc)[0],learning=rows.filter(r=>r.status==="Active"&&r.clicks<100).length;
 const cards=[{label:"Pending conversion records",value:number(pending),icon:ClipboardCheck,path:"/conversions"},{label:"Link issues to inspect",value:number(issues),icon:Link2,path:"/action-center"},{label:"Available to settle",value:money(available),icon:Coins,path:"/settlements"}];
 return <Localize><section className="panel today-focus"><div className="today-focus-heading"><div><span className="eyebrow">TODAY'S PRIORITIES</span><h2>Today's focus</h2><p>Handle the queue, then explore the opportunities.</p></div><span className="demo-pill">Demo snapshot: 2026/10/16</span></div><div className="today-focus-grid">{cards.map(c=><button key={c.label} onClick={()=>w.go(c.path,{},c.path==="/conversions"?{status:"Pending"}:{})}><MetricIcon name={c.label}/><span>{c.label}<strong>{c.value}</strong></span><ArrowRight size={15}/></button>)}</div><div className="today-opportunities"><span><TrendingUp size={15}/>Performance observations</span><button disabled={!leader} onClick={()=>leader&&onInspect(leader)}><span>Highest commission efficiency</span><strong>{leader?.name||"Not enough activity"}</strong>{leader&&<small>{money(leader.epc)} EPC</small>}<ArrowRight size={12}/></button><button onClick={()=>w.go("/campaigns",{},{view:"learning"})}><span>{learning} campaigns learning</span><ArrowRight size={12}/></button></div></section></Localize>
}
