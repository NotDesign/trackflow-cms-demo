import type {PageContent,PageTemplate,TemplateId} from './model';

type Triple=[string,string,string];
type CatalogEntry={
 template:PageTemplate;introTitle:string;featuresTitle:string;galleryTitle:string;
 showcaseTitle:string;showcaseIntro:string;people:Triple[];
 modesTitle:string;modes:Triple[];newsTitle:string;news:Triple[];
 faqTitle:string;faq:{question:string;answer:string}[];
 galleryIntro:string;captions:string[];platforms:string[];
};

/** Original demo worlds. References describe editorial direction, not copied game content. */
export const EXTENDED_CATALOG:CatalogEntry[]=[
 {
  template:{id:'wuxia',name:'墨雨江湖',genre:'武俠 / 開放江湖',reference:'燕雲十六聲',layout:'留白山水長卷・兵器譜・驛站來信',image:'wuxia-hero',heroImage:'demo-creatives/wuxia-hero.jpg',accent:'#a64232',brand:'墨雨江湖',title:'渡口有雨，江湖有你。',subtitle:'一封未送達的信，牽出青溪鎮二十年的舊事。',description:'你帶著一把舊劍抵達青溪。白日替茶行押貨，入夜循著橋下的燈追查失蹤信使。劍術、輕功與人情往來，都能成為解開這座小鎮的方式。',ctaLabel:'啟程入江湖',features:[{title:'雙兵器切換',body:'短劍拆招，長槍守距離；依對手起手式調整出招節奏。'},{title:'無縫輕功',body:'借船篷、竹林與城牆移動，從屋脊找出通往古塔的另一條路。'},{title:'街巷奇遇',body:'聽茶客交談、替驛站送信，旁支人物也握著主線需要的線索。'}]},
  introTitle:'先在青溪落腳，再問江湖往哪走。',featuresTitle:'一招一式，練成自己的路數。',galleryTitle:'沿江而行，山河入卷。',
  showcaseTitle:'不立門戶，先選一件趁手的兵器。',showcaseIntro:'三套原創武學各有起手、架勢與破綻。兵器可以更換，內功與身法則由你搭配。',
  people:[['聽雨劍','拆招 / 近身','以短促的連段引出對手反擊，架開來招後接一記回身刺。適合觀察動作、尋找空檔的遊俠。'],['渡江槍','守距 / 破勢','長槍先控制交鋒距離，再以挑槍打斷重招。對付持盾守衛時，要留意收槍後的空檔。'],['照月傘','牽制 / 身法','開傘卸去飛矢，收傘近身點穴。利用身法繞開正面防線，能替隊友保住出手機會。']],
  modesTitle:'江湖不只比武。',modes:[['青溪舊案','單人故事','沿驛站、茶行與廢塔追查失蹤信使。對話與現場物件提供不同證詞，調查次序由你決定。'],['渡口切磋','雙人試招','與好友在渡口切磋武學，不消耗裝備。每一回合後可回看招式順序，找出招架失誤的位置。'],['夜行押鏢','四人協作','在雨夜護送貨船，分工偵察岸邊、維修船體與迎戰伏擊；航線會依隊伍的選擇改變。']],
  newsTitle:'驛站來信',news:[['青溪驛路已開','江湖紀聞','第一段示範路線連接青溪渡口、茶馬古道與望江塔，沿途設有可自由進出的客棧。'],['兵器譜：聽雨劍','武學筆記','這期拆解聽雨劍的架招與收勢，說明如何從一次成功招架銜接近身反擊。'],['給初到青溪的遊俠','行前備忘','抵達渡口後先向驛丞領取路引，再選一份日常委託，熟悉鎮上的人物與路線。']],
  faqTitle:'入江湖前，先問三件事。',faq:[{question:'選了兵器，之後還能換嗎？',answer:'可以。回到客棧即可更換隨身兵器與內功，已學會的武學會保留，不需要重新建立角色。'},{question:'故事一定要組隊才能完成嗎？',answer:'青溪舊案可單人完成。押鏢與切磋是獨立玩法，不會阻擋主線故事進度。'},{question:'可以只逛城鎮，不參加比武嗎？',answer:'可以。釣魚、採茶、送信與調查都能推進人物關係；切磋與演武需由你主動加入。'}],
  galleryIntro:'渡船停在江面，燈火沿著石階亮起。這是青溪的一天。',captions:['青溪渡口 · 雨後薄霧','望江古塔 · 夜行燈火'],platforms:['Windows','iOS','Android']
 },
 {
  template:{id:'survival',name:'零界避難',genre:'生存建造 / 合作探索',reference:'Once Human',layout:'野外作業手冊・營地資源表・區域地圖',image:'survival-hero',heroImage:'demo-creatives/survival-hero.jpg',accent:'#d9df65',brand:'ASHFALL COUNTY',title:'日落之前，先把營火點起來。',subtitle:'廢棄公路的第七公里，是今晚最後一個安全停靠點。',description:'離開失去訊號的撤離車隊，你得在封鎖郡縣找到飲水、電力和能關上的門。帶走需要的物資，和夥伴搭起營地，再決定明天要不要穿過那片霧。',ctaLabel:'加入避難隊',features:[{title:'收集有取捨',body:'背包重量影響行走與攀爬。把修理零件帶回營地，或留出空間裝飲水。'},{title:'營地可搬遷',body:'工作台、蓄電池與雨水槽能拆裝；沿著補給路線尋找下一處落腳點。'},{title:'合作不分工種',body:'採集、偵察與建造都能學習，隊員可以依當天任務互換裝備。'}]},
  introTitle:'活過今晚，再規劃下一段路。',featuresTitle:'每一件物資，都有它佔的位置。',galleryTitle:'郡縣現場紀錄',
  showcaseTitle:'先檢查裝備，再離開營地。',showcaseIntro:'帶得越多，回程越慢。三套外出配置分別處理偵察、補給與夜間維修。',
  people:[['公路偵察包','輕裝 / 遠行','裝入望遠鏡、路標帶與一日飲水。保留攀爬所需的活動空間，適合先行確認橋梁與隧道。'],['補給搬運組','負重 / 採集','手推車增加攜帶量，卻無法穿過所有地形。需要隊友先確認路線，再運回木材與金屬。'],['夜間維修箱','工具 / 營建','包含手電、線材與替換保險絲。能修復沿路的配電箱，也能維持營地的最低照明。']],
  modesTitle:'白天外出，晚上守住營地。',modes:[['郡道搜索','自由探索','沿著郡道搜尋加油站、林務所與廢棄住區。每次出發前可在地圖標示補給點與撤回路線。'],['移動營地','合作建造','以車隊為核心拆建工作站，分享水電與倉庫。發電設備有噪音，需要安排位置與巡邏範圍。'],['霧區遠征','限時探索','在訊號塔恢復供電後短暫進入霧區。找到紀錄器後須原路返回，隊伍可以提前中止任務。']],
  newsTitle:'營地佈告欄',news:[['第七公里補給站重新開放','路況通報','示範補給路線新增加油站與林務所兩個停靠點，工作台零件可在營地共享。'],['把雨水變成可用飲水','營地教學','本期手冊介紹集水槽、濾網與儲水桶的排列方式，協助隊伍建立穩定補給。'],['夜間噪音測試紀錄','開發筆記','發電機與手工工具的聲響範圍將在地圖以簡單標記呈現，便於規劃營地分區。']],
  faqTitle:'避難隊出發須知',faq:[{question:'物資會隨時間消失嗎？',answer:'食物與燃料有各自的保存條件；放入合適的儲藏設備即可延長使用時間。示範頁不會執行真實資源倒數。'},{question:'朋友稍晚加入，能使用同一座營地嗎？',answer:'隊長可邀請夥伴加入營地。獲准的隊員可共用指定倉庫，重要物資仍能設成個人保管。'},{question:'不喜歡戰鬥，也能協助隊伍嗎？',answer:'可以。維修、採集、路線標記與供水都能支援遠征，外出配置也能隨時更換。'}],
  galleryIntro:'路況、天氣與能見度，都值得在出發前看一眼。',captions:['郡道七公里 · 車隊營地','林務所外圍 · 薄霧封鎖區'],platforms:['Windows','iOS','Android']
 },
 {
  template:{id:'horror',name:'餘響檔案',genre:'懸疑解謎 / 生存驚悚',reference:'Resident Evil',layout:'類比錄影帶封套・證物索引・失聯報告',image:'horror-hero',heroImage:'demo-creatives/horror-hero.jpg',accent:'#c24639',brand:'THE LAST SIGNAL',title:'收音機裡，為什麼是你的聲音？',subtitle:'檔案 0417：凌晨兩點十三分，所有電話同時響起。',description:'你回到停業多年的海岸療養院，整理母親留下的錄音帶。走廊裡的廣播每天重複同一段話，病房門牌卻在夜裡改變。把證物排回正確時間，才能知道誰還留在這裡。',ctaLabel:'開啟調查檔案',features:[{title:'聲音藏著順序',body:'比對錄音中的鐘聲、潮汐與腳步，找出發生在同一晚的片段。'},{title:'光源需要管理',body:'手電與備用電池數量有限；固定照明能讓你安全整理找到的證物。'},{title:'線索可回查',body:'照片、病歷與逐字稿會存入檔案夾，不必靠記憶猜出謎題答案。'}]},
  introTitle:'這次，別把磁帶停在同一個地方。',featuresTitle:'調查守則',galleryTitle:'現場照片 / 請勿移動證物',
  showcaseTitle:'尚未結案的三件證物。',showcaseIntro:'物件不會直接告訴你答案。旋轉、閱讀與比對後，把它放進對應的時間線。',
  people:[['編號 04 錄音帶','聲音證物 / 02:13','標籤上的日期遭到塗改。背景裡能聽見廣播、兩次敲門，以及一個不在病歷名單上的名字。'],['西翼值班表','文件證物 / 西翼','值班欄位寫著三個人的簽名，當晚的出勤紀錄卻只有兩人。紙張背面留有一條手繪路線。'],['沒有地址的明信片','私人證物 / 海岸','照片中的燈塔尚未倒塌，郵戳卻比事故日期晚了一年。寄件人只留下了一個房間號碼。']],
  modesTitle:'把調查，留在你能掌握的節奏。',modes:[['主線調查','單人敘事','逐區開啟療養院的封鎖空間，以線索關係解開門鎖與機關。探索進度可在安全室保存。'],['證物回查','自由檢視','在檔案夾中重聽錄音、重讀文件，依地點或時間整理已發現的證據。'],['輔助調查','提示設定','可調整字幕大小、降低閃光，並開啟逐層提示。提示先指出調查方向，最後才揭示解法。']],
  newsTitle:'補充卷宗',news:[['0417 號檔案：西翼初步公開','區域報告','第一份示範卷宗收錄接待大廳、藥局與西翼病房，照片上的門牌均可與檔案對照。'],['如何閱讀錄音逐字稿','調查教學','時間標記會保留環境音；先找出鐘聲相同的片段，再確認說話者的位置。'],['驚悚體驗與輔助設定','製作手記','以環境、聲音與敘事建立緊張感。設定中提供閃光、鏡頭晃動與字幕選項。']],
  faqTitle:'開卷之前',faq:[{question:'需要戴耳機才能解謎嗎？',answer:'不需要。重要聲音線索同時提供字幕與文字描述，使用一般喇叭或靜音閱讀也能完成調查。'},{question:'遊戲包含持續追逐嗎？',answer:'調查與解謎是主要節奏，特定區域有短暫的逃離段落；可在輔助設定調整追逐壓力。'},{question:'這個頁面會播放驚嚇聲音嗎？',answer:'不會。此示範網站保持靜音，也不會自動播放影片或音效。'}],
  galleryIntro:'影像只記錄了現場的一部分。請同時參閱證物日期與錄音時間。',captions:['西翼走廊 · 停電後','海岸燈塔 · 事故前照片'],platforms:['Windows','PlayStation','Xbox']
 },
 {
  template:{id:'pixel',name:'像素遠征',genre:'像素平台 / 探索冒險',reference:'Terraria',layout:'橫向關卡選單・像素背包・旅店告示',image:'pixel-hero',heroImage:'demo-creatives/pixel-hero.jpg',accent:'#f8ce62',brand:'BITBOUND',title:'一把短劍，三個蘋果。出發！',subtitle:'從草坡到舊礦坑，走一條自己畫出來的路。',description:'村外的吊橋斷了，你需要找回三枚供電晶片。用繩索穿過高塔、在礦坑敲出捷徑，再把沿途撿到的奇怪東西帶回旅店。每張地圖都藏著第二種走法。',ctaLabel:'開始遠征',features:[{title:'路線能自己挖',body:'破除鬆動磚塊與礦脈，打開連接不同區域的短路徑。'},{title:'裝備有小巧思',body:'磁鐵靴走鐵牆，彈簧傘慢慢落地；切換道具才能到達藏寶處。'},{title:'合作不搶掉落',body:'各自取得任務物件，分享建材與食物，重返關卡時不用再等同伴收集。'}]},
  introTitle:'先跳過那個坑，再談拯救世界。',featuresTitle:'背包先留三格。',galleryTitle:'遠征地圖冊',
  showcaseTitle:'旅店推薦裝備',showcaseIntro:'不追求一套穿到底。遇見高牆、深井與風口，就從背包換出對的道具。',
  people:[['繩索發射器','移動道具 / 高塔','朝木樁與金屬環發射繩索，在固定點間擺盪；落地前還能借力跳過一段缺口。'],['磁鐵靴','探索裝備 / 工坊','吸附特定金屬表面，沿牆與天花板移動。先辨認牆面材質，別在半路踩進木板。'],['彈簧傘','移動道具 / 風谷','打開後可延緩墜落，利用上升氣流抵達高台；收傘時要看清腳下的落點。']],
  modesTitle:'選一站，今天走到哪算哪。',modes:[['草坡小徑','區域 01','先練習跑跳與繩索，繞到風車後方找旅人的第一個營火。洞口裡還藏著一條返村捷徑。'],['回聲礦坑','區域 02','沿著舊軌道深入礦層，使用光源辨認可開鑿的牆面，搬運晶片時小心落石。'],['黃銅高塔','區域 03','交替使用磁鐵靴與彈簧傘，穿過機械樓層。抵達塔頂後可打開通往村莊的升降梯。']],
  newsTitle:'旅店門口的告示',news:[['吊橋修好一半了！','村莊消息','草坡路線現已開放示範。回村時可以把多出的木材交給木匠，看看吊橋的修復進度。'],['別把蘋果全吃光','遠征小抄','出發前帶一份食物、一件照明工具和一條繩索，替未知的地形留點餘地。'],['新背包整理方式','開發日誌','任務物品會進入獨立格位；道具可以固定在快捷列，方便在跳躍途中切換。']],
  faqTitle:'出發前的小問題',faq:[{question:'不擅長平台跳躍也能玩嗎？',answer:'可以開啟較寬鬆的落點判定與額外檢查點。部分困難地形也能透過挖掘或搭建繞行。'},{question:'雙人會共用同一個背包嗎？',answer:'各自持有道具與任務物品，建材與食物可以主動交換；不會因隊友撿取而失去主要任務道具。'},{question:'破關之後能回頭找寶箱嗎？',answer:'可以。已開啟的捷徑與升降梯會保留，回到地圖選單即可再次進入探索過的區域。'}],
  galleryIntro:'留意畫面邊緣的小洞、奇怪的牆，還有風車後面那條路。',captions:['草坡小徑 · 風車丘','回聲礦坑 · 黃銅軌道'],platforms:['Windows','Nintendo Switch','iOS','Android']
 },
 {
  template:{id:'cozy',name:'花園日常',genre:'生活模擬 / 農園經營',reference:'Stardew Valley',layout:'手帳式首頁・季節作物卡・小鎮日曆',image:'cozy-hero',heroImage:'demo-creatives/cozy-hero.jpg',accent:'#638b52',brand:'MEADOW DAYS',title:'先澆花，其他的慢慢來。',subtitle:'一間老屋、一塊空地，還有等著認識你的鄰居。',description:'接手外婆留下的溫室，從清理一小塊花圃開始。選種子、做花束、去市場擺攤，也可以把今天留給河邊的釣竿。小鎮沒有倒數計時，四季會陪你慢慢熟悉這裡。',ctaLabel:'搬進花園小鎮',features:[{title:'依季節栽種',body:'觀察日照與雨水，為春季香草、夏季花卉與秋收蔬果安排花圃。'},{title:'一起照顧庭院',body:'和朋友共用工作區，把灑水、收成與擺設分成喜歡的小工作。'},{title:'認識街角鄰居',body:'到麵包店、書店與市集聊聊，記住每個人的喜好與固定出門時間。'}]},
  introTitle:'把一塊空地，過成喜歡的日子。',featuresTitle:'今天想做的三件小事。',galleryTitle:'從花園寄來的照片',
  showcaseTitle:'這一季，想種什麼？',showcaseIntro:'不同作物需要的日照與水分不同。先從一小畦開始，再慢慢擴大你的花園。',
  people:[['羅勒與薄荷','春季 / 香草','適合放在廚房旁的小花盆。穩定澆水後便能採葉，送給麵包店還能換一份新的食譜。'],['金盞花','夏季 / 花卉','耐曬、顏色明亮，可以剪下做成花束。留一小塊給花朵，也能讓庭院多幾位訪客。'],['奶油南瓜','秋季 / 蔬果','需要較大的種植區。收成後可做湯、留種，或帶到週末市集與鄰居交換食材。']],
  modesTitle:'照自己的步調安排一天。',modes:[['整理花圃','種植與採集','清理雜草、安排作物與鋪設小徑。工具會隨使用解鎖新的便利功能，不必趕著完成每日清單。'],['街角散步','小鎮生活','沿河岸走到書店，再到麵包店坐坐。居民的日常行程會帶來季節限定的對話與委託。'],['週末花市','製作與交換','把採下的花與香草做成作品，在市集擺攤，也能向其他攤位交換種子與庭院家具。']],
  newsTitle:'小鎮手帳',news:[['春天的第一張邀請函','季節消息','花園小鎮的示範季節從春天開始，溫室、河岸與週末花市都能步行抵達。'],['種一盆窗邊香草','新手筆記','先選一個有晨光的位置，放上花盆與水壺；羅勒是很適合開始的第一個選擇。'],['市集攤位準備中','居民來信','下次週末花市將由麵包店與花房一起佈置，居民也會帶來各自收藏的小物。']],
  faqTitle:'關於這段慢日子',faq:[{question:'一定要每天登入照顧花園嗎？',answer:'不需要。離線期間花園不會因缺乏照顧而枯萎；重新開啟遊戲時，可從上次停下的地方繼續。'},{question:'有排名或競爭壓力嗎？',answer:'花園日常以種植、生活與合作為主，不設強制排行榜。市集作品與庭院佈置可依自己的節奏完成。'},{question:'能和朋友一起佈置嗎？',answer:'可以邀請朋友進入共用庭院，開放指定區域的種植與擺設權限；個人收藏可保留在自己的倉庫。'}],
  galleryIntro:'不必拍得很完美，記下自己喜歡的那一刻就好。',captions:['春日溫室 · 晨光時分','河岸市集 · 週末散步'],platforms:['Windows','Nintendo Switch','iOS','Android']
 },
 {
  template:{id:'roguelike',name:'第七次黎明',genre:'Roguelike / 牌組策略',reference:'Hades II / Slay the Spire',layout:'牌桌式首屏・路線節點・遺物組牌',image:'roguelike-hero',heroImage:'demo-creatives/roguelike-hero.jpg',accent:'#e79952',brand:'EMBER DECK',title:'這一局，換一條活著回來的路。',subtitle:'帶上十二張牌，往地底第七層走。',description:'黎明前，城門會再度關閉。你能帶走的只有牌組、遺物和上一次失敗留下的筆記。在岔路間決定要補給、改牌，還是用最後一點體力挑戰守門者。',ctaLabel:'展開新一局',features:[{title:'路線先於戰鬥',body:'觀察下一層的商店、營火與精英節點，為牌組選一條承擔得起的路。'},{title:'牌組有代價',body:'抽牌、棄牌與移除卡片都會改變節奏，少帶幾張也可能是更好的選擇。'},{title:'失敗留下紀錄',body:'每次遠征記下造成困難的敵人與牌序，下一局能調整起始配置。'}]},
  introTitle:'不是每一張牌，都值得帶到最後。',featuresTitle:'先想下一回合。',galleryTitle:'地底七層 / 途中所見',
  showcaseTitle:'今天，從哪張牌開始？',showcaseIntro:'三種起始牌型各自改變資源管理方式。卡面只是開始，真正的牌組會在旅途中長出來。',
  people:[['餘燼斬','攻擊 / 連擊','以較低消耗累積連擊，保留手牌能讓下一回合更有彈性；需要留意過度出牌造成的空窗。'],['鏡面守勢','防禦 / 反擊','先建立防禦，再把承受的壓力換成反擊。面對高頻攻擊時，要提前安排護盾與抽牌。'],['夜航秘術','技巧 / 棄牌','透過棄牌與回收尋找關鍵組合，讓同一張牌在合適的回合再次出現。']],
  modesTitle:'選節點，也是在選擇下一局。',modes:[['七層遠征','標準路線','在分岔節點之間選擇戰鬥、補給或事件，擊敗每層的守門者，再決定是否繼續深入。'],['固定種子','同路競技','與朋友使用同一張路線圖，比較不同組牌與事件選擇。結果紀錄以完成度與回合數呈現。'],['自訂試煉','規則組合','熟悉基礎牌組後，加入資源限制或敵人修正；規則可以逐項開關，不必一次挑戰全部。']],
  newsTitle:'營火旁的遠征筆記',news:[['第一層：熔井之門','路線公開','示範路線包含九個分岔節點。營火與商店的位置固定，但可取得的卡牌組合各不相同。'],['三張牌，也能改變整副牌組','組牌教室','先觀察你最常卡手的回合，再決定要增加抽牌、防禦，或直接移除暫時用不到的牌。'],['把失敗寫進下一局','設計筆記','遠征紀錄新增最後三回合的牌序摘要，方便回看資源用在哪裡，而不是只看結算分數。']],
  faqTitle:'發牌之前',faq:[{question:'每次失敗都要重新解鎖卡牌嗎？',answer:'已解鎖的卡牌與筆記會保留。每一局會重新取得牌組與遺物，但不需要重做教學或基礎解鎖。'},{question:'需要快速操作嗎？',answer:'不需要。戰鬥採回合制，你可以在出牌前查看敵人意圖與卡牌說明，再決定這個回合的做法。'},{question:'可以中途休息嗎？',answer:'可以在節點間暫停並保存遠征，下次從原來的牌組與路線繼續。'}],
  galleryIntro:'有些房間值得冒險，有些岔路應該留給下一次。',captions:['熔井之門 · 第一層路線','夜航牌桌 · 遺物與手牌'],platforms:['Windows','Nintendo Switch','iOS','Android']
 },
 {
  template:{id:'space',name:'遠星航誌',genre:'太空探索 / 星際航行',reference:"No Man’s Sky",layout:'星圖導航・艦船紀錄・天體勘查報告',image:'space-hero',heroImage:'demo-creatives/space-hero.jpg',accent:'#71d6d7',brand:'ORBITAL ATLAS',title:'下一顆星，還沒有名字。',subtitle:'航誌 008：離開母港後的第三十七天。',description:'以一艘小型勘查船離開熟悉的航道，測量行星大氣、記錄地表生命，並替後來的船員留下可以停靠的座標。燃料和艙位都有限，每次躍遷前都要想好回程。',ctaLabel:'建立航行紀錄',features:[{title:'星圖自己補完',body:'掃描恆星與行星，將可停靠位置、環境風險和發現寫入個人航誌。'},{title:'艙位決定航程',body:'在燃料、樣本與維修零件間分配空間；擴充模組會改變船隻用途。'},{title:'基地留給後來者',body:'建造小型補給站、上傳路標，讓好友沿著同一條航線探索。'}]},
  introTitle:'離開航道之後，記得留下座標。',featuresTitle:'每次躍遷，都先確認三件事。',galleryTitle:'尚未命名的世界',
  showcaseTitle:'挑選這趟航程的船。',showcaseIntro:'不以尺寸決定好壞。短程勘查、長途運輸與地表採樣，需要不同的艙位與儀器。',
  people:[['KESTREL 02','勘查型 / 長程掃描','保留較大的感測器艙位，能在進入行星軌道前讀取大氣資訊。貨艙較小，適合先行勘查。'],['MULE 11','運輸型 / 補給支援','擁有可拆裝貨櫃與維修工具位，替偏遠基地運送材料。起降時需要留出更寬的地面空間。'],['SKIPPER 07','採樣型 / 地表降落','配備輕量探測車與樣本儲藏艙，可在複雜地形附近降落，沿地表收集生命與礦物資料。']],
  modesTitle:'一份航誌，三種旅程。',modes:[['未知星系勘查','自由探索','從星圖選擇尚未掃描的訊號，確認環境後降落；每一次發現都能加入你的航行紀錄。'],['補給航線','運輸與基地','在母港與外圍基地間建立補給路線，依燃料、艙位與目的地調整船體模組。'],['共同遠征','多人協作','與好友分享座標與勘查任務，各自負責掃描、地表採樣或基地建置，完成一份共同航誌。']],
  newsTitle:'任務中心 / 航行通報',news:[['外環星圖已更新','航道資訊','示範星圖新增三處可勘查天體：風暴行星、冰封衛星與環帶補給站。'],['第一次地表採樣','船員手冊','降落前先查看大氣與重力資料，保留返航燃料，再安排探測車的行走路線。'],['把發現整理成航誌','開發通報','座標、掃描結果與照片可按星系整理；隊伍能選擇分享航線，也能保留私人標記。']],
  faqTitle:'船員出港須知',faq:[{question:'可以只探索，不參與戰鬥嗎？',answer:'可以選擇以勘查與建造為主的航行設定。導航會標記風險區域，讓你有空間安排較安全的路線。'},{question:'船隻能重新改裝嗎？',answer:'回到支援改裝的母港即可更換模組。已購得的艙段保留在倉庫，方便依任務重新組裝。'},{question:'要和朋友同時上線才能建基地嗎？',answer:'共用基地可分配建造與倉庫權限；隊員能分別補充材料，之後再一起完成後續遠征。'}],
  galleryIntro:'從軌道看見顏色，抵達地表才讀懂它的天氣。',captions:['外環 008 · 環帶行星','冰封衛星 · 地表採樣站'],platforms:['Windows','PlayStation','Xbox']
 },
 {
  template:{id:'mecha',name:'鋼鐵前線',genre:'機甲動作 / 戰術組裝',reference:'ARMORED CORE VI',layout:'工業規格面板・機體組裝庫・任務簡報',image:'mecha-hero',heroImage:'demo-creatives/mecha-hero.jpg',accent:'#e5a64b',brand:'FRAME ZERO',title:'把機體組好，再上前線。',subtitle:'作戰區 09。能源輸送線已中斷。',description:'你受僱駕駛舊式作業機，替封鎖區恢復一段能源輸送線。引擎、足部與武器都可替換；任務情報只列出目標，如何穿過工業廢墟，要由你和機體一起回答。',ctaLabel:'進入整備庫',features:[{title:'重量影響動作',body:'裝甲與火力增加負重，推進與轉向表現也會跟著改變。'},{title:'模組互有取捨',body:'發電機、冷卻與武器需共同配置，先確認能源需求，再決定作戰距離。'},{title:'情報可重讀',body:'整備庫保留地形、目標與敵方兵種摘要，出擊前能快速回看任務條件。'}]},
  introTitle:'同一份任務，沒有唯一的機體配置。',featuresTitle:'整備先於出擊。',galleryTitle:'戰區 09 / 偵察影像',
  showcaseTitle:'三種底盤，三種進場方式。',showcaseIntro:'裝備組合會改變移動、輸出與能源節奏。選一套作為起點，再依任務內容調整。',
  people:[['FZ-03 SPARROW','輕量型 / 高機動','以較低裝甲換取快速推進，適合穿過狹窄管線區。需要掌握閃避節奏，避免長時間暴露在火線中。'],['FZ-12 ANVIL','重裝型 / 火力支援','高承載底盤可搭載重型武器，在穩定輸出與重新定位之間安排窗口，適合需要守住區域的任務。'],['FZ-08 VECTOR','平衡型 / 中距交戰','保留適中的武器、裝甲與能源空間，適合初次熟悉戰區；也能逐步改裝成支援或突入配置。']],
  modesTitle:'出擊紀錄',modes:[['能源線復原','單人任務','穿過工業廢墟，啟動三座輸送站。道路、屋頂與地下維修道提供不同進場路線。'],['雙機演練','合作任務','與搭檔分工偵察、壓制與目標防守。出擊前可交換機體配置，確認彼此的作戰距離。'],['整備場測試','自由試機','在封閉測試場檢查能源、射程與散熱，不消耗任務資源；可隨時回到組裝面板修改零件。']],
  newsTitle:'承包任務公告',news:[['作戰區 09 偵察簡報','任務情報','示範戰區收錄輸送站、裝卸碼頭與冷卻塔三種地形，整備庫可查看目標區域的高低差。'],['推進與散熱的關係','整備手冊','持續推進後需要預留散熱空間；配置重型武器時，先在測試場確認完整輸出循環。'],['保留你用得順手的配置','系統更新','機體配置可另存成整備方案，替不同任務保留常用零件與武器組合。']],
  faqTitle:'整備庫常見問題',faq:[{question:'一開始選輕型，之後能改成重型嗎？',answer:'可以。底盤與零件能在整備庫更換，角色本身不綁定固定機體類型。'},{question:'需要先懂複雜的機甲數值嗎？',answer:'不需要。介面會先顯示重量、能源與散熱是否在可用範圍內；進階數值可再展開查看。'},{question:'測試機體會消耗任務道具嗎？',answer:'整備場不消耗任務資源，可重複測試武器與推進組合，確認操作後再出擊。'}],
  galleryIntro:'注意掩體、高低差與可通行寬度。路線往往比火力更早決定一場交鋒。',captions:['輸送站 09 · 工業戰區','整備庫 · 模組檢查'],platforms:['Windows','PlayStation','Xbox']
 },
 {
  template:{id:'rhythm',name:'心跳節拍',genre:'節奏音樂 / 角色演出',reference:'HATSUNE MIKU: COLORFUL STAGE!',layout:'演出海報・曲目清單・舞台票根',image:'rhythm-hero',heroImage:'demo-creatives/rhythm-hero.jpg',accent:'#ef4e88',brand:'BEATLINE',title:'把今天，打成喜歡的節拍。',subtitle:'選一首歌，從第一個拍點開始。',description:'放學後的地下練團室、週末屋頂上的小舞台，五位原創樂手用不同曲風記錄生活。挑選曲目與譜面難度，跟著旋律練習，或和朋友合奏完成同一場演出。',ctaLabel:'進入選曲畫面',features:[{title:'同曲多種譜面',body:'從單拍練習到多指連段，可依今天的狀態選擇難度。'},{title:'判定可以校準',body:'延遲校準、音符速度與明暗設定，協助你找到合適的操作回饋。'},{title:'練習不用重頭來',body:'選取一小段反覆練習，再回到完整曲目驗收進步。'}]},
  introTitle:'不是每次都要滿分，今天先過這一段。',featuresTitle:'找回自己的手感。',galleryTitle:'舞台後台 / 演出剪影',
  showcaseTitle:'今日推薦曲單',showcaseIntro:'原創示範曲目涵蓋電子、搖滾與輕快流行。點選曲目卡可查看演出設定；此網站不會自動播放音訊。',
  people:[['回家以前的夜色','ELECTRO / 128 BPM','由柔和合成器與清楚的四拍組成。適合練習穩定節奏，副歌加入交錯長按。'],['屋頂上的星期六','ROCK / 164 BPM','鼓組與吉他帶出明快的節拍。中段的短連打可以在練習模式拆成小節反覆熟悉。'],['汽水與晴天','POP / 112 BPM','以輕快旋律搭配較寬鬆的音符間距。適合第一次上手，也適合和朋友一起合奏。']],
  modesTitle:'今天用哪種方式練習？',modes:[['自由選曲','單人演出','挑選已開放的曲目與難度，調整音符速度後進入完整演出，結束時查看小節判定分佈。'],['段落練習','反覆練習','設定起點與終點，慢速熟悉容易失誤的連段。練習結果不會覆蓋正式成績。'],['好友合奏','多人合作','各自選擇合適的難度，一起完成同一首曲子；隊伍以合奏完成度記錄這次演出。']],
  newsTitle:'演出告示 / WHAT’S ON',news:[['週末屋頂演出，開場！','演出活動','三首原創示範曲目加入本期選曲頁，舞台畫面可切換日間練團與夜間演出。'],['第一次校準判定','新手說明','更換耳機或裝置後，先完成簡短的判定校準，再用熟悉的曲目確認手感。'],['把困難的小節分開練','練習筆記','進入段落練習，將速度調整到能穩定完成的範圍，熟悉後再逐步回到原速。']],
  faqTitle:'開演之前',faq:[{question:'網站會自動播放音樂嗎？',answer:'不會。此示範網頁保持靜音，曲目卡只展示曲風、節拍與譜面資訊，不會啟動音樂或影片。'},{question:'新手能和熟練玩家一起合奏嗎？',answer:'可以。隊員可選不同譜面難度，仍會在同一首曲目中完成演出。'},{question:'高難度是取得故事的必要條件嗎？',answer:'不是。故事內容可透過一般演出進度閱讀，困難譜面提供額外挑戰，不作為劇情門檻。'}],
  galleryIntro:'從練團室到舞台，記錄每次集合與排練。',captions:['地下練團室 · 午後排練','屋頂舞台 · 週末夜場'],platforms:['iOS','Android','Windows']
 },
 {
  template:{id:'sports',name:'終場之前',genre:'籃球競技 / 團隊運動',reference:'NBA 2K',layout:'運動雜誌封面・球員陣容表・賽程計分板',image:'sports-hero',heroImage:'demo-creatives/sports-hero.jpg',accent:'#df6b32',brand:'FULL COURT 26',title:'最後一球，從這次配合開始。',subtitle:'傳球、跑位、再接球。把機會留給空檔。',description:'從社區球場的三對三，到完整的五人聯賽，組成你願意分享球權的隊伍。閱讀防守、練習擋拆與無球跑動，讓比賽的變化來自每一次配合，而不只是個人數值。',ctaLabel:'加入今晚的球局',features:[{title:'無球也能決定比賽',body:'掩護、切入與拉開空間，讓沒有持球的隊員也有清楚的操作目標。'},{title:'位置可以輪替',body:'根據隊友與對手調整角色，後衛、側翼與內線各有不同的支援方式。'},{title:'每場都有回顧',body:'查看投籃位置、助攻路線與失誤片段，找出隊伍下一次能做得更好的配合。'}]},
  introTitle:'好球，不一定要由你出手。',featuresTitle:'讀懂球場上的空間。',galleryTitle:'場邊鏡頭 / COURTSIDE',
  showcaseTitle:'先決定，這一場怎麼配合。',showcaseIntro:'三位原創示範球員代表不同角色。選人時先看隊伍缺少什麼，再談誰拿最多分。',
  people:[['林宇衡','控球後衛 / 組織','習慣先觀察弱側跑動，再決定突破或傳球。以節奏變化與擋拆為隊友創造出手機會。'],['陳以安','側翼 / 攻守轉換','擅長把握底角空檔與快速回防。需要留意對手的傳球方向，及早補上防線。'],['周凱文','內線 / 籃板保護','用掩護與卡位幫助隊友，保護籃板後迅速找出第一傳，讓隊伍掌握攻守轉換。']],
  modesTitle:'今晚，在哪個球場集合？',modes:[['街區三對三','半場對抗','在社區球場進行短局比賽，練習擋拆、切入與協防。每次交換球權都要重新讀懂空間。'],['五人聯賽','全場競技','組成固定隊伍完成完整賽程，分配上場角色與戰術，從每場回顧調整下一次配合。'],['球場練習','基礎訓練','自由練習投籃、傳球與無球跑位，設定防守情境後反覆嘗試，不計入正式戰績。']],
  newsTitle:'球場週刊',news:[['街區夜場，本週開放','球場消息','示範球場加入夜間照明與場邊練習區，三對三模式可快速組成一場比賽。'],['一次好的擋拆，誰先動？','戰術課堂','持球者與掩護者需要共同閱讀防守；這期用三個情境說明順下、外拆與重新掩護。'],['比賽結束後，多看一次助攻','場邊筆記','賽後回顧加入傳球路線與出手位置，協助隊伍把一次漂亮的配合變成能重複完成的戰術。']],
  faqTitle:'開球前先確認',faq:[{question:'需要先有固定隊伍嗎？',answer:'不需要。街區三對三可快速加入球局，五人聯賽也提供尋找隊友的入口，再決定是否組成固定陣容。'},{question:'能切換不同位置練習嗎？',answer:'可以。練習區與一般球局能更換角色，協助你理解不同位置在擋拆、協防與轉換中的工作。'},{question:'配對只看得分嗎？',answer:'示範設定同時重視角色與隊伍配置，成績頁也會呈現助攻、籃板與防守參與，不只列出個人得分。'}],
  galleryIntro:'球場記得的不只有得分，還有每一次把球傳出去的決定。',captions:['街區夜場 · 三對三','聯賽主場 · 全場對抗'],platforms:['Windows','PlayStation','Xbox','iOS','Android']
 }
];

export const EXTENDED_TEMPLATES=EXTENDED_CATALOG.map(entry=>entry.template);
export const extendedEntry=(id:TemplateId)=>EXTENDED_CATALOG.find(entry=>entry.template.id===id);
export function extendedContent(id:TemplateId):PageContent|undefined{
 const entry=extendedEntry(id);if(!entry)return undefined;
 const hero=entry.template.heroImage!,gallery=templateGallery(id),a=gallery[0]||hero,b=gallery[1]||hero;
 return {
  showcaseTitle:entry.showcaseTitle,showcaseIntro:entry.showcaseIntro,
  showcase:entry.people.map(([name,tag,description],i)=>({name,tag,description,image:[b,hero,a][i]})),
  modesTitle:entry.modesTitle,modes:entry.modes.map(([title,tag,description])=>({title,tag,description})),
  newsTitle:entry.newsTitle,news:entry.news.map(([title,category,description],i)=>({title,category,description,date:['第 01 期','實用手冊','製作紀錄'][i],image:[a,b,hero][i]})),
  faqTitle:entry.faqTitle,faq:entry.faq.map(item=>({...item})),galleryIntro:entry.galleryIntro,galleryCaptions:[...entry.captions],platforms:[...entry.platforms],
  ctaNote:'原創遊戲網站示範 · 下載按鈕可設定遊戲頁或追蹤網址'
 };
}


// Default image sets only reference checked-in art. Saved drafts retain their chosen images.
const EXTENDED_GALLERIES:Partial<Record<TemplateId,string[]>>={
 wuxia:['wuxia-hero.jpg','explore-01.jpg'],survival:['survival-hero.jpg','tactical-02.jpg'],horror:['horror-hero.jpg'],pixel:['pixel-hero.jpg'],cozy:['cozy-hero.jpg'],roguelike:['roguelike-hero.jpg','strategy-02.jpg'],space:['space-hero.jpg'],mecha:['mecha-hero.jpg','tactical-01.jpg'],rhythm:['rhythm-hero.jpg','urban-02.jpg'],sports:['sports-hero.jpg']
};
export function templateGallery(id:TemplateId):string[]{
 const names=EXTENDED_GALLERIES[id]||(['explore','tactical','racing'].includes(id)?[`${id}-official-01.jpg`,`${id}-official-02.jpg`]:[`${id}-01.jpg`,`${id}-02.jpg`]);return names.map(name=>'demo-creatives/'+name);
}
type CoreDemoMeta={introTitle:string;featuresTitle:string;galleryTitle:string;ctaUrl:string;stores:{appStoreUrl:string;googlePlayUrl:string}};
export const CORE_DEMO_META:Partial<Record<TemplateId,CoreDemoMeta>>={
 explore:{introTitle:'山海之間，還有未走過的路。',featuresTitle:'沿路發現，比目的地更多。',galleryTitle:'提瓦特影像札記',ctaUrl:'https://genshin.hoyoverse.com/zh-tw/',stores:{appStoreUrl:'https://apps.apple.com/app/id1517783697',googlePlayUrl:'https://play.google.com/store/apps/details?id=com.miHoYo.GenshinImpact'}},
 tactical:{introTitle:'一場對局，從落點開始。',featuresTitle:'帶著計畫，走進下一個區域。',galleryTitle:'官方遊戲影像資料',ctaUrl:'https://www.pubgmobile.com/en-US/home.shtml',stores:{appStoreUrl:'https://apps.apple.com/app/id1330123889',googlePlayUrl:'https://play.google.com/store/apps/details?id=com.tencent.ig'}},
 racing:{introTitle:'駕駛的樂趣，在每一次銜接。',featuresTitle:'從第一場開始，找到你的路線。',galleryTitle:'賽道與駕駛畫面',ctaUrl:'https://asphaltlegends.com/',stores:{appStoreUrl:'https://apps.apple.com/app/id805603214',googlePlayUrl:'https://play.google.com/store/apps/details?id=com.gameloft.android.ANMP.GloftA9HM'}}
};
export function coreContent(id:TemplateId):PageContent|undefined{
 const meta=CORE_DEMO_META[id];if(!meta)return undefined;
 const hero=`demo-creatives/${id}-official-hero.jpg`,[a,b]=templateGallery(id);
 const data={
  explore:{showcaseTitle:'先選一個方向，讓旅途展開。',showcaseIntro:'這裡以地貌與探索節奏編排圖鑑；圖片為官方商店截圖，未標示或推測特定版本的開放區域。',people:[['城門以外','城鎮 / 啟程','從城鎮整理任務與隊伍，再沿著路標前往下一處探索地點。'],['山路之間','地形 / 探索','留意視線外的道路、地形高度與機關，為路途安排不同順序。'],['遺跡深處','隊伍 / 挑戰','觀察環境線索與隊伍能力，嘗試不同的解謎和戰鬥組合。']],modesTitle:'今天，想怎麼旅行？',modes:[['循著故事前行','任務體驗','跟隨任務認識人物與地方，在對話和調查之間推進旅程。'],['暫時離開主路','自由探索','為途中見到的機關、遺跡與景色停下腳步，再決定下一個方向。'],['和夥伴一起試試','隊伍搭配','理解不同元素與角色能力，依情境調整自己的隊伍。']],newsTitle:'旅人手記 / 內容編排示範',news:[['把第一段路留給觀察','探索筆記','先認識城鎮與周邊道路，再逐步擴大探索範圍。'],['為隊伍留下不同解法','隊伍筆記','從角色能力和元素搭配出發，安排探索與挑戰的順序。'],['記錄路上遇見的風景','影像筆記','以官方商店素材示範遊戲圖集、文字與新聞章節的編排。']],captions:['官方商店素材 · 探索影像','官方商店素材 · 遊戲畫面'],platforms:['iOS','Android','Windows'],galleryIntro:'官方商店素材快照，供版型編排展示；實際內容與支援裝置以遊戲官方資訊為準。'},
  tactical:{showcaseTitle:'落地之後，你的小隊怎麼走？',showcaseIntro:'用資料夾整理搜索、轉移與交鋒的觀察重點。以下是版型編排內容，並非官方戰術或勝率建議。',people:[['落點搜索','第一階段 / 補給','先確認隊友落點與周圍狀況，找到能繼續行動的基本裝備。'],['路線轉移','第二階段 / 移動','交換路況資訊，觀察道路、掩體與安全區方向，再決定移動節奏。'],['小隊協作','全程 / 支援','以位置標記和簡單溝通維持隊伍資訊，避免在不同目標間分散。']],modesTitle:'開局前，先確認你的方向。',modes:[['經典對局','CLASSIC','以搜索、移動與生存為主軸，留意地形和隊伍的資訊。'],['創作地圖','WORLD OF WONDER','認識官方提供的地圖編輯與自訂玩法入口，查看玩家創作內容。'],['組隊準備','SQUAD','和好友確認組隊、語音和操作偏好，再開始一場對局。']],newsTitle:'行動備忘 / 內容編排示範',news:[['先溝通，再落地','準備清單','集合前確認隊伍成員、溝通方式與想要體驗的玩法。'],['路線不只看距離','地形筆記','在畫面資訊中練習觀察掩體、道路與周邊區域。'],['認識創作玩法','玩法入口','官方網站提供 WOW 玩家創作介紹，可由官網繼續查看。']],captions:['官方商店素材 · 遊戲畫面','官方商店素材 · 玩法展示'],platforms:['iOS','Android'],galleryIntro:'官方商店影像快照；畫面內版本或活動文字僅屬素材內容，不代表即時上線狀態。'},
  racing:{showcaseTitle:'把車庫，開上賽道。',showcaseIntro:'從操作、車輛與同樂三個角度編排車庫頁。圖像取自 Gameloft 官方網站，不對圖中車型作未核實的命名。',people:[['車庫視角','GARAGE / 車輛','近看車輛造型與細節，再選擇想要帶上賽道的座駕。'],['駕駛視角','DRIVE / 操作','理解轉向、漂移與氮氣的連結，嘗試適合自己的操作方式。'],['同樂視角','CLUB / 好友','從車隊或私人房間出發，和朋友加入同一場競速。']],modesTitle:'同一條路，也有不同節奏。',modes:[['先熟悉彎道','駕駛練習','觀察路線，練習入彎、出彎與氮氣使用的銜接。'],['一起跑一場','好友同樂','透過車隊或私人房間和朋友共享競速體驗。'],['找到操作習慣','控制方式','認識手動與 TouchDrive，在支援的裝置上選擇習慣的方式。']],newsTitle:'車迷手冊 / 內容編排示範',news:[['第一個彎，先求流暢','駕駛筆記','熟悉道路後，再逐步調整漂移與加速的節奏。'],['你的下一台車','車庫筆記','以官方遊戲圖像示範寬幅車庫與車輛資料排版。'],['朋友，就在下一場','同樂筆記','先確認平台、好友與房間設定，再展開共同的競速。']],captions:['Gameloft 官方素材 · 車輛畫面','Gameloft 官方素材 · 遊戲特色'],platforms:['iOS','Android','Windows','PlayStation','Xbox','Nintendo Switch'],galleryIntro:'車輛品牌與圖像屬各權利人；本頁僅作 CMS 模板編排展示，實際內容以官方網站為準。'}
 }[id as 'explore'|'tactical'|'racing'];
 return {showcaseTitle:data.showcaseTitle,showcaseIntro:data.showcaseIntro,showcase:data.people.map(([name,tag,description],i)=>({name,tag,description,image:[a,b,hero][i]})),modesTitle:data.modesTitle,modes:data.modes.map(([title,tag,description])=>({title,tag,description})),newsTitle:data.newsTitle,news:data.news.map(([title,category,description],i)=>({title,category,description,date:'版型示範',image:[a,b,hero][i]})),faqTitle:'下載與瀏覽之前',faq:[{question:'這是遊戲官方網站嗎？',answer:'不是。本頁是 TRACKFLOW 的非官方網頁模板展示；遊戲名稱、商標與官方素材權利屬原權利人。'},{question:'下載按鈕會前往哪裡？',answer:'預設指向遊戲官方商店或網站。可在 CMS 編輯連結；本展示頁不收集遊戲帳號、密碼或付款資料。'},{question:'這裡的活動與版本是即時資料嗎？',answer:'不是。素材為官方頁面或商店快照，本文為版型編排示範；版本、活動與裝置支援請以官方資訊為準。'}],galleryIntro:data.galleryIntro,galleryCaptions:[...data.captions],platforms:[...data.platforms],ctaNote:'非官方版型展示 · 遊戲名稱、商標與官方素材權利屬原權利人'};
}
