'use client';

import { TrendingUp, Award, Target } from 'lucide-react';

interface ScoreCardProps {
  title: string;
  score: number;
  icon?: 'trending' | 'award' | 'target';
  color?: 'primary' | 'secondary' | 'accent';
}

export default function ScoreCard({ title, score, icon = 'target', color = 'primary' }: ScoreCardProps) {
  const getIcon = () => {
    switch (icon) {
      case 'trending':
        return <TrendingUp className="h-8 w-8" />;
      case 'award':
        return <Award className="h-8 w-8" />;
      case 'target':
      default:
        return <Target className="h-8 w-8" />;
    }
  };

  const getColorClasses = () => {
    switch (color) {
      case 'secondary':
        return 'text-secondary border-secondary/30';
      case 'accent':
        return 'text-accent border-accent/30';
      case 'primary':
      default:
        return 'text-primary border-primary/30';
    }
  };

  const getGradientColor = () => {
    switch (color) {
      case 'secondary':
        return 'from-secondary to-pink-600';
      case 'accent':
        return 'from-accent to-purple-600';
      case 'primary':
      default:
        return 'from-primary to-indigo-600';
    }
  };

  return (
    <div className="glass-strong rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 group">
      <div className="flex items-center justify-between mb-4">
        <div className={`${getColorClasses()}`}>
          {getIcon()}
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-white">{score}%</div>
        </div>
      </div>
      
      <h3 className="text-gray-400 text-sm font-semibold mb-3">{title}</h3>
      
      {/* Progress bar */}
      <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${getGradientColor()} transition-all duration-1000 ease-out`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
