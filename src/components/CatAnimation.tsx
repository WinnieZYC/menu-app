import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, useAnimation } from 'framer-motion';
import { theme } from '../styles/theme';

interface CatAnimationProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

const CatContainer = styled(motion.div)<{ position: string }>`
  position: fixed;
  z-index: 100;
  
  ${({ position }) => {
    switch (position) {
      case 'top-right':
        return `
          top: 100px;
          right: 20px;
        `;
      case 'bottom-left':
        return `
          bottom: 20px;
          left: 20px;
        `;
      case 'bottom-right':
        return `
          bottom: 20px;
          right: 20px;
        `;
      default:
        return `
          top: 100px;
          left: 20px;
        `;
    }
  }}
`;

const Cat = styled(motion.div)`
  width: 100px;
  height: 80px;
  position: relative;
  cursor: pointer;
`;

const CatHead = styled(motion.div)`
  width: 60px;
  height: 50px;
  background-color: ${theme.colors.primary};
  border-radius: 50%;
  position: absolute;
  top: 0;
  left: 20px;
`;

const CatEar = styled(motion.div)<{ side: 'left' | 'right' }>`
  width: 20px;
  height: 20px;
  background-color: ${theme.colors.primary};
  position: absolute;
  border-radius: 50% 50% 0 0;
  top: -8px;
  
  ${({ side }) => side === 'left' 
    ? 'left: 5px; transform: rotate(-30deg);' 
    : 'right: 5px; transform: rotate(30deg);'
  }
`;

const CatEye = styled(motion.div)<{ side: 'left' | 'right' }>`
  width: 10px;
  height: 15px;
  background-color: ${theme.colors.light};
  border-radius: 50%;
  position: absolute;
  top: 15px;
  
  ${({ side }) => side === 'left' ? 'left: 15px;' : 'right: 15px;'}
  
  &::after {
    content: '';
    position: absolute;
    width: 5px;
    height: 5px;
    background-color: ${theme.colors.text};
    border-radius: 50%;
    top: 5px;
    left: 2.5px;
  }
`;

const CatMouth = styled(motion.div)`
  width: 15px;
  height: 5px;
  background-color: ${theme.colors.secondary};
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 0 0 5px 5px;
`;

const CatBody = styled(motion.div)`
  width: 70px;
  height: 40px;
  background-color: ${theme.colors.primary};
  border-radius: 40px 40px 0 0;
  position: absolute;
  bottom: 0;
  left: 15px;
`;

const CatTail = styled(motion.div)`
  width: 40px;
  height: 10px;
  background-color: ${theme.colors.primary};
  position: absolute;
  bottom: 15px;
  right: 0;
  border-radius: 0 5px 5px 0;
  transform-origin: left center;
`;

const SpeechBubble = styled(motion.div)`
  position: absolute;
  left: 100px;
  top: 0;
  background-color: white;
  border-radius: 20px;
  padding: 10px 15px;
  max-width: 150px;
  box-shadow: ${theme.shadows.small};
  
  &::before {
    content: '';
    position: absolute;
    top: 20px;
    left: -10px;
    width: 0;
    height: 0;
    border-top: 5px solid transparent;
    border-right: 10px solid white;
    border-bottom: 5px solid transparent;
  }
`;

const catPhrases = [
  '喵~ 点点好吃的吧！',
  '这道菜超级美味哦~',
  '饿了吗？试试这个！',
  '喵喵喵~今天想吃什么？',
  '别纠结啦，都点起来！'
];

export const CatAnimation: React.FC<CatAnimationProps> = ({ 
  position = 'bottom-right'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [phrase, setPhrase] = useState('');
  const controls = useAnimation();
  const tailControls = useAnimation();
  
  // 简化的尾巴动画，只有当组件可见时才进行
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    
    if (isVisible) {
      intervalId = setInterval(() => {
        tailControls.start({
          rotate: [0, 20, 0, -20, 0],
          transition: { duration: 2, ease: "easeInOut" }
        });
      }, 2000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isVisible, tailControls]);
  
  // 仅在初始化和点击时显示猫咪
  useEffect(() => {
    // 初始化时显示一次猫咪
    const timer = setTimeout(() => {
      showCatOnce();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // 简化的显示猫咪函数
  const showCatOnce = () => {
    setIsVisible(true);
    setPhrase(catPhrases[Math.floor(Math.random() * catPhrases.length)]);
    
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    });
    
    // 5秒后隐藏
    setTimeout(() => {
      controls.start({
        opacity: 0,
        y: 100,
        transition: { duration: 0.5 }
      }).then(() => {
        setIsVisible(false);
      });
    }, 5000);
  };
  
  // 点击猫咪时也显示对话框
  const handleCatClick = () => {
    if (!isVisible) {
      showCatOnce();
    } else {
      setPhrase(catPhrases[Math.floor(Math.random() * catPhrases.length)]);
    }
  };
  
  return (
    <CatContainer
      position={position}
      initial={{ opacity: 0, y: 100 }}
      animate={isVisible ? controls : {}}
    >
      <Cat 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleCatClick}
      >
        <CatBody />
        <CatHead>
          <CatEar side="left" />
          <CatEar side="right" />
          <CatEye side="left" />
          <CatEye side="right" />
          <CatMouth />
        </CatHead>
        <CatTail animate={tailControls} />
      </Cat>
      
      {isVisible && (
        <SpeechBubble
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          {phrase}
        </SpeechBubble>
      )}
    </CatContainer>
  );
}; 