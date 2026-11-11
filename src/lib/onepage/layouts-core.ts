import type {GamePage} from './model';
import type {RenderKit} from './layout-kit';

/** Game-first compositions. Content and images stay editable in the CMS. */
export function renderCore(p:GamePage,k:RenderKit):string|null{
 const {e,pic,link,storeBadges}=k,c=p.content;
 const title=(heading:string,intro='')=>`<header class="gc-title"><h2>${e(heading)}</h2>${intro?`<p>${e(intro)}</p>`:''}</header>`;
 const intro=(cls:string)=>`<section id="explore" class="${cls} gc-shell" data-section="intro"><h2>${e(p.introTitle)}</h2><p>${e(p.description)}</p></section>`;
 const faqs=()=>!p.sections.faq?'':`<section class="gc-faq gc-shell" data-section="faq">${title(c.faqTitle)}<div>${c.faq.map(f=>`<details><summary>${e(f.question)}<span aria-hidden="true">＋</span></summary><p>${e(f.answer)}</p></details>`).join('')}</div></section>`;
 const end=(cls:string)=>!p.sections.cta?'':`<section class="${cls} gc-end" data-section="cta"><div class="gc-shell"><h2>${e(p.title)}</h2><p>${e(p.subtitle)}</p>${link()}<div class="gc-platforms">${c.platforms.map(v=>`<span>${e(v)}</span>`).join('')}</div><small>${e(c.ctaNote)}</small></div></section>`;
 const newsCards=(cls:string)=>!p.sections.news?'':`<section id="news" class="${cls} gc-shell" data-section="news">${title(c.newsTitle)}<div>${c.news.map(n=>`<article><div class="gc-news-image">${pic(n.image,n.title)}</div><div class="gc-news-copy"><small>${e(n.category)}<time>${e(n.date)}</time></small><h3>${e(n.title)}</h3><p>${e(n.description)}</p></div></article>`).join('')}</div></section>`;
 const features=(cls:string)=>!p.sections.features?'':`<section class="${cls} gc-shell" data-section="features">${title(p.featuresTitle)}<div>${p.features.map(f=>`<article><h3>${e(f.title)}</h3><p>${e(f.body)}</p></article>`).join('')}</div></section>`;
 const gallery=(cls:string)=>!p.sections.gallery||!p.galleryImages.length?'':`<section class="${cls}" data-section="gallery"><div class="gc-shell">${title(p.galleryTitle,c.galleryIntro)}<div>${p.galleryImages.map((v,i)=>`<figure>${pic(v,c.galleryCaptions[i]||p.brand+' 遊戲畫面')}<figcaption>${e(c.galleryCaptions[i]||'遊戲畫面')}</figcaption></figure>`).join('')}</div></div></section>`;
 if(p.templateId==='explore')return `<div class="gi-page">
  <section class="gi-hero" data-section="hero"><div class="gi-keyart">${pic(p.heroImage,p.brand+' 主視覺','',true)}</div><div class="gi-download gc-shell"><div><p>${e(p.eyebrow)}</p><h1>${e(p.title)}</h1><span>${e(p.subtitle)}</span></div>${storeBadges()}</div></section>
  ${intro('gi-intro')}
  ${p.sections.showcase&&c.showcase.length?`<section class="gi-worlds" id="showcase" data-section="showcase"><div class="gc-shell">${title(c.showcaseTitle,c.showcaseIntro)}<div class="gi-world-tabs" style="--items:${c.showcase.length}" role="group" aria-label="${e(c.showcaseTitle)}">${c.showcase.map((s,i)=>`<input class="gc-choice" name="gi-world" id="gi-world-${i}" type="radio" aria-label="查看 ${e(s.name)}" ${i===0?'checked':''}><label for="gi-world-${i}" style="--col:${i+1}">${e(s.name)}</label><article class="gi-world"><div>${pic(s.image,s.name)}</div><div><small>${e(s.tag)}</small><h3>${e(s.name)}</h3><p>${e(s.description)}</p></div></article>`).join('')}</div></div></section>`:''}
  ${newsCards('gi-news')}
  ${p.sections.modes?`<section class="gi-adventures gc-shell" data-section="modes">${title(c.modesTitle)}<div>${c.modes.map(m=>`<article><span aria-hidden="true">◇</span><small>${e(m.tag)}</small><h3>${e(m.title)}</h3><p>${e(m.description)}</p></article>`).join('')}</div></section>`:''}
  ${gallery('gi-gallery')}${features('gi-features')}${faqs()}${end('gi-end')}</div>`;
 if(p.templateId==='tactical')return `<div class="pm-page">
  <section class="pm-hero" data-section="hero"><div class="pm-keyart">${pic(p.heroImage,p.brand+' 主視覺','',true)}</div><div class="pm-download gc-shell"><div><p>${e(p.eyebrow)}</p><h1>${e(p.title)}</h1><span>${e(p.subtitle)}</span></div>${storeBadges()}</div></section>
  ${newsCards('pm-news')}${intro('pm-intro')}
  ${p.sections.showcase&&c.showcase.length?`<section class="pm-play" id="showcase" data-section="showcase"><div class="gc-shell">${title(c.showcaseTitle,c.showcaseIntro)}<div class="pm-play-switch" style="--items:${c.showcase.length}" role="group" aria-label="${e(c.showcaseTitle)}">${c.showcase.map((s,i)=>`<input class="gc-choice" type="radio" name="pm-play" id="pm-play-${i}" aria-label="查看 ${e(s.name)}" ${i===0?'checked':''}><label for="pm-play-${i}" style="--row:${i+1}"><strong>${e(s.name)}</strong><small>${e(s.tag)}</small><span aria-hidden="true">›</span></label><article class="pm-play-detail"><div>${pic(s.image,s.name)}</div><div><h3>${e(s.name)}</h3><p>${e(s.description)}</p></div></article>`).join('')}</div></div></section>`:''}
  ${p.sections.modes?`<section class="pm-modes gc-shell" data-section="modes">${title(c.modesTitle)}<div>${c.modes.map(m=>`<details><summary><strong>${e(m.title)}</strong><small>${e(m.tag)}</small><span aria-hidden="true">＋</span></summary><p>${e(m.description)}</p></details>`).join('')}</div></section>`:''}
  ${gallery('pm-gallery')}${features('pm-features')}${faqs()}${end('pm-end')}</div>`;
 if(p.templateId==='racing')return `<div class="al-page">
  <section class="al-hero" data-section="hero"><div class="al-keyart">${pic(p.heroImage,p.brand+' 主視覺','',true)}<div class="al-hero-name"><p>${e(p.eyebrow)}</p><h1>${e(p.title)}</h1><span>${e(p.subtitle)}</span>${link()}</div></div><div class="al-download gc-shell">${storeBadges()}<a href="#showcase">${e(c.showcaseTitle)} <span aria-hidden="true">↓</span></a></div></section>
  ${intro('al-intro')}
  ${p.sections.showcase?`<section class="al-garage" id="showcase" data-section="showcase"><div class="gc-shell">${title(c.showcaseTitle,c.showcaseIntro)}<div>${c.showcase.map(s=>`<article><div>${pic(s.image,s.name)}</div><div><small>${e(s.tag)}</small><h3>${e(s.name)}</h3><p>${e(s.description)}</p></div></article>`).join('')}</div></div></section>`:''}
  ${features('al-features')}
  ${p.sections.modes?`<section class="al-modes gc-shell" data-section="modes">${title(c.modesTitle)}${c.modes.map(m=>`<article><h3>${e(m.title)}</h3><small>${e(m.tag)}</small><p>${e(m.description)}</p></article>`).join('')}</section>`:''}
  ${newsCards('al-news')}${gallery('al-gallery')}${faqs()}${end('al-end')}</div>`;
 if(p.templateId==='urban')return `<div class="zz-page">
  <section class="zz-hero" data-section="hero"><div class="zz-keyart">${pic(p.heroImage,p.brand+' 主視覺','',true)}</div><div class="zz-download gc-shell"><div><p>${e(p.eyebrow)}</p><h1>${e(p.title)}</h1><span>${e(p.subtitle)}</span></div>${storeBadges()}</div></section>
  ${newsCards('zz-news')}
  ${p.sections.showcase&&c.showcase.length?`<section class="zz-agents" id="showcase" data-section="showcase"><div class="gc-shell">${title(c.showcaseTitle,c.showcaseIntro)}<div class="zz-agents-switch" style="--items:${c.showcase.length}" role="group" aria-label="${e(c.showcaseTitle)}">${c.showcase.map((s,i)=>`<input class="gc-choice" type="radio" name="zz-agent" id="zz-agent-${i}" aria-label="查看 ${e(s.name)}" ${i===0?'checked':''}><label for="zz-agent-${i}" style="--col:${i+1}">${e(s.name)}</label><article class="zz-agent"><div>${pic(s.image,s.name)}</div><div><small>${e(s.tag)}</small><h3>${e(s.name)}</h3><p>${e(s.description)}</p></div></article>`).join('')}</div></div></section>`:''}
  ${intro('zz-intro')}${features('zz-features')}
  ${p.sections.modes?`<section class="zz-modes gc-shell" data-section="modes">${title(c.modesTitle)}<div>${c.modes.map(m=>`<article><div><small>${e(m.tag)}</small><h3>${e(m.title)}</h3></div><p>${e(m.description)}</p></article>`).join('')}</div></section>`:''}
  ${gallery('zz-gallery')}${faqs()}${end('zz-end')}</div>`;
 if(p.templateId==='strategy')return `<div class="wr-page">
  <section class="wr-hero" data-section="hero"><div class="wr-keyart">${pic(p.heroImage,p.brand+' 英雄主視覺','',true)}<div class="wr-keyart-copy gc-shell"><p>${e(p.eyebrow)}</p><h1>${e(p.title)}</h1><span>${e(p.subtitle)}</span></div></div><div class="wr-download">${storeBadges()}</div></section>
  ${intro('wr-intro')}
  ${p.sections.showcase&&c.showcase.length?`<section class="wr-champions" id="showcase" data-section="showcase"><div class="gc-shell">${title(c.showcaseTitle,c.showcaseIntro)}<div class="wr-champion-switch" role="group" aria-label="${e(c.showcaseTitle)}" style="--items:${c.showcase.length}">${c.showcase.map((s,i)=>`<input class="gc-choice" type="radio" name="wr-champion" id="wr-champion-${i}" aria-label="選擇 ${e(s.name)}" ${i===0?'checked':''}><label for="wr-champion-${i}" style="--col:${i+1}">${e(s.name)}</label><article class="wr-champion"><div class="wr-champion-art">${pic(s.image,s.name)}</div><div><small>${e(s.tag)}</small><h3>${e(s.name)}</h3><p>${e(s.description)}</p></div></article>`).join('')}</div></div></section>`:''}
  ${p.sections.modes?`<section class="wr-teamplay gc-shell" data-section="modes">${title(c.modesTitle)}<div>${c.modes.map(m=>`<article><small>${e(m.tag)}</small><h3>${e(m.title)}</h3><p>${e(m.description)}</p></article>`).join('')}</div></section>`:''}
  ${gallery('wr-gallery')}${newsCards('wr-news')}${features('wr-features')}${faqs()}${end('wr-end')}</div>`;
 if(p.templateId==='party')return `<div class="ep-page">
  <section class="ep-hero" data-section="hero"><div class="ep-keyart">${pic(p.heroImage,p.brand+' 樂園主視覺','',true)}</div><div class="ep-download gc-shell"><div><p>${e(p.eyebrow)}</p><h1>${e(p.title)}</h1><span>${e(p.subtitle)}</span></div>${storeBadges()}</div></section>
  ${intro('ep-intro')}
  ${p.sections.modes?`<section class="ep-play" data-section="modes"><div class="gc-shell">${title(c.modesTitle)}<div>${c.modes.map((m,i)=>`<article><div class="ep-play-art">${pic(p.galleryImages[i%Math.max(p.galleryImages.length,1)]||p.heroImage,m.title)}</div><div><small>${e(m.tag)}</small><h3>${e(m.title)}</h3><p>${e(m.description)}</p></div></article>`).join('')}</div></div></section>`:''}
  ${p.sections.showcase?`<section class="ep-looks gc-shell" id="showcase" data-section="showcase">${title(c.showcaseTitle,c.showcaseIntro)}<div>${c.showcase.map(s=>`<article><div>${pic(s.image,s.name)}</div><small>${e(s.tag)}</small><h3>${e(s.name)}</h3><p>${e(s.description)}</p></article>`).join('')}</div></section>`:''}
  ${newsCards('ep-news')}${gallery('ep-gallery')}${features('ep-features')}${faqs()}${end('ep-end')}</div>`;
 return null;
}
