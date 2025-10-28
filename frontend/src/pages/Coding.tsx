import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Code, Target, Users, Lock, Search, Filter, X, BookOpen } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useProblem } from "@/context/ProblemContext";
import { ProblemCard } from "@/components/coding/ProblemCard";
import { ProblemCardSkeleton, StatsCardSkeleton, TopicCardSkeleton } from "@/components/common/LoadingSkeleton";
import { Problem } from "@/types";
import { cn } from "@/lib/utils";

const Coding = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { problems, loading, error, meta, fetchProblems } = useProblem();
  
  const [filters, setFilters] = useState({
    difficulty: 'all',
    type: 'all' as 'all' | 'public' | 'college',
    title: ''
  });

  const [selectedTopic, setSelectedTopic] = useState("all");
  const [hasActiveFilters, setHasActiveFilters] = useState(false);
  
  const topics = [
    "All Topics",
    "Arrays",
    "Linked Lists",
    "Trees",
    "Stack",
    "Dynamic Programming",
    "Graphs",
    "Heap",
    "Trie",
    "Backtracking",
    "Binary Search",
    "Two Pointers",
    "Sliding Window",
    "String Manipulation",
    "Math",
    "Bit Manipulation",
    "Greedy",
    "Union Find",
    "Intervals",
  ];

  useEffect(() => {
    if (isAuthenticated) {
      fetchProblems();
    }
  }, [isAuthenticated, fetchProblems]);

  useEffect(() => {
    const hasFilters = 
      filters.difficulty !== 'all' || 
      filters.type !== 'all' || 
      filters.title !== '' ||
      selectedTopic !== "all";
    setHasActiveFilters(hasFilters);
  }, [filters, selectedTopic]);

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    const apiFilters: any = {};
    if (newFilters.difficulty !== 'all') apiFilters.difficulty = newFilters.difficulty;
    if (newFilters.type !== 'all') apiFilters.type = newFilters.type;
    if (newFilters.title) apiFilters.title = newFilters.title;
    
    fetchProblems(apiFilters);
  };

  const handleSearch = () => {
    const apiFilters: any = {};
    if (filters.difficulty !== 'all') apiFilters.difficulty = filters.difficulty;
    if (filters.type !== 'all') apiFilters.type = filters.type;
    if (filters.title) apiFilters.title = filters.title;
    
    fetchProblems(apiFilters);
  };

  const handleClearFilters = () => {
    setFilters({ difficulty: 'all', type: 'all', title: '' });
    setSelectedTopic("all");
    fetchProblems();
  };

  const handleSolveProblem = (problem: Problem) => {
    navigate(`/coding/problem/${problem._id}`, { state: { problem } });
  };

  // if (!isAuthenticated) {
  //   return (
  //     <div className="container mx-auto px-4 py-16">
  //       <div className="max-w-md mx-auto">
  //         <Card className="shadow-elevated animate-scale-in">
  //           <CardContent className="p-8 text-center space-y-4">
  //             <div className="flex justify-center">
  //               <div className="p-4 bg-primary-light rounded-full">
  //                 <Lock className="w-12 h-12 text-primary" />
  //               </div>
  //             </div>
  //             <h2 className="text-2xl font-bold">Authentication Required</h2>
  //             <p className="text-muted-foreground">
  //               Please log in to access coding problems and submit solutions.
  //             </p>
  //             <Alert>
  //               <Lock className="w-4 h-4" />
  //               <AlertDescription>
  //                 Coding practice requires authentication to save your progress.
  //               </AlertDescription>
  //             </Alert>
  //           </CardContent>
  //         </Card>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-background py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {/* Header */}
       <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-center">
  <span className="inline-block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent pb-1">
    Data Structures & Algorithms
  </span>
</h1>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Master coding interviews with our comprehensive collection of DSA
            problems. Practice with problems from easy to advanced difficulty
            levels.
          </p>
        </div>

        {/* Stats Cards */}
        {loading && !meta ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
            {[1, 2, 3].map((i) => (
              <StatsCardSkeleton key={i} />
            ))}
          </div>
        ) : meta && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-slide-up">
            <Card className="hover-lift border-primary/20 hover:border-primary/40 transition-colors">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-2.5 bg-primary-light rounded-lg shrink-0">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-2xl font-bold text-foreground">{meta.total}</div>
                  <div className="text-sm text-muted-foreground font-medium">Total Problems</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover-lift border-primary/20 hover:border-primary/40 transition-colors">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-2.5 bg-college-bg rounded-lg shrink-0">
                  <Code className="w-6 h-6 text-college-text" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-2xl font-bold text-foreground">{meta.collegeSpecific}</div>
                  <div className="text-sm text-muted-foreground font-medium">College Problems</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover-lift border-accent/20 hover:border-accent/40 transition-colors">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-2.5 bg-public-bg rounded-lg shrink-0">
                  <Users className="w-6 h-6 text-public-text" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-2xl font-bold text-foreground">{meta.public}</div>
                  <div className="text-sm text-muted-foreground font-medium">Public Problems</div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Topics Grid */}
        <div className="space-y-3 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-foreground">Choose Your Topic</h2>
          </div>
          
          {loading && !problems.length ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {[...Array(12)].map((_, i) => (
                <TopicCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {topics.map((topic, index) => {
                const isSelected = selectedTopic === (index === 0 ? "all" : topic);
                return (
                  <Card
                    key={topic}
                    className={cn(
                      "cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-md h-16",
                      isSelected 
                        ? "ring-2 ring-primary shadow-glow bg-gradient-to-br from-primary-light to-transparent border-primary" 
                        : "hover:border-primary/30"
                    )}
                    onClick={() => setSelectedTopic(index === 0 ? "all" : topic)}
                  >
                    <CardContent className="flex items-center justify-center text-center p-3 h-full">
                      <div className={cn(
                        "text-xs font-medium transition-colors leading-tight",
                        isSelected ? "text-primary" : "text-foreground"
                      )}>
                        {topic}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Filters */}
        <Card className="animate-slide-up" style={{ animationDelay: '200ms' }}>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary-light rounded-lg">
                  <Filter className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-lg font-semibold">Filters</h2>
              </div>
              {hasActiveFilters && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleClearFilters}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear All
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {/* Search by Title */}
              <div className="relative">
                <Input
                  placeholder="Search by title..."
                  value={filters.title}
                  onChange={(e) => setFilters({ ...filters, title: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pr-10 border-border focus:border-primary transition-colors"
                />
                <Search className="w-4 h-4 absolute right-3 top-3 text-muted-foreground" />
              </div>

              {/* Difficulty Filter */}
              <Select 
                value={filters.difficulty} 
                onValueChange={(value) => handleFilterChange('difficulty', value)}
              >
                <SelectTrigger className="border-border focus:border-primary transition-colors">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulties</SelectItem>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>

              {/* Type Filter */}
              <Select 
                value={filters.type} 
                onValueChange={(value) => handleFilterChange('type', value as any)}
              >
                <SelectTrigger className="border-border focus:border-primary transition-colors">
                  <SelectValue placeholder="Problem Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Problems</SelectItem>
                  <SelectItem value="college">College Only</SelectItem>
                  <SelectItem value="public">Public Only</SelectItem>
                </SelectContent>
              </Select>

              {/* Search Button */}
              <Button 
                onClick={handleSearch}
                className="bg-gradient-to-r from-primary to-accent hover:shadow-glow transition-all"
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Error State */}
        {error && (
          <Alert variant="destructive" className="animate-scale-in">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <div className="space-y-4 animate-fade-in">
            {[1, 2, 3, 4, 5].map((i) => (
              <ProblemCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Problems List */}
        {!loading && (
          <div className="space-y-4 animate-slide-up" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">
                Problems 
                <span className="ml-2 text-muted-foreground font-normal text-base">
                  ({problems.length} {hasActiveFilters ? 'filtered' : 'total'})
                </span>
              </h2>
            </div>

            {problems.length === 0 ? (
              <Card className="shadow-card">
                <CardContent className="p-16 text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="p-4 bg-muted rounded-full">
                      <Code className="w-12 h-12 text-muted-foreground" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold">No problems found</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    {hasActiveFilters 
                      ? "Try adjusting your filters to see more problems." 
                      : "Check back later for new problems."}
                  </p>
                  {hasActiveFilters && (
                    <Button onClick={handleClearFilters} variant="outline" className="mt-4">
                      Clear Filters
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {problems.map((problem, index) => (
                  <div 
                    key={problem._id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <ProblemCard
                      problem={problem}
                      onSolve={handleSolveProblem}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Coding;