import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ProductService } from '../../../../core/services/product.service';
import { Iproduct } from '../../../../core/models/product.model';
import { ProductModal } from '../../components/product-modal/product-modal';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ProductModal],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit {
  private productService = inject(ProductService);

  products = signal<Iproduct[]>([]);
  loading = signal(true);
  errorMessage = signal('');

  isProductModalOpen = false;
  modalMode: 'add' | 'edit' = 'add';
  selectedProduct: Iproduct | null = null;


  totalProducts = computed(() => this.products().length);

  activeProducts = computed(() =>
    this.products().filter((product) => product.active).length
  );

  featuredProducts = computed(() =>
    this.products().filter((product) => product.featured).length
  );

  outOfStockProducts = computed(() =>
    this.products().filter((product) => product.stock <= 0).length
  );

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products.set([...products].sort((a, b) => b.createdAt - a.createdAt));
        this.loading.set(false);
      },
      error: (error) => {
        console.error(error);
        this.errorMessage.set('პროდუქტების ჩატვირთვა ვერ მოხერხდა');
        this.loading.set(false);
      },
    });
  }

  openAddProductModal(): void {
    this.modalMode = 'add';
    this.selectedProduct = null;
    this.isProductModalOpen = true;
  }

  openEditProductModal(product: Iproduct): void {
    this.modalMode = 'edit';
    this.selectedProduct = product;
    this.isProductModalOpen = true;
  }

  closeProductModal(): void {
    this.isProductModalOpen = false;
    this.selectedProduct = null;
  }

  async deleteProduct(product: Iproduct): Promise<void> {
    if (!product.id) return;

    const confirmed = window.confirm(`ნამდვილად გსურს "${product.name}" წაშლა?`);
    if (!confirmed) return;

    try {
      await this.productService.deleteProduct(product.id);
      this.products.set(this.products().filter((item) => item.id !== product.id));
    } catch (error) {
      console.error(error);
      this.errorMessage.set('პროდუქტის წაშლა ვერ მოხერხდა');
    }
  }

  onProductSaved(): void {
    this.closeProductModal();
  }

  getProductStatus(product: Iproduct): string {
    if (product.stock <= 0) {
      return 'მარაგის გარეშე';
    }

    if (!product.active) {
      return 'არააქტიური';
    }

    return 'აქტიური';
  }
}