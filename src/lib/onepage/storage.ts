import type {GamePage} from './model';
const DB='trackflow-onepage-studio-v1',STORE='pages';
async function database():Promise<IDBDatabase>{return new Promise((resolve,reject)=>{const r=indexedDB.open(DB,1);r.onupgradeneeded=()=>r.result.createObjectStore(STORE,{keyPath:'key'});r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);r.onblocked=()=>reject(Error('請關閉其他舊版編輯器分頁後再試。'))})}
export async function readPages(owner:string):Promise<GamePage[]>{const db=await database();try{return await new Promise((resolve,reject)=>{const tx=db.transaction(STORE,'readonly'),r=tx.objectStore(STORE).getAll();r.onsuccess=()=>resolve(r.result.filter((v:{owner:string})=>v.owner===owner).map((v:{page:GamePage})=>v.page).filter((p:GamePage)=>p.schema===1).sort((a:GamePage,b:GamePage)=>b.updatedAt.localeCompare(a.updatedAt)));r.onerror=()=>reject(r.error)})}finally{db.close()}}
export async function writePage(owner:string,page:GamePage):Promise<void>{const db=await database();try{await new Promise<void>((resolve,reject)=>{const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).put({key:owner+':'+page.id,owner,page});tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error)})}finally{db.close()}}
export async function deletePage(owner:string,id:string):Promise<void>{const db=await database();try{await new Promise<void>((resolve,reject)=>{const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).delete(owner+':'+id);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error)})}finally{db.close()}}
export async function readMedia(file:File,kind:'image'|'video'):Promise<string>{
 const types=kind==='image'?['image/png','image/jpeg','image/webp','image/gif','image/avif']:['video/mp4','video/webm','video/ogg'];
 if(!types.includes(file.type))throw Error(kind==='image'?'請選擇 PNG、JPG、WebP、GIF 或 AVIF 圖片。':'請選擇 MP4、WebM 或 Ogg 影片。');
 if(file.size>(kind==='image'?5:30)*1024*1024)throw Error(kind==='image'?'單張圖片請小於 5 MB。':'單支影片請小於 30 MB。');
 return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result));reader.onerror=()=>reject(Error('檔案讀取失敗，請重新選擇。'));reader.readAsDataURL(file)})
}
