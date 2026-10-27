import type {Agent} from "./agents-v8";

export type LoginRole="admin"|"agent";
export type DemoIdentity={id:string;role:LoginRole;name:string;email:string};
export type DemoSession={identity:DemoIdentity;expiresAt:number};
export const DEMO_PASSWORD="TrackflowDemo!";
export const SESSION_DURATION=8*60*60*1000;
export const demoAdmins:DemoIdentity[]=[
 {id:"ADM-1001",role:"admin",name:"Diane Wang",email:"diane@example.com"},
 {id:"ADM-1002",role:"admin",name:"Operations Admin",email:"operations@example.com"},
];
export function demoAccounts(agents:readonly Agent[]):DemoIdentity[]{return [...demoAdmins,...agents.filter(a=>a.status==="Active").map(a=>({id:a.id,role:"agent" as const,name:a.name,email:a.email}))]}
export function authenticateDemo(role:LoginRole,email:string,password:string,agents:readonly Agent[]):DemoIdentity|null{
 if(password!==DEMO_PASSWORD)return null;
 return demoAccounts(agents).find(a=>a.role===role&&a.email.toLowerCase()===email.trim().toLowerCase())||null;
}
export function readDemoSession(value:unknown,now=Date.now()):DemoSession|null{
 if(!value||typeof value!=="object")return null;
 const s=value as DemoSession,a=s.identity;
 if(!Number.isFinite(s.expiresAt)||s.expiresAt<=now||s.expiresAt>now+SESSION_DURATION||!a||typeof a.id!=="string"||typeof a.name!=="string"||typeof a.email!=="string"||!["admin","agent"].includes(a.role))return null;
 // This validates demo UI state only; no client-side value grants real access.
 if(a.role==="admin"&&!demoAdmins.some(d=>d.id===a.id&&d.email===a.email))return null;
 return s;
}
