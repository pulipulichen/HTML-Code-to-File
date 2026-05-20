# CHANGELOG

All notable changes to this project will be documented in this file.

## [0.0.2]

### Added

- Added `.jslintrc` with JSLint baseline options and `esversion: 8` support for modern JavaScript syntax.

### Changed

- Updated `index.html` title and PWA-related metadata.
- Removed custom scrollbar styles and switched to an external stylesheet link.
- Improved `README.md` with icon credit information.
- Reorganized `README.md` into a complete English guide with clear sections for features, stack, usage, testing, and license.
- Added language switch links to support bilingual README navigation.

### Documentation

- Added `README_zh_tw.md` as the Traditional Chinese README, aligned with the English structure and content.

### Improved

- Refactored filename input from a single-line input to a textarea.
- Enhanced `localStorage` handling for user edit state and content persistence.

### Fixed

- Updated Playwright assertion in `e2e/test.spec.js` to match localized UI text for detected HTML type.
- Resolved Playwright reporter output conflict by separating test artifacts into `test-results/`.
- Aligned Docker test runner output path in `Dockerfile.test` with Playwright config.
- Stripped wrapping Markdown code fences (` ```html ... ``` `) from editor content before download so exported files contain raw HTML only.

## [0.0.1]

### Added

- Introduced initial project structure and baseline setup.
