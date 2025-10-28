// src/components/coding/ProblemList.tsx

import React from 'react';
import { Problem } from '../../types';
import { ProblemCard } from './ProblemCard';
import { Loader, EmptyState } from '../common/LoadingSkeleton';

interface ProblemListProps {
  problems: Problem[];
  loading: boolean;
  onProblemClick: (problem: Problem) => void;
}

export const ProblemList: React.FC<ProblemListProps> = ({
  problems,
  loading,
  onProblemClick,
}) => {
  if (loading) {
    return <Loader />;
  }

  if (problems.length === 0) {
    return <EmptyState message="No problems found" />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {problems.map((problem) => (
        <ProblemCard
          key={problem._id}
          problem={problem}
          onClick={() => onProblemClick(problem)}
        />
      ))}
    </div>
  );
};