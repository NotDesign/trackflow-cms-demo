import{c as B,a as F,b as M}from"./index-Cblydjmw.js";async function N(i,p){await document.fonts.ready;const T=[],l=1240,g=1754,c=80,b='"Noto Sans TC Variable", "Noto Sans TC", sans-serif';let $,e,n=0,w=0;const s=(t,o,r,f=21,a="#20243c",S=400)=>{e.font=`${S} ${f}px ${b}`,e.fillStyle=a,e.fillText(t,o,r)},x=()=>{s(`${p("Demo report")} · USD · Asia/Taipei`,c,g-65,17,"#626d84"),e.textAlign="right",s(String(w),l-c,g-65,17,"#626d84"),e.textAlign="left";const t=atob($.toDataURL("image/jpeg",.94).split(",")[1]);T.push(Uint8Array.from(t,o=>o.charCodeAt(0)))},u=()=>{$=document.createElement("canvas"),$.width=l,$.height=g,e=$.getContext("2d"),e.fillStyle="#fff",e.fillRect(0,0,l,g),w++,s(i.config.brand,c,85,27,"#1d1d5a",700),e.textAlign="right",s(p("Demo report"),l-c,85,19,"#88632e"),e.textAlign="left",n=135},h=(t,o=23,r=l-c*2)=>{e.font=`400 ${o}px ${b}`;let f="";for(const a of t)a===`
`||e.measureText(f+a).width>r?(n>g-135&&(x(),u()),s(f,c,n,o),n+=o*1.7,f=a===`
`?"":a):f+=a;f&&(n>g-135&&(x(),u()),s(f,c,n,o),n+=o*1.7)},L=i.config.metrics.length,A=300,D=(l-2*c-A)/L,C=()=>{e.fillStyle="#ebedf8",e.fillRect(c,n-25,l-2*c,52),s(p(F[i.config.group]),c+12,n+7,18),i.config.metrics.forEach((t,o)=>{e.textAlign="right",s(p(M[t]),c+A+D*(o+1)-12,n+7,18)}),e.textAlign="left",n+=62};u(),h(i.config.title,35),h(`${p("Client")}: ${i.config.client}`,23),h(`${i.config.scope.from} — ${i.config.scope.to}`,22),h(`${p("Snapshot time")}: ${new Date(i.created).toLocaleString(i.config.locale,{timeZone:"Asia/Taipei"})}`,18);for(const t of i.scopeLabels)h(t,18);n+=15,h(p("Demonstration data only. Not a live performance report."),20),i.config.note&&(n+=10,h(i.config.note,22)),n+=20,n>g-280&&(x(),u()),C();for(const t of[...i.rows,i.total]){e.font=`400 19px ${b}`;const o=[];let r="";for(const a of t.name)e.measureText(r+a).width>A-25?(o.push(r),r=a):r+=a;r&&o.push(r);const f=Math.max(56,o.length*28+18);n+f>g-140&&(x(),u(),C()),t===i.total&&(e.fillStyle="#f1f3fa",e.fillRect(c,n-17,l-2*c,f)),o.forEach((a,S)=>s(a,c+12,n+12+S*28,19)),i.config.metrics.forEach((a,S)=>{e.textAlign="right",s(B(a,t.values[a]||0,i.config.locale),c+A+D*(S+1)-12,n+12,19)}),e.textAlign="left",n+=f,e.strokeStyle="#dae0ee",e.beginPath(),e.moveTo(c,n-14),e.lineTo(l-c,n-14),e.stroke()}n+=24,h(p("Unique visitors may overlap across groups. Totals are deduplicated; conversion rates are recalculated. Approved conversions only."),18),x();const v=new TextEncoder,j=[],m=[0];let y=0;const d=t=>{const o=typeof t=="string"?v.encode(t):t;j.push(o),y+=o.length};d(`%PDF-1.4
`);const R=(t,o)=>{m[t]=y,d(`${t} 0 obj
${o}
endobj
`)};R(1,"<< /Type /Catalog /Pages 2 0 R >>"),R(2,`<< /Type /Pages /Count ${T.length} /Kids [${T.map((t,o)=>`${3+o*3} 0 R`).join(" ")}] >>`),T.forEach((t,o)=>{const r=3+o*3;R(r,`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /XObject << /Im0 ${r+1} 0 R >> >> /Contents ${r+2} 0 R >>`),m[r+1]=y,d(`${r+1} 0 obj
<< /Type /XObject /Subtype /Image /Width ${l} /Height ${g} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${t.length} >>
stream
`),d(t),d(`
endstream
endobj
`);const f="q 595.28 0 0 841.89 0 0 cm /Im0 Do Q";R(r+2,`<< /Length ${v.encode(f).length} >>
stream
${f}
endstream`)});const U=y;d(`xref
0 ${m.length}
0000000000 65535 f 
`);for(let t=1;t<m.length;t++)d(String(m[t]).padStart(10,"0")+` 00000 n 
`);d(`trailer
<< /Size ${m.length} /Root 1 0 R >>
startxref
${U}
%%EOF`);const P=new Uint8Array(y);let E=0;for(const t of j)P.set(t,E),E+=t.length;return new Blob([P],{type:"application/pdf"})}export{N as clientReportPDF};
