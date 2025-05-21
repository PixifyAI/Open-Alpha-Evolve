import React, { HTMLAttributes } from 'react';
import { motion } from 'framer-motion';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'interactive' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  isFullHeight?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  isFullHeight = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'bg-card rounded-lg border border-border transition-all duration-200';
  
  const variantClasses = {
    default: 'shadow-sm',
    interactive: 'shadow-sm hover:shadow-md cursor-pointer',
    elevated: 'shadow-md'
  };
  
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6'
  };
  
  const heightClass = isFullHeight ? 'h-full' : '';
  
  const cardVariants = {
    interactive: {
      rest: { scale: 1 },
      hover: { scale: 1.01, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }
    }
  };

  if (variant === 'interactive') {
    return (
      <motion.div
        initial="rest"
        whileHover="hover"
        variants={cardVariants.interactive}
        className={`
          ${baseClasses} 
          ${variantClasses[variant]} 
          ${paddingClasses[padding]} 
          ${heightClass} 
          ${className}
        `}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div
      className={`
        ${baseClasses} 
        ${variantClasses[variant]} 
        ${paddingClasses[padding]} 
        ${heightClass} 
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};