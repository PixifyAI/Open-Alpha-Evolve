export interface Individual {
  id: string;
  code: string;
  fitness: number;
  generation: number;
  parentIds: string[];
  createdAt: Date;
  testResults: TestResult[];
  metadata: {
    executionTime?: number;
    codeSize?: number;
    complexity?: number;
    [key: string]: any;
  };
}

export interface TestResult {
  id: string;
  passed: boolean;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  executionTime?: number;
  error?: string;
}

export interface Problem {
  id: string;
  title: string;
  description: string;
  functionSignature: string;
  testCases: {
    input: string;
    expectedOutput: string;
  }[];
  constraints?: string;
  tags: string[];
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  createdAt: Date;
}

export interface EvolutionParameters {
  populationSize: number;
  selectionStrategy: 'tournament' | 'roulette' | 'rank' | 'elite';
  tournamentSize?: number;
  eliteCount?: number;
  maxGenerations: number;
  targetFitness: number;
  useCorrection: boolean;
  diversityWeight: number;
  model: 'gemini-1.5-flash' | 'gemini-1.5-pro';
  temperature: number;
}

export interface EvolutionStatus {
  status: 'idle' | 'running' | 'paused' | 'completed' | 'error';
  currentGeneration: number;
  populationSize: number;
  bestFitness: number;
  averageFitness: number;
  diversityIndex: number;
  elapsedTime: number;
  apiCallsMade: number;
  errorMessage?: string;
}

export interface EvolutionRun {
  id: string;
  problemId: string;
  status: EvolutionStatus;
  parameters: EvolutionParameters;
  startedAt: Date;
  completedAt?: Date;
  bestIndividualId?: string;
}

export interface LogEntry {
  id: string;
  timestamp: Date;
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
  details?: string;
  evolutionRunId: string;
  generation?: number;
}

export interface EvolutionMetrics {
  generation: number;
  bestFitness: number;
  averageFitness: number;
  diversityIndex: number;
  totalIndividuals: number;
  apiCallsMade: number;
  timestamp: Date;
}