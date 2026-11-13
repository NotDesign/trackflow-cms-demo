import {normalizePage,safeUrl,type GamePage} from './model';

// Resolve protected Site assets in the authenticated host, then pass only image
// bytes into the opaque preview. The iframe keeps its isolated origin.
const embeddedImages=new Map<string,Promise<string>>();
const blobData=(blob:Blob)=>new Promise<string>((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result));reader.onerror=()=>reject(Error('無法讀取網頁圖片。'));reader.readAsDataURL(blob)});
export async function embedPageMedia(page:GamePage,base:string):Promise<{page:GamePage;externalMedia:boolean}>{
 const clone=structuredClone(normalizePage(page));let externalMedia=false;
 const embed=async(value:string)=>{
  const valid=safeUrl(value,'image');if(!valid||valid.startsWith('data:'))return valid;
  if(!valid.startsWith('demo-creatives/')){externalMedia=true;return valid}
  const url=new URL(valid,base).href;
  if(!embeddedImages.has(url)){
   const pending=fetch(url,{credentials:'same-origin'}).then(async response=>{
    if(!response.ok)throw Error('網頁圖片載入失敗，請重新開啟預覽。');
    const blob=await response.blob();if(!/^image\/(png|jpe?g|webp|gif|avif)$/i.test(blob.type))throw Error('圖片回應格式不正確，請重新登入網站後再試。');
    return blobData(blob);
   }).catch(error=>{embeddedImages.delete(url);throw error});
   embeddedImages.set(url,pending);
  }
  return embeddedImages.get(url)!;
 };
 const [hero,mobile,device,intro,gallery,features,modes,faq,showcase,news]=await Promise.all([
  embed(clone.heroImage),embed(clone.heroMobileImage||''),embed(clone.deviceFrameImage||''),embed(clone.introImage||''),Promise.all(clone.galleryImages.map(embed)),
  Promise.all(clone.features.map(async item=>({...item,image:await embed(item.image||'')}))),
  Promise.all(clone.content.modes.map(async item=>({...item,image:await embed(item.image||'')}))),embed(clone.content.faqImage||''),
  Promise.all(clone.content.showcase.map(async item=>({...item,image:await embed(item.image)}))),
  Promise.all(clone.content.news.map(async item=>({...item,image:await embed(item.image)})))
 ]);
 clone.heroImage=hero;clone.heroMobileImage=mobile;clone.deviceFrameImage=device;clone.introImage=intro;clone.galleryImages=gallery;clone.features=features;clone.content.modes=modes;clone.content.faqImage=faq;clone.content.showcase=showcase;clone.content.news=news;
 return {page:clone,externalMedia};
}
