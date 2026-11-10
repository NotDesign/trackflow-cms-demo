# Track Flow CMS Demo

[開啟線上 Demo](https://notdesign.github.io/trackflow-cms-demo/)

遊戲廣告成效管理 CMS 互動原型。所有帳戶、營收、追蹤、通知及操作均為示範，尚未串接正式後端。

## 使用方式

開啟 Demo，選擇示範帳戶並登入。請勿輸入真實帳密或個人資料。

## 一頁式網頁工作室（v0.4.0）

進入「推廣素材 → 一頁式網頁」，或按「建立一頁式網頁」。內建六款遊戲風格模板與 18 張不同示意圖片，可替換圖片、角色／車輛、玩法、最新消息、FAQ、按鈕及區塊，並切換桌機／手機預覽。

修改停止約 400ms 後自動儲存；關閉編輯器也會保存最新內容。草稿與自訂模板保存在目前瀏覽器的 IndexedDB，依示範帳戶分開，尚未同步雲端。換瀏覽器、換裝置或清除網站資料不會保留原草稿。

可匯出獨立 HTML；內建圖片及本機上傳媒體會嵌入，外部圖片網址仍需要連線。建立的頁面不會自動公開上線。圖片支援 PNG/JPG/WebP/GIF/AVIF（每張 5MB），本輪暫不顯示影片區塊；舊草稿的影片資料仍保留。

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
```

GitHub Pages 從 main 分支的 docs 目錄發布。修改後將 dist 的內容同步至 docs，再提交更新。使用 hash 路由支援直接開啟與重新整理。

## 分享與搜尋收錄

網站加入 noindex、nofollow、noarchive，請搜尋引擎不要收錄。連結可轉傳；本儲存庫與網站皆公開，這不是密碼保護或收件人限制。搜尋引擎移除既有索引可能需要時間。

## 版型與官方參考

六款模板採不同區塊順序及組合：全景冒險手記、戰術簡報、賽車車庫、都市雜誌、英雄選角與派對闖關。角色選擇可切換資料，FAQ 可展開；圖片自適應寬度並保留比例。擴充內容均可編輯、自動儲存及匯出，舊草稿只補上新增欄位，保留既有文字與區塊開關。

僅參考以下官方網站的資訊層級與編排；Demo 使用原創示意圖片、虛構遊戲、角色與活動文案，並非官方遊戲產品。

- [Genshin Impact](https://genshin.hoyoverse.com/en/)：主視覺與探索敘事。
- [VALORANT](https://playvalorant.com/en-us/)：角色、地圖與消息。
- [Forza Horizon](https://forza.net/horizon)：車輛、公路與活動。
- [Zenless Zone Zero](https://zenless.hoyoverse.com/en-us/)：都市視覺與角色。
- [League of Legends](https://www.leagueoflegends.com/en-us/)：英雄定位與玩法。
- [Fall Guys](https://www.fallguys.com/en-US)：闖關、造型與最新動態。
