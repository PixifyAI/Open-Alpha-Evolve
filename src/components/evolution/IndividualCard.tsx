import React from 'react';
import { motion } from 'framer-motion';
import { FileCode, Zap, Check, X, Clock, GitBranch } from 'lucide-react';
import { Individual } from '../../types/evolution';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface IndividualCardProps {
  individual: Individual;
  isSelected?: boolean;
  onClick?: () => void;
}

export const IndividualCard: React.FC<IndividualCardProps> = ({
  individual,
  isSelected = false,
  onClick
}) => {
  // Calculate test pass rate
  const passedTests = individual.testResults.filter(test => test.passed).length;
  const totalTests = individual.testResults.length;
  const passRate = totalTests > 0 ? passedTests / totalTests : 0;
  
  // Format creation date
  const formattedDate = new Date(individual.createdAt).toLocaleTimeString();
  
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <Card 
        variant="interactive" 
        className={`h-full flex flex-col border-l-4 ${
          isSelected 
            ? 'border-l-primary-600 bg-primary-50/30 dark:bg-primary-900/10' 
            : individual.fitness === 1 
              ? 'border-l-success-500' 
              : 'border-l-border'
        }`}
        onClick={onClick}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-md">
            <FileCode size={20} className="text-primary-700 dark:text-primary-400" />
          </div>
          <Badge 
            variant={individual.fitness === 1 ? 'success' : individual.fitness > 0.7 ? 'primary' : 'warning'}
          >
            <div className="flex items-center">
              <Zap size={12} className="mr-1" />
              Fitness: {individual.fitness.toFixed(2)}
            </div>
          </Badge>
        </div>
        
        <h3 className="text-base font-semibold mb-1">Individual #{individual.id.split('-')[1]}</h3>
        <p className="text-xs text-foreground/70 mb-3">
          Generation {individual.generation}
        </p>
        
        <div className="space-y-2 mb-4 flex-grow">
          <div>
            <p className="text-xs font-medium mb-1">Test Results:</p>
            <div className="flex items-center">
              <div className="flex-1 h-3 bg-card-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary-500 to-success-500"
                  style={{ width: `${passRate * 100}%` }}
                />
              </div>
              <span className="ml-2 text-xs">
                <Check size={12} className="inline text-success-500 mr-1" />
                {passedTests}/{totalTests}
              </span>
            </div>
          </div>
          
          <div className="text-xs">
            <span className="font-medium">Execution time:</span>{' '}
            {individual.metadata.executionTime?.toFixed(2)}ms
          </div>
          
          <div className="text-xs">
            <span className="font-medium">Code size:</span>{' '}
            {individual.metadata.codeSize} bytes
          </div>
        </div>
        
        <div className="flex justify-between text-xs text-foreground/60 pt-2 border-t border-border">
          <div className="flex items-center">
            <Clock size={12} className="mr-1" />
            {formattedDate}
          </div>
          <div className="flex items-center">
            <GitBranch size={12} className="mr-1" />
            {individual.parentIds.length > 0 
              ? `${individual.parentIds.length} parent${individual.parentIds.length > 1 ? 's' : ''}` 
              : 'Initial'}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};