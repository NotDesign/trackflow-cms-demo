import{c as B,a as F,b as M}from"./index-DeWmlCmj.js";async function N(i,p){await document.fonts.ready;const T=[],l=1240,g=1754,r=80,w='"Noto Sans TC Variable", "Noto Sans TC", sans-serif';let $,e,n=0,b=0;const s=(t,o,c,f=21,a="#233245",S=400)=>{e.font=`${S} ${f}px ${w}`,e.fillStyle=a,e.fillText(t,o,c)},x=()=>{s(`${p("Demo report")} · USD · Asia/Taipei`,r,g-65,17,"#5e7185"),e.textAlign="right",s(String(b),l-r,g-65,17,"#5e7185"),e.textAlign="left";const t=atob($.toDataURL("image/jpeg",.94).split(",")[1]);T.push(Uint8Array.from(t,o=>o.charCodeAt(0)))},u=()=>{$=document.createElement("canvas"),$.width=l,$.height=g,e=$.getContext("2d"),e.fillStyle="#fff",e.fillRect(0,0,l,g),b++,s(i.config.brand,r,85,27,"#1d1d5a",700),e.textAlign="right",s(p("Demo report"),l-r,85,19,"#88632e"),e.textAlign="left",n=135},h=(t,o=23,c=l-r*2)=>{e.font=`400 ${o}px ${w}`;let f="";for(const a of t)a===`
`||e.measureText(f+a).width>c?(n>g-135&&(x(),u()),s(f,r,n,o),n+=o*1.7,f=a===`
`?"":a):f+=a;f&&(n>g-135&&(x(),u()),s(f,r,n,o),n+=o*1.7)},L=i.config.metrics.length,A=300,D=(l-2*r-A)/L,C=()=>{e.fillStyle="#e7f0fa",e.fillRect(r,n-25,l-2*r,52),s(p(F[i.config.group]),r+12,n+7,18),i.config.metrics.forEach((t,o)=>{e.textAlign="right",s(p(M[t]),r+A+D*(o+1)-12,n+7,18)}),e.textAlign="left",n+=62};u(),h(i.config.title,35),h(`${p("Client")}: ${i.config.client}`,23),h(`${i.config.scope.from} — ${i.config.scope.to}`,22),h(`${p("Snapshot time")}: ${new Date(i.created).toLocaleString(i.config.locale,{timeZone:"Asia/Taipei"})}`,18);for(const t of i.scopeLabels)h(t,18);n+=15,h(p("Demonstration data only. Not a live performance report."),20),i.config.note&&(n+=10,h(i.config.note,22)),n+=20,n>g-280&&(x(),u()),C();for(const t of[...i.rows,i.total]){e.font=`400 19px ${w}`;const o=[];let c="";for(const a of t.name)e.measureText(c+a).width>A-25?(o.push(c),c=a):c+=a;c&&o.push(c);const f=Math.max(56,o.length*28+18);n+f>g-140&&(x(),u(),C()),t===i.total&&(e.fillStyle="#f1f5fa",e.fillRect(r,n-17,l-2*r,f)),o.forEach((a,S)=>s(a,r+12,n+12+S*28,19)),i.config.metrics.forEach((a,S)=>{e.textAlign="right",s(B(a,t.values[a]||0,i.config.locale),r+A+D*(S+1)-12,n+12,19)}),e.textAlign="left",n+=f,e.strokeStyle="#d8e2ed",e.beginPath(),e.moveTo(r,n-14),e.lineTo(l-r,n-14),e.stroke()}n+=24,h(p("Unique visitors may overlap across groups. Totals are deduplicated; conversion rates are recalculated. Approved conversions only."),18),x();const v=new TextEncoder,j=[],m=[0];let y=0;const d=t=>{const o=typeof t=="string"?v.encode(t):t;j.push(o),y+=o.length};d(`%PDF-1.4
`);const R=(t,o)=>{m[t]=y,d(`${t} 0 obj
${o}
endobj
`)};R(1,"<< /Type /Catalog /Pages 2 0 R >>"),R(2,`<< /Type /Pages /Count ${T.length} /Kids [${T.map((t,o)=>`${3+o*3} 0 R`).join(" ")}] >>`),T.forEach((t,o)=>{const c=3+o*3;R(c,`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /XObject << /Im0 ${c+1} 0 R >> >> /Contents ${c+2} 0 R >>`),m[c+1]=y,d(`${c+1} 0 obj
<< /Type /XObject /Subtype /Image /Width ${l} /Height ${g} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${t.length} >>
stream
`),d(t),d(`
endstream
endobj
`);const f="q 595.28 0 0 841.89 0 0 cm /Im0 Do Q";R(c+2,`<< /Length ${v.encode(f).length} >>
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
