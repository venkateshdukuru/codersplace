import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Code, Calendar, Clock, Cpu, Database, CheckCircle, XCircle, BarChart3 } from "lucide-react";

interface SolutionsViewerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Solution {
  id: string;
  problemId: number;
  title: string;
  difficulty: string;
  topic: string;
  language: string;
  code: string;
  timestamp: string;
  testsPassed: number;
  totalTests: number;
  passed: boolean;
  runtime: string;
  memory: string;
  status: string;
}

export const SolutionsViewer = ({ isOpen, onOpenChange }: SolutionsViewerProps) => {
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [problemStats, setProblemStats] = useState<any>({});
  const [selectedSolution, setSelectedSolution] = useState<Solution | null>(null);

  useEffect(() => {
    if (isOpen) {
      const savedSolutions = JSON.parse(localStorage.getItem('codingSolutions') || '[]');
      const stats = JSON.parse(localStorage.getItem('problemStats') || '{}');
      setSolutions(savedSolutions);
      setProblemStats(stats);
    }
  }, [isOpen]);

  const getDifficultyVariant = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "easy";
      case "medium": return "medium";
      case "hard": return "hard";
      default: return "default";
    }
  };

  const getLanguageIcon = (language: string) => {
    switch (language) {
      case 'javascript': return '🟨';
      case 'python': return '🐍';
      case 'java': return '☕';
      case 'cpp': return '⚡';
      case 'c': return '🔧';
      case 'sql': return '🗃️';
      default: return '💻';
    }
  };

  const getStats = () => {
    const totalSolutions = solutions.length;
    const passedSolutions = solutions.filter(s => s.passed).length;
    const uniqueProblems = new Set(solutions.filter(s => s.passed).map(s => s.problemId)).size;
    const languagesUsed = new Set(solutions.map(s => s.language)).size;
    
    return {
      totalSolutions,
      passedSolutions,
      uniqueProblems,
      languagesUsed,
      successRate: totalSolutions > 0 ? Math.round((passedSolutions / totalSolutions) * 100) : 0
    };
  };

  const stats = getStats();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] w-full h-full overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Code className="w-5 h-5" />
            My Coding Solutions
          </DialogTitle>
          <DialogDescription>
            View all your submitted solutions and coding statistics
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="solutions" className="flex-1 flex flex-col min-h-0">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="solutions">Solutions ({solutions.length})</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="solutions" className="flex-1 flex gap-4 min-h-0">
            {/* Solutions List */}
            <div className="w-1/2 flex flex-col">
              <h3 className="font-medium mb-3">Recent Submissions</h3>
              <ScrollArea className="flex-1">
                <div className="space-y-2 pr-2">
                  {solutions.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <Code className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No solutions submitted yet</p>
                      <p className="text-sm">Start solving problems to see your solutions here!</p>
                    </div>
                  ) : (
                    solutions.map((solution) => (
                      <Card 
                        key={solution.id} 
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedSolution?.id === solution.id ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => setSelectedSolution(solution)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm">{getLanguageIcon(solution.language)}</span>
                                <h4 className="font-medium text-sm truncate">{solution.title}</h4>
                                <Badge variant={getDifficultyVariant(solution.difficulty) as any} className="text-xs">
                                  {solution.difficulty}
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>{new Date(solution.timestamp).toLocaleDateString()}</span>
                                <div className="flex items-center gap-1">
                                  {solution.passed ? (
                                    <CheckCircle className="w-3 h-3 text-green-500" />
                                  ) : (
                                    <XCircle className="w-3 h-3 text-red-500" />
                                  )}
                                  <span>{solution.testsPassed}/{solution.totalTests}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Solution Details */}
            <div className="w-1/2 flex flex-col">
              {selectedSolution ? (
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium">Solution Details</h3>
                    <Badge variant={selectedSolution.passed ? "default" : "destructive"}>
                      {selectedSolution.status}
                    </Badge>
                  </div>
                  
                  <Card className="flex-1 flex flex-col">
                    <CardHeader>
                      <CardTitle className="text-lg">{selectedSolution.title}</CardTitle>
                      <CardDescription className="flex items-center gap-4">
                        <Badge variant={getDifficultyVariant(selectedSolution.difficulty) as any}>
                          {selectedSolution.difficulty}
                        </Badge>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(selectedSolution.timestamp).toLocaleString()}
                        </span>
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="flex-1 flex flex-col space-y-4">
                      {/* Performance Metrics */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-muted/50 p-2 rounded text-center">
                          <div className="text-xs text-muted-foreground">Runtime</div>
                          <div className="font-medium text-sm">{selectedSolution.runtime}</div>
                        </div>
                        <div className="bg-muted/50 p-2 rounded text-center">
                          <div className="text-xs text-muted-foreground">Memory</div>
                          <div className="font-medium text-sm">{selectedSolution.memory}</div>
                        </div>
                      </div>

                      {/* Test Results */}
                      <div className="bg-muted/50 p-3 rounded">
                        <div className="flex items-center justify-between text-sm">
                          <span>Test Cases</span>
                          <span className="flex items-center gap-1">
                            {selectedSolution.passed ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-500" />
                            )}
                            {selectedSolution.testsPassed}/{selectedSolution.totalTests} Passed
                          </span>
                        </div>
                      </div>

                      {/* Code */}
                      <div className="flex-1 flex flex-col">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium">Code</span>
                          <span className="text-xs text-muted-foreground">
                            {getLanguageIcon(selectedSolution.language)} {selectedSolution.language}
                          </span>
                        </div>
                        <ScrollArea className="flex-1 bg-muted/30 p-3 rounded border">
                          <pre className="text-sm font-mono whitespace-pre-wrap">
                            {selectedSolution.code}
                          </pre>
                        </ScrollArea>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Code className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Select a solution to view details</p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="statistics" className="flex-1">
            <ScrollArea className="h-full">
              <div className="space-y-6">
                {/* Overview Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Code className="w-8 h-8 mx-auto mb-2 text-primary" />
                      <div className="text-2xl font-bold">{stats.totalSolutions}</div>
                      <div className="text-sm text-muted-foreground">Total Submissions</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 text-center">
                      <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
                      <div className="text-2xl font-bold">{stats.passedSolutions}</div>
                      <div className="text-sm text-muted-foreground">Accepted Solutions</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 text-center">
                      <BarChart3 className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                      <div className="text-2xl font-bold">{stats.uniqueProblems}</div>
                      <div className="text-sm text-muted-foreground">Problems Solved</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Database className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                      <div className="text-2xl font-bold">{stats.successRate}%</div>
                      <div className="text-sm text-muted-foreground">Success Rate</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Language Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle>Programming Languages Used</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {Array.from(new Set(solutions.map(s => s.language))).map(language => {
                        const count = solutions.filter(s => s.language === language).length;
                        return (
                          <div key={language} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                            <span className="flex items-center gap-2">
                              <span>{getLanguageIcon(language)}</span>
                              <span className="capitalize">{language}</span>
                            </span>
                            <Badge variant="outline">{count}</Badge>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Difficulty Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle>Problems by Difficulty</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      {['easy', 'medium', 'hard'].map(difficulty => {
                        const count = solutions.filter(s => s.difficulty === difficulty && s.passed).length;
                        return (
                          <div key={difficulty} className="text-center p-4 bg-muted/50 rounded">
                            <Badge variant={getDifficultyVariant(difficulty) as any} className="mb-2">
                              {difficulty}
                            </Badge>
                            <div className="text-2xl font-bold">{count}</div>
                            <div className="text-sm text-muted-foreground">Solved</div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};