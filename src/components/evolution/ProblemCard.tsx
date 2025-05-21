import React from 'react';
import { Code, Star, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Problem } from '../../types/evolution';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface ProblemCardProps {
  problem: Problem;
  onClick?: () => void;
}

export const ProblemCard: React.FC<ProblemCardProps> = ({
  problem,
  onClick
}) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/lab/${problem.id}`);
    }
  };
  
  // Map difficulty to badge variant
  const difficultyVariant: Record<string, 'primary' | 'secondary' | 'warning' | 'error'> = {
    easy: 'primary',
    medium: 'secondary',
    hard: 'warning',
    expert: 'error'
  };
  
  // Format creation date
  const formattedDate = new Date(problem.createdAt).toLocaleDateString();
  
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <Card 
        variant="interactive" 
        className="h-full flex flex-col"
        onClick={handleClick}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-md">
            <Code size={20} className="text-primary-700 dark:text-primary-400" />
          </div>
          <Badge 
            variant={difficultyVariant[problem.difficulty] || 'primary'}
            size="sm"
          >
            {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
          </Badge>
        </div>
        
        <h3 className="text-lg font-semibold mb-2">{problem.title}</h3>
        
        <p className="text-sm text-foreground/70 mb-4 flex-grow line-clamp-3">
          {problem.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {problem.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="secondary" size="sm">
              {tag}
            </Badge>
          ))}
          {problem.tags.length > 3 && (
            <Badge variant="secondary" size="sm">
              +{problem.tags.length - 3}
            </Badge>
          )}
        </div>
        
        <div className="flex justify-between text-xs text-foreground/60">
          <div className="flex items-center">
            <Clock size={12} className="mr-1" />
            {formattedDate}
          </div>
          <div className="flex items-center">
            <Star size={12} className="mr-1" />
            {problem.testCases.length} test cases
          </div>
        </div>
      </Card>
    </motion.div>
  );
};