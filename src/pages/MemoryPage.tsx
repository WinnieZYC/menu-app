import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeProvider } from 'styled-components';

// 定义记忆页面主题
const memoryTheme = {
  colors: {
    primary: '#8BA5E1',
    secondary: '#A9D9D0',
    light: '#F5F5F5',
    dark: '#3F4045',
    background: '#E5EAF5', // 浅蓝色背景
    lightBackground: '#F0F4FA', // 更浅的背景色用于渐变
    accent: '#FF8E71', // 亮橙色作为强调色
    paper: '#FFF9F0', // 纸张的颜色
    ink: '#5A5A5A', // 墨水颜色
  }
};

// 手绘边框样式
const handDrawnBorder = `
  border-image-source: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0.5 0.5C20 2.5 30 5 50 5C70 5 80 2.5 99.5 0.5V99.5C80 97.5 70 95 50 95C30 95 20 97.5 0.5 99.5V0.5Z' stroke='%238BA5E1' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  border-image-slice: 20;
  border-image-width: 10px;
  border-image-outset: 5px;
  border-image-repeat: stretch;
  padding: 15px;
`;

// 页面容器
const PageContainer = styled.div`
  width: 100%;
  min-height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-x: hidden;
`;

// 标题样式
const Title = styled.h1`
  color: ${memoryTheme.colors.primary};
  margin-bottom: 2rem;
  font-size: 2.8rem;
  text-align: center;
  text-shadow: 3px 3px 0 rgba(0, 0, 0, 0.05);
  font-family: 'Comic Sans MS', cursive, sans-serif;
  letter-spacing: 1px;
  transform: rotate(-1deg);
  
  &::after {
    content: '';
    display: block;
    width: 100%;
    height: 4px;
    background: ${memoryTheme.colors.primary};
    border-radius: 2px;
    margin-top: 5px;
    transform: skew(-12deg);
    opacity: 0.5;
  }
`;

// 记忆页面容器
const MemoryPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px;
  position: relative;
`;

// 添加页面标题
const PageTitle = styled.h1`
  color: #fff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  font-size: 2.5rem;
  margin: 2rem 0;
  text-align: center;
  font-family: 'Comic Sans MS', cursive, sans-serif;
`;

// 添加内容区域
const ContentArea = styled.div`
  display: flex;
  width: 100%;
  position: relative;
  margin-top: 2rem;
`;

// 调整信封容器样式
const EnvelopeContainer = styled(motion.div)`
  width: 450px;
  height: 350px;
  position: relative;
  margin-left: 5vw;
  perspective: 1200px;
  transform-style: preserve-3d;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='%23FF8E71'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E") 12 12, auto;
  animation: floatEnvelope 3s ease-in-out infinite;

  @keyframes floatEnvelope {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
  
  &:hover {
    animation-play-state: paused;
  }
`;

// 信封外壳
const EnvelopeWrapper = styled(motion.div)`
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  cursor: pointer;
  z-index: 1;
  
  &:hover {
    filter: brightness(1.05);
  }
`;

// 信封正面
const EnvelopeFront = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, #e8d8c3, #d5c3aa);
  border-radius: 16px;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  z-index: 2;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  
  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: 
      linear-gradient(45deg, rgba(255,255,255,0.05) 25%, 
                      transparent 25%, transparent 50%, 
                      rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.05) 75%, 
                      transparent 75%, transparent);
    background-size: 10px 10px;
    opacity: 0.5;
  }

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60%;
    height: 60%;
    border: 1px dashed rgba(139, 106, 77, 0.4);
    border-radius: 12px;
  }
`;

// 信封背面
const EnvelopeBack = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, #e8d8c3, #d5c3aa);
  border-radius: 16px;
  transform-style: preserve-3d;
  transform-origin: center;
  z-index: 1;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  backface-visibility: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 45%;
    left: 0;
    width: 100%;
    height: 55%;
    background: linear-gradient(to bottom, #e8d8c3, #d5c3aa);
    border-top: 1px dashed rgba(139, 106, 77, 0.3);
  }
`;

// 封盖内部装饰
const EnvelopeFlapInner = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(213, 195, 170, 0.9), rgba(190, 170, 140, 0.8));
  clip-path: polygon(
    0% 0%,
    100% 0%,
    100% 70%,
    80% 100%,
    20% 100%,
    0% 70%
  );
  z-index: -1;
  
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60%;
    height: 1px;
    background: rgba(139, 106, 77, 0.3);
  }
`;

// 信封内盖动画元素，添加opacity过渡
const EnvelopeFlap = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 55%;
  background: linear-gradient(to bottom, rgba(245, 235, 220, 0.95), rgba(232, 220, 202, 0.9));
  transform-origin: top;
  transform: ${({ isOpen }) => (isOpen ? 'rotateX(170deg)' : 'rotateX(0)')};
  box-shadow: inset 0 -10px 20px -10px rgba(0, 0, 0, 0.1);
  border-bottom: 1px dashed rgba(139, 106, 77, 0.3);
  z-index: 3;
  opacity: ${({ isOpen }) => (isOpen ? 0 : 1)};
  /* 重新加入opacity过渡 */
  transition: 
    transform 0.8s cubic-bezier(0.4, 0, 0.2, 1), 
    opacity 0.5s ease-in-out 0.3s;
  
  /* 创建五边形形状 */
  clip-path: polygon(
    0% 0%,      /* 左上角 */
    100% 0%,    /* 右上角 */
    100% 70%,   /* 右侧切口点 */
    80% 100%,   /* 右下角 */
    20% 100%,   /* 左下角 */
    0% 70%      /* 左侧切口点 */
  );

  &::before {
    content: '';
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(204, 170, 136, 0.3) 0%, rgba(204, 170, 136, 0.1) 60%, transparent 80%);
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      linear-gradient(45deg, rgba(255,255,255,0.05) 25%, 
                      transparent 25%, transparent 50%, 
                      rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.05) 75%, 
                      transparent 75%, transparent);
    background-size: 10px 10px;
    opacity: 0.5;
  }
`;

// 添加额外的五边形背景
const EnvelopeFlapBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(213, 195, 170, 0.85);
  clip-path: polygon(
    0 0,                 /* 左上角 */
    100% 0,              /* 右上角 */
    100% 60%,            /* 右侧中点 */
    50% 100%,            /* 底部中点 */
    0 60%                /* 左侧中点 */
  );
  background-image: 
    repeating-linear-gradient(45deg, 
      rgba(139, 106, 77, 0.05) 0px, 
      rgba(139, 106, 77, 0.05) 2px, 
      transparent 2px, 
      transparent 8px);
  z-index: 1;
`;

// 添加信封盖的光泽效果
const EnvelopeFlapGloss = styled(motion.div)`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 40%;
  height: 30%;
  background: radial-gradient(
    ellipse at center,
    rgba(255, 255, 255, 0.2) 0%,
    rgba(255, 255, 255, 0.1) 30%,
    transparent 70%
  );
  opacity: 0.7;
  z-index: 3;
  pointer-events: none;
`;

// 模态信纸容器
const LetterModal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(3px);
  z-index: 100;
  padding: 2rem;
`;

// 信的组件
const Letter = styled(motion.div)`
  width: 100%;
  background-color: ${memoryTheme.colors.paper};
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  position: relative;
  background-image: 
    linear-gradient(${memoryTheme.colors.paper} 0.8px, transparent 0.8px),
    linear-gradient(90deg, ${memoryTheme.colors.paper} 0.8px, rgba(139, 165, 225, 0.03) 0.8px);
  background-size: 20px 20px;
  transform-origin: left center; /* 设置变换原点为左侧中心 */
  
  &:before {
    content: '';
    position: absolute;
    top: 5px;
    left: 5px;
    width: calc(100% - 10px);
    height: calc(100% - 10px);
    border: 1px dashed ${memoryTheme.colors.primary};
    border-radius: 8px;
    z-index: 0;
    opacity: 0.5;
    pointer-events: none;
  }
`;

const LetterContent = styled.div`
  position: relative;
  font-family: 'Comic Sans MS', cursive, sans-serif;
  line-height: 1.8;
  color: ${memoryTheme.colors.ink};
  
  p {
    margin-bottom: 1.2rem;
    text-indent: 2rem;
  }
  
  .signature {
    text-align: right;
    margin-top: 2.5rem;
    font-style: italic;
    font-weight: bold;
    color: ${memoryTheme.colors.primary};
  }
  
  // 手绘风格装饰元素
  &::after {
    content: '';
    position: absolute;
    bottom: -40px;
    right: -40px;
    width: 120px;
    height: 120px;
    background: radial-gradient(
      circle at center,
      rgba(139, 165, 225, 0.1) 0%,
      rgba(139, 165, 225, 0.05) 50%,
      transparent 70%
    );
    border-radius: 50%;
    z-index: -1;
  }
`;

// 关闭按钮
const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1.5rem;
  color: ${memoryTheme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.1) rotate(5deg);
  }
  
  &:before, &:after {
    content: '';
    position: absolute;
    width: 24px;
    height: 3px;
    background: currentColor;
    border-radius: 2px;
  }
  
  &:before {
    transform: rotate(45deg);
  }
  
  &:after {
    transform: rotate(-45deg);
  }
`;

// 唱片播放器容器
const VinylPlayerContainer = styled.div`
  position: fixed;
  bottom: 2rem;
  left: 2rem;
  width: 80px;
  height: 80px;
  z-index: 10;
`;

// 唱片样式
const VinylDisc = styled(motion.div)`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: radial-gradient(
    circle at center,
    ${memoryTheme.colors.dark} 10%,
    #111 12%,
    ${memoryTheme.colors.dark} 14%,
    #222 16%,
    ${memoryTheme.colors.dark} 20%,
    #333 30%,
    #444 40%,
    #333 70%,
    ${memoryTheme.colors.dark} 100%
  );
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  cursor: pointer;
  
  &::before {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: ${memoryTheme.colors.light};
    z-index: 2;
  }
  
  &::after {
    content: '♫';
    position: absolute;
    color: ${memoryTheme.colors.accent};
    font-size: 1.5rem;
    z-index: 3;
  }
`;

// 信件容器组件
const LetterContainer = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 30%;
  width: 65%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  z-index: 10;
  cursor: pointer;
  
  /* 确保信件适当宽度 */
  & > * {
    width: 100%;
    max-width: 600px;
  }
`;

// 添加信封阴影效果组件
const EnvelopeShadow = styled(motion.div)`
  position: absolute;
  top: 105%;
  left: calc(5vw + 225px);
  transform: translateX(-50%);
  width: 80%;
  height: 20px;
  border-radius: 50%;
  background: radial-gradient(ellipse at center, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 70%);
  z-index: 0;
`;

// 修改背景图片组件
const BackgroundImage = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('${process.env.PUBLIC_URL}/memory_picture/LoveMusicCity.png');
  background-size: cover;
  background-position: center;
  opacity: 1; /* 提高到完全不透明 */
  z-index: -1;
  pointer-events: none;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, 
      rgba(229, 234, 245, 0.2), 
      rgba(229, 234, 245, 0.3));
  }
`;

// 修改樱花飘落效果组件
const CherryBlossomContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: 0; // 提高z-index，使其在背景图片之上
`;

const CherryBlossom = styled.span`
  position: absolute;
  display: block;
  width: 10px;
  height: 10px;
  background-color: rgba(255, 182, 193, 0.7); // 更明显的粉色
  border-radius: 50% 0 50% 50%;
  transform: rotate(45deg);
  animation: fall linear infinite;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1); // 添加阴影增加立体感
  
  @keyframes fall {
    0% {
      opacity: 1;
      transform: translate(0, 0) rotate(0deg) scale(1);
    }
    100% {
      opacity: 0.3;
      transform: translate(100px, 100vh) rotate(720deg) scale(0.3);
    }
  }
`;

// 改进樱花飘落效果组件
const CherryBlossomEffect: React.FC = () => {
  const blossoms = Array.from({ length: 50 }, (_, i) => { // 增加数量
    const size = Math.random() * 15 + 8; // 增大尺寸
    const left = Math.random() * 100;
    const delay = Math.random() * 15;
    const duration = Math.random() * 10 + 8;
    
    // 添加不同的樱花形状变化
    const rotation = Math.floor(Math.random() * 4) * 90;
    const opacity = 0.7 + Math.random() * 0.3;
    
    return (
      <CherryBlossom 
        key={i}
        style={{
          left: `${left}%`,
          width: `${size}px`,
          height: `${size}px`,
          animationDelay: `${delay}s`,
          animationDuration: `${duration}s`,
          transform: `rotate(${rotation}deg)`,
          opacity,
          backgroundColor: i % 3 === 0 ? 'rgba(255, 170, 180, 0.8)' : 'rgba(255, 182, 193, 0.7)'
        }}
      />
    );
  });
  
  return <CherryBlossomContainer>{blossoms}</CherryBlossomContainer>;
};

// 信的内容
const MemoryPage: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLetterVisible, setIsLetterVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // 音频初始化只在组件挂载时执行一次
    try {
      // 显式指定完整路径
      audioRef.current = new Audio(`${process.env.PUBLIC_URL}/music.mp3`);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.5;
      audioRef.current.preload = "auto"; // 预加载音频
      
      // 添加错误处理
      const handleError = (e: Event) => {
        console.error('音频加载或播放出错:', e);
        setIsPlaying(false);
      };
      
      audioRef.current.addEventListener('error', handleError);
      
      // 组件卸载时清理资源
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('error', handleError);
          audioRef.current.pause();
          audioRef.current = null;
        }
      };
    } catch (err) {
      console.error('音频初始化失败:', err);
    }
  }, []); // 空依赖数组，只在挂载时执行一次

  // 改进音乐播放/暂停逻辑
  const toggleMusic = () => {
    if (!audioRef.current) {
      console.warn('音频尚未初始化');
      return;
    }
    
    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        // 在用户交互后尝试播放
        const playPromise = audioRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
              console.log('音乐开始播放');
            })
            .catch(error => {
              console.error('播放失败:', error);
              setIsPlaying(false);
            });
        }
      }
    } catch (err) {
      console.error('音乐控制发生错误:', err);
      setIsPlaying(false);
    }
  };

  // 修改信封点击事件中的音乐播放逻辑
  const handleEnvelopeClick = () => {
    if (!isOpen) {
      // 先打开信封盖
      setIsOpen(true);
      
      // 尝试播放音乐
      if (!isPlaying && audioRef.current) {
        toggleMusic(); // 利用已有的切换音乐函数
      }
      
      // 等待信封盖完全打开后，显示信件
      setTimeout(() => {
        setIsFlipped(true);
        
        // 延迟一点显示信件，让用户先看到信封打开的效果
        setTimeout(() => {
          setIsLetterVisible(true);
        }, 300);
      }, 500);
    }
  };
  
  // 修改关闭信件的函数
  const closeLetter = () => {
    // 先隐藏信的内容
    setIsLetterVisible(false);
    
    // 等待信消失后，恢复信封
    setTimeout(() => {
      setIsFlipped(false);
      
      // 等待信封恢复后，合上信封盖
      setTimeout(() => {
        setIsOpen(false);
      }, 300);
    }, 300);
  };

  return (
    <PageContainer>
      {/* 背景图片 */}
      <BackgroundImage />
      
      {/* 樱花飘落效果 */}
      <CherryBlossomEffect />
      
      <ThemeProvider theme={memoryTheme}>
        <MemoryPageContainer>
          <PageTitle></PageTitle>
          <PageTitle></PageTitle>
          
          <ContentArea>
            {/* 信封阴影 */}
            <EnvelopeShadow 
              animate={isFlipped ? 
                { opacity: 0.6, scale: 1, x: "-50%" } : 
                { opacity: 0.6, scale: 1, x: "-50%" }
              }
              transition={{
                duration: 0.7,
                ease: "easeInOut"
              }}
            />
            
            {/* 信封容器 */}
            <EnvelopeContainer 
              onClick={isOpen ? undefined : handleEnvelopeClick}
              animate={isFlipped ? 
                { rotateY: 10, rotateX: 5, scale: [1, 0.95], opacity: 1 } : 
                { rotateY: 0, rotateX: 0, scale: 1, opacity: 1 }
              }
              transition={{
                duration: 0.7,
                ease: isFlipped ? "easeIn" : "easeOut"
              }}
            >
              <EnvelopeFront 
                initial={false}
                animate={isFlipped ? 
                  { opacity: 0.7 } : 
                  { opacity: 1 }
                }
                transition={{ 
                  opacity: { duration: 0.3, ease: "easeOut", delay: isFlipped ? 0 : 0.4 }
                }}
              />
              <EnvelopeFlap isOpen={isOpen}>
                <EnvelopeFlapInner />
              </EnvelopeFlap>
              <EnvelopeBack
                initial={false}
                animate={isFlipped ?
                  { opacity: 0.7 } :
                  { opacity: 1 }
                }
                transition={{ 
                  opacity: { duration: 0.3, ease: "easeOut", delay: isFlipped ? 0.4 : 0 }
                }}
              />
            </EnvelopeContainer>

            {/* 把信件移到信封容器外部，这样信封消失不会影响到信件 */}
            <AnimatePresence mode="wait">
              {isLetterVisible && (
                <LetterContainer 
                  onClick={(e) => {
                    e.stopPropagation();
                    closeLetter();
                  }}
                  initial={{ x: "-60%", opacity: 0 }} // 初始位置在信封内
                  animate={{ x: "0%", opacity: 1 }} // 向右移动，抽出信封
                  exit={{ x: "-60%", opacity: 0 }} // 回到信封内
                  transition={{ 
                    type: "spring",
                    stiffness: 200,
                    damping: 25,
                    mass: 0.8,
                    delay: 0.2 // 延迟一点开始，等信封先有反应
                  }}
                >
                  <Letter
                    initial={{ scale: 0.9, opacity: 0, rotateY: -5 }}
                    animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                    exit={{ scale: 0.9, opacity: 0, rotateY: -5 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 300, 
                      damping: 25,
                      delay: 0.3
                    }}
                  >
                    <CloseButton onClick={(e) => {
                      e.stopPropagation();
                      closeLetter();
                    }} />
                    <LetterContent>
                      <p>亲爱的Elena，</p>
                      
                      {/* <p>时间如流水，却载不走我对你的思念。每当夜深人静，我总会想起我们一起走过的那些日子。</p> */}
                      
                      {/* <p>你的微笑如阳光般温暖，你的声音如清风般悦耳。是你，让我明白了什么是真正的美好；是你，教会了我如何去爱，如何去珍惜。</p> */}
                      
                      {/* <p>我知道，无论多少言语都无法表达我内心的感受，但我想告诉你，我和你的经历已经成为我的人生的一部分。</p> */}

                      <p>我想你了。</p>
                      
                      {/* <p>如果可以，我希望我们的故事可以继续书写，一起走过四季更迭，一起迎接每一个黎明。</p> */}
                      
                      <div className="signature">
                        {/* <p>永远爱你的人</p> */}
                        <p>- Porridge</p>
                      </div>
                    </LetterContent>
                  </Letter>
                </LetterContainer>
              )}
            </AnimatePresence>
          </ContentArea>
        </MemoryPageContainer>
      </ThemeProvider>
      
      <VinylPlayerContainer>
        <VinylDisc 
          onClick={toggleMusic}
          animate={{ 
            rotate: isPlaying ? 360 : 0
          }}
          transition={{ 
            rotate: { 
              duration: 2, 
              ease: "linear", 
              repeat: isPlaying ? Infinity : 0 
            }
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        />
      </VinylPlayerContainer>
    </PageContainer>
  );
};

export default MemoryPage; 