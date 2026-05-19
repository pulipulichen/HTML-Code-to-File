import { test, expect } from '@playwright/test';

test('應該能夠貼上內容並偵測到 HTML 格式', async ({ page }) => {
  // 1. 導航到應用程式
  await page.goto('http://localhost:8080');

  // 2. 設定控制台錯誤追蹤
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  // 3. 執行動作
  const contentInput = page.locator('#contentInput');
  await contentInput.fill('<!DOCTYPE html><html><body><h1>Hello</h1></body></html>');

  // 4. 斷言
  const detectedType = page.locator('#detectedType');
  await expect(detectedType).toContainText('HTML');

  const filenameInput = page.locator('#filenameInput');
  await expect(filenameInput).not.toBeDisabled();
  const filename = await filenameInput.inputValue();
  expect(filename).toContain('.html');

  // 5. 最終檢查
  await page.waitForLoadState('networkidle');
  expect(consoleErrors).toHaveLength(0);
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
