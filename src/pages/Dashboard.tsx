import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Award, 
  Cpu, 
  Clock, 
  Database, 
  BarChart, 
  ArrowRight,
  LayoutGrid,
  Plus
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useEvolution } from '../context/EvolutionContext';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ProblemCard } from '../components/evolution/ProblemCard';
import { FitnessChart } from '../components/ui/FitnessChart';

// Animation variants for staggered children
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

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { problems, evolutionRuns } = useEvolution();
  
  // Get recent problems
  const recentProblems = [...problems]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);
  
  // Calculate some stats
  const totalProblems = problems.length;
  const totalRuns = evolutionRuns.length;
  const completedRuns = evolutionRuns.filter(run => run.status.status === 'completed').length;
  const successRate = completedRuns > 0 
    ? evolutionRuns.filter(run => run.status.bestFitness === 1.0).length / completedRuns 
    : 0;
  
  // Mock metrics data for the chart
  const mockMetricsData = Array.from({ length: 20 }, (_, i) => ({
    generation: i + 1,
    bestFitness: Math.min(1, 0.2 + i * 0.04 + Math.random() * 0.05),
    averageFitness: Math.min(1, 0.1 + i * 0.03 + Math.random() * 0.05),
    diversityIndex: Math.max(0.2, 1 - i * 0.04 + Math.random() * 0.05),
    totalIndividuals: 10 + i * 5,
    apiCallsMade: 5 + i * 3,
    timestamp: new Date()
  }));
  
  return (
    <>
      <Header 
        title="Dashboard"
        subtitle="Overview of your evolutionary coding experiments"
      />
      
      <motion.div 
        className="p-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <Card className="h-full">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground/70 mb-1">Total Problems</p>
                  <p className="text-3xl font-bold">{totalProblems}</p>
                </div>
                <div className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-md">
                  <Database size={20} className="text-primary-700 dark:text-primary-400" />
                </div>
              </div>
            </Card>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Card className="h-full">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground/70 mb-1">Evolution Runs</p>
                  <p className="text-3xl font-bold">{totalRuns}</p>
                </div>
                <div className="bg-secondary-100 dark:bg-secondary-900/30 p-3 rounded-md">
                  <Cpu size={20} className="text-secondary-700 dark:text-secondary-400" />
                </div>
              </div>
            </Card>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Card className="h-full">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground/70 mb-1">Success Rate</p>
                  <p className="text-3xl font-bold">{(successRate * 100).toFixed(1)}%</p>
                </div>
                <div className="bg-accent-100 dark:bg-accent-900/30 p-3 rounded-md">
                  <Award size={20} className="text-accent-700 dark:text-accent-400" />
                </div>
              </div>
            </Card>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Card className="h-full">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground/70 mb-1">Avg. Generations</p>
                  <p className="text-3xl font-bold">
                    {completedRuns > 0
                      ? Math.round(
                          evolutionRuns
                            .filter(run => run.status.status === 'completed')
                            .reduce((acc, run) => acc + run.status.currentGeneration, 0) / completedRuns
                        )
                      : 0}
                  </p>
                </div>
                <div className="bg-success-50 dark:bg-success-700/20 p-3 rounded-md">
                  <Clock size={20} className="text-success-700 dark:text-success-500" />
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
        
        <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8" variants={containerVariants}>
          <motion.div className="lg:col-span-2" variants={itemVariants}>
            <Card className="h-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <BarChart size={20} className="mr-2 text-primary-600" />
                  Recent Evolution Progress
                </h2>
              </div>
              <FitnessChart data={mockMetricsData} height={250} />
            </Card>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Card className="h-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Recent Activity</h2>
              </div>
              
              <div className="space-y-4">
                {evolutionRuns.slice(0, 4).map((run, index) => {
                  const problem = problems.find(p => p.id === run.problemId);
                  return (
                    <div key={index} className="flex items-start">
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center mr-3
                        ${run.status.status === 'completed' 
                          ? 'bg-success-50 text-success-700 dark:bg-success-700/20 dark:text-success-500' 
                          : run.status.status === 'running'
                            ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                            : 'bg-warning-50 text-warning-700 dark:bg-warning-700/20 dark:text-warning-500'
                        }
                      `}>
                        <Cpu size={16} />
                      </div>
                      <div>
                        <p className="font-medium">
                          {run.status.status === 'completed' ? 'Completed' : 'Started'} evolution for {problem?.title}
                        </p>
                        <p className="text-xs text-foreground/70">
                          {new Date(run.startedAt).toLocaleString()} • 
                          Best fitness: {run.status.bestFitness.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })}
                
                {evolutionRuns.length === 0 && (
                  <p className="text-foreground/70 text-sm italic">No evolution runs yet</p>
                )}
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-2 w-full"
                  rightIcon={<ArrowRight size={16} />}
                  onClick={() => navigate('/problems')}
                >
                  View All Activity
                </Button>
              </div>
            </Card>
          </motion.div>
        </motion.div>
        
        <motion.div variants={containerVariants}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <LayoutGrid size={20} className="mr-2 text-primary-600" />
              Recent Problems
            </h2>
            <Button 
              variant="outline" 
              size="sm"
              leftIcon={<Plus size={16} />}
              onClick={() => navigate('/problems')}
            >
              Create Problem
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentProblems.map((problem, index) => (
              <motion.div key={problem.id} variants={itemVariants}>
                <ProblemCard problem={problem} />
              </motion.div>
            ))}
            
            {recentProblems.length === 0 && (
              <motion.div variants={itemVariants} className="md:col-span-3">
                <Card className="text-center py-12">
                  <p className="text-foreground/70 mb-4">No problems created yet</p>
                  <Button 
                    variant="primary"
                    leftIcon={<Plus size={16} />}
                    onClick={() => navigate('/problems')}
                  >
                    Create Your First Problem
                  </Button>
                </Card>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default Dashboard;