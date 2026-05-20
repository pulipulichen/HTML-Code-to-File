/* jshint esversion: 11 */
const KEYS = {
    content: 'canvas_exporter_content',
    filename: 'canvas_exporter_filename',
    isEdited: 'canvas_exporter_is_edited',
};

export function loadEditorState() {
    return {
        content: localStorage.getItem(KEYS.content) || '',
        filename: localStorage.getItem(KEYS.filename) || '',
        isUserEditedFilename: localStorage.getItem(KEYS.isEdited) === 'true',
    };
}

export function persistContent(content) {
    localStorage.setItem(KEYS.content, content);
}

export function persistFilename(filename) {
    localStorage.setItem(KEYS.filename, filename);
}

export function clearPersistedFilename() {
    localStorage.removeItem(KEYS.filename);
}

export function persistFilenameEditedFlag(isEdited) {
    localStorage.setItem(KEYS.isEdited, String(isEdited));
}

export function clearEditorState() {
    localStorage.removeItem(KEYS.content);
    localStorage.removeItem(KEYS.filename);
    persistFilenameEditedFlag(false);
}
