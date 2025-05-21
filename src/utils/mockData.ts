import { Problem, Individual, EvolutionRun, TestResult } from '../types/evolution';

// Mock Problems
export const mockProblems: Problem[] = [
  {
    id: 'prob-1',
    title: 'Sort Array',
    description: 'Write a function to sort an array of integers in ascending order.',
    functionSignature: 'def sort_array(arr: list[int]) -> list[int]:',
    testCases: [
      { input: '[3, 1, 4, 1, 5, 9, 2, 6]', expectedOutput: '[1, 1, 2, 3, 4, 5, 6, 9]' },
      { input: '[]', expectedOutput: '[]' },
      { input: '[1]', expectedOutput: '[1]' },
      { input: '[9, 8, 7, 6, 5]', expectedOutput: '[5, 6, 7, 8, 9]' }
    ],
    constraints: 'Time complexity: O(n log n), Space complexity: O(n)',
    tags: ['sorting', 'arrays', 'algorithms'],
    difficulty: 'easy',
    createdAt: new Date('2023-09-15')
  },
  {
    id: 'prob-2',
    title: 'Fibonacci Sequence',
    description: 'Write a function to generate the nth Fibonacci number.',
    functionSignature: 'def fibonacci(n: int) -> int:',
    testCases: [
      { input: '0', expectedOutput: '0' },
      { input: '1', expectedOutput: '1' },
      { input: '2', expectedOutput: '1' },
      { input: '10', expectedOutput: '55' }
    ],
    constraints: 'Optimize for performance with large inputs.',
    tags: ['dynamic programming', 'recursion', 'mathematics'],
    difficulty: 'medium',
    createdAt: new Date('2023-10-20')
  },
  {
    id: 'prob-3',
    title: 'LRU Cache',
    description: 'Implement a Least Recently Used (LRU) cache with get and put operations.',
    functionSignature: 'class LRUCache:\n    def __init__(self, capacity: int):\n    def get(self, key: int) -> int:\n    def put(self, key: int, value: int) -> None:',
    testCases: [
      { 
        input: 'LRUCache(2); cache.put(1, 1); cache.put(2, 2); cache.get(1); cache.put(3, 3); cache.get(2);', 
        expectedOutput: '1; -1' 
      }
    ],
    constraints: 'Operations must run in O(1) time complexity.',
    tags: ['data structures', 'hash table', 'linked list', 'design'],
    difficulty: 'hard',
    createdAt: new Date('2024-01-05')
  }
];

// Create mock test results
const createMockTestResults = (passed: boolean[]): TestResult[] => {
  return passed.map((isPassed, index) => ({
    id: `test-${index}`,
    passed: isPassed,
    input: mockProblems[0].testCases[index % mockProblems[0].testCases.length].input,
    expectedOutput: mockProblems[0].testCases[index % mockProblems[0].testCases.length].expectedOutput,
    actualOutput: isPassed 
      ? mockProblems[0].testCases[index % mockProblems[0].testCases.length].expectedOutput
      : '[3, 2, 1, 4, 5]', // Just a wrong output for failing tests
    executionTime: Math.random() * 100,
    error: isPassed ? undefined : 'AssertionError: Expected [1, 1, 2, 3, 4, 5, 6, 9] but got [3, 2, 1, 4, 5]'
  }));
};

// Mock Individuals
export const mockIndividuals: Individual[] = [
  {
    id: 'ind-1',
    code: `def sort_array(arr: list[int]) -> list[int]:
    # Simple bubble sort implementation
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr`,
    fitness: 0.75,
    generation: 1,
    parentIds: [],
    createdAt: new Date('2024-03-01T10:00:00'),
    testResults: createMockTestResults([true, true, true, false]),
    metadata: {
      executionTime: 45.2,
      codeSize: 215,
      complexity: 0.3
    }
  },
  {
    id: 'ind-2',
    code: `def sort_array(arr: list[int]) -> list[int]:
    # Improved implementation using Python's built-in sort
    return sorted(arr)`,
    fitness: 1.0,
    generation: 2,
    parentIds: ['ind-1'],
    createdAt: new Date('2024-03-01T10:05:00'),
    testResults: createMockTestResults([true, true, true, true]),
    metadata: {
      executionTime: 12.5,
      codeSize: 82,
      complexity: 0.1
    }
  },
  {
    id: 'ind-3',
    code: `def fibonacci(n: int) -> int:
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)`,
    fitness: 0.5,
    generation: 1,
    parentIds: [],
    createdAt: new Date('2024-03-02T09:30:00'),
    testResults: createMockTestResults([true, true, true, false]),
    metadata: {
      executionTime: 1250.3, // Very slow for larger inputs
      codeSize: 94,
      complexity: 0.2
    }
  },
  {
    id: 'ind-4',
    code: `def fibonacci(n: int) -> int:
    if n <= 1:
        return n
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    return b`,
    fitness: 1.0,
    generation: 2,
    parentIds: ['ind-3'],
    createdAt: new Date('2024-03-02T09:35:00'),
    testResults: createMockTestResults([true, true, true, true]),
    metadata: {
      executionTime: 0.8,
      codeSize: 122,
      complexity: 0.25
    }
  }
];

// Mock Evolution Runs
export const mockEvolutionRuns: EvolutionRun[] = [
  {
    id: 'run-1',
    problemId: 'prob-1',
    status: {
      status: 'completed',
      currentGeneration: 2,
      populationSize: 10,
      bestFitness: 1.0,
      averageFitness: 0.85,
      diversityIndex: 0.6,
      elapsedTime: 120,
      apiCallsMade: 15
    },
    parameters: {
      populationSize: 10,
      selectionStrategy: 'tournament',
      tournamentSize: 3,
      maxGenerations: 5,
      targetFitness: 1.0,
      useCorrection: true,
      diversityWeight: 0.3,
      model: 'gemini-1.5-flash',
      temperature: 0.7
    },
    startedAt: new Date('2024-03-01T10:00:00'),
    completedAt: new Date('2024-03-01T10:05:00'),
    bestIndividualId: 'ind-2'
  },
  {
    id: 'run-2',
    problemId: 'prob-2',
    status: {
      status: 'completed',
      currentGeneration: 2,
      populationSize: 10,
      bestFitness: 1.0,
      averageFitness: 0.75,
      diversityIndex: 0.5,
      elapsedTime: 180,
      apiCallsMade: 12
    },
    parameters: {
      populationSize: 10,
      selectionStrategy: 'elite',
      eliteCount: 2,
      maxGenerations: 5,
      targetFitness: 1.0,
      useCorrection: true,
      diversityWeight: 0.2,
      model: 'gemini-1.5-pro',
      temperature: 0.8
    },
    startedAt: new Date('2024-03-02T09:30:00'),
    completedAt: new Date('2024-03-02T09:40:00'),
    bestIndividualId: 'ind-4'
  },
  {
    id: 'run-3',
    problemId: 'prob-3',
    status: {
      status: 'running',
      currentGeneration: 1,
      populationSize: 15,
      bestFitness: 0.6,
      averageFitness: 0.4,
      diversityIndex: 0.8,
      elapsedTime: 90,
      apiCallsMade: 8
    },
    parameters: {
      populationSize: 15,
      selectionStrategy: 'roulette',
      maxGenerations: 10,
      targetFitness: 1.0,
      useCorrection: true,
      diversityWeight: 0.4,
      model: 'gemini-1.5-pro',
      temperature: 0.9
    },
    startedAt: new Date('2024-03-03T14:00:00')
  }
];