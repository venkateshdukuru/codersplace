// src/components/coding/ProblemCard.tsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Users, CheckCircle2, Play, Trophy, Target } from 'lucide-react';
import { Problem } from '@/types';
import { DifficultyBadge } from '../common/DifficultyBadge';
import { CollegeBadge } from '../common/CollegeBadge';
import { cn } from '@/lib/utils';

interface ProblemCardProps {
  problem: Problem;
  onSolve: (problem: Problem) => void;
}

export const ProblemCard: React.FC<ProblemCardProps> = ({ problem, onSolve }) => {
  const isCompleted = problem.completedBy.length > 0;
  const isCollegeProblem = problem.source === 'your-college';

  return (
    <Card 
      className={cn(
        "group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated",
        isCompleted && "bg-gradient-to-br from-success-light/30 to-transparent border-success/20",
        isCollegeProblem && !isCompleted && "border-l-4 border-l-primary"
      )}
    >
      {/* Solved Badge */}
      {isCompleted && (
        <div className="absolute top-4 right-4 z-10">
          <div className="flex items-center gap-1.5 bg-success text-success-foreground px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm">
            <Trophy className="w-3.5 h-3.5" />
            Solved
          </div>
        </div>
      )}

      {/* College Priority Badge */}
      {isCollegeProblem && !isCompleted && (
        <div className="absolute top-4 right-4 z-10">
          <div className="flex items-center gap-1.5 bg-primary text-primary-foreground px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm animate-pulse-glow">
            <Target className="w-3.5 h-3.5" />
            Priority
          </div>
        </div>
      )}

      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1 space-y-3">
            {/* Title and Badges */}
            <div className="flex items-start gap-3 flex-wrap pr-24 md:pr-0">
              <h3 className={cn(
                "text-lg font-semibold text-foreground transition-colors",
                "group-hover:text-primary",
                isCompleted && "opacity-80"
              )}>
                {problem.title}
              </h3>
              <div className="flex items-center gap-2 flex-wrap">
                <DifficultyBadge difficulty={problem.difficulty} />
                {/* ✅ Pass collegeName prop to CollegeBadge */}
                <CollegeBadge 
                  source={problem.source} 
                  collegeName={problem.collegeName} 
                />
              </div>
            </div>
            
            {/* Description */}
            <p className={cn(
              "text-muted-foreground leading-relaxed line-clamp-2",
              isCompleted && "opacity-70"
            )}>
              {problem.description || 'No description available'}
            </p>
            
            {/* Meta Information */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 flex-shrink-0" />
                <span className="font-medium">{problem.completedBy.length}</span>
                <span className="hidden sm:inline">solved</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline">{new Date(problem.createdAt).toLocaleDateString()}</span>
                <span className="sm:hidden">{new Date(problem.createdAt).toLocaleDateString('en', { month: 'short', day: 'numeric' })}</span>
              </div>
              {isCompleted && (
                <div className="flex items-center gap-1.5 text-success">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span className="font-medium">Completed</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Action Button */}
          <div className="flex gap-2 md:self-center">
            <Button 
              onClick={() => onSolve(problem)}
              className={cn(
                "min-w-[120px] shadow-sm transition-all duration-300",
                isCompleted 
                  ? "bg-muted hover:bg-muted/80 text-foreground" 
                  : isCollegeProblem 
                    ? "bg-gradient-to-r from-primary to-accent hover:shadow-glow" 
                    : "hover:shadow-md"
              )}
            >
              <Play className="w-4 h-4 mr-2 flex-shrink-0" />
              {isCompleted ? 'Review' : 'Solve'}
            </Button>
          </div>
        </div>
      </CardContent>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/20 rounded-lg transition-colors pointer-events-none" />
    </Card>
  );
};