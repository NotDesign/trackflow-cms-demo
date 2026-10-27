import type {ClientSnapshot} from "./client-reports";
export type DemoChat={id:string;client:string;name:string;kind:"private"|"group";chatId:string};
export type TelegramTest={id:string;reportId:string;title:string;client:string;recipient:DemoChat;message:string;fileName:string;bytes:number;at:string;actor:string;mode:"simulation";status:"Simulated"|"Failed";reason:string};
export function validDemoChat(c:DemoChat){return !!c&&typeof c.id==="string"&&typeof c.client==="string"&&!!c.client.trim()&&typeof c.name==="string"&&!!c.name.trim()&&c.name.trim().length<=80&&typeof c.chatId==="string"&&(c.kind==="group"?/^-[1-9]\d{0,19}$/:c.kind==="private"?/^[1-9]\d{0,19}$/:/$a/).test(c.chatId)}
export function validTelegramDraft(s:ClientSnapshot,target:DemoChat|undefined,message:string){return !!target&&validDemoChat(target)&&target.client===s.config.client&&!!message.trim()&&Array.from(message).length<=900}
export function defaultTelegramMessage(s:ClientSnapshot){return s.config.locale==="zh-TW"?`${s.config.client} 您好，\n附件為「${s.config.title}」。\n報表期間：${s.config.scope.from} 至 ${s.config.scope.to}\n本附件為虛構示範資料，非實際成效報表。`:`Hello ${s.config.client},\nAttached: ${s.config.title}.\nPeriod: ${s.config.scope.from} to ${s.config.scope.to}\nDemonstration data only; not a live performance report.`}
export function makeTelegramTest(s:ClientSnapshot,target:DemoChat,message:string,actor:string,at:string,id:string,bytes:number,reason=""):TelegramTest{
 if(!validTelegramDraft(s,target,message)||!Number.isFinite(bytes)||bytes<0||(!reason&&bytes===0))throw Error("Invalid Telegram test");
 return {id,reportId:s.id,title:s.config.title,client:s.config.client,recipient:{...target},message:message.trim(),fileName:`trackflow-demo-${s.id}.pdf`,bytes,at,actor,mode:"simulation",status:reason?"Failed":"Simulated",reason};
}
