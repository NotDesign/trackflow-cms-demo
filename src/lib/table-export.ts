export function tableCSV<T>(columns:{key:keyof T;label:string}[],rows:T[],label:(value:string)=>string=(v=>v)){
 const escape=(value:unknown)=>'"'+String(value??"").replace(/^[\s]*[=+@-]/,"'$&").replaceAll('"','""')+'"';
 return "\uFEFF"+[[...columns.map(c=>label(c.label))],...rows.map(row=>columns.map(c=>typeof row[c.key]==="string"?label(String(row[c.key])):row[c.key]))].map(row=>row.map(escape).join(",")).join("\r\n");
}
export function downloadTableCSV<T>(name:string,columns:{key:keyof T;label:string}[],rows:T[],label?:(value:string)=>string){
 const url=URL.createObjectURL(new Blob([tableCSV(columns,rows,label)],{type:"text/csv;charset=utf-8"}));
 const anchor=document.createElement("a");anchor.href=url;anchor.download=name;anchor.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
