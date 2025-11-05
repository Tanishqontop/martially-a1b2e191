
export interface Product {
  id: string;
  image: string;
  title: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category: string;
  description: string;
  features: string[];
  specifications: Record<string, string>;
  relatedProducts?: string[];
  inStock: boolean;
  rating?: number;
  reviewCount?: number;
}
