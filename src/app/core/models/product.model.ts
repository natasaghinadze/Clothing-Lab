export interface Iproduct {
    id?: string;
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    imageUrl: string;
    active: boolean;
    featured: boolean;
    createdAt: number;
    updatedAt: number;
}