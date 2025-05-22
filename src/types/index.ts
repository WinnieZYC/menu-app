export interface DishItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

export interface CartItem {
  item: DishItem;
  quantity: number;
}

export interface CartContextType {
  cart: CartItem[];
  addToCart: (item: DishItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
} 