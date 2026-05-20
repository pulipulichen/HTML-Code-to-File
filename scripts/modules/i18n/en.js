/* jshint esversion: 11 */
const en = {
    language: {
        label: 'Language',
        options: {
            en: 'English',
            'zh-TW': 'Traditional Chinese',
        },
    },
    header: {
        title: 'Code to File Exporter',
        subtitle: 'Paste code or text copied from Canvas, and this tool will auto-detect a suitable filename for download.',
    },
    editor: {
        title: 'File Content (Paste Here)',
        placeholder: 'Paste HTML, Markdown, JSON, or any code here...',
    },
    settings: {
        title: 'File Settings',
        detectedType: 'Detected Format',
        filenameLabel: 'Filename (editable)',
        filenamePlaceholder: 'untitled.txt',
    },
    hints: {
        autoFilename: 'Filename will be generated after you input content',
        lockedFilename: 'Manual filename is locked',
    },
    buttons: {
        clear: 'Clear',
        download: 'Download File',
        downloadSuccess: 'Downloaded!',
    },
    footer: {
        localOnly: 'All processing happens in your browser. No data is uploaded.',
    },
    types: {
        unknown: 'Not detected yet',
        plainText: 'Plain Text (TXT)',
        html: 'Webpage (HTML)',
        json: 'Data (JSON)',
        markdown: 'Markdown (MD)',
        css: 'Stylesheet (CSS)',
        javascript: 'JavaScript (JS)',
    },
};

export default en;
