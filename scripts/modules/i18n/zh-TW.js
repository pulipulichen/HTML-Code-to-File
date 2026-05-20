/* jshint esversion: 11 */
const zhTW = {
    language: {
        label: '語言',
        options: {
            en: 'English',
            'zh-TW': '繁體中文',
        },
    },
    header: {
        title: '檔案匯出工具',
        subtitle: '貼上從 Canvas 取得的程式碼或文字內容，系統將自動分析並產生適合的檔名。',
    },
    editor: {
        title: '檔案內容 (貼上於此)',
        placeholder: '請在此貼上 HTML、Markdown、JSON 或任何程式碼...',
    },
    settings: {
        title: '檔案設定',
        detectedType: '自動偵測格式',
        filenameLabel: '儲存檔名 (可自行修改)',
        filenamePlaceholder: 'untitled.txt',
    },
    hints: {
        autoFilename: '輸入內容後將自動產生檔名',
        lockedFilename: '已鎖定手動修改的檔名',
    },
    buttons: {
        clear: '清空',
        download: '下載檔案',
        downloadSuccess: '下載成功！',
    },
    footer: {
        localOnly: '所有處理皆在您的瀏覽器中完成，不會上傳任何資料。',
    },
    types: {
        unknown: '尚未偵測',
        plainText: '純文字 (TXT)',
        html: '網頁 (HTML)',
        json: '資料 (JSON)',
        markdown: 'Markdown (MD)',
        css: '樣式表 (CSS)',
        javascript: 'JavaScript (JS)',
    },
};

export default zhTW;
