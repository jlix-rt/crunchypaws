import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.describe('Login', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/auth/login');
    });

    test('should display login form', async ({ page }) => {
      await expect(page.locator('input[type="email"]')).toBeVisible();
      await expect(page.locator('input[type="password"]')).toBeVisible();
      await expect(page.locator('button:has-text("Iniciar Sesión")')).toBeVisible();
    });

    test('should show validation errors for empty fields', async ({ page }) => {
      await page.click('button:has-text("Iniciar Sesión")');
      
      // Wait for validation errors to appear
      await expect(page.locator('text=El email es requerido')).toBeVisible();
      await expect(page.locator('text=La contraseña es requerida')).toBeVisible();
    });

    test('should show error for invalid email format', async ({ page }) => {
      await page.fill('input[type="email"]', 'invalid-email');
      await page.click('button:has-text("Iniciar Sesión")');
      
      await expect(page.locator('text=Email inválido')).toBeVisible();
    });

    test('should login with valid credentials', async ({ page }) => {
      await page.fill('input[type="email"]', 'demo@crunchypaws.com');
      await page.fill('input[type="password"]', 'password123');
      await page.click('button:has-text("Iniciar Sesión")');
      
      // Should redirect to home and show user menu
      await expect(page).toHaveURL('/');
      await expect(page.locator('button[mat-icon-button] mat-icon:has-text("account_circle")')).toBeVisible();
    });
  });

  test.describe('Register', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/auth/register');
    });

    test('should display registration form', async ({ page }) => {
      await expect(page.locator('input[placeholder*="Nombre"]')).toBeVisible();
      await expect(page.locator('input[placeholder*="Apellido"]')).toBeVisible();
      await expect(page.locator('input[type="email"]')).toBeVisible();
      await expect(page.locator('input[placeholder*="Teléfono"]')).toBeVisible();
      await expect(page.locator('input[type="password"]')).toBeVisible();
      await expect(page.locator('button:has-text("Registrarse")')).toBeVisible();
    });

    test('should show validation errors for empty required fields', async ({ page }) => {
      await page.click('button:has-text("Registrarse")');
      
      await expect(page.locator('text=El nombre es requerido')).toBeVisible();
      await expect(page.locator('text=El apellido es requerido')).toBeVisible();
      await expect(page.locator('text=El email es requerido')).toBeVisible();
      await expect(page.locator('text=El teléfono es requerido')).toBeVisible();
    });

    test('should register new user successfully', async ({ page }) => {
      const timestamp = Date.now();
      
      await page.fill('input[placeholder*="Nombre"]', 'Test');
      await page.fill('input[placeholder*="Apellido"]', 'User');
      await page.fill('input[type="email"]', `test${timestamp}@example.com`);
      await page.fill('input[placeholder*="Teléfono"]', '+50212345678');
      await page.fill('input[type="password"]', 'password123');
      
      await page.click('button:has-text("Registrarse")');
      
      // Should redirect to home and show success message
      await expect(page).toHaveURL('/');
      await expect(page.locator('text=Cuenta creada exitosamente')).toBeVisible();
    });
  });

  test.describe('User Menu', () => {
    test.beforeEach(async ({ page }) => {
      // Login first
      await page.goto('/auth/login');
      await page.fill('input[type="email"]', 'demo@crunchypaws.com');
      await page.fill('input[type="password"]', 'password123');
      await page.click('button:has-text("Iniciar Sesión")');
      await page.waitForURL('/');
    });

    test('should show user menu options', async ({ page }) => {
      await page.click('button[mat-icon-button] mat-icon:has-text("account_circle")');
      
      await expect(page.locator('button:has-text("Mi Perfil")')).toBeVisible();
      await expect(page.locator('button:has-text("Mis Direcciones")')).toBeVisible();
      await expect(page.locator('button:has-text("Mis Órdenes")')).toBeVisible();
      await expect(page.locator('button:has-text("Cerrar Sesión")')).toBeVisible();
    });

    test('should logout successfully', async ({ page }) => {
      await page.click('button[mat-icon-button] mat-icon:has-text("account_circle")');
      await page.click('button:has-text("Cerrar Sesión")');
      
      // Should show login button again
      await expect(page.locator('button:has-text("Iniciar Sesión")')).toBeVisible();
      await expect(page.locator('text=Sesión cerrada')).toBeVisible();
    });
  });
});
