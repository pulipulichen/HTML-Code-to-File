# Changelog

All notable changes to this project will be documented in this file.

## [2026-05-19]

### Changed
- Updated `index.html` title and PWA-related metadata.
- Removed custom scrollbar styles and switched to an external stylesheet link.
- Improved `README.md` with icon credit information.

### Improved
- Refactored filename input from a single-line input to a textarea.
- Enhanced `localStorage` handling for user edit state and content persistence.

### Fixed
- Updated Playwright assertion in `e2e/test.spec.js` to match localized UI text for detected HTML type.
- Resolved Playwright reporter output conflict by separating test artifacts into `test-results/`.
- Aligned Docker test runner output path in `Dockerfile.test` with Playwright config.

## [2026-05-18]

### Added
- Introduced initial project structure and baseline setup.
