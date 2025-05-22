import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { DishItem } from '../types';
import { theme } from '../styles/theme';
import { Button } from './Button';
import { useCart } from '../context/CartContext';
import { triggerAddToCartAnimation } from './CartAnimation';

interface DishCardProps {
  dish: DishItem;
}

const Card = styled(motion.div)`
  background: ${theme.colors.light};
  border-radius: ${theme.borderRadius.large};
  overflow: hidden;
  box-shadow: ${theme.shadows.medium};
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const ImageContainer = styled.div`
  height: 200px;
  overflow: hidden;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 30px;
    background: linear-gradient(to top, ${theme.colors.light}, transparent);
  }
`;

const DishImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
  
  ${Card}:hover & {
    transform: scale(1.05);
  }
`;

const Content = styled.div`
  padding: ${theme.spacing.md};
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const DishName = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  color: ${theme.colors.text};
`;

const DishDescription = styled.p`
  margin: ${theme.spacing.sm} 0;
  color: ${theme.colors.text};
  font-size: 0.9rem;
  flex-grow: 1;
`;

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: ${theme.spacing.sm};
`;

const Price = styled.span`
  font-weight: bold;
  color: ${theme.colors.secondary};
  font-size: 1.1rem;
`;

const HeartBadge = styled(motion.div)`
  position: absolute;
  top: ${theme.spacing.sm};
  right: ${theme.spacing.sm};
  background: rgba(255, 255, 255, 0.8);
  width: 30px;
  height: 30px;
  border-radius: ${theme.borderRadius.round};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2;
  
  svg {
    width: 18px;
    height: 18px;
    fill: ${theme.colors.primary};
  }
`;

// 添加成功提示动画
const AddedIndicator = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: ${theme.borderRadius.large};
  z-index: 10;
`;

const SuccessIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: ${theme.colors.primary};
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
  
  svg {
    width: 30px;
    height: 30px;
    fill: white;
  }
`;

const SuccessText = styled.div`
  font-weight: bold;
  color: ${theme.colors.primary};
  font-size: 1.2rem;
`;

export const DishCard: React.FC<DishCardProps> = ({ dish }) => {
  const { addToCart } = useCart();
  const [isLiked, setIsLiked] = React.useState(false);
  const [showAddedAnimation, setShowAddedAnimation] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };
  
  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleAddToCart = (event: React.MouseEvent) => {
    // 触发动画
    triggerAddToCartAnimation();
    
    // 添加到购物车
    addToCart(dish);

    // 显示添加成功动画
    setShowAddedAnimation(true);
    
    // 一段时间后隐藏动画
    setTimeout(() => {
      setShowAddedAnimation(false);
    }, 800);
  };
  
  return (
    <Card
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <HeartBadge
        onClick={handleLike}
        whileTap={{ scale: 0.8 }}
      >
        {isLiked ? (
          <svg viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24">
            <path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z" />
          </svg>
        )}
      </HeartBadge>
      
      <AnimatePresence>
        {showAddedAnimation && (
          <AddedIndicator
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SuccessIcon>
              <svg viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </SuccessIcon>
            <SuccessText>已加入菜单 ✨</SuccessText>
          </AddedIndicator>
        )}
      </AnimatePresence>
      
      <ImageContainer>
        <DishImage src={dish.image} alt={dish.name} />
      </ImageContainer>
      
      <Content>
        <DishName>{dish.name}</DishName>
        <DishDescription>{dish.description}</DishDescription>
        
        <PriceRow>
          <Price>￥{dish.price}</Price>
          <Button 
            onClick={handleAddToCart}
            size="small"
            ref={buttonRef}
          >
            加入菜单
          </Button>
        </PriceRow>
      </Content>
    </Card>
  );
}; 