/* jshint esversion: 11 */
import { initI18n, t } from './modules/i18n.js';
import { detectContentMetadata, buildSuggestedFilename } from './modules/content-detector.js';
import {
    loadEditorState,
    persistContent,
    persistFilename,
    persistFilenameEditedFlag,
    clearPersistedFilename,
    clearEditorState,
} from './modules/persistence.js';
import { downloadTextContent } from './modules/file-downloader.js';

const DETECTED_TYPE_BASE_CLASS = 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-sm font-medium border transition-colors';
const DETECTED_TYPE_UNKNOWN_CLASS = 'bg-slate-100 text-slate-700 border-slate-200';

document.addEventListener('DOMContentLoaded', () => {
    initI18n();

    const contentInput = document.getElementById('contentInput');
    const filenameInput = document.getElementById('filenameInput');
    const downloadBtn = document.getElementById('downloadBtn');
    const downloadBtnLabel = document.getElementById('downloadBtnLabel');
    const clearBtn = document.getElementById('clearBtn');
    const detectedTypeEl = document.getElementById('detectedType');
    const autoUpdateHint = document.getElementById('autoUpdateHint');

    if (!contentInput || !filenameInput || !downloadBtn || !downloadBtnLabel || !clearBtn || !detectedTypeEl || !autoUpdateHint) {
        return;
    }

    const persistedState = loadEditorState();
    let isUserEditedFilename = persistedState.isUserEditedFilename;
    let currentDetectedType = {
        typeKey: 'types.unknown',
        typeColorClass: DETECTED_TYPE_UNKNOWN_CLASS,
    };

    function renderDetectedType() {
        detectedTypeEl.textContent = t(currentDetectedType.typeKey);
        detectedTypeEl.className = `${DETECTED_TYPE_BASE_CLASS} ${currentDetectedType.typeColorClass}`;
    }

    function renderAutoFilenameHint() {
        const hintKey = isUserEditedFilename ? 'hints.lockedFilename' : 'hints.autoFilename';
        autoUpdateHint.textContent = t(hintKey);
        autoUpdateHint.classList.toggle('text-amber-500', isUserEditedFilename);
    }

    function applyEmptyState() {
        downloadBtn.disabled = true;
        filenameInput.disabled = true;
        clearBtn.classList.add('hidden');
        filenameInput.value = '';
        isUserEditedFilename = false;
        persistFilenameEditedFlag(false);
        clearPersistedFilename();
        currentDetectedType = {
            typeKey: 'types.unknown',
            typeColorClass: DETECTED_TYPE_UNKNOWN_CLASS,
        };
        renderDetectedType();
        renderAutoFilenameHint();
    }

    function syncContentState() {
        const content = contentInput.value;
        persistContent(content);

        const isEmpty = content.trim() === '';
        if (isEmpty) {
            applyEmptyState();
            return;
        }

        downloadBtn.disabled = false;
        filenameInput.disabled = false;
        clearBtn.classList.remove('hidden');

        const metadata = detectContentMetadata(content);
        currentDetectedType = {
            typeKey: metadata.typeKey,
            typeColorClass: metadata.typeColorClass,
        };
        renderDetectedType();

        if (isUserEditedFilename) {
            return;
        }

        filenameInput.value = buildSuggestedFilename(metadata.baseName, metadata.extension);
        persistFilename(filenameInput.value);
        renderAutoFilenameHint();
    }

    function showDownloadSuccessFeedback() {
        downloadBtnLabel.textContent = t('buttons.downloadSuccess');
        downloadBtn.classList.replace('bg-blue-600', 'bg-green-600');
        downloadBtn.classList.replace('hover:bg-blue-700', 'hover:bg-green-700');

        setTimeout(() => {
            downloadBtnLabel.textContent = t('buttons.download');
            downloadBtn.classList.replace('bg-green-600', 'bg-blue-600');
            downloadBtn.classList.replace('hover:bg-green-700', 'hover:bg-blue-700');
        }, 2000);
    }

    filenameInput.addEventListener('input', () => {
        isUserEditedFilename = true;
        persistFilenameEditedFlag(true);
        persistFilename(filenameInput.value);
        renderAutoFilenameHint();
    });

    clearBtn.addEventListener('click', () => {
        contentInput.value = '';
        clearEditorState();
        contentInput.dispatchEvent(new Event('input'));
    });

    contentInput.addEventListener('input', syncContentState);

    downloadBtn.addEventListener('click', () => {
        const content = contentInput.value;
        if (!content) {
            return;
        }

        downloadTextContent(content, filenameInput.value);
        showDownloadSuccessFeedback();
    });

    window.addEventListener('i18n:changed', () => {
        renderDetectedType();
        renderAutoFilenameHint();
        downloadBtnLabel.textContent = t('buttons.download');
    });

    if (persistedState.content) {
        contentInput.value = persistedState.content;
        if (isUserEditedFilename) {
            filenameInput.value = persistedState.filename;
            renderAutoFilenameHint();
        }
        syncContentState();
    } else {
        applyEmptyState();
    }
});
