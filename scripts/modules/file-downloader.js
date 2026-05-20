/* jshint esversion: 11 */
function normalizeFilename(filename) {
    const cleanedFilename = filename.replace(/[\r\n]+/g, '').trim();
    return cleanedFilename || 'untitled.txt';
}

export function downloadTextContent(content, filename) {
    if (!content) {
        return;
    }

    const safeFilename = normalizeFilename(filename);
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = safeFilename;
    document.body.appendChild(anchor);
    anchor.click();

    setTimeout(() => {
        document.body.removeChild(anchor);
        URL.revokeObjectURL(url);
    }, 100);
}
