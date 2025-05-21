import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Terminal } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../ui/Button';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'AlphaEvolve',
  subtitle,
  actions
}) => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center">
            <Terminal className="text-primary-600 mr-3" size={24} />
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          </div>
          {subtitle && (
            <p className="text-sm text-foreground/70 mt-1">{subtitle}</p>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          {actions}
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-card-muted transition-colors duration-200"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Moon size={20} className="text-foreground" />
            ) : (
              <Sun size={20} className="text-foreground" />
            )}
          </motion.button>
        </div>
      </div>
    </header>
  );
};