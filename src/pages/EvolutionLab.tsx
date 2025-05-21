import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useEvolution } from '../context/EvolutionContext';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Tabs } from '../components/ui/Tabs';
import { CodeEditor } from '../components/ui/CodeEditor';
import { FitnessChart } from '../components/ui/FitnessChart';
import { EvolutionControls } from '../components/evolution/EvolutionControls';
import { IndividualCard } from '../components/evolution/IndividualCard';
import { 
  Terminal, 
  Code, 
  BarChart3,
  ArrowRight,
  ArrowLeft,
  Filter,
  Download,
  Share2
} from 'lucide-react';

const EvolutionLab: React.FC = () => {
  const { problemId } = useParams<{ problemId: string }>();
  const { 
    problems, 
    individuals, 
    evolutionRuns,
    selectedIndividualId, 
    setSelectedIndividualId,
    getIndividual
  } = useEvolution();
  
  const [selectedRun, setSelectedRun] = useState<string | null>(null);
  const [selectedGeneration, setSelectedGeneration] = useState<number>(0);
  
  // Find the problem based on the URL parameter
  const problem = problemId ? problems.find(p => p.id === problemId) : null;
  
  // Find runs for this problem
  const problemRuns = problemId
    ? evolutionRuns.filter(run => run.problemId === problemId)
    : [];
  
  // Set the first run as selected if none is selected
  useEffect(() => {
    if (problemRuns.length > 0 && !selectedRun) {
      setSelectedRun(problemRuns[0].id);
      const run = problemRuns[0];
      setSelectedGeneration(run.status.currentGeneration);
    }
  }, [problemRuns, selectedRun]);
  
  // Get the current run
  const currentRun = selectedRun 
    ? evolutionRuns.find(run => run.id === selectedRun)
    : null;
  
  // Get individuals for the selected generation
  const generationIndividuals = currentRun
    ? individuals.filter(ind => 
        ind.generation === selectedGeneration && 
        problemRuns.some(run => run.id === selectedRun)
      )
    : [];
  
  // Get the selected individual
  const selectedIndividual = selectedIndividualId 
    ? getIndividual(selectedIndividualId)
    : generationIndividuals[0];
  
  // If an individual is not selected, select the first one
  useEffect(() => {
    if (generationIndividuals.length > 0 && !selectedIndividualId) {
      setSelectedIndividualId(generationIndividuals[0].id);
    }
  }, [generationIndividuals, selectedIndividualId, setSelectedIndividualId]);
  
  // Mock metrics data for the chart
  const mockMetricsData = Array.from({ length: currentRun?.status.currentGeneration || 10 }, (_, i) => ({
    generation: i + 1,
    bestFitness: Math.min(1, 0.2 + i * 0.04 + Math.random() * 0.05),
    averageFitness: Math.min(1, 0.1 + i * 0.03 + Math.random() * 0.05),
    diversityIndex: Math.max(0.2, 1 - i * 0.04 + Math.random() * 0.05),
    totalIndividuals: 10 + i * 5,
    apiCallsMade: 5 + i * 3,
    timestamp: new Date()
  }));
  
  if (!problem) {
    return (
      <>
        <Header title="Evolution Lab" />
        <div className="p-6">
          <Card className="text-center py-12">
            <p className="text-foreground/70 mb-4">Select a problem to start evolution</p>
            <Button 
              variant="primary"
              leftIcon={<ArrowLeft size={16} />}
              onClick={() => window.history.back()}
            >
              Back to Problems
            </Button>
          </Card>
        </div>
      </>
    );
  }
  
  return (
    <>
      <Header 
        title="Evolution Lab"
        subtitle={problem.title}
        actions={
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Share2 size={16} />}
          >
            Share Results
          </Button>
        }
      />
      
      <div className="p-6">
        <div className="mb-6">
          <Card>
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-xl font-bold">{problem.title}</h2>
                  <Badge variant={
                    problem.difficulty === 'easy' ? 'primary' :
                    problem.difficulty === 'medium' ? 'secondary' :
                    problem.difficulty === 'hard' ? 'warning' :
                    'error'
                  }>
                    {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                  </Badge>
                </div>
                
                <p className="text-foreground/80 mb-3">{problem.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {problem.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" size="sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="mb-4">
                  <h3 className="text-sm font-semibold mb-1">Function Signature:</h3>
                  <div className="bg-card-muted p-3 rounded-md font-mono text-sm overflow-x-auto">
                    {problem.functionSignature}
                  </div>
                </div>
              </div>
              
              <div className="md:min-w-80">
                <h3 className="text-sm font-semibold mb-2">Test Cases:</h3>
                <div className="bg-card-muted rounded-md overflow-hidden">
                  <div className="max-h-60 overflow-y-auto">
                    <table className="w-full">
                      <thead className="bg-primary-50 dark:bg-primary-900/20">
                        <tr>
                          <th className="p-2 text-left text-xs font-medium">Input</th>
                          <th className="p-2 text-left text-xs font-medium">Expected</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {problem.testCases.map((testCase, index) => (
                          <tr key={index} className="hover:bg-card-muted">
                            <td className="p-2 text-xs font-mono">{testCase.input}</td>
                            <td className="p-2 text-xs font-mono">{testCase.expectedOutput}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Evolution Controls */}
        {problemId && <EvolutionControls problemId={problemId} />}
        
        {/* Run Selection */}
        {problemRuns.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Evolution Runs</h3>
              
              <div className="flex items-center gap-2">
                <select
                  value={selectedRun || ''}
                  onChange={(e) => setSelectedRun(e.target.value)}
                  className="input text-sm"
                >
                  {problemRuns.map((run) => (
                    <option key={run.id} value={run.id}>
                      Run #{run.id.split('-')[1]} - {new Date(run.startedAt).toLocaleDateString()}
                    </option>
                  ))}
                </select>
                
                <select
                  value={selectedGeneration}
                  onChange={(e) => setSelectedGeneration(parseInt(e.target.value))}
                  className="input text-sm"
                  disabled={!currentRun}
                >
                  {Array.from({ length: (currentRun?.status.currentGeneration || 0) + 1 }, (_, i) => (
                    <option key={i} value={i}>
                      {i === 0 ? 'Initial Population' : `Generation ${i}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
        
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Evolution Progress & Metrics */}
          <div className="md:col-span-1 space-y-6">
            <Card>
              <h3 className="text-base font-semibold mb-3 flex items-center">
                <BarChart3 size={18} className="mr-2 text-primary-600" />
                Evolution Progress
              </h3>
              
              <FitnessChart data={mockMetricsData} height={200} />
              
              {currentRun && (
                <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-border">
                  <div>
                    <p className="text-xs text-foreground/70 mb-1">Status</p>
                    <p className="font-semibold">{currentRun.status.status.charAt(0).toUpperCase() + currentRun.status.status.slice(1)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-foreground/70 mb-1">Best Fitness</p>
                    <p className="font-semibold">{currentRun.status.bestFitness.toFixed(3)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-foreground/70 mb-1">Current Generation</p>
                    <p className="font-semibold">{currentRun.status.currentGeneration}</p>
                  </div>
                  <div>
                    <p className="text-xs text-foreground/70 mb-1">Population Size</p>
                    <p className="font-semibold">{currentRun.status.populationSize}</p>
                  </div>
                  <div>
                    <p className="text-xs text-foreground/70 mb-1">API Calls</p>
                    <p className="font-semibold">{currentRun.status.apiCallsMade}</p>
                  </div>
                  <div>
                    <p className="text-xs text-foreground/70 mb-1">Elapsed Time</p>
                    <p className="font-semibold">{(currentRun.status.elapsedTime / 1000).toFixed(1)}s</p>
                  </div>
                </div>
              )}
            </Card>
            
            <Card>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-base font-semibold flex items-center">
                  <Code size={18} className="mr-2 text-primary-600" />
                  Generation {selectedGeneration} Population
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<Filter size={14} />}
                >
                  Filter
                </Button>
              </div>
              
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {generationIndividuals.length > 0 ? (
                  generationIndividuals
                    .sort((a, b) => b.fitness - a.fitness)
                    .map((individual) => (
                      <IndividualCard 
                        key={individual.id} 
                        individual={individual}
                        isSelected={selectedIndividual?.id === individual.id}
                        onClick={() => setSelectedIndividualId(individual.id)}
                      />
                    ))
                ) : (
                  <p className="text-sm text-foreground/70 text-center py-6">
                    No individuals for this generation
                  </p>
                )}
              </div>
            </Card>
          </div>
          
          {/* Right Column - Individual Details */}
          <div className="md:col-span-2">
            <Card>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Terminal size={20} className="mr-2 text-primary-600" />
                {selectedIndividual 
                  ? `Individual #${selectedIndividual.id.split('-')[1]} (Fitness: ${selectedIndividual.fitness.toFixed(2)})` 
                  : 'Individual Details'}
              </h3>
              
              {selectedIndividual ? (
                <Tabs
                  tabs={[
                    {
                      id: 'code',
                      label: 'Code',
                      content: (
                        <div>
                          <div className="flex justify-between items-center mb-3">
                            <div className="text-sm text-foreground/70">
                              Generation {selectedIndividual.generation}, 
                              {selectedIndividual.parentIds.length > 0 
                                ? ` derived from ${selectedIndividual.parentIds.length} parent(s)` 
                                : ' initial population'}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              leftIcon={<Download size={14} />}
                            >
                              Save Code
                            </Button>
                          </div>
                          <CodeEditor
                            code={selectedIndividual.code}
                            readOnly={true}
                            height="350px"
                          />
                        </div>
                      )
                    },
                    {
                      id: 'testResults',
                      label: 'Test Results',
                      content: (
                        <div>
                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">Test Summary</h4>
                              <Badge 
                                variant={selectedIndividual.fitness === 1 ? 'success' : 'warning'}
                                className="font-mono"
                              >
                                {selectedIndividual.testResults.filter(t => t.passed).length}/{selectedIndividual.testResults.length} Tests Passed
                              </Badge>
                            </div>
                            <div className="w-full h-2 bg-card-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-primary-500 to-success-500" 
                                style={{ 
                                  width: `${(selectedIndividual.testResults.filter(t => t.passed).length / selectedIndividual.testResults.length) * 100}%` 
                                }}
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            {selectedIndividual.testResults.map((result, index) => (
                              <div key={index} className={`border rounded-md overflow-hidden ${result.passed ? 'border-success-500' : 'border-error-500'}`}>
                                <div className={`px-4 py-2 flex justify-between items-center ${result.passed ? 'bg-success-50 dark:bg-success-700/20' : 'bg-error-50 dark:bg-error-700/20'}`}>
                                  <div className="font-medium">
                                    Test #{index + 1}
                                  </div>
                                  <Badge variant={result.passed ? 'success' : 'error'}>
                                    {result.passed ? 'Passed' : 'Failed'}
                                  </Badge>
                                </div>
                                <div className="p-4 bg-card-muted">
                                  <div className="grid grid-cols-2 gap-4 mb-3">
                                    <div>
                                      <h5 className="text-xs font-medium mb-1">Input:</h5>
                                      <pre className="font-mono text-xs p-2 bg-card rounded-md">{result.input}</pre>
                                    </div>
                                    <div>
                                      <h5 className="text-xs font-medium mb-1">Expected Output:</h5>
                                      <pre className="font-mono text-xs p-2 bg-card rounded-md">{result.expectedOutput}</pre>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <h5 className="text-xs font-medium mb-1">Actual Output:</h5>
                                    <pre className="font-mono text-xs p-2 bg-card rounded-md">{result.actualOutput}</pre>
                                  </div>
                                  
                                  {!result.passed && result.error && (
                                    <div className="mt-3">
                                      <h5 className="text-xs font-medium mb-1">Error:</h5>
                                      <pre className="font-mono text-xs p-2 bg-card text-error-700 dark:text-error-500 rounded-md">{result.error}</pre>
                                    </div>
                                  )}
                                  
                                  <div className="mt-3 text-xs text-foreground/70">
                                    Execution time: {result.executionTime ? `${result.executionTime.toFixed(2)}ms` : 'N/A'}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    },
                    {
                      id: 'metrics',
                      label: 'Metrics',
                      content: (
                        <div>
                          <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <div>
                                <h4 className="text-sm font-medium mb-2">Performance Metrics</h4>
                                <Card className="bg-card-muted">
                                  <div className="space-y-3">
                                    <div>
                                      <p className="text-xs text-foreground/70 mb-1">Execution Time</p>
                                      <div className="flex items-center">
                                        <div className="flex-1 h-2 bg-card rounded-full overflow-hidden">
                                          <div 
                                            className="h-full bg-primary-600" 
                                            style={{ width: `${Math.min(100, (selectedIndividual.metadata.executionTime || 0) / 2)}%` }}
                                          />
                                        </div>
                                        <span className="ml-2 text-sm font-mono">{selectedIndividual.metadata.executionTime?.toFixed(2)}ms</span>
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <p className="text-xs text-foreground/70 mb-1">Code Size</p>
                                      <div className="flex items-center">
                                        <div className="flex-1 h-2 bg-card rounded-full overflow-hidden">
                                          <div 
                                            className="h-full bg-secondary-600" 
                                            style={{ width: `${Math.min(100, (selectedIndividual.metadata.codeSize || 0) / 5)}%` }}
                                          />
                                        </div>
                                        <span className="ml-2 text-sm font-mono">{selectedIndividual.metadata.codeSize} bytes</span>
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <p className="text-xs text-foreground/70 mb-1">Complexity</p>
                                      <div className="flex items-center">
                                        <div className="flex-1 h-2 bg-card rounded-full overflow-hidden">
                                          <div 
                                            className="h-full bg-accent-600" 
                                            style={{ width: `${(selectedIndividual.metadata.complexity || 0) * 100}%` }}
                                          />
                                        </div>
                                        <span className="ml-2 text-sm font-mono">{selectedIndividual.metadata.complexity?.toFixed(2)}</span>
                                      </div>
                                    </div>
                                  </div>
                                </Card>
                              </div>
                              
                              <div>
                                <h4 className="text-sm font-medium mb-2">Evolution History</h4>
                                <Card className="bg-card-muted">
                                  <div className="space-y-3">
                                    <div>
                                      <p className="text-xs text-foreground/70 mb-1">Created</p>
                                      <p className="text-sm">{new Date(selectedIndividual.createdAt).toLocaleString()}</p>
                                    </div>
                                    
                                    <div>
                                      <p className="text-xs text-foreground/70 mb-1">Ancestry</p>
                                      {selectedIndividual.parentIds.length > 0 ? (
                                        <div className="space-y-1">
                                          {selectedIndividual.parentIds.map((parentId, i) => (
                                            <p key={i} className="text-sm flex items-center">
                                              <ArrowRight size={12} className="mr-1 text-primary-600" />
                                              Parent #{parentId.split('-')[1]}
                                            </p>
                                          ))}
                                        </div>
                                      ) : (
                                        <p className="text-sm">Initial population (no parents)</p>
                                      )}
                                    </div>
                                  </div>
                                </Card>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="text-sm font-medium mb-2">Fitness Analysis</h4>
                              <Card className="bg-card-muted">
                                <div className="flex flex-col items-center justify-center h-full py-6">
                                  <div className="relative mb-4">
                                    <svg className="w-32 h-32" viewBox="0 0 100 100">
                                      <circle
                                        className="text-card-muted stroke-current"
                                        strokeWidth="10"
                                        cx="50"
                                        cy="50"
                                        r="40"
                                        fill="none"
                                      />
                                      <circle
                                        className="text-primary-600 progress-ring stroke-current"
                                        strokeWidth="10"
                                        strokeLinecap="round"
                                        cx="50"
                                        cy="50"
                                        r="40"
                                        fill="none"
                                        strokeDasharray={`${250.5 * selectedIndividual.fitness} 251.5`}
                                        strokeDashoffset="0"
                                        transform="rotate(-90 50 50)"
                                      />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <div className="text-center">
                                        <span className="text-3xl font-bold">
                                          {(selectedIndividual.fitness * 100).toFixed(0)}%
                                        </span>
                                        <p className="text-xs text-foreground/70">Fitness</p>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="text-center">
                                    <h5 className="font-medium mb-1">Overall Rating</h5>
                                    <p className="text-sm">
                                      {selectedIndividual.fitness === 1
                                        ? 'Perfect Solution'
                                        : selectedIndividual.fitness >= 0.9
                                          ? 'Excellent'
                                          : selectedIndividual.fitness >= 0.7
                                            ? 'Good'
                                            : selectedIndividual.fitness >= 0.5
                                              ? 'Average'
                                              : 'Needs Improvement'}
                                    </p>
                                  </div>
                                </div>
                              </Card>
                            </div>
                          </div>
                        </div>
                      )
                    }
                  ]}
                />
              ) : (
                <div className="text-center py-12 text-foreground/70">
                  <p>Select an individual to view details</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default EvolutionLab;