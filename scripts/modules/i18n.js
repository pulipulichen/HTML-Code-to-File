/* jshint esversion: 11 */
import en from './i18n/en.js';
import zhTW from './i18n/zh-TW.js';

const TRANSLATIONS = {
    en,
    'zh-TW': zhTW,
};

const STORAGE_KEY = 'canvas_exporter_language';
const DEFAULT_LANGUAGE = 'en';

const SUPPORTED_LANGUAGES = Object.keys(TRANSLATIONS);

let currentLanguage = DEFAULT_LANGUAGE;

function getNestedValue(obj, path) {
    return path.split('.').reduce((acc, key) => {
        if (acc && Object.prototype.hasOwnProperty.call(acc, key)) {
            return acc[key];
        }

        return undefined;
    }, obj);
}

function normalizeLanguage(lang) {
    if (!lang) {
        return null;
    }

    if (SUPPORTED_LANGUAGES.includes(lang)) {
        return lang;
    }

    const lowerLang = lang.toLowerCase();
    const partialMatch = SUPPORTED_LANGUAGES.find((supported) => supported.toLowerCase() === lowerLang);
    if (partialMatch) {
        return partialMatch;
    }

    const baseLang = lowerLang.split('-')[0];
    return SUPPORTED_LANGUAGES.find((supported) => supported.toLowerCase().split('-')[0] === baseLang) || null;
}

function detectBrowserLanguage() {
    const languageCandidates = [
        ...(navigator.languages || []),
        navigator.language,
    ];

    for (const language of languageCandidates) {
        const matchedLanguage = normalizeLanguage(language);
        if (matchedLanguage) {
            return matchedLanguage;
        }
    }

    return null;
}

function getInitialLanguage() {
    const savedLanguage = normalizeLanguage(localStorage.getItem(STORAGE_KEY));
    if (savedLanguage) {
        return savedLanguage;
    }

    const browserLanguage = detectBrowserLanguage();
    if (browserLanguage) {
        return browserLanguage;
    }

    return DEFAULT_LANGUAGE;
}

function applyTranslations() {
    const translatableElements = document.querySelectorAll('[data-i18n]');
    translatableElements.forEach((element) => {
        const key = element.dataset.i18n;
        const translatedText = t(key);
        element.textContent = translatedText;
    });

    const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
    placeholderElements.forEach((element) => {
        const key = element.dataset.i18nPlaceholder;
        element.setAttribute('placeholder', t(key));
    });
}

function updateLanguageSelector() {
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.value = currentLanguage;
    }
}

function updateHtmlLanguage() {
    document.documentElement.lang = currentLanguage;
}

function dispatchLanguageChangedEvent() {
    window.dispatchEvent(new CustomEvent('i18n:changed', {
        detail: {
            language: currentLanguage,
        },
    }));
}

export function t(key) {
    const translatedValue = getNestedValue(TRANSLATIONS[currentLanguage], key);
    if (typeof translatedValue !== 'undefined') {
        return translatedValue;
    }

    const fallbackValue = getNestedValue(TRANSLATIONS[DEFAULT_LANGUAGE], key);
    if (typeof fallbackValue !== 'undefined') {
        return fallbackValue;
    }

    return key;
}

export function getCurrentLanguage() {
    return currentLanguage;
}

export function setLanguage(language) {
    const normalizedLanguage = normalizeLanguage(language) || DEFAULT_LANGUAGE;
    currentLanguage = normalizedLanguage;
    localStorage.setItem(STORAGE_KEY, currentLanguage);
    updateHtmlLanguage();
    applyTranslations();
    updateLanguageSelector();
    dispatchLanguageChangedEvent();
}

function registerLanguageSelector() {
    const languageSelect = document.getElementById('language-select');
    if (!languageSelect) {
        return;
    }

    languageSelect.addEventListener('change', (event) => {
        setLanguage(event.target.value);
    });
}

export function initI18n() {
    currentLanguage = getInitialLanguage();
    registerLanguageSelector();
    updateLanguageSelector();
    setLanguage(currentLanguage);
}
