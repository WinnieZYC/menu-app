import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { CartProvider } from './context/CartContext';
import { GlobalStyles } from './styles/GlobalStyles';
import { theme } from './styles/theme';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { CartPage } from './pages/CartPage';
import { CartAnimation } from './components/CartAnimation';
import Live2DTororo from './components/Live2DTororo';
import MemoryPage from './pages/MemoryPage';

// 捕获所有控制台错误
if (process.env.NODE_ENV === 'production') {
  const originalError = console.error;
  console.error = (...args) => {
    if (
      /Warning:|Error:|TypeError:|ReferenceError:|Failed prop type/.test(args[0]) ||
      (typeof args[0] === 'string' && args[0].includes('react'))
    ) {
      // 在生产环境下不显示React警告
    } else {
      originalError.call(console, ...args);
    }
  };
}

// 错误边界组件
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; errorMessage: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('应用错误:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // 渲染错误UI
      return (
        <div style={{ 
          padding: '20px', 
          textAlign: 'center', 
          color: theme.colors.danger,
          margin: '50px auto',
          maxWidth: '500px',
          backgroundColor: theme.colors.light,
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h1>哎呀，出错了！</h1>
          <p>{this.state.errorMessage || '应用加载失败，请刷新页面重试。'}</p>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              background: theme.colors.primary,
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '15px'
            }}
          >
            刷新页面
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // 延迟显示应用，确保所有资源加载
    const timer = setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => {
        setIsReady(true);
      }, 300);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: theme.colors.background
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            border: `3px solid ${theme.colors.primary}`,
            borderTopColor: 'transparent',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }} />
          <style>
            {`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
            `}
          </style>
          <p style={{ color: theme.colors.primary, fontWeight: 'bold' }}>加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Router>
        <ThemeProvider theme={theme}>
          <GlobalStyles />
          <CartProvider>
            <div style={{ 
              opacity: isReady ? 1 : 0,
              transition: 'opacity 0.3s ease-in-out'
            }}>
              <Navbar />
              <CartAnimation />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/memory" element={<MemoryPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              <Live2DTororo position="right" width={280} height={250} />
            </div>
          </CartProvider>
        </ThemeProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
