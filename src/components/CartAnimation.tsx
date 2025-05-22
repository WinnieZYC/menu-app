import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '../styles/theme';

// 全局单例事件发射器
export class CartAnimationManager {
  private static instance: CartAnimationManager;
  private listeners: (() => void)[] = [];

  private constructor() {}

  public static getInstance(): CartAnimationManager {
    if (!CartAnimationManager.instance) {
      CartAnimationManager.instance = new CartAnimationManager();
    }
    return CartAnimationManager.instance;
  }

  public addListener(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  public emit() {
    this.listeners.forEach(listener => listener());
  }
}

// 添加动画效果
const CartBadge = styled(motion.div)`
  position: fixed;
  background-color: ${theme.colors.primary};
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 25px;
  height: 25px;
  font-size: 14px;
  font-weight: bold;
  opacity: 0;
  pointer-events: none;
  z-index: 1001;
  box-shadow: 0 2px 8px rgba(255, 105, 180, 0.5);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
`;

interface CartAnimationProps {}

export const CartAnimation: React.FC<CartAnimationProps> = () => {
  const [showAnimation, setShowAnimation] = useState(false);
  const [badgePosition, setBadgePosition] = useState({ top: 20, right: 20 });

  useEffect(() => {
    const unsubscribe = CartAnimationManager.getInstance().addListener(() => {
      // 获取购物车图标位置
      const cartIcon = document.querySelector('[data-testid="cart-icon"]');
      if (cartIcon) {
        const rect = cartIcon.getBoundingClientRect();
        setBadgePosition({ 
          top: rect.top - 5, 
          right: window.innerWidth - rect.right + 20
        });
        
        // 添加一个临时类来触发弹跳动画
        cartIcon.classList.add('cart-bounce');
        
        // 动画结束后移除类
        setTimeout(() => {
          cartIcon.classList.remove('cart-bounce');
        }, 500);
      }
      
      // 显示动画
      setShowAnimation(true);
      
      // 一段时间后隐藏
      setTimeout(() => {
        setShowAnimation(false);
      }, 1000);
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      {/* 添加全局CSS动画 */}
      <style>
        {`
          @keyframes cartBounce {
            0% { transform: scale(1); }
            40% { transform: scale(1.3); }
            60% { transform: scale(1.2); }
            80% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
          
          .cart-bounce {
            animation: cartBounce 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          }
        `}
      </style>
      
      <AnimatePresence>
        {showAnimation && (
          <CartBadge
            style={{ top: badgePosition.top, right: badgePosition.right }}
            initial={{ opacity: 0, scale: 0.5, y: 0 }}
            animate={{ opacity: 1, scale: 1, y: -20 }}
            exit={{ opacity: 0, y: -40, scale: 0.5 }}
            transition={{ 
              duration: 0.6, 
              ease: "backOut"
            }}
          >
            +1
          </CartBadge>
        )}
      </AnimatePresence>
    </>
  );
};

// 在任何组件中调用此函数触发动画
export const triggerAddToCartAnimation = () => {
  CartAnimationManager.getInstance().emit();
}; 