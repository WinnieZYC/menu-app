import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '../styles/theme';

// 相册数据接口
interface PhotoData {
  id: number;
  image: string;
  title: string;
  description: string;
}

// 相册数据（示例，可以替换为真实数据）
const photos: PhotoData[] = [
  {
    id: 1,
    image: `${process.env.PUBLIC_URL}/home_picture/ren_jibuli_wugongshan.jpeg`,
    title: "一起爬山的日子",
    description: "那天的雾很大，我们征服了武功山，晚上吃了你推荐的血鸭，好吃。"
  },
  {
    id: 2,
    image: `${process.env.PUBLIC_URL}/home_picture/ren_jibuli_pijiuguan.jpeg`,
    title: "Augustin Keller啤酒馆,小年共进午餐",
    description: "你比猪肘子可爱，比啤酒还辣，虽然我没喝酒精。"
  },
  {
    id: 3,
    image: `${process.env.PUBLIC_URL}/home_picture/ren_jibuli_mozhate.jpeg`,
    title: "莫扎特博物馆",
    description: "吃完猪排和你漫步在奥地利的街上，和你一起去喝奶茶。"
  },
  {
    id: 4,
    image: `${process.env.PUBLIC_URL}/home_picture/ren_jibuli_weilai.jpeg`,
    title: "苿莱",
    description: "老照片了，但我觉得我这张拍得封神。"
  }
];

// 默认图片路径（当照片不存在时显示）
const defaultImages = [
  'https://via.placeholder.com/800x500?text=照片1',
  'https://via.placeholder.com/800x500?text=照片2',
  'https://via.placeholder.com/800x500?text=照片3',
  'https://via.placeholder.com/800x500?text=照片4'
];

// 相册容器
const AlbumContainer = styled.div`
  max-width: 800px;
  height: 500px;
  margin: 2rem auto;
  position: relative;
  perspective: 2000px;
  transform-style: preserve-3d;
  display: flex;
  flex-direction: column;
`;

// 相册页面容器
const AlbumPagesContainer = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
  border-radius: 10px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  background-color: white;
`;

// 相册标题
const AlbumTitle = styled.h2`
  text-align: center;
  margin-bottom: 1.5rem;
  color: ${theme.colors.primary};
  font-size: 2rem;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 3px;
    background: linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.secondary});
    border-radius: 3px;
  }
`;

// 相册页面
const AlbumPage = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: white;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  padding: 20px;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
`;

// 照片容器
const PhotoContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: ${theme.colors.light};
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

// 照片
const Photo = styled.img`
  max-width: 100%;
  max-height: 300px;
  object-fit: contain;
  border-radius: 5px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  border: 5px solid white;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.02);
  }
`;

// 照片描述
const PhotoInfo = styled.div`
  margin-top: 20px;
  text-align: center;
`;

const PhotoTitle = styled.h3`
  margin: 0 0 10px 0;
  color: ${theme.colors.secondary};
  font-size: 1.5rem;
`;

const PhotoDescription = styled.p`
  margin: 0;
  color: ${theme.colors.text};
  font-style: italic;
  line-height: 1.6;
`;

// 导航控制区域
const ControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
`;

// 导航按钮容器
const NavButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 15px;
`;

// 导航按钮
const NavButton = styled.button`
  background: ${theme.colors.primary}20;
  color: ${theme.colors.primary};
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${theme.colors.primary};
    color: white;
    transform: scale(1.1);
  }
  
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    transform: scale(1);
  }
  
  svg {
    width: 24px;
    height: 24px;
  }
`;

// 页码指示器
const PageIndicator = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 15px;
`;

// 让PageDot可点击
const PageDot = styled.div<{ active: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${props => props.active ? theme.colors.primary : '#ddd'};
  margin: 0 5px;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: scale(1.2);
    background: ${props => props.active ? theme.colors.primary : theme.colors.secondary + '80'};
  }
`;

// 相册组件
const PhotoAlbum: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0); // -1: 向左翻, 1: 向右翻
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [imageErrors, setImageErrors] = useState<{[key: number]: boolean}>({});

  const totalPages = photos.length;

  // 处理图片加载错误
  const handleImageError = (id: number) => {
    setImageErrors(prev => ({...prev, [id]: true}));
  };

  // 获取图片URL（优先使用真实照片，加载失败时使用默认图片）
  const getImageUrl = (index: number) => {
    return imageErrors[photos[index].id] ? defaultImages[index % defaultImages.length] : photos[index].image;
  };

  // 翻到上一页
  const prevPage = () => {
    if (currentPage > 0) {
      setDirection(-1);
      setCurrentPage(prev => prev - 1);
    }
  };

  // 翻到下一页
  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setDirection(1);
      setCurrentPage(prev => prev + 1);
    }
  };

  // 处理拖拽开始
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setDragStart(clientX);
  };

  // 处理拖拽结束
  const handleDragEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    
    setIsDragging(false);
    const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX;
    const diff = clientX - dragStart;
    
    // 如果拖拽距离足够大，翻页
    if (diff > 100 && currentPage > 0) {
      prevPage();
    } else if (diff < -100 && currentPage < totalPages - 1) {
      nextPage();
    }
  };

  // 页面动画变体
  const pageVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0
    })
  };

  // 添加键盘控制
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          prevPage();
          break;
        case 'ArrowRight':
          nextPage();
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentPage]); // 添加currentPage作为依赖
  
  // 自动播放
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  
  useEffect(() => {
    let autoPlayTimer: NodeJS.Timeout | null = null;
    
    if (isAutoPlaying) {
      autoPlayTimer = setInterval(() => {
        if (currentPage < totalPages - 1) {
          nextPage();
        } else {
          setCurrentPage(0);
          setDirection(1);
        }
      }, 3000);
    }
    
    return () => {
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
      }
    };
  }, [isAutoPlaying, currentPage, totalPages]);
  
  // 切换自动播放
  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  return (
    <>
      <AlbumTitle>我看见的你</AlbumTitle>
      <AlbumContainer>
        <AlbumPagesContainer
          onMouseDown={handleDragStart}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={handleDragStart}
          onTouchEnd={handleDragEnd}
        >
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <AlbumPage
              key={currentPage}
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "tween", duration: 0.5, ease: "easeInOut" },
                opacity: { duration: 0.3 }
              }}
            >
              <PhotoContainer>
                <Photo 
                  src={getImageUrl(currentPage)} 
                  alt={photos[currentPage].title} 
                  onError={() => handleImageError(photos[currentPage].id)}
                />
              </PhotoContainer>
              <PhotoInfo>
                <PhotoTitle>{photos[currentPage].title}</PhotoTitle>
                <PhotoDescription>{photos[currentPage].description}</PhotoDescription>
              </PhotoInfo>
            </AlbumPage>
          </AnimatePresence>
        </AlbumPagesContainer>

        <ControlsContainer>
          <NavButtons>
            <NavButton onClick={prevPage} disabled={currentPage === 0}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
              </svg>
            </NavButton>
            
            <NavButton 
              onClick={toggleAutoPlay} 
              style={{ 
                background: isAutoPlaying ? theme.colors.primary : `${theme.colors.primary}20`,
                color: isAutoPlaying ? 'white' : theme.colors.primary
              }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                {isAutoPlaying ? (
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>  // 暂停图标
                ) : (
                  <path d="M8 5v14l11-7z"/>  // 播放图标
                )}
              </svg>
            </NavButton>
            
            <NavButton onClick={nextPage} disabled={currentPage === totalPages - 1}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
              </svg>
            </NavButton>
          </NavButtons>
          
          <PageIndicator>
            {photos.map((_, index) => (
              <PageDot 
                key={index} 
                active={index === currentPage} 
                onClick={() => {
                  const direction = index > currentPage ? 1 : -1;
                  setDirection(direction);
                  setCurrentPage(index);
                }}
              />
            ))}
          </PageIndicator>
        </ControlsContainer>
      </AlbumContainer>
    </>
  );
};

export default PhotoAlbum; 