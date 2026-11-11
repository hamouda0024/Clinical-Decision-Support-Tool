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

test('an age under 16 withholds adult clinical results and shows the paediatric notice', async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('cds.language', 'ar');
  });

  await page.goto('/');
  await page.getByRole('button', { name: 'ألم صدري', exact: true }).click();
  await page.locator('#age').fill('8');
  await page.getByRole('button', { name: 'تحليل الحالة', exact: true }).click();

  await expect(page.getByText('لا يتم تطبيق مسار البالغين على الأطفال')).toBeVisible();
  await expect(page.locator('#differentials-title')).toHaveCount(0);
});
