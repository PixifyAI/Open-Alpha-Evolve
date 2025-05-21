import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Key, 
  Save, 
  Sun, 
  Moon, 
  Palette, 
  Globe,
  Database
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Tabs } from '../components/ui/Tabs';

const Settings: React.FC = () => {
  const { theme, setTheme } = useTheme();
  
  const [apiKey, setApiKey] = useState('');
  const [temperature, setTemperature] = useState(0.7);
  const [maxModelTokens, setMaxModelTokens] = useState(8192);
  const [defaultPopulationSize, setDefaultPopulationSize] = useState(10);
  const [defaultMaxGenerations, setDefaultMaxGenerations] = useState(20);
  
  const [savedStatus, setSavedStatus] = useState<null | 'saving' | 'saved' | 'error'>(null);
  
  const handleSave = () => {
    setSavedStatus('saving');
    
    // Simulate save operation
    setTimeout(() => {
      setSavedStatus('saved');
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setSavedStatus(null);
      }, 3000);
    }, 1000);
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  return (
    <>
      <Header 
        title="Settings"
        subtitle="Configure AlphaEvolve"
      />
      
      <motion.div 
        className="p-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Tabs
          tabs={[
            {
              id: 'api',
              label: 'API Configuration',
              content: (
                <motion.div 
                  className="space-y-6"
                  variants={containerVariants}
                >
                  <motion.div variants={itemVariants}>
                    <Card>
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <Key size={20} className="mr-2 text-primary-600" />
                        API Credentials
                      </h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="api-key" className="block text-sm font-medium mb-1">
                            Gemini API Key
                          </label>
                          <div className="relative">
                            <input
                              id="api-key"
                              type="password"
                              value={apiKey}
                              onChange={(e) => setApiKey(e.target.value)}
                              placeholder="Enter your Gemini API key"
                              className="input pr-10"
                            />
                            <button
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground/60 hover:text-foreground"
                              onClick={() => {/* Toggle visibility */}}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                <circle cx="12" cy="12" r="3" />
                              </svg>
                            </button>
                          </div>
                          <p className="text-xs text-foreground/70 mt-1">
                            Your API key is stored locally and never sent to our servers.
                          </p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Default Model
                          </label>
                          <select className="input">
                            <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                            <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                          </select>
                          <p className="text-xs text-foreground/70 mt-1">
                            Pro offers better reasoning capabilities but costs more.
                          </p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <Card>
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <Globe size={20} className="mr-2 text-primary-600" />
                        Model Parameters
                      </h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="temperature" className="block text-sm font-medium mb-1">
                            Temperature: {temperature}
                          </label>
                          <input
                            id="temperature"
                            type="range"
                            min="0.1"
                            max="1"
                            step="0.1"
                            value={temperature}
                            onChange={(e) => setTemperature(parseFloat(e.target.value))}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-foreground/70 mt-1">
                            <span>More deterministic</span>
                            <span>More creative</span>
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="max-tokens" className="block text-sm font-medium mb-1">
                            Max Output Tokens: {maxModelTokens}
                          </label>
                          <input
                            id="max-tokens"
                            type="range"
                            min="1024"
                            max="32768"
                            step="1024"
                            value={maxModelTokens}
                            onChange={(e) => setMaxModelTokens(parseInt(e.target.value))}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-foreground/70 mt-1">
                            <span>Shorter responses</span>
                            <span>Longer responses</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </motion.div>
              )
            },
            {
              id: 'evolution',
              label: 'Evolution Settings',
              content: (
                <motion.div 
                  className="space-y-6"
                  variants={containerVariants}
                >
                  <motion.div variants={itemVariants}>
                    <Card>
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <Database size={20} className="mr-2 text-primary-600" />
                        Default Parameters
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="population-size" className="block text-sm font-medium mb-1">
                            Default Population Size
                          </label>
                          <input
                            id="population-size"
                            type="number"
                            min="5"
                            max="50"
                            value={defaultPopulationSize}
                            onChange={(e) => setDefaultPopulationSize(parseInt(e.target.value))}
                            className="input"
                          />
                          <p className="text-xs text-foreground/70 mt-1">
                            Larger populations provide more diversity but use more API calls.
                          </p>
                        </div>
                        
                        <div>
                          <label htmlFor="max-generations" className="block text-sm font-medium mb-1">
                            Default Max Generations
                          </label>
                          <input
                            id="max-generations"
                            type="number"
                            min="5"
                            max="100"
                            value={defaultMaxGenerations}
                            onChange={(e) => setDefaultMaxGenerations(parseInt(e.target.value))}
                            className="input"
                          />
                          <p className="text-xs text-foreground/70 mt-1">
                            Higher values allow more time for evolution but use more API calls.
                          </p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Default Selection Strategy
                          </label>
                          <select className="input">
                            <option value="tournament">Tournament Selection</option>
                            <option value="roulette">Roulette Wheel Selection</option>
                            <option value="rank">Rank-Based Selection</option>
                            <option value="elite">Elite Selection</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Use Program Correction
                          </label>
                          <div className="flex items-center mt-2">
                            <input 
                              type="checkbox" 
                              id="use-correction" 
                              className="mr-2" 
                              defaultChecked 
                            />
                            <label htmlFor="use-correction" className="text-sm">
                              Attempt to correct programs that fail tests
                            </label>
                          </div>
                          <p className="text-xs text-foreground/70 mt-1">
                            This uses additional API calls but can improve results.
                          </p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </motion.div>
              )
            },
            {
              id: 'appearance',
              label: 'Appearance',
              content: (
                <motion.div 
                  className="space-y-6"
                  variants={containerVariants}
                >
                  <motion.div variants={itemVariants}>
                    <Card>
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <Palette size={20} className="mr-2 text-primary-600" />
                        Theme Settings
                      </h3>
                      
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium mb-3">
                            Color Theme
                          </label>
                          <div className="grid grid-cols-2 gap-4">
                            <div
                              className={`
                                border-2 rounded-lg p-4 cursor-pointer transition-all
                                ${theme === 'light' 
                                  ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/30' 
                                  : 'border-border hover:border-primary-300'
                                }
                              `}
                              onClick={() => setTheme('light')}
                            >
                              <div className="flex items-center justify-between mb-3">
                                <span className="font-medium">Light</span>
                                <Sun size={18} className={theme === 'light' ? 'text-primary-600' : ''} />
                              </div>
                              <div className="rounded-md bg-[#FAFAFA] border border-[#E5E7EB] p-2 h-20 flex items-center justify-center">
                                <div className="w-2/3 bg-blue-500 h-6 rounded" />
                              </div>
                            </div>
                            
                            <div
                              className={`
                                border-2 rounded-lg p-4 cursor-pointer transition-all
                                ${theme === 'dark' 
                                  ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/30' 
                                  : 'border-border hover:border-primary-300'
                                }
                              `}
                              onClick={() => setTheme('dark')}
                            >
                              <div className="flex items-center justify-between mb-3">
                                <span className="font-medium">Dark</span>
                                <Moon size={18} className={theme === 'dark' ? 'text-primary-600' : ''} />
                              </div>
                              <div className="rounded-md bg-[#1F2937] border border-[#374151] p-2 h-20 flex items-center justify-center">
                                <div className="w-2/3 bg-blue-500 h-6 rounded" />
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-3">
                            Font Size
                          </label>
                          <div className="flex items-center gap-3">
                            <button className="px-3 py-1 border border-border rounded text-sm hover:bg-card-muted">
                              A-
                            </button>
                            <div className="text-base">Normal</div>
                            <button className="px-3 py-1 border border-border rounded text-sm hover:bg-card-muted">
                              A+
                            </button>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-3">
                            Code Editor Theme
                          </label>
                          <select className="input">
                            <option value="tomorrow">Tomorrow (Dark)</option>
                            <option value="light">Light</option>
                            <option value="dracula">Dracula</option>
                            <option value="github">GitHub</option>
                          </select>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </motion.div>
              )
            }
          ]}
        />
        
        <motion.div 
          className="mt-6 flex justify-end"
          variants={itemVariants}
        >
          <Button
            variant="primary"
            leftIcon={<Save size={16} />}
            onClick={handleSave}
            isLoading={savedStatus === 'saving'}
          >
            {savedStatus === 'saved' ? 'Saved!' : 'Save Settings'}
          </Button>
        </motion.div>
      </motion.div>
    </>
  );
};

export default Settings;