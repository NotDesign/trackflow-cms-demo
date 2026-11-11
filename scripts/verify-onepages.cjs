const fs=require('fs'),path=require('path'),ts=require('typescript'),assert=require('assert');
const cache=new Map();function load(file){file=path.resolve(file);if(cache.has(file))return cache.get(file).exports;const m={exports:{}};cache.set(file,m);const js=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText;new Function('exports','require','module',js)(m.exports,p=>p.startsWith('.')?load(path.resolve(path.dirname(file),p+'.ts')):require(p),m);return m.exports}
const m=load('src/lib/onepage/model.ts'),r=load('src/lib/onepage/render.ts');assert.equal(m.PAGE_TEMPLATES.length,16);assert.equal(new Set(m.PAGE_TEMPLATES.map(t=>t.id)).size,16);
for(const t of m.PAGE_TEMPLATES){const p=m.pageFromTemplate(t);assert.deepEqual(m.validatePage(p),[]);assert(fs.existsSync('public/'+p.heroImage));assert(p.galleryImages.length>=1);assert(new Set([p.heroImage,...p.galleryImages]).size>=1);for(const image of p.galleryImages)assert(fs.existsSync('public/'+image));const html=r.renderPage(p,'https://demo.example/cms/');assert(html.includes('template-'+t.id));assert(html.includes('https://demo.example/cms/'+p.heroImage));assert(html.includes('name="viewport"'));assert(html.includes('name="robots"'));assert(!html.includes('<video'))}
const p=m.pageFromTemplate(m.PAGE_TEMPLATES[0]);p.title='</h1><script>alert("XSS")</script>';p.ctaUrl='javascript:alert(1)';p.heroImage='data:image/svg+xml;base64,AAAA';const html=r.renderPage(p,'https://demo.example/');assert(!html.includes('<script>'));assert(!html.includes('javascript:'));assert(!html.includes('data:image/svg+xml;base64,AAAA'));assert(m.validatePage(p).length>=2);
assert.equal(m.safeUrl('https://trusted.example@evil.example'),'');assert.equal(m.videoSource('javascript:alert(1)'),null);assert.equal(m.videoSource('https://youtube.com.evil.example/watch?v=dQw4w9WgXcQ'),null);assert.deepEqual(m.videoSource('https://youtu.be/dQw4w9WgXcQ'),{kind:'embed',url:'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ'});assert(m.videoSource('data:video/webm;base64,AAAA'));assert.equal(m.videoSource('https://player.vimeo.com/video/123456').url,'https://player.vimeo.com/video/123456');
const good=m.pageFromTemplate(m.PAGE_TEMPLATES[1]);good.sections.gallery=false;good.videoUrl='https://example.com/trailer.mp4';const out=r.renderPage(good,'https://demo.example/');assert(!out.includes('id="gallery"'));assert(!out.includes('<video'));assert(!out.includes('<iframe'));const c=m.clonePage(good,true);assert(c.id!==good.id);assert(c.isTemplate);c.features[0].title='edited';assert(c.features[0].title!==good.features[0].title);
console.log('PASS: sixteen distinct layouts, local assets, export URLs, escaping, unsafe URL rejection, video parsing, section toggles and independent copies.');

// Verify exported files carry the template media, not deployment-only paths.
global.FileReader=class{readAsDataURL(blob){blob.arrayBuffer().then(bytes=>{this.result='data:'+blob.type+';base64,'+Buffer.from(bytes).toString('base64');this.onload()}).catch(()=>this.onerror())}};
global.fetch=async(url,options)=>{assert.equal(options.credentials,'same-origin');const file=new URL(url).pathname.split('/cms/')[1];return new Response(fs.readFileSync(path.join('public',file)),{headers:{'Content-Type':file.endsWith('.jpg')?'image/jpeg':'image/png'}})};
(async()=>{const exporter=load('src/lib/onepage/export.ts');for(const template of m.PAGE_TEMPLATES){const page=m.pageFromTemplate(template);const output=await exporter.exportPageHTML(page,'https://demo.example/cms/');assert(!output.externalMedia);assert(output.html.includes('data:image/'));assert(!output.html.includes('https://demo.example/cms/demo-creatives/'));assert(output.html.includes(page.title));assert.equal((output.html.match(/class="store-badge store-badge--/g)||[]).length,2);assert(output.html.includes('data:image/svg+xml;base64,'));assert(output.html.includes('data:image/png;base64,'));}const media=load('src/lib/onepage/media.ts'),source=m.pageFromTemplate(m.PAGE_TEMPLATES[0]);
 const embedded=await media.embedPageMedia(source,'https://private-site.example/cms/');
 const preview=r.renderPage(embedded.page,'https://private-site.example/cms/',true);
 assert(!preview.includes('https://private-site.example/cms/demo-creatives/'));
 assert(source.heroImage.startsWith('demo-creatives/'),'embedding must not mutate saved drafts');
 const originalFetch=global.fetch;global.fetch=async()=>new Response('<html>sign in</html>',{headers:{'Content-Type':'text/html'}});
 await assert.rejects(()=>media.embedPageMedia(source,'https://auth-rejection.example/cms/'),/圖片回應格式/);
 global.fetch=originalFetch;
 const ui=fs.readFileSync('src/components/onepage-studio.tsx','utf8');assert(!ui.includes('allow-same-origin'));assert(!ui.includes('allow-scripts'));
 console.log('PASS: sixteen self-contained HTML exports, authenticated preview media, rejected login HTML and isolated script-free iframe.');})().catch(e=>{console.error(e);process.exitCode=1});

assert(r.renderPage(m.pageFromTemplate(m.PAGE_TEMPLATES[0]),'https://demo.example/',true).includes('<base href="about:srcdoc">'));

// Existing saved drafts gain new sections without losing their own content or disabled sections.
const legacy=m.pageFromTemplate(m.PAGE_TEMPLATES[0]);delete legacy.content;legacy.title='保留我的標題';legacy.sections={features:false,gallery:true,video:true,cta:true};const migrated=m.normalizePage(legacy);assert.equal(migrated.title,'保留我的標題');assert.equal(migrated.sections.features,false);assert(migrated.content.showcase.length>=3);
const orders=new Set();for(const template of m.PAGE_TEMPLATES){const page=m.pageFromTemplate(template),markup=r.renderPage(page,'https://demo.example/cms/');orders.add([...markup.matchAll(/data-section="(.*?)"/g)].map(x=>x[1]).join(','));assert(page.content.showcase.length>=3);assert(page.content.modes.length>=3);assert(page.content.news.length>=3);assert(page.content.faq.length>=3);assert(markup.length>30000);page.content.news[0].title='<script>alert(1)</script>';page.content.showcase[0].name='<img onerror=alert(1)>';const escaped=r.renderPage(page,'https://demo.example/');assert(!escaped.includes('<script>'));assert(escaped.includes('&lt;script&gt;'));assert(escaped.includes('&lt;img onerror'));}assert(orders.size>=10,'new templates need genuinely different content rhythms');
const imagePage=m.pageFromTemplate(m.PAGE_TEMPLATES[0]);imagePage.content.news[0].image='javascript:alert(1)';assert(m.validatePage(imagePage).length>0);
console.log('PASS: varied content orders; rich section defaults; saved draft migration; rich content escaping and media validation.');

// Template CSS is rendered from a TS string, so Vite does not parse it during the app build.
for(const template of m.PAGE_TEMPLATES){const markup=r.renderPage(m.pageFromTemplate(template),'https://demo.example/');require('postcss').parse(markup.match(/<style>([\s\S]*?)<\/style>/)[1]);}
console.log('PASS: CSS in every exported template parses without unclosed blocks.');

// Every layout, including migrated drafts and pages with the footer disabled, offers independent store destinations.
for(const template of m.PAGE_TEMPLATES){
 const page=m.pageFromTemplate(template);page.appStoreUrl='https://track.example/ios?game='+template.id+'&campaign=demo';page.googlePlayUrl='https://track.example/android?game='+template.id;page.sections.cta=false;
 const output=r.renderPage(page,'https://demo.example/');
 assert.equal((output.match(/class="store-badge store-badge--app-store"/g)||[]).length,1);
 assert.equal((output.match(/class="store-badge store-badge--google-play"/g)||[]).length,1);
 assert(output.includes('href="https://track.example/ios?game='+template.id+'&amp;campaign=demo"'));
 assert(output.includes('href="https://track.example/android?game='+template.id+'"'));
 assert.equal((output.match(/aria-label="在 .*? 下載（另開分頁）"/g)||[]).length,2);
 delete page.appStoreUrl;delete page.googlePlayUrl;assert.equal(m.normalizePage(page).appStoreUrl,'https://apps.apple.com/');assert.equal(m.normalizePage(page).googlePlayUrl,'https://play.google.com/store/games');
 page.appStoreUrl='javascript:alert(1)';page.googlePlayUrl='https://user:secret@example.com';const bad=r.renderPage(page,'https://demo.example/');assert(!bad.includes('javascript:'));assert(!bad.includes('user:secret'));assert.equal((bad.match(/aria-disabled="true"/g)||[]).length,2);assert(m.validatePage(page).length>=2);
}
console.log('PASS: all sixteen layouts include accessible, independent store links; legacy defaults; unsafe download destinations disabled.');

// A create request made before the lazy editor loads must reach it exactly once.
const requests=load('src/components/onepage-events.ts');global.window=new EventTarget();
assert.equal(requests.consumeOnePageRequest(),false);requests.openOnePageBuilder();assert.equal(requests.consumeOnePageRequest(),true);assert.equal(requests.consumeOnePageRequest(),false);
let openCount=0;const receive=()=>{if(requests.consumeOnePageRequest())openCount++};window.addEventListener(requests.ONE_PAGE_EVENT,receive);requests.openOnePageBuilder();assert.equal(openCount,1);assert.equal(requests.consumeOnePageRequest(),false);window.removeEventListener(requests.ONE_PAGE_EVENT,receive);
for(const file of ['cms-design.css','cms-dialogs.css','onepage-studio.css'])require('postcss').parse(fs.readFileSync('src/app/'+file,'utf8'));
console.log('PASS: editor create requests survive deferred loading; shared table, dialog and preview CSS parses.');

// Compare actual markup structure, not just labels, palette or section order.
const skeletons=new Set();
for(const template of m.PAGE_TEMPLATES){
 const page=m.pageFromTemplate(template),markup=r.renderPage(page,'https://demo.example/cms/');
 const main=markup.match(/<main[^>]*>([\s\S]*?)<\/main>/)[1];
 skeletons.add([...main.matchAll(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi)].map(x=>x[0].startsWith('</')?'/'+x[1]:x[1]).join(' '));
 for(const field of ['showcase','news'])for(const item of page.content[field])if(item.image.startsWith('demo-creatives/'))assert(fs.existsSync('public/'+item.image),item.image);
 for(const key of ['features','gallery','showcase','modes','news','faq','cta']){const hidden=structuredClone(page);hidden.sections[key]=false;assert(!r.renderPage(hidden,'https://demo.example/').includes('data-section="'+key+'"'),template.id+' toggle '+key);}
 for(const count of [0,1,6]){
  const edge=structuredClone(page);edge.title='超長繁體中文遊戲標題用來檢查響應式排版及內容安全呈現'.repeat(3);
  for(const key of ['showcase','modes','news','faq'])edge.content[key]=Array.from({length:count},(_,i)=>({...page.content[key][i%page.content[key].length]}));
  edge.galleryImages=Array.from({length:count},()=>page.heroImage);edge.features=Array.from({length:count},()=>({...page.features[0]}));
  const output=r.renderPage(edge,'https://demo.example/');assert(!output.includes('undefined'));assert(!output.includes('NaN'));assert.equal((output.match(/class="store-badge store-badge--/g)||[]).length,2);
  const ids=[...output.matchAll(/\bid="([^"<>]+)"/g)].map(x=>x[1]);assert.equal(new Set(ids).size,ids.length,template.id+' duplicate ids');
  for(const a of output.matchAll(/href="#([^"]+)"/g))assert(ids.includes(a[1]),template.id+' missing anchor '+a[1]+' count '+count);
 }
}
assert.equal(skeletons.size,16,'Each template must have a different DOM skeleton.');
console.log('PASS: 16 distinct DOM skeletons, local rich media, every section toggle and 48 long-title / 0-1-6-item edge cases.');
if(process.argv.includes('--fixtures')){
 const dir=path.resolve('qa/v0.6.0');fs.mkdirSync(dir,{recursive:true});
 const base='http://127.0.0.1:4174/trackflow-cms-demo/';
 for(const t of m.PAGE_TEMPLATES){
  const page=m.pageFromTemplate(t);fs.writeFileSync(path.join(dir,t.id+'.html'),r.renderPage(page,base));
  page.title='前往世界的另一端，和夥伴尋找下一段精彩冒險。'.repeat(3);
  for(const key of ['showcase','modes','news','faq'])page.content[key]=Array.from({length:6},(_,i)=>({...page.content[key][i%page.content[key].length]}));
  page.galleryImages=Array.from({length:6},()=>page.heroImage);
  fs.writeFileSync(path.join(dir,'long-'+t.id+'.html'),r.renderPage(page,base));
 }

 fs.writeFileSync(path.join(dir,'index.html'),'<!doctype html><html lang="zh-Hant"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Track Flow 16 款版型檢查</title><style>body{font:18px system-ui;padding:40px;background:#101820;color:white}ul{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:24px}a{color:#8bbaff}</style><h1>16 款遊戲版型</h1><ul>'+m.PAGE_TEMPLATES.map(t=>'<li><a href="'+t.id+'.html">'+t.name+'</a> '+t.genre+'</li>').join('')+'</ul><h2>長文與六項內容</h2><ul>'+m.PAGE_TEMPLATES.map(t=>'<li><a href="long-'+t.id+'.html">'+t.name+' 長文測試</a></li>').join('')+'</ul></html>');
 console.log('QA fixtures: '+dir);
}

// Legacy default official-site CTAs become in-page exploration without changing drafts.
const oldCTA=m.pageFromTemplate(m.PAGE_TEMPLATES[1]);oldCTA.ctaLabel='前往官方網站';oldCTA.ctaUrl='https://www.pubgmobile.com/';
const cleanCTA=r.renderPage(oldCTA,'https://demo.example/');assert(!cleanCTA.includes('前往官方網站'));assert(cleanCTA.includes('href="#explore"'));assert.equal(oldCTA.ctaLabel,'前往官方網站');
assert.equal(m.safeUrl('#explore'),'#explore');assert.equal(m.safeUrl('#untrusted'),'');
