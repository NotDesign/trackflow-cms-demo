import {CORE_GAME_PRESETS} from './core-catalog';
import {EDITORIAL_GAME_PRESETS} from './editorial-game-data';
import {ACTION_GAME_PRESETS} from './action-game-data';
export type TemplateId='explore'|'tactical'|'racing'|'urban'|'strategy'|'party'|'wuxia'|'survival'|'horror'|'pixel'|'cozy'|'roguelike'|'space'|'mecha'|'rhythm'|'sports';
export type PageSection='features'|'gallery'|'video'|'cta'|'showcase'|'modes'|'news'|'faq';
export type ShowcaseItem={name:string;tag:string;description:string;image:string};
export type ModeItem={title:string;tag:string;description:string};
export type NewsItem={title:string;category:string;date:string;description:string;image:string};
export type PageContent={showcaseTitle:string;showcaseIntro:string;showcase:ShowcaseItem[];modesTitle:string;modes:ModeItem[];newsTitle:string;news:NewsItem[];faqTitle:string;faq:{question:string;answer:string}[];galleryIntro:string;galleryCaptions:string[];platforms:string[];ctaNote:string};
export type GamePage={
 schema:1;id:string;name:string;templateId:TemplateId;isTemplate:boolean;campaignId:string;
 brand:string;eyebrow:string;title:string;subtitle:string;description:string;introTitle:string;featuresTitle:string;galleryTitle:string;videoTitle:string;
 heroImage:string;galleryImages:string[];videoUrl:string;videoPoster:string;
 ctaLabel:string;ctaUrl:string;appStoreUrl:string;googlePlayUrl:string;accent:string;features:{title:string;body:string}[];
 sections:Record<PageSection,boolean>;content:PageContent;updatedAt:string;
};
export type PageTemplate={id:TemplateId;name:string;genre:string;reference:string;layout:string;image:string;heroImage?:string;ctaLabel?:string;attribution?:string;accent:string;brand:string;title:string;subtitle:string;description:string;features:{title:string;body:string}[]};
const GAME_PRESETS=[...CORE_GAME_PRESETS,...EDITORIAL_GAME_PRESETS,...ACTION_GAME_PRESETS];
export const PAGE_TEMPLATES:PageTemplate[]=GAME_PRESETS.map(entry=>entry.template);
export const templateHero=(template:PageTemplate)=>template.heroImage||'demo-creatives/'+template.image+'.png';
export const DEFAULT_STORE_LINKS={appStoreUrl:'https://apps.apple.com/',googlePlayUrl:'https://play.google.com/store/games'};
export function pageFromTemplate(template:PageTemplate,campaignId=''):GamePage{
 const preset=GAME_PRESETS.find(entry=>entry.template.id===template.id);
 return {schema:1,id:crypto.randomUUID(),name:template.name+'・網頁',templateId:template.id,isTemplate:false,campaignId,brand:template.brand,eyebrow:'遊戲介紹',title:template.title,subtitle:template.subtitle,description:template.description,introTitle:'遊戲介紹',featuresTitle:'遊戲特色',galleryTitle:'遊戲畫面',videoTitle:'',heroImage:templateHero(template),galleryImages:[templateHero(template)],videoUrl:'',videoPoster:'',ctaLabel:template.ctaLabel||'探索遊戲',ctaUrl:'#explore',...DEFAULT_STORE_LINKS,accent:template.accent,features:structuredClone(template.features),...structuredClone(preset?.page||{}),sections:{features:true,gallery:true,video:false,cta:true,showcase:true,modes:true,news:true,faq:true},content:defaultContent(template.id),updatedAt:new Date().toISOString()};
}
export function safeUrl(value:string,kind:'image'|'video'|'link'='link'):string{
 const v=value.trim();if(!v)return '';
 if(kind==='link'&&v==='#explore')return v;
 if(kind==='image'&&/^data:image\/(png|jpe?g|webp|gif|avif);base64,[a-z\d+/=\s]+$/i.test(v))return v;
 if(kind==='video'&&/^data:video\/(mp4|webm|ogg);base64,[a-z\d+/=\s]+$/i.test(v))return v;
 if(kind==='image'&&/^demo-creatives\/[a-z\d._-]+\.(png|jpe?g|webp|avif)$/i.test(v))return v;
 try{const u=new URL(v);return ['https:','http:'].includes(u.protocol)&&!u.username&&!u.password?u.href:''}catch{return ''}
}
export function videoSource(value:string):{kind:'embed'|'file';url:string}|null{
 const safe=safeUrl(value,'video');if(!safe)return null;if(safe.startsWith('data:'))return {kind:'file',url:safe};
 const u=new URL(safe),host=u.hostname.toLowerCase();let id='';
 if(['youtube.com','www.youtube.com','m.youtube.com','youtube-nocookie.com','www.youtube-nocookie.com'].includes(host))id=u.searchParams.get('v')||u.pathname.match(/^\/(?:embed|shorts)\/([\w-]+)/)?.[1]||'';
 if(host==='youtu.be')id=u.pathname.slice(1).split('/')[0];
 if(id&&/^[\w-]{11}$/.test(id))return {kind:'embed',url:'https://www.youtube-nocookie.com/embed/'+id};
 if(['vimeo.com','www.vimeo.com','player.vimeo.com'].includes(host)){const match=u.pathname.match(/(?:^\/|\/video\/)(\d+)/);if(match)return {kind:'embed',url:'https://player.vimeo.com/video/'+match[1]}}
 return /\.(mp4|webm|ogg)$/i.test(u.pathname)?{kind:'file',url:safe}:null;
}
export function validatePage(p:GamePage):string[]{const e:string[]=[];if(!p.name.trim())e.push('請輸入網頁名稱。');if(!p.brand.trim()||!p.title.trim())e.push('請填寫遊戲名稱與主標題。');if(!safeUrl(p.heroImage,'image'))e.push('請上傳主視覺或輸入有效的圖片網址。');if(!p.ctaLabel.trim()||!safeUrl(p.ctaUrl))e.push('請填寫按鈕文字與有效的 HTTP／HTTPS 連結，或 #explore 頁內導覽。');const downloads=normalizePage(p);if(!safeUrl(downloads.appStoreUrl))e.push('請填寫有效的 App Store HTTP／HTTPS 下載連結。');if(!safeUrl(downloads.googlePlayUrl))e.push('請填寫有效的 Google Play HTTP／HTTPS 下載連結。');if(p.galleryImages.some(v=>!safeUrl(v,'image')))e.push('遊戲圖集含有無效的圖片網址。');for(const item of [...(p.content?.showcase||[]),...(p.content?.news||[])])if(item.image&&!safeUrl(item.image,'image'))e.push('內容區塊含有無效的圖片網址。');return e}
export function clonePage(p:GamePage,isTemplate=false):GamePage{return {...structuredClone(p),id:crypto.randomUUID(),name:p.name+(isTemplate?'・模板':'・副本'),isTemplate,updatedAt:new Date().toISOString()}}

export function defaultContent(id:TemplateId):PageContent{
 const preset=GAME_PRESETS.find(entry=>entry.template.id===id)||GAME_PRESETS[0];
 if(!preset.page.content)throw Error('模板內容未設定：'+id);
 return structuredClone(preset.page.content);
}
export function normalizePage(page:GamePage):GamePage{
 const defaults=defaultContent(page.templateId);
 return {...DEFAULT_STORE_LINKS,...page,content:{...defaults,...page.content},sections:Object.assign({features:true,gallery:true,video:false,cta:true,showcase:true,modes:true,news:true,faq:true},page.sections)};
}
