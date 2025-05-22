import React, { useState, useCallback, memo, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { DishCard } from '../components/DishCard';
import { menuData } from '../data/menuData';
import { theme } from '../styles/theme';
import PhotoAlbum from '../components/PhotoAlbum';

// 使用require方式导入背景图片
const backgroundImage = require('../assets/images/background.jpg');

const PageContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  position: relative;
`;

const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background-image: url(${backgroundImage});
  background-size: cover;
  background-position: center;
  opacity: 0.2;
  filter: blur(5px);
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, rgba(255, 240, 248, 0.8), rgba(255, 240, 248, 0.95));
  }
`;

const Header = styled.div`
  padding: 2rem 0;
  text-align: center;
  margin-top: 1rem;
`;

const PageTitle = styled.h1`
  color: ${theme.colors.primary};
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
`;

const Subtitle = styled.p`
  color: ${theme.colors.secondary};
  font-size: 1.2rem;
  max-width: 600px;
  margin: 0 auto;
`;

const MenuGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto 3rem;
`;

const HeartParticle = styled(motion.div)`
  position: fixed;
  width: 20px;
  height: 20px;
  z-index: 10;
  
  svg {
    width: 100%;
    height: 100%;
    fill: ${theme.colors.primary};
  }
`;

// 使用React.memo优化渲染性能
const MemoDishCard = memo(DishCard);

export const HomePage: React.FC = () => {
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  // 添加引用，用于滚动到"今日菜单"部分
  const menuSectionRef = useRef<HTMLDivElement>(null);
  
  // 使用useCallback减少函数重新创建
  const addHeart = useCallback((event: React.MouseEvent) => {
    const id = Date.now();
    const x = event.clientX;
    const y = event.clientY;
    
    setHearts((prev) => [...prev, { id, x, y }]);
    
    // 移除心形
    setTimeout(() => {
      setHearts((prev) => prev.filter((heart) => heart.id !== id));
    }, 2000);
  }, []);
  
  // 页面加载时自动滚动到"今日菜单"部分
  useEffect(() => {
    setTimeout(() => {
      if (menuSectionRef.current) {
        const yOffset = -80; // 向上偏移80像素
        const element = menuSectionRef.current;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        
        window.scrollTo({
          top: y,
          behavior: 'smooth'
        });
      }
    }, 300); // 延迟一点执行，确保页面元素已完全加载
  }, []);
  
  return (
    <PageContainer onClick={addHeart}>
      <Background />
      
      {hearts.map((heart) => (
        <HeartParticle
          key={heart.id}
          initial={{ opacity: 1, scale: 0, x: heart.x, y: heart.y }}
          animate={{ 
            opacity: 0, 
            scale: 1,
            y: heart.y - 100,
            x: heart.x + (Math.random() * 100 - 50)
          }}
          transition={{ duration: 2 }}
        >
          <svg viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </HeartParticle>
      ))}
      
      <PhotoAlbum />
      
      <Header ref={menuSectionRef}>
        <PageTitle>今日菜单</PageTitle>
        <Subtitle>挑好美食，粥大厨展示手艺๑•̀ㅂ•́و✧(dai ni qu chi)</Subtitle>
      </Header>
      
      <MenuGrid>
        {menuData.map((dish) => (
          <MemoDishCard key={dish.id} dish={dish} />
        ))}
      </MenuGrid>
      
    </PageContainer>
  );
}; 