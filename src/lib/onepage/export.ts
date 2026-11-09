import {safeUrl,type GamePage} from './model';
import {renderPage} from './render';
const blobData=(blob:Blob)=>new Promise<string>((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result));reader.onerror=()=>reject(Error('無法讀取匯出媒體。'));reader.readAsDataURL(blob)});
export async function exportPageHTML(page:GamePage,base:string):Promise<{html:string;externalMedia:boolean}>{
 const clone=structuredClone(page),cache=new Map<string,string>();let externalMedia=false;
 const embed=async(value:string)=>{const valid=safeUrl(value,'image');if(!valid||valid.startsWith('data:'))return valid;if(!valid.startsWith('demo-creatives/')){externalMedia=true;return valid}if(cache.has(valid))return cache.get(valid)!;const url=new URL(valid,base).href,response=await fetch(url);if(!response.ok)throw Error('匯出圖片讀取失敗，請稍後再試。');const result=await blobData(await response.blob());cache.set(valid,result);return result};
 clone.heroImage=await embed(clone.heroImage);clone.galleryImages=await Promise.all(clone.galleryImages.map(embed));if(clone.videoPoster)clone.videoPoster=await embed(clone.videoPoster);if(clone.videoUrl&&!clone.videoUrl.startsWith('data:'))externalMedia=true;
 return {html:renderPage(clone,base),externalMedia};
}
export function downloadHTML(html:string,name:string){const url=URL.createObjectURL(new Blob([html],{type:'text/html;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download=(name.replace(/[^\p{L}\p{N}\s_.-]/gu,'').slice(0,80)||'game-page')+'.html';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000)}
