import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { DishItem, CartItem, CartContextType } from '../types';

const CartContext = createContext<CartContextType | undefined>(undefined);

// 用于调试的本地存储key
const CART_STORAGE_KEY = 'menuApp_cart';

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // 从本地存储加载购物车
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Error loading cart from storage:', error);
    } finally {
      setIsInitialized(true);
    }
  }, []);
  
  // 保存到本地存储
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      } catch (error) {
        console.error('Error saving cart to storage:', error);
      }
    }
  }, [cart, isInitialized]);

  const addToCart = (item: DishItem) => {
    try {
      console.log('Adding to cart:', item);
      setCart((prevCart) => {
        const existingItem = prevCart.find((cartItem) => cartItem.item.id === item.id);
        
        if (existingItem) {
          return prevCart.map((cartItem) => 
            cartItem.item.id === item.id 
              ? { ...cartItem, quantity: cartItem.quantity + 1 } 
              : cartItem
          );
        }
        
        return [...prevCart, { item, quantity: 1 }];
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw new Error(`添加到购物车失败: ${error}`);
    }
  };

  const removeFromCart = (itemId: string) => {
    try {
      console.log('Removing from cart:', itemId);
      setCart((prevCart) => prevCart.filter((cartItem) => cartItem.item.id !== itemId));
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw new Error(`从购物车移除失败: ${error}`);
    }
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    try {
      console.log('Updating quantity:', itemId, quantity);
      if (quantity <= 0) {
        removeFromCart(itemId);
        return;
      }

      setCart((prevCart) =>
        prevCart.map((cartItem) =>
          cartItem.item.id === itemId ? { ...cartItem, quantity } : cartItem
        )
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
      throw new Error(`更新数量失败: ${error}`);
    }
  };

  const clearCart = () => {
    try {
      console.log('Clearing cart');
      setCart([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw new Error(`清空购物车失败: ${error}`);
    }
  };

  const getTotalPrice = () => {
    try {
      return cart.reduce((total, cartItem) => {
        return total + cartItem.item.price * cartItem.quantity;
      }, 0);
    } catch (error) {
      console.error('Error calculating total price:', error);
      return 0;
    }
  };

  const contextValue: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    console.error('useCart must be used within a CartProvider');
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 