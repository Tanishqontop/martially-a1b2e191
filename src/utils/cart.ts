
import { Product } from "@/types/product";

export interface CartItem {
  product: Product;
  quantity: number;
}

// Helper function to get cart items from localStorage
export const getCartItems = (): CartItem[] => {
  const cartItemsJson = localStorage.getItem('cartItems');
  if (!cartItemsJson) return [];
  try {
    return JSON.parse(cartItemsJson);
  } catch (error) {
    console.error('Failed to parse cart items from localStorage', error);
    return [];
  }
};

// Helper function to save cart items to localStorage
export const saveCartItems = (items: CartItem[]): void => {
  localStorage.setItem('cartItems', JSON.stringify(items));
};

// Add item to cart
export const addItemToCart = (product: Product, quantity: number = 1): void => {
  const cartItems = getCartItems();
  const existingItemIndex = cartItems.findIndex(item => item.product.id === product.id);
  
  if (existingItemIndex >= 0) {
    // Update quantity if item already exists
    cartItems[existingItemIndex].quantity += quantity;
  } else {
    // Add new item
    cartItems.push({ product, quantity });
  }
  
  saveCartItems(cartItems);
};

// Remove item from cart
export const removeItemFromCart = (productId: string): void => {
  const cartItems = getCartItems();
  const updatedCartItems = cartItems.filter(item => item.product.id !== productId);
  saveCartItems(updatedCartItems);
};

// Update item quantity
export const updateCartItemQuantity = (productId: string, quantity: number): void => {
  const cartItems = getCartItems();
  const itemIndex = cartItems.findIndex(item => item.product.id === productId);
  
  if (itemIndex >= 0) {
    if (quantity > 0) {
      cartItems[itemIndex].quantity = quantity;
    } else {
      // Remove item if quantity is 0 or negative
      cartItems.splice(itemIndex, 1);
    }
    
    saveCartItems(cartItems);
  }
};

// Get cart total
export const getCartTotal = (): number => {
  const cartItems = getCartItems();
  return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
};

// Get cart item count
export const getCartItemCount = (): number => {
  const cartItems = getCartItems();
  return cartItems.reduce((count, item) => count + item.quantity, 0);
};

// Clear cart
export const clearCart = (): void => {
  localStorage.removeItem('cartItems');
};
