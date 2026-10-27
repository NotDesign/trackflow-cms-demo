"use client";
import {useEffect,useState} from "react";
import Link from "next/link";
import {LoginGate,SessionMenu} from "./demo-auth";
import {PanelLeftClose,PanelLeftOpen,Command,ChevronRight,Activity,ArrowDownLeft,Bell,CalendarDays,ChevronDown,ChevronsUpDown,Download,FileBarChart,Globe2,Image as ImageIcon,LayoutDashboard,Link2,Menu,Moon,Plus,Search,Settings2,Sun,Target,Users,Check,X,Undo2,ClipboardCheck,Coins,Workflow} from "lucide-react";
import {ReviewInbox} from "./review-inbox";
import {AgentManagement,AgentPortal} from "./agents-v8";
import {RecordItemsEditor} from "./record-items";
import {LandingPages} from "./landing-pages-v7";
import {Costs} from "./costs-v6";
import {DailyWork} from "./daily-work";
import {NotificationCenter,CmsAssistant} from "./cms-assistant";
import {WorkspaceTabs} from "./workspace-tabs";
import {ThemeSwitcher} from "./theme-switcher";
import {Localize,LanguageSwitcher,translateText} from "./localization";
import {useWorkspaceState,WorkspaceProvider,useWorkspace,NavigationGuard} from "./workspace";
import {GlobalFilters,Avatar} from "./analytics-ui";
import * as Pages from "./pages-v2";
import {ActionCenter,Settlements,FunnelComparison,GrowthShortcuts} from "./growth-v3";
import {Editor,Settings} from "./forms-v2";
import {Button} from "./ui/button";
import {Dialog} from "./ui/dialog";
import {cn,number} from "@/lib/utils";
const navigation=[{group:"",items:[{id:"overview",name:"Overview",icon:LayoutDashboard}]},{group:"CAMPAIGNS",items:[{id:"campaigns",name:"Campaigns",icon:Target},{id:"landing-pages",name:"Landing pages",icon:Globe2},{id:"tracking-links",name:"Tracking Links",icon:Link2},{id:"creatives",name:"Creatives",icon:ImageIcon}]},{group:"ANALYTICS",items:[{id:"visitors",name:"Visitors",icon:Users},{id:"conversions",name:"Conversions",icon:ArrowDownLeft},{id:"reports",name:"Reports",icon:FileBarChart},{id:"funnel",name:"Funnel & comparison",icon:Workflow}]},{group:"MANAGEMENT",items:[{id:"action-center",name:"Action center",icon:ClipboardCheck},{id:"costs",name:"Costs & returns",icon:Coins},{id:"settlements",name:"Commission & settlements",icon:Coins},{id:"affiliates",name:"Affiliates",icon:Globe2}]},{group:"SYSTEM",items:[{id:"agents",name:"Agent management",icon:Users},{id:"review-inbox",name:"Review inbox",icon:ClipboardCheck},{id:"settings",name:"Settings",icon:Settings2}]}];
const meta:Record<string,{title:string;description:string;eyebrow:string}>={"review-inbox":{title:"Every submission, ready for review.",description:"Review work, explain revisions and keep a clear decision trail.",eyebrow:"REVIEW INBOX"},agents:{title:"A separate workspace for your agents.",description:"Assign campaigns, delegate work and review submissions.",eyebrow:"AGENT MANAGEMENT"},"landing-pages":{title:"Turn visits into action.",description:"Manage destinations and compare landing page performance.",eyebrow:"LANDING PAGE MANAGEMENT"},costs:{title:"Know what your growth costs.",description:"Record expenses and estimate returns for your business model.",eyebrow:"COSTS & RETURNS"},"action-center":{title:"Start with what needs attention.",description:"Turn alerts and pending work into clear next steps.",eyebrow:"ACTION CENTER"},settlements:{title:"Commission, with a clear trail.",description:"Review eligible commission and preview the settlement workflow.",eyebrow:"COMMISSION & SETTLEMENTS"},funnel:{title:"See where growth happens.",description:"Follow new visitors through registration and first deposit.",eyebrow:"FUNNEL & COMPARISON"},overview:{title:"A clear view of your growth.",description:"Your campaigns, traffic, and results. All connected.",eyebrow:"WORKSPACE OVERVIEW"},campaigns:{title:"Campaigns",description:"Manage every initiative. Find your next growth opportunity.",eyebrow:"CAMPAIGN MANAGEMENT"},"tracking-links":{title:"Tracking links",description:"Connect every click to the campaign behind it.",eyebrow:"LINK MANAGEMENT"},visitors:{title:"Visitors",description:"Understand the people behind your performance.",eyebrow:"AUDIENCE INTELLIGENCE"},conversions:{title:"Conversions",description:"Follow the actions that move your business forward.",eyebrow:"CONVERSION INTELLIGENCE"},creatives:{title:"Your creative library",description:"Every asset. Every format. Ready for your next campaign.",eyebrow:"CREATIVE MANAGEMENT"},reports:{title:"Turn data into direction.",description:"Build a report around the questions that matter.",eyebrow:"REPORT BUILDER"},affiliates:{title:"Better growth, together.",description:"A clear picture of your partner network.",eyebrow:"PARTNER MANAGEMENT"},settings:{title:"Workspace settings",description:"Make TRACKFLOW work the way you do.",eyebrow:"WORKSPACE CONFIGURATION"}};
export default function Dashboard({route}:{route:string}){const workspace=useWorkspaceState();return <WorkspaceProvider value={workspace}><LoginGate route={route}>{route==="agent"?<AgentPortal/>:<AppShell route={route}/>}</LoginGate></WorkspaceProvider>}
function AppShell({route}:{route:string}){
 const w=useWorkspace(),page=route.split("/")[0],m=meta[page];
 const [menu,setMenu]=useState(false),[compact,setCompact]=useState(false),[command,setCommand]=useState(false),[navQuery,setNavQuery]=useState("");
 const [theme,setTheme]=useState<"dark"|"light">("dark"),[themeReady,setThemeReady]=useState(false),[dateOpen,setDateOpen]=useState(false);
 const zh=w.locale==="zh-TW",label=(en:string,tc:string)=>zh?tc:en;
 useEffect(()=>{
  try{const saved=localStorage.getItem("trackflow-theme");if(saved==="light"||saved==="dark")setTheme(saved);setCompact(localStorage.getItem("trackflow-sidebar-compact")==="true")}catch{}
  setThemeReady(true);
 },[]);
 useEffect(()=>{if(!themeReady)return;document.documentElement.dataset.theme=theme;try{localStorage.setItem("trackflow-theme",theme)}catch{}},[theme,themeReady]);
 useEffect(()=>{setMenu(false);setCommand(false);setNavQuery("")},[route]);
 useEffect(()=>{const key=(e:KeyboardEvent)=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){e.preventDefault();setCommand(v=>!v)}};window.addEventListener("keydown",key);return()=>window.removeEventListener("keydown",key)},[]);
 const action=page==="campaigns"?{type:"campaign" as const,label:"New campaign"}:page==="tracking-links"?{type:"link" as const,label:"Create tracking link"}:page==="creatives"?{type:"creative" as const,label:"Upload creative"}:null;
 const current=navigation.flatMap(g=>g.items).find(i=>i.id===page),PageIcon=current?.icon||LayoutDashboard;
 const filteredNavigation=navigation.flatMap(g=>g.items).filter(i=>(i.name+" "+translateText(i.name)).toLowerCase().includes(navQuery.trim().toLowerCase()));
 const matchedCampaigns=navQuery.trim()?w.campaigns.filter(c=>(c.name+" "+c.id).toLowerCase().includes(navQuery.trim().toLowerCase())).slice(0,6):[];
 const toggleSidebar=()=>setCompact(value=>{try{localStorage.setItem("trackflow-sidebar-compact",String(!value))}catch{}return !value});
 function Navigation({mobile=false}:{mobile?:boolean}){return <Localize><nav aria-label={label("Main navigation","主要導覽")} className="cms-navigation">{navigation.map(group=><div className="nav-group" key={group.group}>{group.group&&<span className="nav-label">{group.group}</span>}{group.items.map(item=><Link href={w.href("/"+item.id)} key={item.id} title={zh?translateText(item.name):item.name} className={cn("nav-item",page===item.id&&"active")} aria-current={page===item.id?"page":undefined} onClick={e=>{if(w.dirty&&!e.metaKey&&!e.ctrlKey){e.preventDefault();w.protect(()=>{setMenu(false);w.router.push(w.href("/"+item.id))})}else if(mobile)setMenu(false)}}><item.icon size={18}/><span>{item.name}</span>{item.id==="campaigns"&&<small>{w.campaigns.length}</small>}{page===item.id&&<span className="nav-active-dot"/>}</Link>)}</div>)}</nav></Localize>}
 let content;
 if(route.startsWith("campaigns/"))content=<Pages.CampaignDetail id={route.split("/")[1]}/>;
 else switch(page){
  case "overview":content=<Pages.Overview/>;break;
  case "action-center":content=<ActionCenter/>;break;
  case "settlements":content=<Settlements/>;break;
  case "funnel":content=<FunnelComparison/>;break;
  case "campaigns":content=<Pages.Campaigns/>;break;
  case "tracking-links":content=<Pages.TrackingLinks/>;break;
  case "visitors":content=<Pages.Visitors/>;break;
  case "conversions":content=<Pages.Conversions/>;break;
  case "creatives":content=<Pages.Creatives/>;break;
  case "reports":content=<Pages.Reports/>;break;
  case "affiliates":content=<Pages.Affiliates/>;break;
  case "review-inbox":content=<ReviewInbox/>;break;
  case "agents":content=<AgentManagement/>;break;
  case "landing-pages":content=<LandingPages/>;break;
  case "costs":content=<Costs/>;break;
  default:content=<Settings/>;
 }
 return <Localize><div className={cn("app-shell v2 cms-shell",compact&&"cms-compact")}>
  <a className="skip-link" href="#cms-content" onClick={e=>{e.preventDefault();const content=document.getElementById("cms-content");content?.focus();content?.scrollIntoView()}}>{label("Skip to content","跳至主要內容")}</a>
  <aside className="sidebar cms-sidebar">
   <Link className="brand" href={w.href("/overview")}><span className="brand-icon"><Activity size={23}/></span><strong>TRACKFLOW<span>Promotion intelligence</span></strong></Link>
   <Navigation/>
   <div className="sidebar-bottom cms-sidebar-footer"><LanguageSwitcher/><small translate="no">TRACKFLOW · v0.1.0</small></div>
  </aside>
  <div className="main-shell">
   <header className="header cms-header">
    <div className="header-breadcrumb">
     <Button className="cms-sidebar-toggle" variant="ghost" size="icon" aria-label={compact?label("Expand sidebar","展開側欄"):label("Collapse sidebar","收合側欄")} aria-expanded={!compact} onClick={toggleSidebar}>{compact?<PanelLeftOpen size={19}/>:<PanelLeftClose size={19}/>}</Button>
     <Button className="mobile-menu" variant="ghost" size="icon" aria-label="Open navigation" onClick={()=>setMenu(true)}><Menu size={20}/></Button>
     <span className="breadcrumb-workspace">Workspace</span><ChevronRight className="breadcrumb-chevron" size={13}/><strong>{current?.name||"Page"}{route.includes("/")&&<span> / Details</span>}</strong>
    </div>
    <div className="header-actions">
     <button className="cms-command-trigger" onClick={()=>setCommand(true)} aria-label={label("Quick search","快速搜尋")}><Search size={16}/><span>{label("Quick search…","快速搜尋…")}</span><kbd>⌘ K</kbd></button>
     <span className="cms-header-separator"/>
     <ThemeSwitcher theme={theme} onChange={setTheme} ready={themeReady}/>
     <NotificationCenter/><SessionMenu/>
    </div>
   </header>
   <WorkspaceTabs pages={navigation.flatMap(g=>g.items)} onNew={()=>setCommand(true)}/>
   <main id="cms-content" tabIndex={-1} aria-busy={w.isPending}>
    {!m?<div className="empty-state"><h1>Page not found</h1><Button onClick={()=>w.go("/overview")}>Go to overview</Button></div>:<>
     {!route.includes("/")&&<div className="page-heading"><div><span className="eyebrow"><PageIcon size={14}/>{m.eyebrow}</span><h1>{m.title}</h1><p>{m.description}</p></div><div className="cms-page-actions"><label className="cms-table-search"><Search size={15}/><input aria-label="Search current table" placeholder="Search this table…" value={w.query} onChange={e=>w.setQuery(e.target.value)}/></label>{action?<Button onClick={()=>w.setEditor({type:action.type})}><Plus size={16}/>{action.label}</Button>:page==="overview"?<Button variant="outline" onClick={()=>w.go("/reports")}><Download size={15}/>Export report</Button>:null}</div></div>}
     {!["agents","review-inbox","settings"].includes(page)&&<GlobalFilters dateOpen={dateOpen} onDateOpen={setDateOpen}/>}
     <div className="cms-content-stack" role="tabpanel" id="workspace-panel" aria-labelledby={"workspace-tab-"+w.pathname.replaceAll("/","-")} onClickCapture={e=>{if(!w.dirty||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;const anchor=(e.target as HTMLElement).closest("a[href]");const href=anchor?.getAttribute("href");if(href?.startsWith("/")){e.preventDefault();e.stopPropagation();w.protect(()=>w.router.push(href))}}}>{content}</div>
    </>}
    <footer className="app-footer"><span>TRACKFLOW / Promotion intelligence</span><span>V8 · UI prototype · Fictional data · No live tracking</span></footer>
   </main>
  </div>
  {w.editor&&<Editor key={w.editor.type+(w.editor.id||"new")}/>}{w.itemEditor&&<RecordItemsEditor key={w.itemEditor.kind+w.itemEditor.id}/>}
  <NavigationGuard/>
  <Dialog open={menu} onOpenChange={setMenu} title="TRACKFLOW" className="cms-mobile-navigation"><Navigation mobile/><div className="cms-sidebar-footer"><LanguageSwitcher/><small translate="no">TRACKFLOW · v0.1.0</small></div></Dialog>
  <Dialog open={command} onOpenChange={value=>{setCommand(value);if(!value)setNavQuery("")}} title={label("Quick search","快速搜尋")} description={label("Search pages and campaigns in this workspace.","搜尋工作區頁面與推廣活動。")} className="cms-command-dialog">
   <label className="cms-command-input"><Search size={19}/><input autoFocus aria-label={label("Search navigation","搜尋導覽")} placeholder={label("Search pages or campaigns…","搜尋頁面或活動名稱…")} value={navQuery} onChange={e=>setNavQuery(e.target.value)}/><kbd>ESC</kbd></label>
   <div className="cms-command-results">{filteredNavigation.map(item=><button key={item.id} onClick={()=>{setCommand(false);w.go("/"+item.id)}}><item.icon size={18}/><span>{item.name}</span>{page===item.id?<Check size={16}/>:<ChevronRight size={16}/>}</button>)}{matchedCampaigns.map(c=><button key={c.id} onClick={()=>{setCommand(false);w.go("/campaigns/"+c.id,{campaign:c.id})}}><Target size={18}/><span>{c.name}<small className="cms-search-type"> · {c.id}</small></span><ChevronRight size={16}/></button>)}{!filteredNavigation.length&&!matchedCampaigns.length&&<p className="empty-state">{label("No matching pages","找不到符合的頁面")}</p>}</div>
  </Dialog>
  <CmsAssistant/>
  {w.toast&&<div className="toast" role="status"><span><Check size={17}/></span><span>{w.toast.message}</span>{w.toast.undo&&<Button variant="outline" size="sm" onClick={()=>{w.toast?.undo?.();w.setToast(null)}}><Undo2 size={13}/>Undo</Button>}<button aria-label="Dismiss notification" onClick={()=>w.setToast(null)}><X size={14}/></button></div>}
 </div></Localize>
}
