// path: frontend/src/components/coding/ProblemPage.tsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { 
  Code, Clock, Users, ArrowLeft, Play, Terminal, Settings, 
  BookOpen, Lightbulb, Copy, CheckCircle, AlertCircle,
  ChevronRight, ChevronLeft, Save, Share2
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const ProblemPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState("");
  const [activeTab, setActiveTab] = useState("problem");
  const [testResults, setTestResults] = useState<any[]>([]);

  // Your existing problems data
  const problems = [
    // ... your problems array
  ];

  const problem = problems.find(p => p.id === parseInt(id || "0"));

  const languages = [
    { id: "javascript", name: "JavaScript", icon: "JS", template: "function solve() {\n    // Write your code here\n    return result;\n}" },
    { id: "python", name: "Python", icon: "PY", template: "def solve():\n    # Write your code here\n    return result" },
    { id: "java", name: "Java", icon: "JA", template: "public class Solution {\n    public int solve() {\n        // Write your code here\n        return result;\n    }\n}" },
    { id: "cpp", name: "C++", icon: "C+", template: "#include <iostream>\nusing namespace std;\n\nclass Solution {\npublic:\n    int solve() {\n        // Write your code here\n        return result;\n    }\n};" },
  ];

  useEffect(() => {
    const lang = languages.find(l => l.id === selectedLanguage);
    if (lang) setCode(lang.template);
  }, [selectedLanguage]);

  const handleRunCode = () => {
    setIsRunning(true);
    setTimeout(() => {
      setOutput("Test Case 1: Passed ✓\nTest Case 2: Passed ✓\nTest Case 3: Failed ✗\n\nExecution Time: 2.3ms\nMemory Used: 15.2MB");
      setTestResults([
        { id: 1, passed: true, time: "1.2ms" },
        { id: 2, passed: true, time: "1.1ms" },
        { id: 3, passed: false, time: "2.3ms" }
      ]);
      setIsRunning(false);
    }, 2000);
  };

  const handleSubmit = () => {
    handleRunCode();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "text-green-500";
      case "medium": return "text-yellow-500";
      case "hard": return "text-red-500";
      default: return "text-gray-500";
    }
  };

  if (!problem) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Problem not found</h2>
          <Button onClick={() => navigate("/coding")} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Problems
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur sticky top-0 z-10">
        <div className="max-w-[1920px] mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/coding")}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Problems
              </Button>
              
              <div className="h-6 w-px bg-border" />
              
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold">{problem.title}</h1>
                <Badge className={getDifficultyColor(problem.difficulty)}>
                  {problem.difficulty}
                </Badge>
                <Badge variant="outline">{problem.topic}</Badge>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm">
                <Share2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Save className="w-4 h-4" />
              </Button>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.id} value={lang.id}>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs bg-muted px-1 rounded">
                          {lang.icon}
                        </span>
                        {lang.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1920px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-[calc(100vh-60px)]">
          {/* Left Panel - Problem Description */}
          <div className="border-r overflow-hidden flex flex-col">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
              <div className="px-4 pt-4">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="problem" className="gap-2">
                    <BookOpen className="w-4 h-4" />
                    Description
                  </TabsTrigger>
                  <TabsTrigger value="solutions" className="gap-2">
                    <Code className="w-4 h-4" />
                    Solutions
                  </TabsTrigger>
                  <TabsTrigger value="hints" className="gap-2">
                    <Lightbulb className="w-4 h-4" />
                    Hints
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="flex-1 overflow-auto px-4 pb-4">
                <TabsContent value="problem" className="mt-0 space-y-6">
                  {/* Problem Stats */}
                  <div className="grid grid-cols-3 gap-3">
                    <Card>
                      <CardContent className="p-3">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">Time</p>
                            <p className="text-sm font-semibold">{problem.time}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-3">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">Solved</p>
                            <p className="text-sm font-semibold">{problem.solved}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">Success</p>
                            <p className="text-sm font-semibold">67.8%</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Problem Description</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {problem.description}
                    </p>
                  </div>

                  {/* Examples */}
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Examples</h3>
                    <div className="space-y-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <div className="flex gap-2">
                              <span className="font-medium">Input:</span>
                              <code className="bg-muted px-2 py-1 rounded text-sm">nums = [2,7,11,15], target = 9</code>
                            </div>
                            <div className="flex gap-2">
                              <span className="font-medium">Output:</span>
                              <code className="bg-muted px-2 py-1 rounded text-sm">[0,1]</code>
                            </div>
                            <div className="flex gap-2">
                              <span className="font-medium">Explanation:</span>
                              <span className="text-muted-foreground">Because nums[0] + nums[1] == 9, we return [0, 1].</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Constraints */}
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Constraints</h3>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>2 ≤ nums.length ≤ 10⁴</li>
                      <li>-10⁹ ≤ nums[i] ≤ 10⁹</li>
                      <li>Only one valid answer exists</li>
                    </ul>
                  </div>
                </TabsContent>

                <TabsContent value="solutions" className="mt-0">
                  <div className="space-y-4">
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-2">Optimal Solution - Hash Map</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Time: O(n) | Space: O(n)
                        </p>
                        <pre className="bg-muted p-3 rounded-lg overflow-x-auto">
                          <code>{`function twoSum(nums, target) {
    const map = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        
        map.set(nums[i], i);
    }
    
    return [];
}`}</code>
                        </pre>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="hints" className="mt-0 space-y-3">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">
                          1
                        </div>
                        <p className="text-sm">Think about using a hash map to store values you've seen.</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">
                          2
                        </div>
                        <p className="text-sm">For each element, check if target - element exists in the map.</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Right Panel - Code Editor */}
          <div className="flex flex-col h-full">
            {/* Code Editor */}
            <div className="flex-1 flex flex-col p-4 pb-0">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Code Editor</h3>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex-1 min-h-0">
                <Textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="h-full font-mono text-sm resize-none bg-muted/30"
                  placeholder="Write your code here..."
                />
              </div>
            </div>

            {/* Test Results */}
            <div className="border-t">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Test Results</h3>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleRunCode}
                      disabled={isRunning}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {isRunning ? "Running..." : "Run"}
                    </Button>
                    <Button 
                      variant="gradient"
                      size="sm"
                      onClick={handleSubmit}
                      disabled={!code.trim() || isRunning}
                    >
                      Submit
                    </Button>
                  </div>
                </div>

                <div className="bg-muted/30 rounded-lg p-4 min-h-[200px]">
                  {output ? (
                    <div className="space-y-3">
                      {testResults.map((result) => (
                        <div key={result.id} className="flex items-center justify-between p-2 bg-background rounded">
                          <div className="flex items-center gap-2">
                            {result.passed ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-red-500" />
                            )}
                            <span className="text-sm">Test Case {result.id}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{result.time}</span>
                        </div>
                      ))}
                      
                      <div className="pt-3 border-t mt-3">
                        <pre className="text-xs text-muted-foreground">{output}</pre>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                      <Terminal className="w-8 h-8 mb-2 opacity-50" />
                      <p className="text-sm">Run your code to see results</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="border-t bg-card/50 backdrop-blur">
        <div className="max-w-[1920px] mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm" className="gap-2">
              <ChevronLeft className="w-4 h-4" />
              Previous Problem
            </Button>
            <span className="text-sm text-muted-foreground">
              Problem {problem.id} of {problems.length}
            </span>
            <Button variant="outline" size="sm" className="gap-2">
              Next Problem
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;