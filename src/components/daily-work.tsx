"use client";
import {useWorkspace} from "./workspace";
import {useSession} from "./growth-v3";
import {Localize} from "./localization";
import {ArrowRight,ClipboardCheck,Link2,Coins} from "lucide-react";
import * as O from "@/lib/operations";
import {money,number} from "@/lib/utils";

export function DailyWork(){
 const w=useWorkspace();
 const [rules]=useSession("trackflow-rules-v3",{drop:10,minClicks:100});
 const [states]=useSession<Record<string,{status:string}>>("trackflow-tasks-v3",{});
 const [batches]=useSession<O.Batch[]>("trackflow-settlements-v3",[]);
 const alerts=O.buildAlerts(w.visits,w.events,w.scope,w.links,rules).filter(a=>states[a.id]?.status!=="Resolved");
 const pending=w.events.filter(e=>e.status==="Pending").length;
 const broken=alerts.filter(a=>a.kind==="Links").length;
 const available=O.availableLines(w.events,batches).reduce((sum,l)=>sum+l.cents,0)/100;
 const cards=[{icon:ClipboardCheck,label:"Pending conversion records",value:number(pending),detail:"Review conversion details",path:"/conversions"},{icon:Link2,label:"Link issues to inspect",value:number(broken),detail:"Inspect simulated link issues",path:"/action-center"},{icon:Coins,label:"Available to settle",value:money(available),detail:"Review eligible commission",path:"/settlements"}];
 return <Localize><section className="daily-work" aria-label="Today's work"><div className="daily-heading"><div><span className="eyebrow">YOUR NEXT STEP</span><h2>Today's work</h2><p>Within current filters · Demo snapshot: 2026/10/16</p></div><button className="text-link" onClick={()=>w.go("/action-center")}>Open action center<ArrowRight size={14}/></button></div><div className="daily-grid">{cards.map(c=><button className="panel daily-card" key={c.label} onClick={()=>w.go(c.path,{},c.path==="/conversions"?{status:"Pending"}:{})}><span className="daily-icon"><c.icon size={19}/></span><span className="daily-card-content"><span>{c.label}</span><strong>{c.value}</strong><small>{c.detail}<ArrowRight size={12}/></small></span></button>)}</div></section></Localize>
}
