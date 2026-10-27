"use client";
import {createContext,useContext,useEffect,useState,useRef,type ReactNode} from "react";
import * as Dropdown from "@radix-ui/react-dropdown-menu";
import {Settings2,ChevronDown,Activity,ArrowRight,Check,ClipboardCheck,Eye,EyeOff,LogOut,Mail,ShieldCheck,UserRound,Users} from "lucide-react";
import {authenticateDemo,demoAccounts,DEMO_PASSWORD,readDemoSession,SESSION_DURATION,type DemoIdentity,type DemoSession,type LoginRole} from "@/lib/demo-login";
import {useWorkspace,NavigationGuard} from "./workspace";
import {Localize,LanguageSwitcher} from "./localization";
import {ThemeSwitcher} from "./theme-switcher";
import {Button} from "./ui/button";

const KEY="trackflow-demo-session-v1";
type Auth={session:DemoSession|null;ready:boolean;reason:string;signIn:(identity:DemoIdentity)=>void;signOut:(reason?:string)=>void};
const AuthContext=createContext<Auth|null>(null);
export function DemoAuthProvider({children}:{children:ReactNode}){
 const [session,setSession]=useState<DemoSession|null>(null),[ready,setReady]=useState(false),[reason,setReason]=useState("");
 const signOut=(message="")=>{try{sessionStorage.removeItem(KEY)}catch{}setSession(null);setReason(message)};
 useEffect(()=>{try{const saved=sessionStorage.getItem(KEY),restored=saved?readDemoSession(JSON.parse(saved)):null;setSession(restored);if(saved&&!restored){sessionStorage.removeItem(KEY);setReason("Your demo session has expired. Please sign in again.")}}catch{try{sessionStorage.removeItem(KEY)}catch{}}setReady(true)},[]);
 useEffect(()=>{if(!session)return;const check=()=>{if(Date.now()>=session.expiresAt)signOut("Your demo session has expired. Please sign in again.")};const timer=setTimeout(check,Math.max(0,session.expiresAt-Date.now()));window.addEventListener("focus",check);return()=>{clearTimeout(timer);window.removeEventListener("focus",check)}},[session]);
 const signIn=(identity:DemoIdentity)=>{const next={identity,expiresAt:Date.now()+SESSION_DURATION};try{sessionStorage.setItem(KEY,JSON.stringify(next))}catch{}setReason("");setSession(next)};
 return <AuthContext.Provider value={{session,ready,reason,signIn,signOut}}>{children}</AuthContext.Provider>;
}
export function useDemoAuth(){const value=useContext(AuthContext);if(!value)throw Error("Demo auth missing");return value}

export function LoginGate({route,children}:{route:string;children:ReactNode}){
 const auth=useDemoAuth(),w=useWorkspace(),identity=auth.session?.identity;
 const agent=identity?.role==="agent"?w.agents.find(a=>a.id===identity.id):null;
 const invalidAgent=identity?.role==="agent"&&w.reviewReady&&(!agent||agent.status!=="Active"||!!agent.deletedAt);
 const redirect=auth.ready&&w.reviewReady?(!identity?route!=="login"?"/login":null:invalidAgent?"/login":identity.role==="agent"?(route!=="agent"||w.params.get("agent")!==identity.id)?"/agent?agent="+encodeURIComponent(identity.id):null:route==="login"?"/overview":null):null;
 useEffect(()=>{if(invalidAgent)auth.signOut("This demo account is unavailable. Contact the administrator.");if(redirect)w.router.replace(redirect)},[invalidAgent,redirect,w.router]);
 if(!auth.ready||!w.reviewReady||redirect)return <Localize><div className="app-loading" role="status">Loading workspace…</div></Localize>;
 if(!identity)return <LoginPage/>;
 return <>{children}</>;
}

export function SessionMenu(){
 const accountNavigation=useRef(false);
 const auth=useDemoAuth(),w=useWorkspace(),identity=auth.session?.identity;
 if(!identity)return null;
 function logout(){w.protect(()=>{w.setEditor(null);w.setItemEditor(null);w.setPending(null);w.setToast(null);auth.signOut();w.router.replace("/login")})}
 const name=identity.role==="admin"?w.profile.name:identity.name;
 const initials=name.trim().split(/\s+/).slice(0,2).map(part=>part[0]).join("").toUpperCase();
 return <Localize><Dropdown.Root><Dropdown.Trigger asChild><button className="account-menu-trigger" aria-label="Account menu"><span className="account-menu-avatar" style={{background:w.profile.color}}>{initials}</span><span className="account-menu-role">{identity.role==="admin"?"Administrator":"Agent"}</span><ChevronDown size={13}/></button></Dropdown.Trigger><Dropdown.Portal><Dropdown.Content className="account-menu-panel" onCloseAutoFocus={e=>{if(accountNavigation.current){e.preventDefault();accountNavigation.current=false}}} align="end" sideOffset={10} collisionPadding={14}><div className="account-menu-identity"><span className="account-menu-avatar" style={{background:w.profile.color}}>{initials}</span><div><strong>{name}</strong><small>{identity.email}</small></div></div><div className="account-menu-badges"><span>{identity.role==="admin"?"Administrator":"Agent"}</span><small>Demo session</small></div><Dropdown.Separator className="account-menu-divider"/>{identity.role==="admin"&&<Dropdown.Item className="account-menu-item" onSelect={()=>{accountNavigation.current=true;w.openAccountSettings()}}><Settings2 size={16}/><span>Account settings</span></Dropdown.Item>}{identity.role==="admin"&&w.pathname==="/agent"&&<Dropdown.Item className="account-menu-item" onSelect={()=>w.go("/settings",{},{section:"Users"})}><Users size={16}/><span>Back to administration</span></Dropdown.Item>}<Dropdown.Item className="account-menu-item account-menu-logout" onSelect={logout}><LogOut size={16}/><span>Sign out / Switch account</span></Dropdown.Item></Dropdown.Content></Dropdown.Portal></Dropdown.Root></Localize>;
}

function LoginPage(){
 const w=useWorkspace(),auth=useDemoAuth(),[role,setRole]=useState<LoginRole>("admin"),[email,setEmail]=useState(""),[password,setPassword]=useState(""),[show,setShow]=useState(false),[error,setError]=useState(""),[theme,setTheme]=useState<"light"|"dark">("dark"),[themeReady,setThemeReady]=useState(false);
 useEffect(()=>{try{const saved=localStorage.getItem("trackflow-theme");if(saved==="light"||saved==="dark")setTheme(saved)}catch{}setThemeReady(true)},[]);
 useEffect(()=>{if(themeReady){document.documentElement.dataset.theme=theme;try{localStorage.setItem("trackflow-theme",theme)}catch{}}},[theme,themeReady]);
 const accounts=demoAccounts(w.agents).filter(a=>a.role===role);
 function submit(e:React.FormEvent){e.preventDefault();const identity=authenticateDemo(role,email,password,w.agents);if(!identity){setError("Check your demo email, password and selected role.");return}setPassword("");auth.signIn(identity);w.router.replace(identity.role==="admin"?"/overview":"/agent?agent="+encodeURIComponent(identity.id))}
 return <Localize><div className="login-shell"><header className="login-header"><div className="login-brand"><Activity size={25}/><strong>TRACKFLOW<small>Promotion intelligence</small></strong></div><div><LanguageSwitcher/><ThemeSwitcher theme={theme} onChange={setTheme} ready={themeReady}/></div></header><main className="login-layout"><section className="login-story"><span className="eyebrow">ONE WORKSPACE. EVERY ROLE.</span><h1>Every role.<br/>A focused workspace.</h1><p>Manage campaigns, collaborate with agents and keep every review moving.</p><div className="login-flow"><article><span><Users size={21}/></span><div><strong>Assign with clarity</strong><small>Administrators manage campaigns and assignments.</small></div><Check size={15}/></article><article><span><UserRound size={21}/></span><div><strong>A workspace of your own</strong><small>Agents focus on their assigned campaigns and work.</small></div><Check size={15}/></article><article><span><ClipboardCheck size={21}/></span><div><strong>Every review, connected</strong><small>Submissions, feedback and decisions in one place.</small></div><Check size={15}/></article></div><div className="login-story-foot"><span className="live-dot"/>TRACKFLOW / Team workspace</div></section><section className="login-card"><span className="eyebrow">WELCOME BACK</span><h2>Sign in to your workspace</h2><p>Choose your role to continue.</p><div className="login-role-tabs cms-tab-bar" role="tablist" aria-label="Sign-in role">{(["admin","agent"] as const).map(r=><button type="button" role="tab" aria-selected={role===r} key={r} onClick={()=>{setRole(r);setEmail("");setPassword("");setError("")}}>{r==="admin"?<ShieldCheck size={17}/>:<UserRound size={17}/>}<span>{r==="admin"?"Administrator":"Agent"}</span></button>)}</div><form onSubmit={submit} noValidate><label className="field"><span>Sign-in email</span><div className="login-input"><Mail size={17}/><input type="email" autoComplete="off" aria-label="Sign-in email" placeholder="Enter your demo email" value={email} onChange={e=>{setEmail(e.target.value);setError("")}} required/></div></label><label className="field"><span>Sign-in password</span><div className="login-input"><ShieldCheck size={17}/><input type={show?"text":"password"} autoComplete="off" aria-label="Sign-in password" placeholder="Enter your demo password" value={password} onChange={e=>{setPassword(e.target.value);setError("")}} required/><button type="button" aria-label={show?"Hide password":"Show password"} onClick={()=>setShow(!show)}>{show?<EyeOff size={17}/>:<Eye size={17}/>}</button></div></label>{(error||auth.reason)&&<p role="alert" className="form-error">{error||auth.reason}</p>}<Button className="login-submit" type="submit">Sign in<ArrowRight size={17}/></Button></form><div className="login-demo"><span className="demo-pill">LOCAL DEMO</span><p>Use a demo account below. Do not enter a real password.</p><div className="login-demo-accounts">{accounts.map(a=><button type="button" key={a.id} onClick={()=>{setEmail(a.email);setPassword(DEMO_PASSWORD);setError("")}}><strong>{a.name}</strong><small>{a.email}</small><ArrowRight size={14}/></button>)}</div>{!accounts.length&&<p>No active agent accounts. Ask an administrator to add one.</p>}<small>Demo password: <code>{DEMO_PASSWORD}</code></small></div><p className="login-help">Need an account or password reset? Contact your administrator.</p></section></main><footer className="login-footer"><span>UI prototype · Demo accounts only</span><span>Sessions last 8 hours in this browser tab. Server-side authentication is not connected.</span></footer><NavigationGuard/></div></Localize>;
}
