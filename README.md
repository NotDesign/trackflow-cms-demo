# Track Flow CMS Demo

[開啟線上 Demo](https://notdesign.github.io/trackflow-cms-demo/)

遊戲廣告成效管理 CMS 互動原型。所有帳戶、營收、追蹤、通知及操作均為示範，尚未串接正式後端。

## 使用方式

開啟 Demo，選擇示範帳戶並登入。請勿輸入真實帳密或個人資料。

## 一頁式網頁工作室（v0.6.0）

此頁以建立網頁為主，預設顯示「網頁管理」。按「建立一頁式網頁」選擇模板，再編輯圖片、角色／車輛、玩法、消息、FAQ、下載連結及區塊。原有推廣素材保留在次要分頁，不再提供新增推廣素材按鈕。16 款模板採不同遊戲網站結構，使用原神、PUBG MOBILE、Asphalt、絕區零、激鬥峽谷、蛋仔派對等實際遊戲素材作非官方版型示範。

16 款模板首屏皆附繁體中文 App Store 與 Google Play 官方下載標章；目的地可在編輯器分別修改。新模板使用查證過的遊戲商店連結，舊草稿保留原設定。主按鈕預設導向頁內遊戲介紹，不再顯示多餘的「前往官方網站」。標章維持原比例，獨立 HTML 亦內嵌圖檔。

修改停止約 400ms 後自動儲存；關閉編輯器也會保存最新內容。草稿與自訂模板保存在目前瀏覽器的 IndexedDB，依示範帳戶分開，尚未同步雲端。換瀏覽器、換裝置或清除網站資料不會保留原草稿。

亦可執行 `npm run export:templates` 批次產生全部 16 款網頁、共用素材與入口頁，預設儲存於 `exports/onepage-templates/`。

可匯出獨立 HTML；內建圖片及本機上傳媒體會嵌入，外部圖片網址仍需要連線。建立的頁面不會自動公開上線。圖片支援 PNG/JPG/WebP/GIF/AVIF（每張 5MB），本輪暫不顯示影片區塊；舊草稿的影片資料仍保留。

## v0.4.2 介面整理

數值表頭、總計與資料共用右側基準，排序、說明與篩選操作保留固定空間。側邊彈窗保留上下留白；一頁式預覽在較矮的畫面只保留內層捲動。網頁工作室按需載入，首次載入完成前的建立請求會保留。

## 本機執行

```sh
npm ci
npm run dev
```

## 檢查與部署

```sh
npm run typecheck
npm run test:onepages
npm run build
npm run export:templates
```

GitHub Pages 從 main 分支的 docs 目錄發布。修改後將 dist 的內容同步至 docs，再提交更新。使用 hash 路由支援直接開啟與重新整理。

## 分享與搜尋收錄

網站加入 noindex、nofollow、noarchive，請搜尋引擎不要收錄。連結可轉傳；本儲存庫與網站皆公開，這不是密碼保護或收件人限制。搜尋引擎移除既有索引可能需要時間。

## 16 種版型結構

模板選擇器提供搜尋及類型篩選，縮圖按可見範圍載入。每個版型有各自的 HTML 結構、資訊比例與原生操作，不只更換背景圖片。

| 版型 | 編排方式 |
| --- | --- |
| 原神・世界圖鑑 | 全景章節、世界圖鑑、旅途札記 |
| PUBG MOBILE・行動簡報 | 落點簡報、地形資料夾、作戰清單 |
| Asphalt Legends・賽車雜誌 | 車庫型錄、寬幅車輛與賽道編排 |
| 霓虹異域 | 都市雜誌拼貼、頻道與委託編排 |
| 王者戰境 | 戰場部署、英雄編成與戰術資料 |
| 繽紛闖關祭 | 遊樂園地圖、闖關漫畫與派對公告 |
| 墨雨江湖 | 直排題字、山水長卷、兵器譜 |
| 零界避難 | 野外手冊、補給清單與外勤檔案 |
| 餘響檔案 | 證物資料夾、接觸印樣與錄音帶紀錄 |
| 像素遠征 | 視窗選單、關卡路徑與隊伍編成 |
| 花園日常 | 生活手帳、季節圖鑑與小鎮日曆 |
| 第七次黎明 | 牌組桌面、分岔路線與遠征筆記 |
| 遠星航誌 | 航行視窗、星圖導航與天體資料 |
| 鋼鐵前線 | 機體整備、配置面板與任務規格 |
| 心跳節拍 | 唱片封套、曲目清單與演出佈告 |
| 終場之前 | 球場戰術板、先發陣容與賽事專刊 |

圖鑑、牌組、曲目及配置選擇以原生 radio 切換；FAQ、簡報以 details 展開，不需要額外 JavaScript，獨立 HTML 同樣可操作。圖片依容器縮放；表單內容與區塊開關持續自動儲存。

### 素材與參考

原神、PUBG MOBILE、Asphalt Legends 使用官方商店或官方網站素材快照，頁尾標示非官方版型展示及權利歸屬，不代表即時版本或官方合作。來源與下載時間記錄在 `public/demo-creatives/sourced-assets.json`；新增原創遊戲圖片的生成描述記錄在 `src/lib/onepage/art-sources.json`。

- [原神](https://genshin.hoyoverse.com/en-us/home)
- [PUBG MOBILE](https://www.pubgmobile.com/en-US/home.shtml)
- [Asphalt Legends](https://asphaltlegends.com/)

其餘原創題材參考官方網站的資訊編排方向：燕雲十六聲、Once Human、Stardew Valley、Hades II、No Man’s Sky、ARMORED CORE VI、HATSUNE MIKU: COLORFUL STAGE! 等。名稱、人物與活動內容為原創示範，未複製遊戲官方頁面。


預覽圖片由登入中的母頁取得並內嵌為圖片資料，避免私人 Sites 的登入保護使縮圖或預覽失效。預覽維持隔離來源、禁止執行腳本；不透過放寬 iframe 同源權限修復。官方來源與素材雜湊紀錄位於 `public/demo-creatives/*-sourced-assets.json`。
