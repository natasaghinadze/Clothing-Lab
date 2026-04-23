import { inject, Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Iproduct } from '../models/product.model';
import { getDownloadURL, ref, Storage, uploadBytes } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private firestore = inject(Firestore);
  private storage = inject(Storage)

  getProducts(): Observable<Iproduct[]> {
    const productRef = collection(this.firestore, 'products');

    return collectionData(productRef, {
      idField: 'id'
    }) as Observable<Iproduct[]>;
  }

  async uploadImage(file: File): Promise<string> {
    const filePath = `products/${Date.now()}-${file.name}`;
    const storageRef = ref(this.storage, filePath);

    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef)
  }

  async addProduct(product: Omit<Iproduct, 'id' | 'createdAt' | 'updatedAt' | 'imageUrl'>, file: File | null): Promise<void> {
    let imageUrl = '';

    if (file) {
      imageUrl = await this.uploadImage(file);
    }
    const payload: Iproduct = {
      ...product,
      imageUrl,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    const productRef = collection(this.firestore, 'products');
    await addDoc(productRef, payload)
  }
  
  async updateProduct(
    productId: string,
    product: Omit<Iproduct, 'id' | 'createdAt' | 'updatedAt' | 'imageUrl'>,
    existingImageUrl: string,
    file: File | null
  ): Promise<void> {
    let imageUrl = existingImageUrl;

    if (file) {
      imageUrl = await this.uploadImage(file);
    }

    const payload = {
      ...product,
      imageUrl,
      updatedAt: Date.now(),
    };

    const productDocRef = doc(this.firestore, `products/${productId}`);
    await updateDoc(productDocRef, payload);
  }

  async deleteProduct(productId: string): Promise<void> {
    const productDocRef = doc(this.firestore, `products/${productId}`);
    await deleteDoc(productDocRef);
  }
}