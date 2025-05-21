import React, { useState } from 'react';
import { 
  Play, 
  PauseCircle, 
  StopCircle, 
  RefreshCw,
  Zap,
  Trophy,
  Settings,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEvolution } from '../../context/EvolutionContext';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { EvolutionParameters } from '../../types/evolution';

interface EvolutionControlsProps {
  problemId: string;
}

export const EvolutionControls: React.FC<EvolutionControlsProps> = ({
  problemId
}) => {
  const { 
    currentRun, 
    startEvolution, 
    pauseEvolution,
    resumeEvolution,
    stopEvolution 
  } = useEvolution();
  
  const [showParams, setShowParams] = useState(false);
  const [parameters, setParameters] = useState<EvolutionParameters>({
    populationSize: 10,
    selectionStrategy: 'tournament',
    tournamentSize: 3,
    maxGenerations: 20,
    targetFitness: 1.0,
    useCorrection: true,
    diversityWeight: 0.3,
    model: 'gemini-1.5-pro',
    temperature: 0.7
  });
  
  const handleParamChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setParameters(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : type === 'number' || name === 'temperature' || name === 'targetFitness' || name === 'diversityWeight'
          ? parseFloat(value)
          : value
    }));
  };
  
  const handleStart = () => {
    startEvolution(problemId, parameters);
  };
  
  const isRunning = currentRun?.status.status === 'running';
  const isPaused = currentRun?.status.status === 'paused';
  
  return (
    <Card className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Evolution Controls</h3>
        <Button 
          variant="ghost" 
          size="sm"
          leftIcon={showParams ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          onClick={() => setShowParams(!showParams)}
        >
          {showParams ? 'Hide' : 'Show'} Parameters
        </Button>
      </div>

      <AnimatePresence>
        {showParams && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Population Size</label>
                <input
                  type="number"
                  name="populationSize"
                  value={parameters.populationSize}
                  onChange={handleParamChange}
                  className="input"
                  min={2}
                  max={50}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Selection Strategy</label>
                <select
                  name="selectionStrategy"
                  value={parameters.selectionStrategy}
                  onChange={handleParamChange}
                  className="input"
                >
                  <option value="tournament">Tournament</option>
                  <option value="roulette">Roulette</option>
                  <option value="rank">Rank</option>
                  <option value="elite">Elite</option>
                </select>
              </div>
              
              {parameters.selectionStrategy === 'tournament' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Tournament Size</label>
                  <input
                    type="number"
                    name="tournamentSize"
                    value={parameters.tournamentSize}
                    onChange={handleParamChange}
                    className="input"
                    min={2}
                    max={Math.min(10, parameters.populationSize)}
                  />
                </div>
              )}
              
              {parameters.selectionStrategy === 'elite' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Elite Count</label>
                  <input
                    type="number"
                    name="eliteCount"
                    value={parameters.eliteCount || 2}
                    onChange={handleParamChange}
                    className="input"
                    min={1}
                    max={Math.floor(parameters.populationSize / 2)}
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium mb-1">Max Generations</label>
                <input
                  type="number"
                  name="maxGenerations"
                  value={parameters.maxGenerations}
                  onChange={handleParamChange}
                  className="input"
                  min={1}
                  max={100}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Target Fitness</label>
                <input
                  type="number"
                  name="targetFitness"
                  value={parameters.targetFitness}
                  onChange={handleParamChange}
                  className="input"
                  min={0.1}
                  max={1}
                  step={0.05}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Model</label>
                <select
                  name="model"
                  value={parameters.model}
                  onChange={handleParamChange}
                  className="input"
                >
                  <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                  <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Temperature</label>
                <input
                  type="range"
                  name="temperature"
                  value={parameters.temperature}
                  onChange={handleParamChange}
                  className="w-full"
                  min={0.1}
                  max={1}
                  step={0.1}
                />
                <div className="flex justify-between text-xs text-foreground/70">
                  <span>More deterministic ({parameters.temperature})</span>
                  <span>More creative</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Diversity Weight</label>
                <input
                  type="range"
                  name="diversityWeight"
                  value={parameters.diversityWeight}
                  onChange={handleParamChange}
                  className="w-full"
                  min={0}
                  max={1}
                  step={0.1}
                />
                <div className="flex justify-between text-xs text-foreground/70">
                  <span>Focus on fitness ({parameters.diversityWeight})</span>
                  <span>Focus on diversity</span>
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="useCorrection"
                  name="useCorrection"
                  checked={parameters.useCorrection}
                  onChange={handleParamChange}
                  className="mr-2"
                />
                <label htmlFor="useCorrection" className="text-sm">
                  Use Program Correction
                </label>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center space-x-3">
        {!currentRun && (
          <Button
            variant="primary"
            leftIcon={<Play size={16} />}
            onClick={handleStart}
          >
            Start Evolution
          </Button>
        )}
        
        {isRunning && (
          <>
            <Button
              variant="secondary"
              leftIcon={<PauseCircle size={16} />}
              onClick={pauseEvolution}
            >
              Pause
            </Button>
            <Button
              variant="outline"
              leftIcon={<StopCircle size={16} />}
              onClick={stopEvolution}
            >
              Stop
            </Button>
          </>
        )}
        
        {isPaused && (
          <>
            <Button
              variant="primary"
              leftIcon={<Play size={16} />}
              onClick={resumeEvolution}
            >
              Resume
            </Button>
            <Button
              variant="outline"
              leftIcon={<StopCircle size={16} />}
              onClick={stopEvolution}
            >
              Stop
            </Button>
          </>
        )}
      </div>
      
      {currentRun && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="flex items-center text-xs font-medium text-foreground/70 mb-1">
                <Trophy size={14} className="mr-1" />
                Best Fitness
              </div>
              <div className="text-lg font-semibold">{currentRun.status.bestFitness.toFixed(3)}</div>
            </div>
            
            <div>
              <div className="flex items-center text-xs font-medium text-foreground/70 mb-1">
                <RefreshCw size={14} className="mr-1" />
                Generation
              </div>
              <div className="text-lg font-semibold">{currentRun.status.currentGeneration} / {parameters.maxGenerations}</div>
            </div>
            
            <div>
              <div className="flex items-center text-xs font-medium text-foreground/70 mb-1">
                <Zap size={14} className="mr-1" />
                Population Size
              </div>
              <div className="text-lg font-semibold">{currentRun.status.populationSize}</div>
            </div>
            
            <div>
              <div className="flex items-center text-xs font-medium text-foreground/70 mb-1">
                <Settings size={14} className="mr-1" />
                API Calls
              </div>
              <div className="text-lg font-semibold">{currentRun.status.apiCallsMade}</div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};