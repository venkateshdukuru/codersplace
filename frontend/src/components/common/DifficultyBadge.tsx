// frontend/src/components/common/DifficultyBadge.tsx

import React from 'react';
import { Badge } from '@/components/ui/badge';

interface DifficultyBadgeProps {
  difficulty: 'easy' | 'medium' | 'hard';
}

export const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({ difficulty }) => {
  const getVariant = () => {
    switch (difficulty) {
      case 'easy':
        return 'default';
      case 'medium':
        return 'secondary';
      case 'hard':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getColorClass = () => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return '';
    }
  };

  return (
    <Badge variant={getVariant()} className={getColorClass()}>
      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
    </Badge>
  );
};