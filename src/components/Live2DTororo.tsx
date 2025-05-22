import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

// 定义容器样式，默认放在右下角
const Live2DContainer = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: 999;
  pointer-events: none; /* 确保不影响下层元素的交互 */
`;

// 定义动作容器样式
const ActionContainer = styled.div`
  pointer-events: auto; /* 允许交互 */
`;

// 定义对话框样式
const DialogContainer = styled.div`
  top: -2em;
  left: 1em;
  right: 1em;
  opacity: 0;
  z-index: -1;
  font-size: .8em;
  background: #fff;
  padding: .75em 1em;
  border-radius: 1em;
  visibility: hidden;
  position: absolute;
  word-break: break-all;
  transition: opacity .3s, visibility .3s;
  border: 1px solid rgba(255, 105, 180, 0.5);
  box-shadow: 0 3px 15px rgba(255, 105, 180, 0.2);

  &.active {
    opacity: 1;
    visibility: visible;
  }
`;

// 定义画布样式
const Canvas = styled.canvas`
  pointer-events: auto; /* 允许交互 */
`;

interface Live2DTororoProps {
  width?: number; // 宽度
  height?: number; // 高度
  position?: 'right' | 'left'; // 位置，右下角或左下角
}

// 声明全局接口
declare global {
  interface Window {
    loadlive2d: (id: string, path: string, callback?: any) => void;
    Paul_Pio: any;
  }
}

// 随机选择数组中的一个元素
const randomChoice = (arr: string[]): string => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export const Live2DTororo: React.FC<Live2DTororoProps> = ({
  width = 280,
  height = 250,
  position = 'right',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // 对话文本配置
  const messages = {
    welcome: ['欢迎Elena光临少女Elenaの菜单~', '我是Porridge,Elena今天想吃点什么呢?'],
    touch: ['呜啊啊啊~不要碰我啦', '乖，手拿开！', '喵~', '讨厌啦~', '人家怕痒的啦~'],
    menu: ['这个看起来很美味呢！', '要不要点一下试试看？', '嗯~这个我推荐！'],
    cart: ['已经选好了吗？', '购物车里的东西看起来很美味呢！']
  };
  
  // 显示对话框
  const showDialog = (text: string) => {
    if (!dialogRef.current) return;
    
    dialogRef.current.innerText = text;
    dialogRef.current.classList.add('active');
    
    // 3秒后自动隐藏
    setTimeout(() => {
      if (dialogRef.current) {
        dialogRef.current.classList.remove('active');
      }
    }, 3000);
  };

  useEffect(() => {
    // 确保组件已经渲染并且DOM已经准备好
    const timer = setTimeout(() => {
      try {
        // 直接加载模型
        if (window.loadlive2d) {
          console.log('直接加载Live2D模型...');
          
          // 确保使用绝对路径访问模型
          const modelPath = `${window.location.origin}/models/tororo/model.json`;
          console.log('模型路径:', modelPath);
          
          window.loadlive2d('pio', modelPath);
          console.log('Live2D模型加载完成');
          
          // 显示欢迎消息
          showDialog(randomChoice(messages.welcome));
          
          // 为模型添加点击事件
          if (canvasRef.current) {
            canvasRef.current.onclick = () => {
              showDialog(randomChoice(messages.touch));
            };
          }
          
          // 为菜单项添加交互
          document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('mouseover', () => {
              showDialog(randomChoice(messages.menu));
            });
          });
          
          // 为购物车按钮添加交互
          document.querySelectorAll('.cart-button').forEach(item => {
            item.addEventListener('mouseover', () => {
              showDialog(randomChoice(messages.cart));
            });
          });
          
        } else {
          console.error('loadlive2d函数未找到');
        }
      } catch (e) {
        console.error('加载Live2D模型失败:', e);
      }
    }, 1000); // 延迟1秒确保DOM已准备好

    return () => clearTimeout(timer);
  }, []);

  return (
    <Live2DContainer 
      ref={containerRef}
      className={`pio-container ${position}`}
    >
      <DialogContainer ref={dialogRef} className="pio-dialog"></DialogContainer>
      <ActionContainer className="pio-action"></ActionContainer>
      <Canvas ref={canvasRef} id="pio" width={width} height={height}></Canvas>
    </Live2DContainer>
  );
};

export default Live2DTororo; 