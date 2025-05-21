import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { 
  Individual, 
  Problem, 
  EvolutionParameters, 
  EvolutionStatus, 
  EvolutionRun,
  LogEntry,
  EvolutionMetrics
} from '../types/evolution';

// Mock data functions (would connect to backend in a real implementation)
import { mockProblems, mockIndividuals, mockEvolutionRuns } from '../utils/mockData';

interface EvolutionContextType {
  problems: Problem[];
  individuals: Individual[];
  evolutionRuns: EvolutionRun[];
  logs: LogEntry[];
  metrics: EvolutionMetrics[];
  currentRun: EvolutionRun | null;
  
  // Problem management
  addProblem: (problem: Omit<Problem, 'id' | 'createdAt'>) => void;
  updateProblem: (problem: Problem) => void;
  deleteProblem: (id: string) => void;
  
  // Evolution control
  startEvolution: (problemId: string, parameters: EvolutionParameters) => void;
  pauseEvolution: () => void;
  resumeEvolution: () => void;
  stopEvolution: () => void;
  
  // Individual management
  getIndividual: (id: string) => Individual | undefined;
  getIndividualsByGeneration: (runId: string, generation: number) => Individual[];
  getBestIndividual: (runId: string) => Individual | undefined;
  
  // Metrics and logs
  getRunMetrics: (runId: string) => EvolutionMetrics[];
  getRunLogs: (runId: string) => LogEntry[];
  
  // UI state
  selectedProblemId: string | null;
  setSelectedProblemId: (id: string | null) => void;
  selectedIndividualId: string | null;
  setSelectedIndividualId: (id: string | null) => void;
}

const EvolutionContext = createContext<EvolutionContextType | undefined>(undefined);

export const useEvolution = (): EvolutionContextType => {
  const context = useContext(EvolutionContext);
  if (!context) {
    throw new Error('useEvolution must be used within an EvolutionProvider');
  }
  return context;
};

interface EvolutionProviderProps {
  children: ReactNode;
}

export const EvolutionProvider: React.FC<EvolutionProviderProps> = ({ children }) => {
  // State initialization with mock data
  const [problems, setProblems] = useState<Problem[]>(mockProblems);
  const [individuals, setIndividuals] = useState<Individual[]>(mockIndividuals);
  const [evolutionRuns, setEvolutionRuns] = useState<EvolutionRun[]>(mockEvolutionRuns);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [metrics, setMetrics] = useState<EvolutionMetrics[]>([]);
  const [currentRun, setCurrentRun] = useState<EvolutionRun | null>(null);
  
  // UI state
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(null);
  const [selectedIndividualId, setSelectedIndividualId] = useState<string | null>(null);

  // Problem management
  const addProblem = useCallback((problemData: Omit<Problem, 'id' | 'createdAt'>) => {
    const newProblem: Problem = {
      ...problemData,
      id: `problem-${Date.now()}`,
      createdAt: new Date()
    };
    setProblems(prev => [...prev, newProblem]);
  }, []);

  const updateProblem = useCallback((updatedProblem: Problem) => {
    setProblems(prev => prev.map(p => p.id === updatedProblem.id ? updatedProblem : p));
  }, []);

  const deleteProblem = useCallback((id: string) => {
    setProblems(prev => prev.filter(p => p.id !== id));
  }, []);

  // Evolution control
  const startEvolution = useCallback((problemId: string, parameters: EvolutionParameters) => {
    const newRun: EvolutionRun = {
      id: `run-${Date.now()}`,
      problemId,
      status: {
        status: 'running',
        currentGeneration: 0,
        populationSize: parameters.populationSize,
        bestFitness: 0,
        averageFitness: 0,
        diversityIndex: 1.0,
        elapsedTime: 0,
        apiCallsMade: 0
      },
      parameters,
      startedAt: new Date()
    };
    
    setCurrentRun(newRun);
    setEvolutionRuns(prev => [...prev, newRun]);
    
    // In a real implementation, this would start the actual evolution process
    console.log(`Starting evolution for problem ${problemId} with parameters:`, parameters);
  }, []);

  const pauseEvolution = useCallback(() => {
    if (currentRun) {
      const updatedRun = {
        ...currentRun,
        status: {
          ...currentRun.status,
          status: 'paused' as const
        }
      };
      setCurrentRun(updatedRun);
      setEvolutionRuns(prev => 
        prev.map(run => run.id === currentRun.id ? updatedRun : run)
      );
    }
  }, [currentRun]);

  const resumeEvolution = useCallback(() => {
    if (currentRun) {
      const updatedRun = {
        ...currentRun,
        status: {
          ...currentRun.status,
          status: 'running' as const
        }
      };
      setCurrentRun(updatedRun);
      setEvolutionRuns(prev => 
        prev.map(run => run.id === currentRun.id ? updatedRun : run)
      );
    }
  }, [currentRun]);

  const stopEvolution = useCallback(() => {
    if (currentRun) {
      const updatedRun = {
        ...currentRun,
        status: {
          ...currentRun.status,
          status: 'completed' as const
        },
        completedAt: new Date()
      };
      setCurrentRun(null);
      setEvolutionRuns(prev => 
        prev.map(run => run.id === currentRun.id ? updatedRun : run)
      );
    }
  }, [currentRun]);

  // Individual management
  const getIndividual = useCallback((id: string) => {
    return individuals.find(ind => ind.id === id);
  }, [individuals]);

  const getIndividualsByGeneration = useCallback((runId: string, generation: number) => {
    return individuals.filter(ind => 
      ind.generation === generation && 
      evolutionRuns.find(run => run.id === runId)?.problemId === 
      problems.find(problem => problem.id === evolutionRuns.find(run => run.id === runId)?.problemId)?.id
    );
  }, [individuals, evolutionRuns, problems]);

  const getBestIndividual = useCallback((runId: string) => {
    const run = evolutionRuns.find(r => r.id === runId);
    if (!run || !run.bestIndividualId) return undefined;
    return individuals.find(ind => ind.id === run.bestIndividualId);
  }, [evolutionRuns, individuals]);

  // Metrics and logs
  const getRunMetrics = useCallback((runId: string) => {
    return metrics.filter(m => 
      evolutionRuns.find(run => run.id === runId)?.id === runId
    );
  }, [metrics, evolutionRuns]);

  const getRunLogs = useCallback((runId: string) => {
    return logs.filter(log => log.evolutionRunId === runId);
  }, [logs]);

  const contextValue: EvolutionContextType = {
    problems,
    individuals,
    evolutionRuns,
    logs,
    metrics,
    currentRun,
    
    // Problem management
    addProblem,
    updateProblem,
    deleteProblem,
    
    // Evolution control
    startEvolution,
    pauseEvolution,
    resumeEvolution,
    stopEvolution,
    
    // Individual management
    getIndividual,
    getIndividualsByGeneration,
    getBestIndividual,
    
    // Metrics and logs
    getRunMetrics,
    getRunLogs,
    
    // UI state
    selectedProblemId,
    setSelectedProblemId,
    selectedIndividualId,
    setSelectedIndividualId
  };

  return (
    <EvolutionContext.Provider value={contextValue}>
      {children}
    </EvolutionContext.Provider>
  );
};