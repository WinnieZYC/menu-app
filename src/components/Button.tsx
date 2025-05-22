import React, { forwardRef } from 'react';
import styled, { css } from 'styled-components';
import { theme } from '../styles/theme';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  children: React.ReactNode;
}

const StyledButton = styled.button<{
  variant: 'primary' | 'secondary' | 'outline';
  size: 'small' | 'medium' | 'large';
  fullWidth: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${theme.borderRadius.medium};
  transition: all 0.2s ease-in-out;
  font-weight: 600;
  box-shadow: ${theme.shadows.small};
  
  ${(props) => props.fullWidth && css`
    width: 100%;
  `}
  
  ${(props) => {
    switch (props.size) {
      case 'small':
        return css`
          padding: ${theme.spacing.xs} ${theme.spacing.sm};
          font-size: 0.85rem;
        `;
      case 'large':
        return css`
          padding: ${theme.spacing.md} ${theme.spacing.lg};
          font-size: 1.1rem;
        `;
      default:
        return css`
          padding: ${theme.spacing.sm} ${theme.spacing.md};
          font-size: 1rem;
        `;
    }
  }}
  
  ${(props) => {
    switch (props.variant) {
      case 'secondary':
        return css`
          background: ${theme.colors.secondary};
          color: ${theme.colors.light};
          &:hover {
            background: ${theme.colors.primary};
            transform: translateY(-2px);
          }
        `;
      case 'outline':
        return css`
          background: transparent;
          color: ${theme.colors.primary};
          border: 2px solid ${theme.colors.primary};
          &:hover {
            background: ${theme.colors.primary};
            color: ${theme.colors.light};
            transform: translateY(-2px);
          }
        `;
      default:
        return css`
          background: ${theme.colors.primary};
          color: ${theme.colors.light};
          &:hover {
            background: ${theme.colors.secondary};
            transform: translateY(-2px);
            box-shadow: ${theme.shadows.medium};
          }
        `;
    }
  }}
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  ...props
}, ref) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      ref={ref}
      {...props}
    >
      {children}
    </StyledButton>
  );
}); 