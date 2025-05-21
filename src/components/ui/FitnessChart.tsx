import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  TooltipProps,
  Brush
} from 'recharts';
import { EvolutionMetrics } from '../../types/evolution';

interface FitnessChartProps {
  data: EvolutionMetrics[];
  height?: number;
  className?: string;
}

// Custom tooltip component
const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border shadow-md p-3 rounded-md">
        <p className="font-medium text-sm mb-1">Generation {label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="text-xs">
            {entry.name}: {entry.value?.toFixed(3)}
          </p>
        ))}
      </div>
    );
  }

  return null;
};

export const FitnessChart: React.FC<FitnessChartProps> = ({
  data,
  height = 300,
  className = ''
}) => {
  return (
    <div className={`w-full ${className}`} style={{ height: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis 
            dataKey="generation" 
            label={{ value: 'Generation', position: 'insideBottomRight', offset: -10 }}
            stroke="var(--color-foreground)"
          />
          <YAxis 
            domain={[0, 1]} 
            label={{ value: 'Fitness', angle: -90, position: 'insideLeft' }}
            stroke="var(--color-foreground)"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="bestFitness" 
            name="Best Fitness" 
            stroke="var(--color-primary-500)" 
            activeDot={{ r: 8 }}
            strokeWidth={2}
          />
          <Line 
            type="monotone" 
            dataKey="averageFitness" 
            name="Average Fitness" 
            stroke="var(--color-secondary-500)"
            strokeWidth={2}
          />
          <Line 
            type="monotone" 
            dataKey="diversityIndex" 
            name="Diversity" 
            stroke="var(--color-accent-500)"
            strokeWidth={2}
          />
          {data.length > 10 && (
            <Brush 
              dataKey="generation" 
              height={30} 
              stroke="var(--color-primary-300)"
              fill="var(--color-card)"
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};