import {PAGE_TEMPLATES,normalizePage,safeUrl,type GamePage} from './model';
import {pageStyles} from './styles';
import {renderEditorial} from './layouts-editorial';
import {editorialStyles} from './styles-editorial';
import {renderAction} from './layouts-action';
import {actionStyles} from './styles-action';
import {renderCore} from './layouts-core';
import {coreStyles} from './styles-core';
import {appStoreBadge,googlePlayBadge} from './store-badges';
export const escapeHTML=(s:string)=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));

export function renderPage(input:GamePage,base:string,preview=false):string{
 const normalized=normalizePage(input),p=/官方網站|官網/.test(normalized.ctaLabel)?{...normalized,ctaLabel:'探索遊戲',ctaUrl:'#explore'}:normalized,c=p.content,e=escapeHTML,t=PAGE_TEMPLATES.find(t=>t.id===p.templateId)||PAGE_TEMPLATES[0];
 const url=(v:string)=>{const s=safeUrl(v,'image');return s.startsWith('demo-creatives/')?new URL(s,base).href:s};
 const pic=(value:string,alt:string,cls='',eager=false)=>url(value)?`<img class="${cls}" src="${e(url(value))}" alt="${e(alt)}" ${eager?'fetchpriority="high"':'loading="lazy"'} decoding="async">`:`<div class="media-placeholder" role="img" aria-label="${e(alt)}"></div>`;
 const target=safeUrl(p.ctaUrl)||'#explore';
 const link=(label=p.ctaLabel)=>`<a class="button" href="${e(target)}" ${target.startsWith('#')?'':'target="_blank" rel="noopener noreferrer"'}>${e(label||'探索遊戲')} <span aria-hidden="true">${target.startsWith('#')?'↓':'↗'}</span></a>`;
 const storeBadges=()=>`<div class="store-badges" role="group" aria-label="下載遊戲">${([{key:'app-store',url:p.appStoreUrl,label:'在 App Store 下載',image:appStoreBadge,width:108.85157,height:40},{key:'google-play',url:p.googlePlayUrl,label:'在 Google Play 下載',image:googlePlayBadge,width:646,height:250}]).map(store=>{const href=safeUrl(store.url),art=`<img src="${store.image}" alt="${store.label}" width="${store.width}" height="${store.height}" decoding="async">`;return href?`<a class="store-badge store-badge--${store.key}" href="${e(href)}" target="_blank" rel="noopener noreferrer" aria-label="${store.label}（另開分頁）">${art}</a>`:`<span class="store-badge store-badge--${store.key}" aria-disabled="true" title="請先設定下載連結">${art}</span>`}).join('')}</div>`;
 const resolved={...p,templateId:t.id},kit={e,pic,link,storeBadges,target};
 const content=renderCore(resolved,kit)??renderEditorial(resolved,kit)??renderAction(resolved,kit)??'';
 const accent=/^#[0-9a-f]{6}$/i.test(p.accent)?p.accent:t.accent;
 return `<!doctype html><html lang="zh-Hant"><head>${preview?'<base href="about:srcdoc">':''}<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow,noarchive"><title>${e(p.name)}｜${e(p.brand)}</title><meta name="description" content="${e(p.subtitle)}"><style>${pageStyles}${coreStyles}${editorialStyles}${actionStyles}.media-placeholder{min-height:200px;background:var(--panel);border:1px solid var(--line)}</style></head><body class="template-${t.id}" style="--accent:${accent}"><header class="wrap nav"><a class="brand" href="#top">${e(p.brand)}</a><nav class="nav-links" aria-label="網頁導覽"><a href="#explore">遊戲介紹</a>${p.sections.showcase&&c.showcase.length?'<a href="#showcase">'+(p.templateId==='racing'?'精選座駕':p.templateId==='party'?'派對造型':'遊戲圖鑑')+'</a>':''}${p.sections.news&&c.news.length?'<a href="#news">最新消息</a>':''}${link()}</nav></header><main id="top">${content}</main><footer class="wrap footer"><strong>${e(p.brand)}</strong><span>${e(t.attribution||'TRACKFLOW · 原創遊戲版型展示 · 圖片與內容可自行替換')}</span></footer></body></html>`;
}
