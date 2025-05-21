import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface TabItem {
  id: string;
  label: React.ReactNode;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  defaultTabId?: string;
  variant?: 'underline' | 'pills' | 'boxed';
  onChange?: (tabId: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTabId,
  variant = 'underline',
  onChange,
  className = ''
}) => {
  const [activeTabId, setActiveTabId] = useState(defaultTabId || tabs[0]?.id);
  
  const handleTabChange = (tabId: string) => {
    setActiveTabId(tabId);
    onChange && onChange(tabId);
  };
  
  const baseTabClasses = 'px-4 py-2 font-medium transition-all duration-200 cursor-pointer';
  
  const variantTabClasses = {
    underline: 'border-b-2 border-transparent hover:text-primary-600 hover:border-primary-300',
    pills: 'rounded-full hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-900/20',
    boxed: 'border border-transparent rounded-t-md hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-900/20'
  };
  
  const activeTabClasses = {
    underline: 'text-primary-600 border-primary-600',
    pills: 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300',
    boxed: 'bg-card border-border border-b-0 rounded-b-none text-primary-600'
  };
  
  const contentClasses = {
    underline: 'pt-4',
    pills: 'p-4',
    boxed: 'border border-border rounded-b-md p-4 bg-card'
  };
  
  return (
    <div className={className}>
      <div 
        className={`flex ${variant === 'boxed' ? 'mb-0' : 'mb-2'} ${variant === 'pills' ? 'gap-2' : 'gap-0'}`}
      >
        {tabs.map((tab) => (
          <motion.div
            key={tab.id}
            className={`
              ${baseTabClasses} 
              ${variantTabClasses[variant]} 
              ${activeTabId === tab.id ? activeTabClasses[variant] : ''}
            `}
            onClick={() => handleTabChange(tab.id)}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
          >
            {tab.label}
          </motion.div>
        ))}
      </div>
      <div className={contentClasses[variant]}>
        {tabs.find(tab => tab.id === activeTabId)?.content}
      </div>
    </div>
  );
};