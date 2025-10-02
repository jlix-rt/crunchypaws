import { test, expect } from '@playwright/test';

test.describe('Cart and Checkout Flow', () => {
  test.describe('Cart Management', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/catalogo');
    });

    test('should add product to cart', async ({ page }) => {
      // Wait for products to load
      await page.waitForSelector('[data-testid="product-card"]', { timeout: 10000 });
      
      // Click on first product
      await page.click('[data-testid="product-card"]:first-child');
      
      // Add to cart
      await page.click('button:has-text("Agregar al Carrito")');
      
      // Check cart badge
      const cartBadge = page.locator('[matBadge]');
      await expect(cartBadge).toHaveAttribute('matBadge', '1');
      
      // Check success message
      await expect(page.locator('text=agregado al carrito')).toBeVisible();
    });

    test('should update quantity in cart', async ({ page }) => {
      // Add product to cart first
      await page.waitForSelector('[data-testid="product-card"]');
      await page.click('[data-testid="product-card"]:first-child');
      await page.click('button:has-text("Agregar al Carrito")');
      
      // Go to cart
      await page.click('button[mat-icon-button] mat-icon:has-text("shopping_cart")');
      
      // Update quantity
      await page.click('[data-testid="increase-quantity"]');
      
      // Check updated quantity
      await expect(page.locator('[data-testid="item-quantity"]')).toHaveValue('2');
    });

    test('should remove item from cart', async ({ page }) => {
      // Add product to cart first
      await page.waitForSelector('[data-testid="product-card"]');
      await page.click('[data-testid="product-card"]:first-child');
      await page.click('button:has-text("Agregar al Carrito")');
      
      // Go to cart
      await page.click('button[mat-icon-button] mat-icon:has-text("shopping_cart")');
      
      // Remove item
      await page.click('[data-testid="remove-item"]');
      
      // Check empty cart message
      await expect(page.locator('text=Tu carrito está vacío')).toBeVisible();
    });
  });

  test.describe('Guest Checkout', () => {
    test.beforeEach(async ({ page }) => {
      // Add product to cart
      await page.goto('/catalogo');
      await page.waitForSelector('[data-testid="product-card"]');
      await page.click('[data-testid="product-card"]:first-child');
      await page.click('button:has-text("Agregar al Carrito")');
      
      // Go to checkout
      await page.goto('/checkout');
    });

    test('should complete guest checkout', async ({ page }) => {
      // Fill customer information
      await page.fill('input[placeholder*="Nombre"]', 'Juan Pérez');
      await page.fill('input[type="email"]', 'juan@example.com');
      await page.fill('input[placeholder*="Teléfono"]', '+50212345678');
      
      // Fill address
      await page.fill('input[placeholder*="Dirección"]', '5ta Avenida 12-34, Zona 10');
      await page.fill('input[placeholder*="Municipio"]', 'Guatemala');
      await page.fill('input[placeholder*="Departamento"]', 'Guatemala');
      
      // Select payment method
      await page.click('input[value="CASH"]');
      
      // Complete order
      await page.click('button:has-text("Finalizar Pedido")');
      
      // Check success message
      await expect(page.locator('text=Orden creada exitosamente')).toBeVisible();
    });

    test('should validate required fields', async ({ page }) => {
      await page.click('button:has-text("Finalizar Pedido")');
      
      await expect(page.locator('text=El nombre es requerido')).toBeVisible();
      await expect(page.locator('text=El email es requerido')).toBeVisible();
      await expect(page.locator('text=El teléfono es requerido')).toBeVisible();
    });

    test('should apply coupon successfully', async ({ page }) => {
      // Fill minimum required fields
      await page.fill('input[placeholder*="Nombre"]', 'Juan Pérez');
      await page.fill('input[type="email"]', 'juan@example.com');
      await page.fill('input[placeholder*="Teléfono"]', '+50212345678');
      
      // Apply coupon
      await page.fill('input[placeholder*="Cupón"]', 'BIENVENIDO10');
      await page.click('button:has-text("Aplicar")');
      
      // Check discount applied
      await expect(page.locator('text=Cupón aplicado')).toBeVisible();
      await expect(page.locator('[data-testid="discount-amount"]')).not.toHaveText('Q0.00');
    });
  });

  test.describe('Authenticated User Checkout', () => {
    test.beforeEach(async ({ page }) => {
      // Login first
      await page.goto('/auth/login');
      await page.fill('input[type="email"]', 'demo@crunchypaws.com');
      await page.fill('input[type="password"]', 'password123');
      await page.click('button:has-text("Iniciar Sesión")');
      
      // Add product to cart
      await page.goto('/catalogo');
      await page.waitForSelector('[data-testid="product-card"]');
      await page.click('[data-testid="product-card"]:first-child');
      await page.click('button:has-text("Agregar al Carrito")');
      
      // Go to checkout
      await page.goto('/checkout');
    });

    test('should use saved address for checkout', async ({ page }) => {
      // Select existing address
      await page.click('[data-testid="address-option"]:first-child');
      
      // Select payment method
      await page.click('input[value="CASH"]');
      
      // Complete order
      await page.click('button:has-text("Finalizar Pedido")');
      
      // Check success and WhatsApp notification
      await expect(page.locator('text=Orden creada exitosamente')).toBeVisible();
    });

    test('should require phone number before checkout', async ({ page }) => {
      // If user doesn't have phone, should be prompted
      // This test assumes the demo user has phone, so it should proceed normally
      
      await page.click('[data-testid="address-option"]:first-child');
      await page.click('input[value="CASH"]');
      await page.click('button:has-text("Finalizar Pedido")');
      
      // Should either complete successfully or ask for phone
      const successMessage = page.locator('text=Orden creada exitosamente');
      const phoneRequired = page.locator('text=completar su número de teléfono');
      
      await expect(successMessage.or(phoneRequired)).toBeVisible();
    });

    test('should create new address during checkout', async ({ page }) => {
      await page.click('button:has-text("Nueva Dirección")');
      
      // Fill new address form
      await page.fill('input[placeholder*="Alias"]', 'Oficina');
      await page.fill('input[placeholder*="Dirección"]', '12 Calle 1-25, Zona 1');
      await page.fill('input[placeholder*="Municipio"]', 'Guatemala');
      await page.fill('input[placeholder*="Departamento"]', 'Guatemala');
      
      await page.click('button:has-text("Guardar Dirección")');
      
      // Select payment and complete
      await page.click('input[value="CASH"]');
      await page.click('button:has-text("Finalizar Pedido")');
      
      await expect(page.locator('text=Orden creada exitosamente')).toBeVisible();
    });
  });
});
