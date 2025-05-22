import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '../styles/theme';
import { useCart } from '../context/CartContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Nav = styled.nav`
  background-color: ${theme.colors.light};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  box-shadow: ${theme.shadows.small};
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${theme.colors.primary};
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
  
  svg {
    margin-right: ${theme.spacing.sm};
    width: 24px;
    height: 24px;
  }
`;

// 下拉箭头
const DropdownArrow = styled(motion.span)`
  margin-left: 8px;
  font-size: 0.8rem;
  display: inline-flex;
  align-items: center;
`;

// 下拉菜单容器
const DropdownMenu = styled(motion.div)`
  position: absolute;
  top: 100%;
  left: 0;
  background-color: ${theme.colors.light};
  border-radius: 4px;
  box-shadow: ${theme.shadows.medium};
  width: 160px;
  overflow: hidden;
  margin-top: 8px;
`;

// 下拉菜单选项
const DropdownItem = styled(motion.div)<{ isActive: boolean }>`
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  background-color: ${props => props.isActive ? `rgba(255, 126, 185, 0.1)` : 'transparent'};
  color: ${props => props.isActive ? theme.colors.primary : theme.colors.text};
  
  &:hover {
    background-color: rgba(255, 126, 185, 0.2);
  }
`;

const CartButton = styled(motion.div)`
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  
  svg {
    width: 24px;
    height: 24px;
    fill: ${theme.colors.primary};
  }
`;

const CartCount = styled.span`
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: ${theme.colors.secondary};
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.75rem;
  font-weight: bold;
`;

const CatEar = styled(motion.div)`
  width: 15px;
  height: 15px;
  background-color: ${theme.colors.primary};
  position: absolute;
  border-radius: 50% 50% 0 0;
  
  &.left {
    top: -8px;
    left: 2px;
    transform: rotate(-30deg);
  }
  
  &.right {
    top: -8px;
    right: 2px;
    transform: rotate(30deg);
  }
`;

interface NavbarProps {
  activePage?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ activePage }) => {
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('menu');
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // 检测当前页面路径
  useEffect(() => {
    if (location.pathname === '/memory') {
      setCurrentPage('memory');
    } else {
      setCurrentPage('menu');
    }
  }, [location.pathname]);
  
  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  
  const goToHome = () => {
    navigate('/');
    setIsDropdownOpen(false);
  };
  
  const goToMemory = () => {
    navigate('/memory');
    setIsDropdownOpen(false);
  };
  
  const goToCart = () => {
    navigate('/cart');
  };
  
  return (
    <Nav>
      <Logo onClick={toggleDropdown} ref={dropdownRef}>
        {currentPage === 'menu' ? (
          <>
            <svg viewBox="0 0 24 24">
              <path fill={theme.colors.primary} d="M12,3c-4.97,0-9,4.03-9,9c0,4.97,4.03,9,9,9s9-4.03,9-9C21,7.03,16.97,3,12,3z M16,13h-3v3c0,0.55-0.45,1-1,1s-1-0.45-1-1v-3H8c-0.55,0-1-0.45-1-1s0.45-1,1-1h3V8c0-0.55,0.45-1,1-1s1,0.45,1,1v3h3c0.55,0,1,0.45,1,1S16.55,13,16,13z" />
            </svg>
            少女Elenaの菜单
          </>
        ) : (
          <>
            {/* 大树SVG图标 */}
            <svg viewBox="0 0 24 24" width="26" height="26">
              <path fill={theme.colors.primary} d="M12,2c0,0-8,4-8,11c0,4.4,3.6,8,8,8s8-3.6,8-8C20,6,12,2,12,2z M12,18c-2.8,0-5-2.2-5-5
              c0-0.6,0.1-1.2,0.4-1.8c0.5,0.4,1,0.7,1.6,0.7c1.4,0,2.5-1.1,2.5-2.5c0-0.8-0.4-1.5-1-2c0.5-0.1,1-0.2,1.5-0.2
              c2.8,0,5,2.2,5,5S14.8,18,12,18z"/>
            </svg>
          </>
        )}
        <DropdownArrow
          animate={{ rotate: isDropdownOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          ▼
        </DropdownArrow>
        
        <AnimatePresence>
          {isDropdownOpen && (
            <DropdownMenu
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <DropdownItem 
                onClick={goToHome}
                isActive={currentPage === 'menu'}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.1 }}
              >
                少女の菜单
              </DropdownItem>
              <DropdownItem 
                onClick={goToMemory}
                isActive={currentPage === 'memory'}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.1 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path fill={theme.colors.primary} d="M12,2c0,0-8,4-8,11c0,4.4,3.6,8,8,8s8-3.6,8-8C20,6,12,2,12,2z"/>
                  </svg>
                </div>
              </DropdownItem>
            </DropdownMenu>
          )}
        </AnimatePresence>
      </Logo>
      
      <CartButton
        onClick={goToCart}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg viewBox="0 0 24 24">
          <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
        </svg>
        {totalItems > 0 && (
          <CartCount>{totalItems}</CartCount>
        )}
      </CartButton>
    </Nav>
  );
}; 