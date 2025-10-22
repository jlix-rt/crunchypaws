import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ModalComponent } from '../../components/modal/modal.component';
import { ApiService, Product, Supply, ProductSupply, Category, Unit } from '../../services/api.service';

interface PriceBreakdown {
  totalCost: number;
  profitPercentage: number;
  profitAmount: number;
  subtotal: number;
  iva: number;
  isr: number;
  finalPrice: number;
}

interface CostType {
  id: number;
  name: string;
  description: string;
  percentage: number;
  isActive: boolean;
  isMandatory: boolean;
  priority: number;
}

interface ProductCostType {
  costTypeId: number;
  costTypeName: string;
  percentage: number;
  amount: number;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ModalComponent],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  availableSupplies: Supply[] = [];
  availableCategories: Category[] = [];
  availableUnits: Unit[] = [];
  availableCostTypes: CostType[] = [];
  selectedCostTypes: ProductCostType[] = [];
  calculatedPrice = 0;

  filteredProducts: Product[] = [];
  searchQuery: string = '';
  selectedCategory: string = '';
  selectedStatus: string = '';
  selectAll: boolean = false;

  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;

  // Modal properties
  showModal = false;
  isEditing = false;
  editingProduct: Product | null = null;
  modalTitle = '';

  // Nuevas propiedades para cálculo de precios
  profitPercentage = 30; // Porcentaje de ganancia por defecto
  priceBreakdown: PriceBreakdown = {
    totalCost: 0,
    profitPercentage: 0,
    profitAmount: 0,
    subtotal: 0,
    iva: 0,
    isr: 0,
    finalPrice: 0
  };

  // Form
  productForm: FormGroup;

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      sku: ['', [Validators.required]],
      categories: [[], [Validators.required]], // Array de categorías
      price: [0], // Sin validación - se calcula automáticamente
      stock: [0, [Validators.required, Validators.min(0)]],
      status: ['active', [Validators.required]],
      description: [''],
      isAlsoSupply: [false], // Checkbox para marcar si es también insumo
      supplies: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadSupplies();
    this.loadCategories();
    this.loadUnits();
    this.loadCostTypes();
  }

  get suppliesArray(): FormArray {
    return this.productForm.get('supplies') as FormArray;
  }

  loadProducts(): void {
    this.apiService.getProducts().subscribe({
      next: (response: any) => {
        // Verificar si la respuesta es un array o un objeto con data
        const products = Array.isArray(response) ? response : (response.data || []);
        this.products = products;
        this.applyFilters();
        console.log('Productos cargados:', products.length, products);
      },
      error: (error) => {
        console.error('Error loading products:', error);
        // Fallback to mock data
        this.products = [
          { id: 1, name: 'Croquetas Premium', category: 'Alimentos', categories: [1], price: 75.50, stock: 100, status: 'active', sku: 'PROD-001', description: 'Croquetas de alta calidad para perros', lastUpdated: '2023-10-26', supplies: [], selectedCostTypes: [] },
          { id: 2, name: 'Juguete Interactivo', category: 'Juguetes', categories: [2], price: 25.00, stock: 50, status: 'active', sku: 'PROD-002', description: 'Juguete para mantener entretenidas a las mascotas', lastUpdated: '2023-10-25', supplies: [], selectedCostTypes: [] },
        ];
        this.applyFilters();
        console.log('Usando datos mock de productos:', this.products);
      }
    });
  }

  loadSupplies(): void {
    this.apiService.getSupplies().subscribe({
      next: (response: any) => {
        // Verificar si la respuesta es un array o un objeto con data
        const supplies = Array.isArray(response) ? response : (response.data || []);
        this.availableSupplies = supplies;
        console.log('Insumos cargados para productos:', supplies.length, supplies);
      },
      error: (error) => {
        console.error('Error loading supplies:', error);
        // Fallback to mock data
        this.availableSupplies = [
          { id: 1, name: 'Harina de Trigo', category: 'Granos', stock: 150, unit: 'kg', unitPrice: 2.50, status: 'available', lastUpdated: '2023-10-26' },
          { id: 2, name: 'Pechuga de Pollo', category: 'Carnes', stock: 30, unit: 'kg', unitPrice: 8.00, status: 'low_stock', lastUpdated: '2023-10-25' },
        ];
        console.log('Usando datos mock de insumos:', this.availableSupplies);
      }
    });
  }

  loadCategories(): void {
    this.apiService.getCategories().subscribe({
      next: (response: any) => {
        // Verificar si la respuesta es un array o un objeto con data
        const categories = Array.isArray(response) ? response : (response.data || []);
        this.availableCategories = categories;
        console.log('Categorías cargadas para productos:', categories.length, categories);
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        // Fallback to mock data
        this.availableCategories = [
          { id: 1, name: 'Alimentos', slug: 'alimentos', status: 'active', createdAt: '2023-10-26', updatedAt: '2023-10-26' },
          { id: 2, name: 'Juguetes', slug: 'juguetes', status: 'active', createdAt: '2023-10-26', updatedAt: '2023-10-26' },
          { id: 3, name: 'Accesorios', slug: 'accesorios', status: 'active', createdAt: '2023-10-26', updatedAt: '2023-10-26' },
          { id: 4, name: 'Cuidado', slug: 'cuidado', status: 'active', createdAt: '2023-10-26', updatedAt: '2023-10-26' },
        ];
        console.log('Usando datos mock de categorías:', this.availableCategories);
      }
    });
  }

  loadUnits(): void {
    this.apiService.getActiveUnits().subscribe({
      next: (units) => {
        this.availableUnits = units;
        console.log('Unidades cargadas para productos:', units.length, units);
      },
      error: (error) => {
        console.error('Error loading units:', error);
        // Fallback a datos mock si hay error
        this.availableUnits = [
          { id: 1, name: 'Kilogramo', symbol: 'kg', description: 'Unidad de masa', category: 'peso', status: 'active', createdAt: '2023-10-01', updatedAt: '2023-10-01' },
          { id: 2, name: 'Gramo', symbol: 'g', description: 'Unidad de masa pequeña', category: 'peso', status: 'active', createdAt: '2023-10-02', updatedAt: '2023-10-02' },
          { id: 3, name: 'Litro', symbol: 'L', description: 'Unidad de volumen', category: 'volumen', status: 'active', createdAt: '2023-10-03', updatedAt: '2023-10-03' },
          { id: 4, name: 'Mililitro', symbol: 'ml', description: 'Unidad de volumen pequeña', category: 'volumen', status: 'active', createdAt: '2023-10-04', updatedAt: '2023-10-04' },
          { id: 5, name: 'Pieza', symbol: 'pz', description: 'Unidad de cantidad', category: 'cantidad', status: 'active', createdAt: '2023-10-05', updatedAt: '2023-10-05' }
        ];
        console.log('Usando datos mock de unidades:', this.availableUnits);
      }
    });
  }

  loadCostTypes(): void {
    this.apiService.getActiveCostTypes().subscribe({
      next: (response: any) => {
        // Verificar si la respuesta es un array o un objeto con data
        const costTypes = Array.isArray(response) ? response : (response.data || []);
        this.availableCostTypes = costTypes;
        
        // Agregar automáticamente los costos obligatorios
        this.addMandatoryCostTypes();
        
        console.log('Tipos de costos cargados:', costTypes.length, costTypes);
      },
      error: (error) => {
        console.error('Error loading cost types:', error);
        // Fallback to mock data
        this.availableCostTypes = [
          { id: 1, name: 'IVA', description: 'Impuesto al Valor Agregado', percentage: 12, isActive: true, isMandatory: true, priority: 1 },
          { id: 2, name: 'ISR', description: 'Impuesto Sobre la Renta', percentage: 5, isActive: true, isMandatory: true, priority: 2 },
          { id: 3, name: 'Costo de Producción', description: 'Costos asociados a la producción', percentage: 0, isActive: true, isMandatory: false, priority: 3 },
          { id: 4, name: 'Costo de Marketing', description: 'Costos de marketing y publicidad', percentage: 0, isActive: true, isMandatory: false, priority: 4 }
        ];
        
        // Agregar automáticamente los costos obligatorios
        this.addMandatoryCostTypes();
      }
    });
  }

  addMandatoryCostTypes(): void {
    // Agregar automáticamente los costos obligatorios
    this.availableCostTypes.forEach(costType => {
      if (costType.isMandatory && !this.isCostTypeSelected(costType.id)) {
        const productCostType: ProductCostType = {
          costTypeId: costType.id,
          costTypeName: costType.name,
          percentage: costType.percentage,
          amount: 0
        };
        this.selectedCostTypes.push(productCostType);
      }
    });
  }

  // Métodos para manejar tipos de costos
  onCostTypeChange(costType: CostType, isSelected: boolean): void {
    if (isSelected) {
      // Agregar tipo de costo seleccionado
      const productCostType: ProductCostType = {
        costTypeId: costType.id,
        costTypeName: costType.name,
        percentage: costType.percentage,
        amount: 0
      };
      this.selectedCostTypes.push(productCostType);
    } else {
      // Remover tipo de costo
      this.selectedCostTypes = this.selectedCostTypes.filter(ct => ct.costTypeId !== costType.id);
    }
  }

  isCostTypeSelected(costTypeId: number): boolean {
    return this.selectedCostTypes.some(ct => ct.costTypeId === costTypeId);
  }

  updateCostTypePercentage(costTypeId: number, percentage: number): void {
    const costType = this.selectedCostTypes.find(ct => ct.costTypeId === costTypeId);
    if (costType) {
      costType.percentage = percentage;
    }
  }

  getCostTypePercentage(costTypeId: number): number {
    const costType = this.selectedCostTypes.find(ct => ct.costTypeId === costTypeId);
    return costType ? costType.percentage : 0;
  }

  loadProductCostTypes(product: Product): void {
    // Limpiar tipos de costos seleccionados
    this.selectedCostTypes = [];
    
    // Agregar automáticamente los costos obligatorios
    this.addMandatoryCostTypes();
    
    // TODO: Aquí se podrían cargar tipos de costos específicos del producto
    // si se implementa esa funcionalidad en el futuro
    
    console.log('Tipos de costos cargados para edición:', this.selectedCostTypes);
  }

  getOptionalCostTypes(): CostType[] {
    return this.availableCostTypes.filter(costType => !costType.isMandatory);
  }

  getMandatoryCostTypes(): CostType[] {
    return this.availableCostTypes.filter(costType => costType.isMandatory);
  }

  getSelectedOptionalCostTypes(): CostType[] {
    return this.availableCostTypes.filter(costType => 
      !costType.isMandatory && this.isCostTypeSelected(costType.id)
    );
  }

  getCostTypeAmount(costTypeId: number): number {
    const costType = this.selectedCostTypes.find(ct => ct.costTypeId === costTypeId);
    return costType ? costType.amount : 0;
  }

  getSubtotalAfterCost(costTypeId: number): number {
    // Obtener el subtotal inicial (costo de insumos + ganancia)
    let currentSubtotal = this.priceBreakdown.subtotal;
    
    // Obtener todos los costos (obligatorios y opcionales seleccionados) en orden de prioridad
    const allCostTypes = this.availableCostTypes.filter(costType => 
      costType.isMandatory || this.isCostTypeSelected(costType.id)
    );
    const sortedCostTypes = allCostTypes.sort((a, b) => a.priority - b.priority);
    
    // Aplicar costos en orden hasta llegar al costTypeId actual
    for (const costType of sortedCostTypes) {
      if (costType.id === costTypeId) {
        // Aplicar este costo y retornar el subtotal resultante
        const costAmount = currentSubtotal * (costType.percentage / 100);
        return currentSubtotal + costAmount;
      }
      
      // Aplicar el costo al subtotal actual
      const costAmount = currentSubtotal * (costType.percentage / 100);
      currentSubtotal += costAmount;
    }
    
    return currentSubtotal;
  }

  getCostTypesInPriorityOrder(): CostType[] {
    // Obtener todos los costos (obligatorios y opcionales seleccionados)
    const allCostTypes = this.availableCostTypes.filter(costType => 
      costType.isMandatory || this.isCostTypeSelected(costType.id)
    );
    
    // Ordenar por prioridad
    return allCostTypes.sort((a, b) => a.priority - b.priority);
  }

  addSupply(): void {
    const supplyForm = this.fb.group({
      supplyId: ['', Validators.required],
      quantity: [0, [Validators.required, Validators.min(0.01)]]
    });
    this.suppliesArray.push(supplyForm);
  }

  removeSupply(index: number): void {
    this.suppliesArray.removeAt(index);
  }

  calculatePrice(): void {
    let totalCost = 0;
    
    // Calcular costo total de insumos
    this.suppliesArray.controls.forEach(control => {
      const supplyId = control.get('supplyId')?.value;
      const quantity = control.get('quantity')?.value;
      if (supplyId && quantity && quantity > 0) {
        const supplyCost = this.getSupplyCost(supplyId, quantity);
        totalCost += supplyCost;
        console.log(`Insumo ${supplyId}: ${quantity} unidades = Q${supplyCost.toFixed(2)}`);
      }
    });

    console.log(`Costo total de insumos: Q${totalCost.toFixed(2)}`);

    // Si no hay insumos, resetear todo
    if (totalCost === 0) {
      this.priceBreakdown = {
        totalCost: 0,
        profitPercentage: this.profitPercentage,
        profitAmount: 0,
        subtotal: 0,
        iva: 0,
        isr: 0,
        finalPrice: 0
      };
      this.calculatedPrice = 0;
      console.log('No hay insumos, precio reseteado a 0');
      return;
    }

    // Calcular ganancia
    console.log('Calculando ganancia con porcentaje:', this.profitPercentage);
    const profitAmount = totalCost * (this.profitPercentage / 100);
    let subtotal = totalCost + profitAmount;
    console.log('Ganancia calculada:', profitAmount);
    
    // Obtener todos los costos (obligatorios y opcionales seleccionados)
    const allCostTypes = this.availableCostTypes.filter(costType => 
      costType.isMandatory || this.isCostTypeSelected(costType.id)
    );
    
    // Ordenar costos por prioridad
    const sortedCostTypes = allCostTypes.sort((a, b) => a.priority - b.priority);
    
    // Aplicar costos en orden de prioridad
    sortedCostTypes.forEach(costType => {
      const costAmount = subtotal * (costType.percentage / 100);
      
      // Actualizar el selectedCostTypes si existe
      const selectedCostType = this.selectedCostTypes.find(ct => ct.costTypeId === costType.id);
      if (selectedCostType) {
        selectedCostType.amount = costAmount;
      } else if (costType.isMandatory) {
        // Agregar costos obligatorios si no están en selectedCostTypes
        const productCostType: ProductCostType = {
          costTypeId: costType.id,
          costTypeName: costType.name,
          percentage: costType.percentage,
          amount: costAmount
        };
        this.selectedCostTypes.push(productCostType);
      }
      
      subtotal += costAmount; // Aplicar el costo al subtotal para el siguiente cálculo
    });

    this.priceBreakdown = {
      totalCost,
      profitPercentage: this.profitPercentage,
      profitAmount,
      subtotal: totalCost + profitAmount, // Subtotal inicial (antes de costos adicionales)
      iva: 0, // Ya no se calcula por separado
      isr: 0, // Ya no se calcula por separado
      finalPrice: subtotal
    };

    this.calculatedPrice = subtotal;
    
    console.log('Cálculo de precios:', {
      totalCost: totalCost.toFixed(2),
      profitPercentage: this.profitPercentage,
      profitAmount: profitAmount.toFixed(2),
      subtotal: (totalCost + profitAmount).toFixed(2),
      finalPrice: subtotal.toFixed(2)
    });
  }

  applyFilters(): void {
    let temp = this.products;

    if (this.searchQuery) {
      temp = temp.filter(product =>
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    if (this.selectedCategory) {
      temp = temp.filter(product => product.category === this.selectedCategory);
    }

    if (this.selectedStatus) {
      temp = temp.filter(product => product.status === this.selectedStatus);
    }

    this.totalItems = temp.length;
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.currentPage = 1;
    this.updatePagedProducts(temp);
  }

  updatePagedProducts(productsToPaginate: Product[]): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.filteredProducts = productsToPaginate.slice(startIndex, endIndex);
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = '';
    this.selectedStatus = '';
    this.applyFilters();
  }

  openAddModal(): void {
    this.isEditing = false;
    this.editingProduct = null;
    this.modalTitle = 'Nuevo Producto';
    this.productForm.reset();
    this.productForm.patchValue({ 
      status: 'active',
      categories: [] // Inicializar categorías como array vacío
    });
    this.suppliesArray.clear();
    this.selectedCostTypes = [];
    this.calculatedPrice = 0;
    this.profitPercentage = 30;
    this.priceBreakdown = {
      totalCost: 0,
      profitPercentage: 0,
      profitAmount: 0,
      subtotal: 0,
      iva: 0,
      isr: 0,
      finalPrice: 0
    };
    this.showModal = true;
  }

  editProduct(product: Product): void {
    console.log('Editando producto:', product);
    console.log('Product supplies:', product.supplies);
    
    this.isEditing = true;
    this.editingProduct = product;
    this.modalTitle = 'Editar Producto';
    this.productForm.patchValue({
      name: product.name,
      sku: product.sku,
      categories: product.categories || [], // Usar array de categorías
      price: product.price,
      stock: product.stock,
      status: product.status,
      description: product.description,
      isAlsoSupply: product.isAlsoSupply || false
    });
    
    // Load product supplies
    this.suppliesArray.clear();
    console.log('Supplies array cleared');
    
    if (product.supplies && product.supplies.length > 0) {
      console.log('Cargando supplies:', product.supplies);
      product.supplies.forEach(supply => {
        console.log('Agregando supply:', supply);
        const supplyForm = this.fb.group({
          supplyId: [supply.supplyId, Validators.required],
          quantity: [supply.quantity, [Validators.required, Validators.min(0.01)]]
        });
        this.suppliesArray.push(supplyForm);
      });
    } else {
      console.log('No hay supplies para cargar');
    }
    
    console.log('Supplies array final:', this.suppliesArray.length);
    
    // Cargar tipos de costos seleccionados del producto
    this.loadProductCostTypes(product);
    
    // Recalcular precio
    this.calculatePrice();
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.productForm.reset();
    this.productForm.patchValue({ categories: [] }); // Limpiar categorías
    this.suppliesArray.clear();
    this.calculatedPrice = 0;
    this.editingProduct = null;
  }

  saveProduct(): void {
    console.log('Form valid:', this.productForm.valid);
    console.log('Form errors:', this.productForm.errors);
    console.log('Form value:', this.productForm.value);
    console.log('Categories value:', this.productForm.get('categories')?.value);
    console.log('Categories errors:', this.productForm.get('categories')?.errors);
    
    if (this.productForm.valid) {
      const formData = this.productForm.value;
      const suppliesData = this.suppliesArray.value;
      
      // Generar SKU automáticamente si no existe
      const sku = formData.sku || `PROD-${Date.now()}`;
      
      const productData = {
        ...formData,
        sku: sku,
        price: this.calculatedPrice,
        finalPrice: this.calculatedPrice,
        basePrice: this.priceBreakdown.subtotal,
        suppliesData: suppliesData,
        categories: formData.categories || [],
        isAlsoSupply: formData.isAlsoSupply || false,
        description: formData.description || '',
        stock: formData.stock || 0,
        status: formData.status || 'active'
      };
      
      console.log('Datos completos del producto:', productData);
      
      if (this.isEditing && this.editingProduct) {
        // Actualizar producto existente
        console.log('Actualizando producto con ID:', this.editingProduct.id);
        console.log('Datos a enviar:', productData);
        
        this.apiService.updateProduct(this.editingProduct.id, productData).subscribe({
          next: (updatedProduct) => {
            console.log('Producto actualizado exitosamente:', updatedProduct);
            const index = this.products.findIndex(p => p.id === this.editingProduct!.id);
            if (index !== -1) {
              this.products[index] = updatedProduct;
            }
            this.applyFilters();
            this.closeModal();
          },
          error: (error) => {
            console.error('Error updating product:', error);
            alert('Error al actualizar el producto');
          }
        });
      } else {
        // Crear nuevo producto
        this.apiService.createProduct(productData).subscribe({
          next: (newProduct) => {
            this.products.push(newProduct);
            this.applyFilters();
            this.closeModal();
          },
          error: (error) => {
            console.error('Error creating product:', error);
            alert('Error al crear el producto');
          }
        });
      }
    } else {
      this.productForm.markAllAsTouched();
    }
  }

  deleteProduct(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      this.apiService.deleteProduct(id).subscribe({
        next: () => {
          this.products = this.products.filter(p => p.id !== id);
          this.applyFilters();
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          alert('Error al eliminar el producto');
        }
      });
    }
  }

  toggleSelectAll(): void {
    this.filteredProducts.forEach(product => product.selected = this.selectAll);
  }

  onProductSelect(): void {
    this.selectAll = this.filteredProducts.every(product => product.selected);
  }

  hasSelectedProducts(): boolean {
    return this.filteredProducts.some(product => product.selected);
  }

  deleteSelectedProducts(): void {
    if (confirm('¿Estás seguro de que quieres eliminar los productos seleccionados?')) {
      this.products = this.products.filter(product => !product.selected);
      this.applyFilters();
      this.selectAll = false;
    }
  }

  // Nuevos métodos para el sistema de cálculo de precios
  onSupplyChange(index: number): void {
    // Solo recalcular si es necesario, no automáticamente
  }

  onProfitPercentageChange(newPercentage: number): void {
    this.profitPercentage = newPercentage;
    console.log('Porcentaje de ganancia actualizado:', this.profitPercentage);
    // Recalcular automáticamente cuando cambie el porcentaje
    this.calculatePrice();
  }


  getSupplyUnit(supplyId: number): string {
    const supply = this.availableSupplies.find(s => s.id == supplyId);
    return supply ? supply.unit : '';
  }

  getSupplyCost(supplyId: number, quantity: number): number {
    if (!supplyId || !quantity || quantity <= 0) {
      return 0;
    }
    
    const supply = this.availableSupplies.find(s => s.id == supplyId);
    if (!supply) {
      return 0;
    }

    return supply.unitPrice * quantity;
  }

  getSupplyCostDisplay(supplyId: number, quantity: number): number {
    // Solo calcular cuando sea necesario, no en cada renderizado
    return this.getSupplyCost(supplyId, quantity);
  }

  getStatusClass(status: 'active' | 'inactive'): string {
    return `status-${status}`;
  }

  isCategorySelected(categoryId: number): boolean {
    const selectedCategories = this.productForm.get('categories')?.value || [];
    return selectedCategories.includes(categoryId);
  }

  onCategoryChange(categoryId: number, event: any): void {
    const selectedCategories = this.productForm.get('categories')?.value || [];
    const isChecked = event.target.checked;
    
    if (isChecked) {
      // Agregar categoría si no está seleccionada
      if (!selectedCategories.includes(categoryId)) {
        selectedCategories.push(categoryId);
      }
    } else {
      // Remover categoría si está seleccionada
      const index = selectedCategories.indexOf(categoryId);
      if (index > -1) {
        selectedCategories.splice(index, 1);
      }
    }
    
    this.productForm.patchValue({ categories: selectedCategories });
    console.log('Categorías seleccionadas:', selectedCategories);
    console.log('Form categories after patch:', this.productForm.get('categories')?.value);
    console.log('Form valid after category change:', this.productForm.valid);
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.applyFilters();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.applyFilters();
    }
  }
}