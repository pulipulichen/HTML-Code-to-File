# HTML-Code-to-File

[English](./README.md) | [繁體中文](./README_zh_tw.md)

這是一個瀏覽器端工具，可自動判斷貼上程式碼或文字的格式，並產生可下載檔案。  
它特別適合把從 Canvas 或其他平台匯出的原始內容，快速整理為本機檔案。

## 線上示範

- [https://pulipulichen.github.io/HTML-Code-to-File/](https://pulipulichen.github.io/HTML-Code-to-File/)

## 功能特色

- 自動偵測貼上內容格式（HTML、JSON、Markdown、CSS、JavaScript、純文字）
- 依內容產生預設檔名，並附加時間戳記（`YYYYMMDD-HHmmSS`）
- 允許手動修改檔名，並鎖定使用者自訂結果
- 使用 `localStorage` 暫存內容與檔名，重新整理頁面後可復原
- 所有處理都在瀏覽器端完成，不會上傳資料到伺服器
- 支援 PWA 基本能力，透過 `manifest.json` 與 `service-worker.js` 提供離線快取
- 內建英文與繁體中文介面切換

## 技術堆疊

- HTML5
- JavaScript (ES6+)
- Tailwind CSS（CDN）
- Browser File API / Blob Download
- Service Worker / Web App Manifest
- Playwright（E2E 測試）

## 使用方式

1. 開啟網頁後，在左側輸入區貼上內容。
2. 系統會自動偵測格式並產生檔名。
3. 可視需求手動調整檔名。
4. 點擊 **Download File** 下載檔案。

## 本機測試（Docker）

專案提供 Docker 化的 E2E 測試流程，可使用：

```bash
npm start
```

此指令會透過 `docker compose` 啟動測試容器並執行 Playwright 測試。

## 授權

- [MIT License](./LICENSE)

## Icon Credit

- [Flaticon - file icon](https://www.flaticon.com/free-icon/file_1091669?term=file+download&page=1&position=6&origin=search&related_id=1091669)
