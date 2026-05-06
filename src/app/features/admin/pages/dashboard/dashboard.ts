import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../../core/services/product.service';
import { Iproduct } from '../../../../core/models/product.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private productService = inject(ProductService);

  products = signal<Iproduct[]>([]);
  loading = signal(true);
  errorMessage = signal('');

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

  lowStockProducts = computed(() =>
    this.products().filter((product) => product.stock > 0 && product.stock <= 5)
  );

  outOfStockList = computed(() =>
    this.products().filter((product) => product.stock <= 0).slice(0, 5)
  );

  recentProducts = computed(() =>
    this.products()
      .slice()
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 5)
  );

  latestUpdatedProducts = computed(() =>
    this.products()
      .slice()
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, 3)
  );

  categories = computed(() => {
    const map = new Map<string, number>();

    this.products().forEach((product) => {
      const category = product.category || 'Uncategorized';
      map.set(category, (map.get(category) ?? 0) + 1);
    });

    return Array.from(map.entries()).map(([name, count]) => ({
      name,
      count,
    }));
  });

  estimatedInventoryValue = computed(() =>
    this.products().reduce(
      (total, product) => total + product.price * product.stock,
      0
    )
  );

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products.set(products);
        this.loading.set(false);
      },
      error: (error) => {
        console.error(error);
        this.errorMessage.set('Dashboard მონაცემების ჩატვირთვა ვერ მოხერხდა');
        this.loading.set(false);
      },
    });
  }
}