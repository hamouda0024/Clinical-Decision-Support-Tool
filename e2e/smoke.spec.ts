import { expect, test } from '@playwright/test';

test('quick chest-pain example produces visible differential results', async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('cds.language', 'ar');
  });

  await page.goto('/');
  await expect(page.getByRole('heading', { name: /تقييم سريري منظّم/ })).toBeVisible();

  await page.getByRole('button', { name: 'ألم صدري', exact: true }).click();
  await page.getByRole('button', { name: 'تحليل الحالة', exact: true }).click();

  await expect(page.locator('#differentials-title')).toBeVisible();
  await expect(page.locator('summary h4').first()).toContainText('متلازمة الشريان التاجي');
  await expect(page.getByText('المحتوى الدوائي محجوب').first()).toBeVisible();
});
