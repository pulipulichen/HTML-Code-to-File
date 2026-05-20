/* jshint esversion: 11 */
const ANALYSIS_LIMIT = 5000;

function sanitizeBaseName(baseName) {
    let sanitizedBaseName = baseName.replace(/[\\/:*?"<>|]/g, '-').trim();
    if (sanitizedBaseName.length > 40) {
        sanitizedBaseName = sanitizedBaseName.substring(0, 40);
    }

    return sanitizedBaseName || 'untitled';
}

function buildTimestamp(date = new Date()) {
    const yyyy = date.getFullYear();
    const MM = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const HH = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');

    return `${yyyy}${MM}${dd}-${HH}${mm}${ss}`;
}

export function detectContentMetadata(content) {
    const headContent = content.substring(0, ANALYSIS_LIMIT);
    const trimmedHeadContent = headContent.trim();

    const metadata = {
        extension: 'txt',
        baseName: 'canvas-export',
        typeKey: 'types.plainText',
        typeColorClass: 'bg-slate-100 text-slate-700 border-slate-200',
    };

    if (
        /<html/i.test(headContent) ||
        /<!doctype html>/i.test(headContent) ||
        (/<body/i.test(headContent) && /<div/i.test(headContent))
    ) {
        metadata.extension = 'html';
        metadata.typeKey = 'types.html';
        metadata.typeColorClass = 'bg-orange-100 text-orange-700 border-orange-200';

        const titleMatch = headContent.match(/<title[^>]*>([^<]+)<\/title>/i);
        const h1Match = headContent.match(/<h1[^>]*>([^<]+)<\/h1>/i);

        if (titleMatch && titleMatch[1].trim()) {
            metadata.baseName = titleMatch[1].trim();
        } else if (h1Match && h1Match[1].trim()) {
            metadata.baseName = h1Match[1].trim();
        } else {
            metadata.baseName = 'webpage';
        }

        return metadata;
    }

    if (trimmedHeadContent.startsWith('{') || trimmedHeadContent.startsWith('[')) {
        try {
            JSON.parse(content);
            metadata.extension = 'json';
            metadata.baseName = 'data';
            metadata.typeKey = 'types.json';
            metadata.typeColorClass = 'bg-yellow-100 text-yellow-700 border-yellow-200';
            return metadata;
        } catch {
            // Invalid JSON. Continue to other detections.
        }
    }

    const markdownMatch = headContent.match(/^#\s+(.*)/m);
    if (markdownMatch) {
        metadata.extension = 'md';
        metadata.typeKey = 'types.markdown';
        metadata.typeColorClass = 'bg-blue-100 text-blue-700 border-blue-200';
        if (markdownMatch[1].trim()) {
            metadata.baseName = markdownMatch[1].trim();
        }

        return metadata;
    }

    if (
        /(?:body|html|div|span|\.[a-z0-9_-]+|#[a-z0-9_-]+)\s*\{/i.test(headContent) &&
        !/<html/i.test(headContent)
    ) {
        metadata.extension = 'css';
        metadata.baseName = 'style';
        metadata.typeKey = 'types.css';
        metadata.typeColorClass = 'bg-indigo-100 text-indigo-700 border-indigo-200';
        return metadata;
    }

    if (/(?:const|let|var|function|import|export)\s+/i.test(headContent) && !/<html/i.test(headContent)) {
        metadata.extension = 'js';
        metadata.baseName = 'script';
        metadata.typeKey = 'types.javascript';
        metadata.typeColorClass = 'bg-yellow-100 text-yellow-800 border-yellow-300';
    }

    return metadata;
}

export function buildSuggestedFilename(baseName, extension, date = new Date()) {
    const safeBaseName = sanitizeBaseName(baseName);
    const timestamp = buildTimestamp(date);
    return `${safeBaseName}_${timestamp}.${extension}`;
}
