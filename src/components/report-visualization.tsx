"use client";
import {useState} from "react";
import {ArrowUpRight,BarChart3} from "lucide-react";
import {useLocale,Localize} from "./localization";
import {formatMetric} from "./analytics-ui";
import type {MetricRow,Metrics} from "@/lib/analytics";
const names:Record<keyof Metrics,string>={clicks:"Clicks",unique:"Unique visitors",register:"Registrations",ftd:"FTD",deposits:"Deposits",revenue:"Revenue",commission:"Commission",cvr:"CVR",epc:"EPC"};
export function ReportVisualization({rows,metrics,onDrill}:{rows:MetricRow[];metrics:(keyof Metrics)[];onDrill:(row:MetricRow)=>void}){
 const {locale}=useLocale(),zh=locale==="zh-TW",[selected,setSelected]=useState<keyof Metrics>("revenue"),metric=metrics.includes(selected)?selected:metrics[0]||"clicks";
 const ranked=[...rows].sort((a,b)=>b[metric]-a[metric]).slice(0,8),maximum=Math.max(1,...ranked.map(r=>Math.abs(r[metric])));
 return <Localize><section className="panel cms-report-chart"><div className="panel-heading"><div><span className="eyebrow"><BarChart3 size={14}/>{zh?"報表視覺分析":"REPORT VISUALIZATION"}</span><h2>{zh?"一眼比較表現":"Compare performance at a glance"}</h2><p>{zh?"依所選指標排序，點選項目查看明細。":"Ranked by the selected metric. Select a row to explore."}</p></div><select aria-label={zh?"圖表指標":"Chart metric"} value={metric} onChange={e=>setSelected(e.target.value as keyof Metrics)}>{metrics.map(k=><option key={k} value={k}>{names[k]}</option>)}</select></div><div className="cms-report-bars">{ranked.map((row,i)=><button className="cms-report-bar" key={row.id} onClick={()=>onDrill(row)}><span className="cms-bar-rank">{String(i+1).padStart(2,"0")}</span><span className="cms-bar-name">{row.name}</span><span className="cms-bar-track"><i style={{width:Math.abs(row[metric])/maximum*100+"%"}}/></span><strong>{formatMetric(metric,row[metric])}</strong><ArrowUpRight size={15}/></button>)}{!rows.length&&<p className="empty-state">{zh?"目前篩選範圍內沒有資料。":"No data in this scope."}</p>}</div><p className="cms-chart-footnote">{zh?`顯示前 ${ranked.length} 項，共 ${rows.length} 項；完整資料見下方表格。`:`Showing ${ranked.length} of ${rows.length} groups. All results are in the table below.`}</p></section></Localize>
}
