# HTML-Code-to-File

[English](./README.md) | [繁體中文](./README_zh_tw.md)

A browser-based tool that detects pasted code/text format and generates a downloadable file automatically.  
It is designed for quickly turning raw content exported from Canvas or other platforms into local files.

## Online Demo

- [https://pulipulichen.github.io/HTML-Code-to-File/](https://pulipulichen.github.io/HTML-Code-to-File/)

## Features

- Detects pasted content format automatically (HTML, JSON, Markdown, CSS, JavaScript, plain text)
- Generates a default filename from content with timestamp (`YYYYMMDD-HHmmSS`)
- Lets users manually edit and lock custom filenames
- Persists content and filename state via `localStorage` and restores after refresh
- Processes everything in-browser; no content is uploaded to a server
- Supports PWA basics with `manifest.json` and `service-worker.js` for offline caching
- Includes UI language switching between English and Traditional Chinese

## Tech Stack

- HTML5
- JavaScript (ES6+)
- Tailwind CSS (CDN)
- Browser File API / Blob download
- Service Worker / Web App Manifest
- Playwright (E2E testing)

## Usage

1. Open the page and paste content into the left input area.
2. The tool auto-detects the format and generates a filename.
3. Optionally edit the filename.
4. Click **Download File** to save the file.

## Local Testing (Docker)

The project includes a Docker-based E2E testing flow:

```bash
npm start
```

This command runs `docker compose` and executes Playwright tests in the test container.

## License

- [MIT License](./LICENSE)

## Icon Credit

- [Flaticon - file icon](https://www.flaticon.com/free-icon/file_1091669?term=file+download&page=1&position=6&origin=search&related_id=1091669)
