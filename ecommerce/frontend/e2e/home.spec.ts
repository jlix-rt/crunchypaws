import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the main heading', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Snacks 100% Naturales');
  });

  test('should have navigation links', async ({ page }) => {
    await expect(page.locator('nav a[href="/catalogo"]')).toBeVisible();
    await expect(page.locator('nav a[href="/informacion"]')).toBeVisible();
    await expect(page.locator('nav a[href="/contacto"]')).toBeVisible();
  });

  test('should display CTA buttons', async ({ page }) => {
    await expect(page.locator('button:has-text("Ver Catálogo")')).toBeVisible();
    await expect(page.locator('button:has-text("Conoce Más")')).toBeVisible();
  });

  test('should navigate to catalog when clicking Ver Catálogo', async ({ page }) => {
    await page.click('button:has-text("Ver Catálogo")');
    await expect(page).toHaveURL('/catalogo');
  });

  test('should display features section', async ({ page }) => {
    await expect(page.locator('text=100% Natural')).toBeVisible();
    await expect(page.locator('text=Saludable')).toBeVisible();
    await expect(page.locator('text=Delicioso')).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('button[mat-icon-button]')).toBeVisible(); // Mobile menu
  });
});
