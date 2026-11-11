import {type GamePage} from './model';
import {renderPage} from './render';
import {embedPageMedia} from './media';
export async function exportPageHTML(page:GamePage,base:string):Promise<{html:string;externalMedia:boolean}>{
 const embedded=await embedPageMedia(page,base);
 return {html:renderPage(embedded.page,base),externalMedia:embedded.externalMedia};
}
export function downloadHTML(html:string,name:string){const url=URL.createObjectURL(new Blob([html],{type:'text/html;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download=(name.replace(/[^\p{L}\p{N}\s_.-]/gu,'').slice(0,80)||'game-page')+'.html';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000)}
