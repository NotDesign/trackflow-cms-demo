const fs=require('fs'),path=require('path'),ts=require('typescript'),assert=require('assert');
const cache=new Map();function load(file){file=path.resolve(file);if(cache.has(file))return cache.get(file).exports;const m={exports:{}};cache.set(file,m);const js=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText;new Function('exports','require','module',js)(m.exports,p=>p.startsWith('.')?load(path.resolve(path.dirname(file),p+'.ts')):require(p),m);return m.exports}
const m=load('src/lib/onepage/model.ts'),r=load('src/lib/onepage/render.ts');assert.equal(m.PAGE_TEMPLATES.length,6);assert.equal(new Set(m.PAGE_TEMPLATES.map(t=>t.id)).size,6);
for(const t of m.PAGE_TEMPLATES){const p=m.pageFromTemplate(t);assert.deepEqual(m.validatePage(p),[]);assert(fs.existsSync('public/'+p.heroImage));assert.equal(new Set([p.heroImage,...p.galleryImages]).size,3);for(const image of p.galleryImages)assert(fs.existsSync('public/'+image));const html=r.renderPage(p,'https://demo.example/cms/');assert(html.includes('template-'+t.id));assert(html.includes('https://demo.example/cms/'+p.heroImage));assert(html.includes('name="viewport"'));assert(html.includes('name="robots"'));assert(!html.includes('<video'))}
const p=m.pageFromTemplate(m.PAGE_TEMPLATES[0]);p.title='</h1><script>alert("XSS")</script>';p.ctaUrl='javascript:alert(1)';p.heroImage='data:image/svg+xml;base64,AAAA';const html=r.renderPage(p,'https://demo.example/');assert(!html.includes('<script>'));assert(!html.includes('javascript:'));assert(!html.includes('data:image/svg+xml;base64,AAAA'));assert(m.validatePage(p).length>=2);
assert.equal(m.safeUrl('https://trusted.example@evil.example'),'');assert.equal(m.videoSource('javascript:alert(1)'),null);assert.equal(m.videoSource('https://youtube.com.evil.example/watch?v=dQw4w9WgXcQ'),null);assert.deepEqual(m.videoSource('https://youtu.be/dQw4w9WgXcQ'),{kind:'embed',url:'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ'});assert(m.videoSource('data:video/webm;base64,AAAA'));assert.equal(m.videoSource('https://player.vimeo.com/video/123456').url,'https://player.vimeo.com/video/123456');
const good=m.pageFromTemplate(m.PAGE_TEMPLATES[1]);good.sections.gallery=false;good.videoUrl='https://example.com/trailer.mp4';const out=r.renderPage(good,'https://demo.example/');assert(!out.includes('id="gallery"'));assert(!out.includes('<video'));assert(!out.includes('<iframe'));const c=m.clonePage(good,true);assert(c.id!==good.id);assert(c.isTemplate);c.features[0].title='edited';assert(c.features[0].title!==good.features[0].title);
console.log('PASS: six distinct layouts, local assets, export URLs, escaping, unsafe URL rejection, video parsing, section toggles and independent copies.');

// Verify exported files carry the template media, not deployment-only paths.
global.FileReader=class{readAsDataURL(blob){blob.arrayBuffer().then(bytes=>{this.result='data:'+blob.type+';base64,'+Buffer.from(bytes).toString('base64');this.onload()}).catch(()=>this.onerror())}};
global.fetch=async url=>{const file=new URL(url).pathname.split('/cms/')[1];return new Response(fs.readFileSync(path.join('public',file)),{headers:{'Content-Type':file.endsWith('.jpg')?'image/jpeg':'image/png'}})};
(async()=>{const exporter=load('src/lib/onepage/export.ts');for(const template of m.PAGE_TEMPLATES){const page=m.pageFromTemplate(template);const output=await exporter.exportPageHTML(page,'https://demo.example/cms/');assert(!output.externalMedia);assert(output.html.includes('data:image/'));assert(!output.html.includes('https://demo.example/cms/demo-creatives/'));assert(output.html.includes(page.title));assert.equal((output.html.match(/class="store-badge store-badge--/g)||[]).length,2);assert(output.html.includes('data:image/svg+xml;base64,'));assert(output.html.includes('data:image/png;base64,'));}console.log('PASS: all six HTML exports embed their three distinct default images.');})().catch(e=>{console.error(e);process.exitCode=1});

assert(r.renderPage(m.pageFromTemplate(m.PAGE_TEMPLATES[0]),'https://demo.example/',true).includes('<base href="about:srcdoc">'));

// Existing saved drafts gain new sections without losing their own content or disabled sections.
const legacy=m.pageFromTemplate(m.PAGE_TEMPLATES[0]);delete legacy.content;legacy.title='保留我的標題';legacy.sections={features:false,gallery:true,video:true,cta:true};const migrated=m.normalizePage(legacy);assert.equal(migrated.title,'保留我的標題');assert.equal(migrated.sections.features,false);assert.equal(migrated.content.showcase.length,3);
const orders=new Set();for(const template of m.PAGE_TEMPLATES){const page=m.pageFromTemplate(template),markup=r.renderPage(page,'https://demo.example/cms/');orders.add([...markup.matchAll(/data-section="(.*?)"/g)].map(x=>x[1]).join(','));assert.equal(page.content.showcase.length,3);assert.equal(page.content.modes.length,3);assert.equal(page.content.news.length,3);assert.equal(page.content.faq.length,3);assert(markup.length>30000);page.content.news[0].title='<script>alert(1)</script>';page.content.showcase[0].name='<img onerror=alert(1)>';const escaped=r.renderPage(page,'https://demo.example/');assert(!escaped.includes('<script>'));assert(escaped.includes('&lt;script&gt;'));assert(escaped.includes('&lt;img onerror'));}assert.equal(orders.size,6);
const imagePage=m.pageFromTemplate(m.PAGE_TEMPLATES[0]);imagePage.content.news[0].image='javascript:alert(1)';assert(m.validatePage(imagePage).length>0);
console.log('PASS: six different content orders; rich section defaults; saved draft migration; rich content escaping and media validation.');

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
console.log('PASS: all six layouts include accessible, independent store links; legacy defaults; unsafe download destinations disabled.');
