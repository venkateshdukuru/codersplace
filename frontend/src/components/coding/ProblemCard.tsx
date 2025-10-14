// path: frontend/src/components/coding/ProblemCard.tsx

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, Play, ChevronRight, Trophy, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProblemCardProps {
  problem: {
    id: number;
    title: string;
    difficulty: string;
    topic: string;
    description: string;
    time: string;
    solved: number;
  };
}

export const ProblemCard = ({ problem }: ProblemCardProps) => {
  const navigate = useNavigate();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "border-green-500 bg-green-500/10 text-green-600";
      case "medium": return "border-yellow-500 bg-yellow-500/10 text-yellow-600";
      case "hard": return "border-red-500 bg-red-500/10 text-red-600";
      default: return "";
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className={`h-1 bg-gradient-to-r ${
        problem.difficulty === 'easy' ? 'from-green-400 to-green-600' :
        problem.difficulty === 'medium' ? 'from-yellow-400 to-yellow-600' :
        'from-red-400 to-red-600'
      }`} />
      
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
              <Target className="w-5 h-5 text-muted-foreground" />
              <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                {problem.title}
              </h3>
            </div>
            
            <p className="text-muted-foreground line-clamp-2">
              {problem.description}
            </p>
            
            <div className="flex items-center gap-4">
              <Badge className={getDifficultyColor(problem.difficulty)}>
                {problem.difficulty}
              </Badge>
              <Badge variant="secondary">{problem.topic}</Badge>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{problem.time}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{problem.solved} solved</span>
              </div>
              <div className="flex items-center gap-1">
                <Trophy className="w-4 h-4" />
                <span>67.8% success</span>
              </div>
            </div>
          </div>
          
          <Button 
            variant="gradient"
            className="group-hover:scale-105 transition-transform"
            onClick={() => navigate(`/coding/problem/${problem.id}`)}
          >
            Solve
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};