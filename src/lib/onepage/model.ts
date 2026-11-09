export type TemplateId='explore'|'tactical'|'racing'|'urban'|'strategy'|'party';
export type PageSection='features'|'gallery'|'video'|'cta';
export type GamePage={
 schema:1;id:string;name:string;templateId:TemplateId;isTemplate:boolean;campaignId:string;
 brand:string;eyebrow:string;title:string;subtitle:string;description:string;introTitle:string;featuresTitle:string;galleryTitle:string;videoTitle:string;
 heroImage:string;galleryImages:string[];videoUrl:string;videoPoster:string;
 ctaLabel:string;ctaUrl:string;accent:string;features:{title:string;body:string}[];
 sections:Record<PageSection,boolean>;updatedAt:string;
};
export type PageTemplate={id:TemplateId;name:string;genre:string;reference:string;layout:string;image:string;accent:string;brand:string;title:string;subtitle:string;description:string;features:{title:string;body:string}[]};
export const PAGE_TEMPLATES:PageTemplate[]=[
 {id:'explore',name:'浮光世界',genre:'開放世界 / 冒險',reference:'原神',layout:'沉浸式主視覺・世界探索',image:'atlas-adventure',accent:'#b9dce1',brand:'LUMINA WORLD',title:'下一段冒險，從這裡開始。',subtitle:'跨過雲海，遇見屬於你的新世界。',description:'沿著古老遺跡的光，探索浮島、城邦與未知秘境。和夥伴組成隊伍，讓每一次出發都有新的故事。',features:[{title:'自由探索',body:'走進山谷與城邦，發現藏在路途中的風景。'},{title:'夥伴同行',body:'組成自己的冒險隊伍，一起迎接新的挑戰。'},{title:'世界故事',body:'循著故事的線索，開啟下一段旅程。'}]},
 {id:'tactical',name:'極限攻防',genre:'戰術射擊 / 電競',reference:'VALORANT',layout:'斜切視覺・角色與戰術',image:'tactical-arena',accent:'#ff645d',brand:'STRIKE PROTOCOL',title:'下一回合，由你決定。',subtitle:'精準出擊。默契合作。扭轉戰局。',description:'集結你的戰術小隊，在瞬息萬變的攻防中找到破局時刻。每一個選擇，都是團隊的下一步。',features:[{title:'戰術配合',body:'掌握隊伍節奏，創造出擊的空間。'},{title:'角色特長',body:'選擇適合你的作戰方式，找到團隊定位。'},{title:'回合對決',body:'從佈局到交鋒，每一回合都是新的挑戰。'}]},
 {id:'racing',name:'地平線疾速',genre:'競速 / 開放賽道',reference:'Forza Horizon',layout:'全幅賽道・車輛展示',image:'nova-racing',accent:'#e9ff63',brand:'NOVA HORIZON',title:'把下一個彎道，交給直覺。',subtitle:'點燃引擎，奔向你的地平線。',description:'從霓虹街道到遼闊公路，挑選你的座駕，感受每一段路面的節奏，讓駕駛成為自己的風格。',features:[{title:'多元賽道',body:'城市、公路與夜間賽道，切換不同駕駛體驗。'},{title:'個性座駕',body:'用車輛與塗裝，展現屬於你的駕駛風格。'},{title:'好友競速',body:'與好友並肩出發，分享衝線的瞬間。'}]},
 {id:'urban',name:'霓虹異域',genre:'都市動作 / 科幻',reference:'絕區零',layout:'雜誌式分割・角色敘事',image:'urban-zero',accent:'#c5ff54',brand:'NEON DISTRICT',title:'城市另一面，現在連線。',subtitle:'進入異域頻道，解鎖你的行動代號。',description:'霓虹街區、未知任務與風格鮮明的夥伴。切換節奏，打出屬於你的連段，在城市中找到自己的答案。',features:[{title:'連段動作',body:'跟隨節奏切換招式，享受俐落的動作回饋。'},{title:'街區探索',body:'在日常街景與異域空間中尋找任務線索。'},{title:'個性小隊',body:'認識不同夥伴，組成你的行動隊伍。'}]},
 {id:'strategy',name:'王者戰境',genre:'策略對戰 / 奇幻',reference:'英雄聯盟',layout:'史詩橫幅・陣容與玩法',image:'orbit-fantasy',accent:'#e6c888',brand:'REALM TACTICS',title:'集結你的陣容，改寫戰場。',subtitle:'讓每一次選擇，都成為關鍵。',description:'在充滿傳說的奇幻戰境，選擇你的英雄、掌握戰場節奏，與隊友一同創造值得回味的精彩對局。',features:[{title:'英雄定位',body:'探索不同角色的風格，找到適合自己的位置。'},{title:'團隊決策',body:'從地圖觀察到資源分配，建立團隊默契。'},{title:'精彩交鋒',body:'把握關鍵時刻，和隊友一起迎接挑戰。'}]},
 {id:'party',name:'繽紛闖關祭',genre:'休閒 / 多人派對',reference:'Fall Guys',layout:'圓角拼貼・關卡與好友',image:'party-rush',accent:'#ffb55e',brand:'PARTY PARADE',title:'跌倒沒關係，快樂繼續！',subtitle:'揪上好友，一起闖進繽紛派對。',description:'跳進充滿驚喜的遊樂場，越過機關、衝過終點，把每一次出糗都變成大家的笑聲。下一場，換你登場。',features:[{title:'趣味機關',body:'在繽紛關卡中跳躍、衝刺，找到自己的節奏。'},{title:'好友同樂',body:'和朋友一起開局，把歡笑留在每一場。'},{title:'百變造型',body:'搭配喜歡的外觀，讓登場更有自己的風格。'}]},
];
export function pageFromTemplate(template:PageTemplate,campaignId=''):GamePage{return {schema:1,id:crypto.randomUUID(),name:template.name+'・活動頁',templateId:template.id,isTemplate:false,campaignId,brand:template.brand,eyebrow:'遊戲體驗 / 活動專頁',title:template.title,subtitle:template.subtitle,description:template.description,introTitle:'每一場冒險，都有你的風格。',featuresTitle:'找到你的遊戲節奏',galleryTitle:'準備好，進入遊戲。',videoTitle:'讓精彩，動起來。',heroImage:'demo-creatives/'+template.image+'.png',galleryImages:['demo-creatives/'+template.id+'-01.jpg','demo-creatives/'+template.id+'-02.jpg'],videoUrl:'',videoPoster:'demo-creatives/'+template.image+'.png',ctaLabel:'探索遊戲',ctaUrl:'https://example.com/game',accent:template.accent,features:template.features.map(f=>({...f})),sections:{features:true,gallery:true,video:true,cta:true},updatedAt:new Date().toISOString()}}
export function safeUrl(value:string,kind:'image'|'video'|'link'='link'):string{
 const v=value.trim();if(!v)return '';
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
export function validatePage(p:GamePage):string[]{const e:string[]=[];if(!p.name.trim())e.push('請輸入網頁名稱。');if(!p.brand.trim()||!p.title.trim())e.push('請填寫遊戲名稱與主標題。');if(!safeUrl(p.heroImage,'image'))e.push('請上傳主視覺或輸入有效的圖片網址。');if(!p.ctaLabel.trim()||!safeUrl(p.ctaUrl))e.push('請填寫按鈕文字與有效的 HTTP／HTTPS 連結。');if(p.videoUrl&&!videoSource(p.videoUrl))e.push('影片請使用 MP4、WebM、YouTube 或 Vimeo 網址。');if(p.galleryImages.some(v=>!safeUrl(v,'image')))e.push('遊戲圖集含有無效的圖片網址。');if(p.videoPoster&&!safeUrl(p.videoPoster,'image'))e.push('影片封面網址無效。');return e}
export function clonePage(p:GamePage,isTemplate=false):GamePage{return {...structuredClone(p),id:crypto.randomUUID(),name:p.name+(isTemplate?'・模板':'・副本'),isTemplate,updatedAt:new Date().toISOString()}}
