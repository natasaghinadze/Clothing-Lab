import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  inject,
  Injector,
  input,
  output,
  signal,
} from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProductService } from '../../../../core/services/product.service';
import { Iproduct } from '../../../../core/models/product.model';

@Component({
  selector: 'app-product-modal',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-modal.html',
  styleUrl: './product-modal.css',
  standalone: true,
})
export class ProductModal {
  mode = input<'add' | 'edit'>('add');
  product = input<Iproduct | null>(null);

  close = output<void>();
  productSaved = output<void>();

  private fb = inject(NonNullableFormBuilder);
  private productService = inject(ProductService);
  private injector = inject(Injector);

  selectedFile = signal<File | null>(null);
  selectedFileName = signal('');
  loading = signal(false);
  errorMessage = signal('');
  imagePreview = signal('');

  productForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    price: [0, [Validators.required, Validators.min(1)]],
    category: ['', [Validators.required]],
    stock: [0, [Validators.required, Validators.min(0)]],
    active: [true],
    featured: [false],
  });

  private syncFormEffect = effect(
    () => {
      const currentMode = this.mode();
      const currentProduct = this.product();

      if (currentMode === 'edit' && currentProduct) {
        this.productForm.patchValue({
          name: currentProduct.name,
          description: currentProduct.description,
          price: currentProduct.price,
          category: currentProduct.category,
          stock: currentProduct.stock,
          active: currentProduct.active,
          featured: currentProduct.featured,
        });

        this.imagePreview.set(currentProduct.imageUrl || '');
        this.selectedFile.set(null);
        this.selectedFileName.set('');
        this.errorMessage.set('');
        return;
      }

      if (currentMode === 'add') {
        this.resetForm();
      }
    },
    { injector: this.injector }
  );

  resetForm(): void {
    this.productForm.reset({
      name: '',
      description: '',
      price: 0,
      category: '',
      stock: 0,
      active: true,
      featured: false,
    });

    this.selectedFile.set(null);
    this.selectedFileName.set('');
    this.imagePreview.set('');
    this.errorMessage.set('');
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (!files || files.length === 0) return;

    const file = files[0];
    this.selectedFile.set(file);
    this.selectedFileName.set(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview.set(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  async submit(): Promise<void> {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    const formValue = this.productForm.getRawValue();

    const payload = {
      ...formValue,
      price: Number(formValue.price),
      stock: Number(formValue.stock),
    };

    try {
      if (this.mode() === 'edit' && this.product()?.id) {
        await this.productService.updateProduct(
          this.product()!.id!,
          payload,
          this.product()?.imageUrl ?? '',
          this.selectedFile()
        );
      } else {
        await this.productService.addProduct(payload, this.selectedFile());
      }

      this.productSaved.emit();
      this.close.emit();
    } catch (error) {
      console.error(error);
      this.errorMessage.set('პროდუქტის შენახვა ვერ მოხერხდა');
    } finally {
      this.loading.set(false);
    }
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.close.emit();
    }
  }
}