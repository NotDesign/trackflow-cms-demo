import {clientGroups,clientMetricLabels,clientValue,type ClientSnapshot} from "./client-reports";
// Raster pages use the same loaded CJK fonts as the preview. No external PDF service receives data.
export async function clientReportPDF(s:ClientSnapshot,label:(s:string)=>string){
 await document.fonts.ready;
 const pages:Uint8Array[]=[],W=1240,H=1754,M=80,font='"Noto Sans TC Variable", "Noto Sans TC", sans-serif';
 let canvas!:HTMLCanvasElement,ctx!:CanvasRenderingContext2D,y=0,page=0;
 const text=(value:string,x:number,yy:number,size=21,color="#233245",weight=400)=>{ctx.font=`${weight} ${size}px ${font}`;ctx.fillStyle=color;ctx.fillText(value,x,yy)};
 const finish=()=>{text(`${label("Demo report")} · USD · Asia/Taipei`,M,H-65,17,"#5e7185");ctx.textAlign="right";text(String(page),W-M,H-65,17,"#5e7185");ctx.textAlign="left";const raw=atob(canvas.toDataURL("image/jpeg",.94).split(",")[1]);pages.push(Uint8Array.from(raw,c=>c.charCodeAt(0)))};
 const start=()=>{canvas=document.createElement("canvas");canvas.width=W;canvas.height=H;ctx=canvas.getContext("2d")!;ctx.fillStyle="#fff";ctx.fillRect(0,0,W,H);page++;text(s.config.brand,M,85,27,"#1d1d5a",700);ctx.textAlign="right";text(label("Demo report"),W-M,85,19,"#88632e");ctx.textAlign="left";y=135};
 const wrapped=(value:string,size=23,width=W-M*2)=>{ctx.font=`400 ${size}px ${font}`;let line="";for(const ch of value){if(ch==="\n"||ctx.measureText(line+ch).width>width){if(y>H-135){finish();start()}text(line,M,y,size);y+=size*1.7;line=ch==="\n"?"":ch}else line+=ch}if(line){if(y>H-135){finish();start()}text(line,M,y,size);y+=size*1.7}};
 const cols=s.config.metrics.length,first=300,cw=(W-2*M-first)/cols;
 const header=()=>{ctx.fillStyle="#e7f0fa";ctx.fillRect(M,y-25,W-2*M,52);text(label(clientGroups[s.config.group]),M+12,y+7,18);s.config.metrics.forEach((k,i)=>{ctx.textAlign="right";text(label(clientMetricLabels[k]),M+first+cw*(i+1)-12,y+7,18)});ctx.textAlign="left";y+=62};
 start();wrapped(s.config.title,35);wrapped(`${label("Client")}: ${s.config.client}`,23);wrapped(`${s.config.scope.from} — ${s.config.scope.to}`,22);wrapped(`${label("Snapshot time")}: ${new Date(s.created).toLocaleString(s.config.locale,{timeZone:"Asia/Taipei"})}`,18);for(const filter of s.scopeLabels)wrapped(filter,18);y+=15;
 wrapped(label("Demonstration data only. Not a live performance report."),20);if(s.config.note){y+=10;wrapped(s.config.note,22)}y+=20;
 if(y>H-280){finish();start()}header();
 for(const row of [...s.rows,s.total]){
  ctx.font=`400 19px ${font}`;const lines:string[]=[];let line="";for(const ch of row.name){if(ctx.measureText(line+ch).width>first-25){lines.push(line);line=ch}else line+=ch}if(line)lines.push(line);
  const height=Math.max(56,lines.length*28+18);if(y+height>H-140){finish();start();header()}
  if(row===s.total){ctx.fillStyle="#f1f5fa";ctx.fillRect(M,y-17,W-2*M,height)}lines.forEach((line,i)=>text(line,M+12,y+12+i*28,19));s.config.metrics.forEach((k,i)=>{ctx.textAlign="right";text(clientValue(k,row.values[k]||0,s.config.locale),M+first+cw*(i+1)-12,y+12,19)});ctx.textAlign="left";y+=height;ctx.strokeStyle="#d8e2ed";ctx.beginPath();ctx.moveTo(M,y-14);ctx.lineTo(W-M,y-14);ctx.stroke();
 }
 y+=24;wrapped(label("Unique visitors may overlap across groups. Totals are deduplicated; conversion rates are recalculated. Approved conversions only."),18);finish();
 const encoder=new TextEncoder(),parts:Uint8Array[]=[],offsets:number[]=[0];let size=0;const push=(v:string|Uint8Array)=>{const b=typeof v==="string"?encoder.encode(v):v;parts.push(b);size+=b.length};
 push("%PDF-1.4\n");const object=(n:number,value:string)=>{offsets[n]=size;push(`${n} 0 obj\n${value}\nendobj\n`)};
 object(1,"<< /Type /Catalog /Pages 2 0 R >>");object(2,`<< /Type /Pages /Count ${pages.length} /Kids [${pages.map((_,i)=>`${3+i*3} 0 R`).join(" ")}] >>`);
 pages.forEach((jpg,i)=>{const n=3+i*3;object(n,`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /XObject << /Im0 ${n+1} 0 R >> >> /Contents ${n+2} 0 R >>`);offsets[n+1]=size;push(`${n+1} 0 obj\n<< /Type /XObject /Subtype /Image /Width ${W} /Height ${H} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpg.length} >>\nstream\n`);push(jpg);push("\nendstream\nendobj\n");const cmd="q 595.28 0 0 841.89 0 0 cm /Im0 Do Q";object(n+2,`<< /Length ${encoder.encode(cmd).length} >>\nstream\n${cmd}\nendstream`)});
 const xref=size;push(`xref\n0 ${offsets.length}\n0000000000 65535 f \n`);for(let i=1;i<offsets.length;i++)push(String(offsets[i]).padStart(10,"0")+" 00000 n \n");push(`trailer\n<< /Size ${offsets.length} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`);const bytes=new Uint8Array(size);let cursor=0;for(const b of parts){bytes.set(b,cursor);cursor+=b.length}return new Blob([bytes],{type:"application/pdf"});
}
