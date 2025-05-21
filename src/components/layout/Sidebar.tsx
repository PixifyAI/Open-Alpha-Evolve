import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard,
  Code2,
  FlaskConical,
  Settings,
  ChevronRight,
  GithubIcon,
  BookOpen,
  FolderGit2
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const SidebarLink: React.FC<{
  to: string;
  label: string;
  icon: React.ReactNode;
}> = ({ to, label, icon }) => {
  const location = useLocation();
  const isActive = location.pathname === to || 
                  (to !== '/' && location.pathname.startsWith(to));
  
  return (
    <NavLink to={to} className="block">
      <motion.div
        className={`
          flex items-center px-4 py-3 rounded-md mb-1 transition-colors duration-200
          ${isActive 
            ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' 
            : 'text-foreground hover:bg-card-muted'}
        `}
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="mr-3">{icon}</span>
        <span className="font-medium">{label}</span>
        {isActive && (
          <motion.span 
            className="ml-auto"
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight size={16} />
          </motion.span>
        )}
      </motion.div>
    </NavLink>
  );
};

export const Sidebar: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <div className="w-64 h-full bg-card border-r border-border flex flex-col">
      <div className="p-6">
        <div className="flex items-center">
          <FlaskConical className="text-primary-600 mr-3" size={28} />
          <h1 className="text-xl font-bold tracking-tight">OpenAlphaEvolve</h1>
        </div>
        <p className="text-xs text-foreground/70 mt-2">
          AI-powered evolution of code
        </p>
      </div>
      
      <nav className="flex-1 px-4 py-2">
        <SidebarLink 
          to="/" 
          label="Dashboard" 
          icon={<LayoutDashboard size={18} />} 
        />
        <SidebarLink 
          to="/projects" 
          label="Projects" 
          icon={<Code2 size={18} />} 
        />
        <SidebarLink 
          to="/lab" 
          label="Evolution Lab" 
          icon={<FlaskConical size={18} />} 
        />
        <SidebarLink 
          to="/settings" 
          label="Settings" 
          icon={<Settings size={18} />} 
        />
      </nav>
      
      <div className="p-4 border-t border-border">
        <div className="mb-4">
          <a
            href="https://github.com/openalphaevolve/openalphaevolve"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-card-muted rounded-md"
          >
            <GithubIcon size={16} className="mr-2" />
            GitHub Repository
          </a>
          <a
            href="https://storage.googleapis.com/deepmind-media/DeepMind.com/Blog/alphaevolve-a-gemini-powered-coding-agent-for-designing-advanced-algorithms/AlphaEvolve.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-card-muted rounded-md"
          >
            <BookOpen size={16} className="mr-2" />
            Research Paper
          </a>
          <a
            href="/import"
            className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-card-muted rounded-md"
          >
            <FolderGit2 size={16} className="mr-2" />
            Import Project
          </a>
        </div>
        <div className="text-xs text-foreground/70 px-4">
          <p>Powered by Gemini API</p>
          <p>Version 0.1.0</p>
        </div>
      </div>
    </div>
  );
};