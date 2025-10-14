// path : frontend/src/components/coding/SolutionsViewer.tsx
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Code, Calendar, Clock, Cpu, Database, CheckCircle, XCircle, BarChart3, TrendingUp, Award, Zap, Filter } from "lucide-react";

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

interface ProblemStats {
  [key: number]: {
    attempts: number;
    solved: boolean;
    bestTime: string | null;
    languages: string[];
  };
}

export const SolutionsViewer = ({ isOpen, onOpenChange }: SolutionsViewerProps) => {
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [problemStats, setProblemStats] = useState<ProblemStats>({});
  const [selectedSolution, setSelectedSolution] = useState<Solution | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'accepted' | 'failed'>('all');

  useEffect(() => {
    if (isOpen) {
      const savedSolutions = JSON.parse(localStorage.getItem('codingSolutions') || '[]');
      const stats = JSON.parse(localStorage.getItem('problemStats') || '{}');
      setSolutions(savedSolutions);
      setProblemStats(stats);
      if (savedSolutions.length > 0) {
        setSelectedSolution(savedSolutions[0]);
      }
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "text-green-600";
      case "medium": return "text-yellow-600";
      case "hard": return "text-red-600";
      default: return "text-gray-600";
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
    const easyCount = solutions.filter(s => s.difficulty === 'easy' && s.passed).length;
    const mediumCount = solutions.filter(s => s.difficulty === 'medium' && s.passed).length;
    const hardCount = solutions.filter(s => s.difficulty === 'hard' && s.passed).length;
    
    return {
      totalSolutions,
      passedSolutions,
      uniqueProblems,
      languagesUsed,
      successRate: totalSolutions > 0 ? Math.round((passedSolutions / totalSolutions) * 100) : 0,
      easyCount,
      mediumCount,
      hardCount
    };
  };

  const filteredSolutions = solutions.filter(solution => {
    if (filterStatus === 'accepted') return solution.passed;
    if (filterStatus === 'failed') return !solution.passed;
    return true;
  });

  const stats = getStats();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[98vw] max-h-[95vh] w-full h-full overflow-hidden flex flex-col p-3 sm:p-4 md:p-6">
        <DialogHeader className="space-y-2 pb-3 border-b">
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Code className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            My Submissions
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Track your coding journey • View all submissions and performance metrics
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="submissions" className="flex-1 flex flex-col min-h-0 mt-3 sm:mt-4">
          <TabsList className="grid w-full grid-cols-2 h-9 sm:h-10">
            <TabsTrigger value="submissions" className="text-xs sm:text-sm">
              Submissions ({solutions.length})
            </TabsTrigger>
            <TabsTrigger value="progress" className="text-xs sm:text-sm">
              Progress
            </TabsTrigger>
          </TabsList>

          {/* Submissions Tab */}
          <TabsContent value="submissions" className="flex-1 flex flex-col lg:flex-row gap-3 sm:gap-4 min-h-0 mt-3 sm:mt-4">
            {/* Submissions List - Responsive */}
            <div className="w-full lg:w-2/5 flex flex-col min-h-0">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <h3 className="font-semibold text-sm sm:text-base flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  Recent Submissions
                </h3>
                <div className="flex items-center gap-1 sm:gap-2">
                  <Button
                    variant={filterStatus === 'all' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setFilterStatus('all')}
                    className="h-7 sm:h-8 text-xs px-2 sm:px-3"
                  >
                    All
                  </Button>
                  <Button
                    variant={filterStatus === 'accepted' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setFilterStatus('accepted')}
                    className="h-7 sm:h-8 text-xs px-2 sm:px-3"
                  >
                    Accepted
                  </Button>
                  <Button
                    variant={filterStatus === 'failed' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setFilterStatus('failed')}
                    className="h-7 sm:h-8 text-xs px-2 sm:px-3"
                  >
                    Failed
                  </Button>
                </div>
              </div>
              
              <ScrollArea className="flex-1 pr-2">
                <div className="space-y-2">
                  {filteredSolutions.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8 sm:py-12">
                      <Code className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm sm:text-base font-medium">No submissions yet</p>
                      <p className="text-xs sm:text-sm mt-2">Start solving problems to track your progress!</p>
                    </div>
                  ) : (
                    filteredSolutions.map((solution) => (
                      <Card 
                        key={solution.id} 
                        className={`cursor-pointer transition-all hover:shadow-md hover:border-primary/50 ${
                          selectedSolution?.id === solution.id ? 'ring-2 ring-primary shadow-md' : ''
                        }`}
                        onClick={() => setSelectedSolution(solution)}
                      >
                        <CardContent className="p-3 sm:p-4">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <h4 className="font-medium text-sm sm:text-base truncate max-w-[200px] sm:max-w-none">
                                  {solution.title}
                                </h4>
                                <Badge 
                                  variant={getDifficultyVariant(solution.difficulty) as 'easy' | 'medium' | 'hard' | 'default'} 
                                  className="text-xs shrink-0"
                                >
                                  {solution.difficulty}
                                </Badge>
                              </div>
                              
                              <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                                <span className="flex items-center gap-1">
                                  <span className="text-sm">{getLanguageIcon(solution.language)}</span>
                                  <span className="capitalize">{solution.language}</span>
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {new Date(solution.timestamp).toLocaleDateString()}
                                </span>
                              </div>
                              
                              <div className="mt-2 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  {solution.passed ? (
                                    <Badge variant="default" className="text-xs bg-green-500/10 text-green-700 border-green-500/20">
                                      <CheckCircle className="w-3 h-3 mr-1" />
                                      Accepted
                                    </Badge>
                                  ) : (
                                    <Badge variant="destructive" className="text-xs bg-red-500/10 text-red-700 border-red-500/20">
                                      <XCircle className="w-3 h-3 mr-1" />
                                      Failed
                                    </Badge>
                                  )}
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {solution.testsPassed}/{solution.totalTests} passed
                                </span>
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

            {/* Solution Details - Responsive */}
            <div className="w-full lg:w-3/5 flex flex-col min-h-0">
              {selectedSolution ? (
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-2 sm:mb-3 flex-wrap gap-2">
                    <h3 className="font-semibold text-sm sm:text-base">Submission Details</h3>
                    <Badge 
                      variant={selectedSolution.passed ? "default" : "destructive"}
                      className="text-xs sm:text-sm"
                    >
                      {selectedSolution.status}
                    </Badge>
                  </div>
                  
                  <Card className="flex-1 flex flex-col overflow-hidden">
                    <CardHeader className="pb-3 space-y-2">
                      <CardTitle className="text-base sm:text-lg line-clamp-2">{selectedSolution.title}</CardTitle>
                      <CardDescription className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs">
                        <Badge variant={getDifficultyVariant(selectedSolution.difficulty) as 'easy' | 'medium' | 'hard' | 'default'}>
                          {selectedSolution.difficulty}
                        </Badge>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(selectedSolution.timestamp).toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <span>{getLanguageIcon(selectedSolution.language)}</span>
                          <span className="capitalize">{selectedSolution.language}</span>
                        </span>
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="flex-1 flex flex-col space-y-3 sm:space-y-4 overflow-hidden">
                      {/* Performance Metrics */}
                      <div className="grid grid-cols-2 gap-2 sm:gap-3">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 p-3 sm:p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                          <div className="flex items-center gap-2 mb-1">
                            <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400" />
                            <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">Runtime</div>
                          </div>
                          <div className="font-bold text-sm sm:text-base text-blue-900 dark:text-blue-100">{selectedSolution.runtime}</div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 p-3 sm:p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                          <div className="flex items-center gap-2 mb-1">
                            <Database className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600 dark:text-purple-400" />
                            <div className="text-xs text-purple-600 dark:text-purple-400 font-medium">Memory</div>
                          </div>
                          <div className="font-bold text-sm sm:text-base text-purple-900 dark:text-purple-100">{selectedSolution.memory}</div>
                        </div>
                      </div>

                      {/* Test Results */}
                      <div className={`p-3 sm:p-4 rounded-lg border-2 ${
                        selectedSolution.passed 
                          ? 'bg-green-50 dark:bg-green-950 border-green-500' 
                          : 'bg-red-50 dark:bg-red-950 border-red-500'
                      }`}>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium flex items-center gap-2">
                            {selectedSolution.passed ? (
                              <>
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span className="text-green-900 dark:text-green-100">All Tests Passed</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-4 h-4 text-red-600" />
                                <span className="text-red-900 dark:text-red-100">Some Tests Failed</span>
                              </>
                            )}
                          </span>
                          <span className={`text-sm font-bold ${
                            selectedSolution.passed ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
                          }`}>
                            {selectedSolution.testsPassed}/{selectedSolution.totalTests}
                          </span>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all ${
                              selectedSolution.passed ? 'bg-green-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${(selectedSolution.testsPassed / selectedSolution.totalTests) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Code Section */}
                      <div className="flex-1 flex flex-col min-h-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Code className="w-4 h-4 text-primary" />
                          <span className="text-sm font-semibold">Your Code</span>
                        </div>
                        <ScrollArea className="flex-1 bg-muted/30 p-3 sm:p-4 rounded-lg border border-border">
                          <pre className="text-xs sm:text-sm font-mono whitespace-pre-wrap break-words">
                            <code>{selectedSolution.code}</code>
                          </pre>
                        </ScrollArea>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Code className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 opacity-50" />
                    <p className="text-sm sm:text-base font-medium">Select a submission to view details</p>
                    <p className="text-xs sm:text-sm mt-2">Choose from the list on the left</p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Progress Tab - LeetCode Style */}
          <TabsContent value="progress" className="flex-1 mt-3 sm:mt-4">
            <ScrollArea className="h-full pr-2">
              <div className="space-y-4 sm:space-y-6">
                {/* Hero Stats */}
                <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 sm:p-3 bg-primary/10 rounded-lg">
                        <Award className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold">Coding Statistics</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">Your problem-solving journey</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                      <div className="text-center p-3 sm:p-4 bg-background/50 rounded-lg">
                        <div className="text-2xl sm:text-3xl font-bold text-primary">{stats.totalSolutions}</div>
                        <div className="text-xs sm:text-sm text-muted-foreground mt-1">Total Submissions</div>
                      </div>
                      <div className="text-center p-3 sm:p-4 bg-background/50 rounded-lg">
                        <div className="text-2xl sm:text-3xl font-bold text-green-600">{stats.passedSolutions}</div>
                        <div className="text-xs sm:text-sm text-muted-foreground mt-1">Accepted</div>
                      </div>
                      <div className="text-center p-3 sm:p-4 bg-background/50 rounded-lg">
                        <div className="text-2xl sm:text-3xl font-bold text-blue-600">{stats.uniqueProblems}</div>
                        <div className="text-xs sm:text-sm text-muted-foreground mt-1">Problems Solved</div>
                      </div>
                      <div className="text-center p-3 sm:p-4 bg-background/50 rounded-lg">
                        <div className="text-2xl sm:text-3xl font-bold text-purple-600">{stats.successRate}%</div>
                        <div className="text-xs sm:text-sm text-muted-foreground mt-1">Success Rate</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Problems Solved by Difficulty - LeetCode Style */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                      Problems Solved
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 sm:space-y-4">
                      {/* Easy */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-green-600">Easy</span>
                          <span className="text-xs sm:text-sm font-bold text-green-700">{stats.easyCount}</span>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500 transition-all"
                            style={{ width: `${stats.totalSolutions > 0 ? (stats.easyCount / stats.totalSolutions) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                      
                      {/* Medium */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-yellow-600">Medium</span>
                          <span className="text-xs sm:text-sm font-bold text-yellow-700">{stats.mediumCount}</span>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-yellow-500 transition-all"
                            style={{ width: `${stats.totalSolutions > 0 ? (stats.mediumCount / stats.totalSolutions) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                      
                      {/* Hard */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-red-600">Hard</span>
                          <span className="text-xs sm:text-sm font-bold text-red-700">{stats.hardCount}</span>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-red-500 transition-all"
                            style={{ width: `${stats.totalSolutions > 0 ? (stats.hardCount / stats.totalSolutions) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Languages Used */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                      <Code className="w-4 h-4 sm:w-5 sm:h-5" />
                      Languages Used
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                      {Array.from(new Set(solutions.map(s => s.language))).map(language => {
                        const count = solutions.filter(s => s.language === language).length;
                        const percentage = Math.round((count / solutions.length) * 100);
                        return (
                          <div key={language} className="p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-lg">{getLanguageIcon(language)}</span>
                              <span className="text-xs sm:text-sm font-medium capitalize truncate">{language}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">{count} submissions</span>
                              <Badge variant="outline" className="text-xs">{percentage}%</Badge>
                            </div>
                          </div>
                        );
                      })}
                      {solutions.length === 0 && (
                        <div className="col-span-full text-center text-sm text-muted-foreground py-4">
                          No languages used yet
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {solutions.slice(0, 5).map((solution, index) => (
                        <div key={solution.id} className="flex items-center justify-between p-2 sm:p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                            <div className="text-xs font-mono text-muted-foreground w-6 text-center">#{index + 1}</div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs sm:text-sm font-medium truncate">{solution.title}</div>
                              <div className="text-xs text-muted-foreground">{new Date(solution.timestamp).toLocaleDateString()}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <Badge variant={getDifficultyVariant(solution.difficulty) as 'easy' | 'medium' | 'hard' | 'default'} className="text-xs">
                              {solution.difficulty[0].toUpperCase()}
                            </Badge>
                            {solution.passed ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-500" />
                            )}
                          </div>
                        </div>
                      ))}
                      {solutions.length === 0 && (
                        <div className="text-center text-sm text-muted-foreground py-4">
                          No recent activity
                        </div>
                      )}
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