/* jshint esversion: 11 */
import { test, expect } from '@playwright/test';

function captureConsoleErrors(page) {
  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  return consoleErrors;
}

test('頁面載入時應套用 localStorage 語系並同步到 html lang 與選單', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('canvas_exporter_language', 'zh-TW');
  });

  const consoleErrors = captureConsoleErrors(page);
  await page.goto('http://localhost:8080');

  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-TW');
  await expect(page.locator('#language-select')).toHaveValue('zh-TW');
  await expect(page.locator('h1')).toContainText('檔案匯出工具');

  await page.waitForLoadState('networkidle');
  expect(consoleErrors).toHaveLength(0);
});

test('手動切換語系應立即更新 UI 文案', async ({ page }) => {
  const consoleErrors = captureConsoleErrors(page);
  await page.goto('http://localhost:8080');

  await page.selectOption('#language-select', 'zh-TW');

  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-TW');
  await expect(page.locator('#downloadBtnLabel')).toHaveText('下載檔案');
  await expect(page.locator('#autoUpdateHint')).toContainText('輸入內容後將自動產生檔名');

  await page.waitForLoadState('networkidle');
  expect(consoleErrors).toHaveLength(0);
});

test('語系切換後應寫入 localStorage 並在 reload 後維持', async ({ page }) => {
  const consoleErrors = captureConsoleErrors(page);
  await page.goto('http://localhost:8080');

  await page.selectOption('#language-select', 'zh-TW');
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem('canvas_exporter_language')))
    .toBe('zh-TW');

  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-TW');
  await expect(page.locator('#language-select')).toHaveValue('zh-TW');

  await page.waitForLoadState('networkidle');
  expect(consoleErrors).toHaveLength(0);
});

test('應該能夠貼上內容並偵測到 HTML 格式', async ({ page }) => {
  await page.goto('http://localhost:8080');

  const contentInput = page.locator('#contentInput');
  await contentInput.fill('<!DOCTYPE html><html><body><h1>Hello</h1></body></html>');

  const detectedType = page.locator('#detectedType');
  await expect(detectedType).toContainText('HTML');

  const filenameInput = page.locator('#filenameInput');
  await expect(filenameInput).not.toBeDisabled();
  const filename = await filenameInput.inputValue();
  expect(filename).toContain('.html');
});

test('清空按鈕應該可以運作', async ({ page }) => {
  await page.goto('http://localhost:8080');

  const contentInput = page.locator('#contentInput');
  await contentInput.fill('Some content');

  const clearBtn = page.locator('#clearBtn');
  await expect(clearBtn).toBeVisible();
  await clearBtn.click();

  await expect(contentInput).toHaveValue('');
  await expect(clearBtn).not.toBeVisible();
});
