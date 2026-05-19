document.addEventListener('DOMContentLoaded', () => {
    const contentInput = document.getElementById('contentInput');
    const filenameInput = document.getElementById('filenameInput');
    const downloadBtn = document.getElementById('downloadBtn');
    const clearBtn = document.getElementById('clearBtn');
    const detectedTypeEl = document.getElementById('detectedType');
    const autoUpdateHint = document.getElementById('autoUpdateHint');

    let isUserEditedFilename = localStorage.getItem('canvas_exporter_is_edited') === 'true';

    // 監聽檔名輸入框，如果使用者自己改了，就不再自動覆蓋，除非清空內容
    filenameInput.addEventListener('input', () => {
        isUserEditedFilename = true;
        localStorage.setItem('canvas_exporter_is_edited', 'true');
        localStorage.setItem('canvas_exporter_filename', filenameInput.value);
        autoUpdateHint.textContent = "已鎖定手動修改的檔名";
        autoUpdateHint.classList.add('text-amber-500');
    });

    // 頁面載入時，若有暫存內容則自動復原
    const savedContent = localStorage.getItem('canvas_exporter_content');
    if (savedContent) {
        contentInput.value = savedContent;
        if (isUserEditedFilename) {
            filenameInput.value = localStorage.getItem('canvas_exporter_filename') || '';
            autoUpdateHint.textContent = "已鎖定手動修改的檔名";
            autoUpdateHint.classList.add('text-amber-500');
        }
        // 延遲觸發以確保事件綁定已完成
        setTimeout(() => contentInput.dispatchEvent(new Event('input')), 0);
    }

    // 清空按鈕邏輯
    clearBtn.addEventListener('click', () => {
        contentInput.value = '';
        localStorage.removeItem('canvas_exporter_content');
        localStorage.removeItem('canvas_exporter_filename');
        localStorage.setItem('canvas_exporter_is_edited', 'false');
        contentInput.dispatchEvent(new Event('input'));
    });

    // 核心邏輯：分析內容並產生檔名
    contentInput.addEventListener('input', () => {
        const content = contentInput.value;
        localStorage.setItem('canvas_exporter_content', content);
        
        const isEmpty = content.trim() === '';
        
        downloadBtn.disabled = isEmpty;
        filenameInput.disabled = isEmpty;
        
        if (isEmpty) {
            clearBtn.classList.add('hidden');
            filenameInput.value = '';
            detectedTypeEl.textContent = '尚未偵測';
            detectedTypeEl.className = 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-sm font-medium border border-slate-200';
            isUserEditedFilename = false;
            localStorage.setItem('canvas_exporter_is_edited', 'false');
            localStorage.removeItem('canvas_exporter_filename');
            autoUpdateHint.textContent = "輸入內容後將自動產生檔名";
            autoUpdateHint.classList.remove('text-amber-500');
            return;
        }

        clearBtn.classList.remove('hidden');

        if (isUserEditedFilename) return; // 如果使用者已經自訂檔名，不自動覆蓋

        // 只取前 5000 個字元進行分析，避免大型檔案造成瀏覽器卡頓
        const headContent = content.substring(0, 5000);
        
        let ext = 'txt';
        let baseName = 'canvas-export';
        let typeLabel = '純文字 (TXT)';
        let typeColor = 'bg-slate-100 text-slate-700 border-slate-200';

        // 1. 判斷是否為 HTML
        if (/<html/i.test(headContent) || /<!doctype html>/i.test(headContent) || (/<body/i.test(headContent) && /<div/i.test(headContent))) {
            ext = 'html';
            typeLabel = '網頁 (HTML)';
            typeColor = 'bg-orange-100 text-orange-700 border-orange-200';
            
            // 擷取 <title>
            const titleMatch = headContent.match(/<title[^>]*>([^<]+)<\/title>/i);
            // 擷取 <h1>
            const h1Match = headContent.match(/<h1[^>]*>([^<]+)<\/h1>/i);

            if (titleMatch && titleMatch[1].trim()) {
                baseName = titleMatch[1].trim();
            } else if (h1Match && h1Match[1].trim()) {
                baseName = h1Match[1].trim();
            } else {
                baseName = 'webpage';
            }
        }
        // 2. 判斷是否為 JSON
        else if (headContent.trim().startsWith('{') || headContent.trim().startsWith('[')) {
            try {
                JSON.parse(content); // 對完整內容測試
                ext = 'json';
                baseName = 'data';
                typeLabel = '資料 (JSON)';
                typeColor = 'bg-yellow-100 text-yellow-700 border-yellow-200';
            } catch (e) {
                // 不是有效的 JSON，繼續其他判斷
            }
        }
        // 3. 判斷是否為 Markdown (標題開頭)
        else if (/^#\s+(.*)/m.test(headContent)) {
            ext = 'md';
            typeLabel = 'Markdown (MD)';
            typeColor = 'bg-blue-100 text-blue-700 border-blue-200';
            
            const mdMatch = headContent.match(/^#\s+(.*)/m);
            if (mdMatch && mdMatch[1].trim()) {
                baseName = mdMatch[1].trim();
            }
        }
        // 4. 判斷是否為 CSS
        else if (/(?:body|html|div|span|\.[a-z0-9_-]+|#[a-z0-9_-]+)\s*\{/i.test(headContent) && !/<html/i.test(headContent)) {
            ext = 'css';
            baseName = 'style';
            typeLabel = '樣式表 (CSS)';
            typeColor = 'bg-indigo-100 text-indigo-700 border-indigo-200';
        }
        // 5. 判斷是否為 JavaScript (簡單判斷)
        else if (/(?:const|let|var|function|import|export)\s+/i.test(headContent) && !/<html/i.test(headContent)) {
            ext = 'js';
            baseName = 'script';
            typeLabel = 'JavaScript (JS)';
            typeColor = 'bg-yellow-100 text-yellow-800 border-yellow-300';
        }

        // 更新標籤顯示
        detectedTypeEl.textContent = typeLabel;
        detectedTypeEl.className = `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-sm font-medium border transition-colors ${typeColor}`;

        // 清理檔名 (移除不合法的字元)
        baseName = baseName.replace(/[\\/:*?"<>|]/g, '-').trim();
        if (baseName.length > 40) baseName = baseName.substring(0, 40); // 限制長度

        // 產生時間戳記 YYYYMMDD-HHmmSS
        const now = new Date();
        const yyyy = now.getFullYear();
        const MM = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        const HH = String(now.getHours()).padStart(2, '0');
        const mm = String(now.getMinutes()).padStart(2, '0');
        const ss = String(now.getSeconds()).padStart(2, '0');
        const timestamp = `${yyyy}${MM}${dd}-${HH}${mm}${ss}`;

        // 組合最終檔名
        filenameInput.value = `${baseName}_${timestamp}.${ext}`;
    });

    // 下載功能
    downloadBtn.addEventListener('click', () => {
        const content = contentInput.value;
        if (!content) return;

        // 取得檔名並移除所有換行字元
        let filename = filenameInput.value.replace(/[\r\n]+/g, '').trim();
        if (!filename) filename = 'untitled.txt';
        
        // 建立 Blob 物件
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        
        // 建立隱藏的 a 標籤來觸發下載
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        
        // 清理
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);

        // 給予一點視覺回饋
        const originalText = downloadBtn.innerHTML;
        downloadBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> 下載成功！`;
        downloadBtn.classList.replace('bg-blue-600', 'bg-green-600');
        downloadBtn.classList.replace('hover:bg-blue-700', 'hover:bg-green-700');
        
        setTimeout(() => {
            downloadBtn.innerHTML = originalText;
            downloadBtn.classList.replace('bg-green-600', 'bg-blue-600');
            downloadBtn.classList.replace('hover:bg-green-700', 'hover:bg-blue-700');
        }, 2000);
    });
});
