import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { CartItem as CartItemType } from '../types';
import { theme } from '../styles/theme';
import { useCart } from '../context/CartContext';

interface CartItemProps {
  item: CartItemType;
}

const Item = styled(motion.div)`
  display: flex;
  background: ${theme.colors.light};
  border-radius: ${theme.borderRadius.medium};
  padding: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.md};
  box-shadow: ${theme.shadows.small};
  position: relative;
`;

const ImageContainer = styled.div`
  width: 80px;
  height: 80px;
  overflow: hidden;
  border-radius: ${theme.borderRadius.medium};
  margin-right: ${theme.spacing.md};
  flex-shrink: 0;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Details = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const Name = styled.h4`
  margin: 0;
  color: ${theme.colors.text};
`;

const Price = styled.div`
  font-weight: bold;
  color: ${theme.colors.secondary};
  margin-top: ${theme.spacing.xs};
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  margin-top: ${theme.spacing.sm};
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  margin-right: ${theme.spacing.md};
`;

const QuantityButton = styled.button`
  width: 24px;
  height: 24px;
  border-radius: ${theme.borderRadius.small};
  background: ${theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  border: none;
  cursor: pointer;
  
  &:hover {
    background: ${theme.colors.secondary};
  }
`;

const Quantity = styled.span`
  margin: 0 ${theme.spacing.sm};
  font-weight: bold;
  min-width: 20px;
  text-align: center;
`;

const RemoveButton = styled.button`
  background: ${theme.colors.danger};
  color: white;
  border: none;
  border-radius: ${theme.borderRadius.small};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  cursor: pointer;
  font-size: 0.8rem;
  
  &:hover {
    opacity: 0.9;
  }
`;

const TotalPrice = styled.div`
  margin-left: auto;
  font-weight: bold;
  color: ${theme.colors.secondary};
  font-size: 1.1rem;
  align-self: center;
`;

export const CartItemComponent: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const [error, setError] = React.useState<string | null>(null);
  
  const handleIncrement = () => {
    try {
      updateQuantity(item.item.id, item.quantity + 1);
    } catch (e) {
      console.error("增加数量失败:", e);
      setError("操作失败，请重试");
    }
  };
  
  const handleDecrement = () => {
    try {
      if (item.quantity > 1) {
        updateQuantity(item.item.id, item.quantity - 1);
      } else {
        removeFromCart(item.item.id);
      }
    } catch (e) {
      console.error("减少数量失败:", e);
      setError("操作失败，请重试");
    }
  };
  
  return (
    <Item
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      layout
    >
      {error && <div style={{ color: 'red', position: 'absolute', top: '5px', right: '5px' }}>{error}</div>}
      
      <ImageContainer>
        <Image src={item.item.image} alt={item.item.name} />
      </ImageContainer>
      
      <Details>
        <Name>{item.item.name}</Name>
        <Price>￥{item.item.price}</Price>
        
        <Controls>
          <QuantityControl>
            <QuantityButton onClick={handleDecrement}>-</QuantityButton>
            <Quantity>{item.quantity}</Quantity>
            <QuantityButton onClick={handleIncrement}>+</QuantityButton>
          </QuantityControl>
          
          <RemoveButton onClick={() => removeFromCart(item.item.id)}>
            删除
          </RemoveButton>
        </Controls>
      </Details>
      
      <TotalPrice>
        ￥{(item.item.price * item.quantity).toFixed(2)}
      </TotalPrice>
    </Item>
  );
}; 