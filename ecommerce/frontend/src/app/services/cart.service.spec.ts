import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CartService } from './cart.service';
import { NotificationService } from './notification.service';
import { Product } from '../models';

describe('CartService', () => {
  let service: CartService;
  let httpMock: HttpTestingController;
  let notificationSpy: jasmine.Spy;

  const mockProduct: Product = {
    id: 1,
    name: 'Patitas de Pollo',
    slug: 'patitas-pollo',
    description: 'Deliciosas patitas de pollo deshidratadas',
    price: 25.50,
    imageUrl: '/assets/images/products/patitas.jpg',
    stock: 10,
    isFeatured: true,
    categoryId: 1,
    category: {
      id: 1,
      name: 'Snacks',
      slug: 'snacks',
      children: [],
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
    },
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  };

  beforeEach(() => {
    const notificationSpyObj = jasmine.createSpyObj('NotificationService', [
      'showSuccess',
      'showInfo',
      'showWarning',
    ]);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CartService,
        { provide: NotificationService, useValue: notificationSpyObj },
      ],
    });

    service = TestBed.inject(CartService);
    httpMock = TestBed.inject(HttpTestingController);
    notificationSpy = TestBed.inject(NotificationService).showSuccess as jasmine.Spy;

    // Clear localStorage
    localStorage.removeItem('crunchypaws_cart');
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.removeItem('crunchypaws_cart');
  });

  describe('addItem', () => {
    it('should add new item to cart', () => {
      service.addItem(mockProduct, 2);

      const cartItems = service.cartItems();
      expect(cartItems).toHaveLength(1);
      expect(cartItems[0]).toEqual({
        productId: 1,
        quantity: 2,
        product: mockProduct,
      });
      expect(service.itemCount()).toBe(2);
      expect(notificationSpy).toHaveBeenCalledWith('Patitas de Pollo agregado al carrito');
    });

    it('should update quantity for existing item', () => {
      // Add item first time
      service.addItem(mockProduct, 1);
      
      // Add same item again
      service.addItem(mockProduct, 2);

      const cartItems = service.cartItems();
      expect(cartItems).toHaveLength(1);
      expect(cartItems[0].quantity).toBe(3);
      expect(service.itemCount()).toBe(3);
    });

    it('should persist cart to localStorage', () => {
      service.addItem(mockProduct, 1);

      const storedCart = JSON.parse(localStorage.getItem('crunchypaws_cart') || '[]');
      expect(storedCart).toHaveLength(1);
      expect(storedCart[0].productId).toBe(1);
    });
  });

  describe('updateQuantity', () => {
    beforeEach(() => {
      service.addItem(mockProduct, 2);
    });

    it('should update item quantity', () => {
      service.updateQuantity(1, 5);

      const cartItems = service.cartItems();
      expect(cartItems[0].quantity).toBe(5);
      expect(service.itemCount()).toBe(5);
    });

    it('should remove item when quantity is 0', () => {
      service.updateQuantity(1, 0);

      expect(service.cartItems()).toHaveLength(0);
      expect(service.isEmpty()).toBe(true);
    });

    it('should remove item when quantity is negative', () => {
      service.updateQuantity(1, -1);

      expect(service.cartItems()).toHaveLength(0);
    });
  });

  describe('removeItem', () => {
    beforeEach(() => {
      service.addItem(mockProduct, 2);
    });

    it('should remove item from cart', () => {
      service.removeItem(1);

      expect(service.cartItems()).toHaveLength(0);
      expect(service.isEmpty()).toBe(true);
      expect(TestBed.inject(NotificationService).showInfo).toHaveBeenCalledWith(
        'Producto eliminado del carrito'
      );
    });
  });

  describe('clearCart', () => {
    beforeEach(() => {
      service.addItem(mockProduct, 2);
    });

    it('should clear all items from cart', () => {
      service.clearCart();

      expect(service.cartItems()).toHaveLength(0);
      expect(service.isEmpty()).toBe(true);
      expect(localStorage.getItem('crunchypaws_cart')).toBeNull();
    });
  });

  describe('getItemQuantity', () => {
    beforeEach(() => {
      service.addItem(mockProduct, 3);
    });

    it('should return correct quantity for existing item', () => {
      expect(service.getItemQuantity(1)).toBe(3);
    });

    it('should return 0 for non-existent item', () => {
      expect(service.getItemQuantity(999)).toBe(0);
    });
  });

  describe('isInCart', () => {
    beforeEach(() => {
      service.addItem(mockProduct, 1);
    });

    it('should return true for item in cart', () => {
      expect(service.isInCart(1)).toBe(true);
    });

    it('should return false for item not in cart', () => {
      expect(service.isInCart(999)).toBe(false);
    });
  });

  describe('calculateTotals', () => {
    beforeEach(() => {
      service.addItem(mockProduct, 2);
    });

    it('should calculate cart totals without coupon', () => {
      const mockCalculation = {
        success: true,
        data: {
          items: [
            {
              productId: 1,
              name: 'Patitas de Pollo',
              price: 25.50,
              quantity: 2,
              subtotal: 51.00,
            },
          ],
          subtotal: 51.00,
          discount: 0,
          total: 51.00,
        },
      };

      service.calculateTotals().subscribe((response) => {
        expect(response).toEqual(mockCalculation.data);
      });

      const req = httpMock.expectOne('/api/cart/price');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        items: [{ productId: 1, quantity: 2 }],
      });
      req.flush(mockCalculation);
    });

    it('should calculate cart totals with coupon', () => {
      const mockCalculation = {
        success: true,
        data: {
          items: [
            {
              productId: 1,
              name: 'Patitas de Pollo',
              price: 25.50,
              quantity: 2,
              subtotal: 51.00,
            },
          ],
          subtotal: 51.00,
          discount: 5.10,
          total: 45.90,
          couponApplied: 'BIENVENIDO10',
        },
      };

      service.calculateTotals('BIENVENIDO10').subscribe((response) => {
        expect(response).toEqual(mockCalculation.data);
      });

      const req = httpMock.expectOne('/api/cart/price');
      expect(req.request.body).toEqual({
        items: [{ productId: 1, quantity: 2 }],
        couponCode: 'BIENVENIDO10',
      });
      req.flush(mockCalculation);
    });
  });

  describe('validateCart', () => {
    beforeEach(() => {
      service.addItem(mockProduct, 2);
    });

    it('should validate cart items successfully', () => {
      const mockValidation = {
        success: true,
        data: {
          valid: true,
          items: [
            {
              productId: 1,
              valid: true,
              product: mockProduct,
            },
          ],
        },
      };

      service.validateCart().subscribe((response) => {
        expect(response).toEqual(mockValidation);
      });

      const req = httpMock.expectOne('/api/cart/validate');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        items: [{ productId: 1, quantity: 2 }],
      });
      req.flush(mockValidation);
    });

    it('should handle stock issues and update cart', () => {
      const mockValidation = {
        success: true,
        data: {
          valid: false,
          items: [
            {
              productId: 1,
              valid: false,
              availableStock: 1,
              error: 'Stock insuficiente',
            },
          ],
        },
      };

      service.validateCart().subscribe(() => {
        // Cart should be updated with available stock
        expect(service.getItemQuantity(1)).toBe(1);
        expect(TestBed.inject(NotificationService).showWarning).toHaveBeenCalledWith(
          'Algunos productos fueron actualizados o eliminados del carrito'
        );
      });

      const req = httpMock.expectOne('/api/cart/validate');
      req.flush(mockValidation);
    });
  });

  describe('loadCartFromStorage', () => {
    it('should load cart from localStorage on initialization', () => {
      const cartData = [
        {
          productId: 1,
          quantity: 2,
          product: mockProduct,
        },
      ];

      localStorage.setItem('crunchypaws_cart', JSON.stringify(cartData));

      // Create new service instance to trigger constructor
      const newService = new CartService();

      expect(newService.cartItems()).toEqual(cartData);
      expect(newService.itemCount()).toBe(2);
    });

    it('should handle invalid cart data in localStorage', () => {
      localStorage.setItem('crunchypaws_cart', 'invalid-json');

      // Create new service instance
      const newService = new CartService();

      expect(newService.cartItems()).toEqual([]);
      expect(newService.isEmpty()).toBe(true);
    });
  });
});
