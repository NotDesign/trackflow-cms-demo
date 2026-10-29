"use client";
import {useState} from "react";
import {ResponsiveContainer,PieChart,Pie,Cell} from "recharts";
import {ChevronRight} from "lucide-react";
import {Localize,useLocale,translateText} from "./localization";
import {number} from "@/lib/utils";

type TrafficRow={id:string;name:string;clicks:number};
const colors=Array.from({length:6},(_,i)=>`var(--chart-${i+1})`);

/** Keep hover/touch details in normal flow, away from the donut's total. */
export function TrafficBreakdown({rows,total,onOpen}:{rows:TrafficRow[];total:number;onOpen:(id:string)=>void}){
 const {locale}=useLocale();
 const [activeId,setActiveId]=useState<string|null>(null);
 const active=rows.find(row=>row.id===activeId);
 const share=(clicks:number)=>`${total?(clicks/total*100).toFixed(1):"0.0"}%`;
 const preview=(index:number)=>{if(rows[index])setActiveId(rows[index].id)};
 return <Localize><div className="traffic-content">
  <div className="traffic-chart-group">
   <div className="donut">
    {rows.length?<ResponsiveContainer width="100%" height="100%"><PieChart>
     <Pie data={rows} dataKey="clicks" nameKey="name" innerRadius="68%" outerRadius="90%" paddingAngle={3} stroke="none" isAnimationActive={false} onMouseEnter={(_,index)=>preview(index)} onClick={(_,index)=>preview(index)}>
      {rows.map((row,index)=><Cell key={row.id} fill={colors[index%colors.length]} cursor="pointer"/>)}
     </Pie>
    </PieChart></ResponsiveContainer>:<div className="empty-donut"/>}
    <div className="donut-label"><strong>{number(total)}</strong><span>Total clicks</span></div>
   </div>
   <div className="traffic-point-detail" role="status" aria-live="polite" aria-atomic="true">
    {active?<><span className="traffic-point-name"><i style={{background:colors[rows.indexOf(active)%colors.length]}}/>{active.name}</span><span className="traffic-point-value"><strong>{number(active.clicks)}</strong><span>Clicks</span><span>· {share(active.clicks)}</span></span></>:<span className="traffic-point-hint">{locale==="zh-TW"?"移至圖表、點選區塊或聚焦來源查看明細":"Hover or tap a segment, or focus a source for details"}</span>}
   </div>
  </div>
  <div className="source-list">{rows.map((row,index)=><button key={row.id} onMouseEnter={()=>setActiveId(row.id)} onFocus={()=>setActiveId(row.id)} onClick={()=>onOpen(row.id)} aria-label={`${(locale==="zh-TW"?translateText(row.name):row.name)} · ${number(row.clicks)} ${(locale==="zh-TW"?translateText("Clicks"):"Clicks")} · ${share(row.clicks)}`} data-previewed={active?.id===row.id||undefined}>
   <span><i style={{background:colors[index%colors.length]}}/>{row.name}</span><strong>{share(row.clicks)} <ChevronRight size={11}/></strong>
  </button>)}</div>
 </div></Localize>
}
