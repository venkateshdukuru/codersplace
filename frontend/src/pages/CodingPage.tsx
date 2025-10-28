// src/pages/CodingPage.tsx

import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, BookOpen, Lightbulb, Terminal, Settings, Play, Send, Loader2, CheckCircle2, XCircle, Code2, Sun, Moon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useProblem } from "@/context/ProblemContext";
import { Problem } from "@/types";
import { DifficultyBadge } from "@/components/common/DifficultyBadge";
import { CollegeBadge } from "@/components/common/CollegeBadge";
import { CodeEditor } from "@/components/coding/CodeEditor";
import { codeExecutionService } from "@/services/codeExecutionService";
import { cn } from "@/lib/utils";

const LANGUAGES = [
  { id: 63, name: "JavaScript", template: "// Write your code here\nfunction solve() {\n    \n}\n\n// Read input\nconst input = require('fs').readFileSync(0, 'utf-8').trim();\nsolve();" },
  { id: 71, name: "Python", template: "# Write your code here\ndef solve():\n    pass\n\n# Read input\nimport sys\ninput_data = sys.stdin.read().strip()\nsolve()" },
  { id: 62, name: "Java", template: "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Write your code here\n        \n    }\n}" },
  { id: 54, name: "C++", template: "#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    \n    return 0;\n}" },
];

interface TestResult {
  testCase: number;
  passed: boolean;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  error?: string;
  time?: string;
  memory?: number;
}

export const CodingPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { getProblem, loading, error } = useProblem();
  
  const [problem, setProblem] = useState<Problem | null>(
    location.state?.problem || null
  );
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0]);
  const [code, setCode] = useState(LANGUAGES[0].template);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [fetchingProblem, setFetchingProblem] = useState(false);
  const [outputType, setOutputType] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [editorTheme, setEditorTheme] = useState<'vs-dark' | 'light'>('vs-dark');

  useEffect(() => {
    const loadProblem = async () => {
      if (!problem && id) {
        setFetchingProblem(true);
        try {
          const fetchedProblem = await getProblem(id);
          if (fetchedProblem) {
            setProblem(fetchedProblem);
          } else {
            toast({
              title: "Error",
              description: "Problem not found",
              variant: "destructive"
            });
            navigate('/coding');
          }
        } catch (err) {
          toast({
            title: "Error",
            description: "Failed to load problem",
            variant: "destructive"
          });
          navigate('/coding');
        } finally {
          setFetchingProblem(false);
        }
      }
    };

    loadProblem();
  }, [id, problem, getProblem, navigate, toast]);

  const handleLanguageChange = (langId: string) => {
    const lang = LANGUAGES.find(l => l.id === Number(langId));
    if (lang) {
      setSelectedLanguage(lang);
      setCode(lang.template);
    }
  };

  const toggleEditorTheme = () => {
    setEditorTheme(prev => prev === 'vs-dark' ? 'light' : 'vs-dark');
  };

  const handleRunCode = async () => {
    if (!code.trim()) {
      toast({
        title: "Error",
        description: "Please write some code first",
        variant: "destructive"
      });
      return;
    }

    setIsRunning(true);
    setOutputType('running');
    setOutput("⏳ Running your code...\n\n");
    
    try {
      // Run against first test case only
      const firstTestCase = problem?.testCases?.[0];
      
      if (!firstTestCase) {
        setOutputType('error');
        setOutput("❌ No test cases available");
        return;
      }

      const result = await codeExecutionService.executeCode(
        code,
        selectedLanguage.id,
        firstTestCase.input
      );

      const formattedOutput = codeExecutionService.formatOutput(result);
      
      if (result.status.id === 3) { // Accepted
        const actualOutput = (result.stdout || '').trim();
        const expectedOutput = firstTestCase.output.trim();
        const isPassed = actualOutput === expectedOutput;

        if (isPassed) {
          setOutputType('success');
          setOutput(
            "✅ Sample Test Case Passed!\n\n" +
            formattedOutput +
            "\n💡 Submit to run against all test cases."
          );
        } else {
          setOutputType('error');
          setOutput(
            "❌ Sample Test Case Failed\n\n" +
            formattedOutput +
            "\n📋 Expected Output:\n" + expectedOutput +
            "\n\n📤 Your Output:\n" + actualOutput
          );
        }
      } else {
        setOutputType('error');
        setOutput("❌ Execution Failed\n\n" + formattedOutput);
      }
    } catch (error: any) {
      setOutputType('error');
      setOutput("❌ Error: " + error.message);
      toast({
        title: "Execution Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!problem || !code.trim()) {
      toast({
        title: "Error",
        description: "Please write some code before submitting",
        variant: "destructive"
      });
      return;
    }

    if (!problem.testCases || problem.testCases.length === 0) {
      toast({
        title: "Error",
        description: "No test cases available for this problem",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsRunning(true);
      setOutputType('running');
      setOutput("🔄 Running all test cases...\n\n");
      setTestResults([]);
      
      const result = await codeExecutionService.runTestCases(
        code,
        selectedLanguage.id,
        problem.testCases
      );
      
      setTestResults(result.results);

      if (result.passed === result.total) {
        setOutputType('success');
        setOutput(
          `🎉 All Test Cases Passed! (${result.passed}/${result.total})\n\n` +
          "✅ Your solution is correct!\n\n" +
          "Test Results:\n" +
          result.results.map(r => 
            `Test ${r.testCase}: ${r.passed ? '✅ Passed' : '❌ Failed'} (${r.time}s, ${r.memory}KB)`
          ).join('\n')
        );
        
        toast({
          title: "Success!",
          description: `All ${result.total} test cases passed!`,
        });
      } else {
        setOutputType('error');
        setOutput(
          `❌ Some Test Cases Failed (${result.passed}/${result.total} passed)\n\n` +
          result.results.map((r, idx) => {
            if (!r.passed) {
              return `\nTest Case ${r.testCase}: ❌ Failed\n` +
                     `Input: ${r.input}\n` +
                     `Expected: ${r.expectedOutput}\n` +
                     `Got: ${r.actualOutput}\n` +
                     (r.error ? `Error: ${r.error}\n` : '');
            }
            return `Test Case ${r.testCase}: ✅ Passed`;
          }).join('\n')
        );
        
        toast({
          title: "Failed",
          description: `${result.failed} test case(s) failed`,
          variant: "destructive"
        });
      }
    } catch (error: any) {
      setOutputType('error');
      setOutput("❌ Submission Error: " + error.message);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
    }
  };

  if (fetchingProblem || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4 animate-scale-in">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary-light rounded-full mx-auto" />
            <Loader2 className="w-16 h-16 text-primary animate-spin absolute inset-0 mx-auto" />
          </div>
          <p className="text-lg text-muted-foreground font-medium">Loading problem...</p>
        </div>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <Card className="max-w-md w-full shadow-elevated animate-scale-in">
          <CardContent className="p-6 space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {!problem && (
              <div className="text-center space-y-2">
                <p className="text-lg text-muted-foreground">Problem not found</p>
              </div>
            )}
            <Button 
              className="w-full" 
              onClick={() => navigate('/coding')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Problems
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-20 shadow-sm">
        <div className="max-w-[98vw] mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/coding")}
                className="flex-shrink-0"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-3 flex-wrap min-w-0">
                <h1 className="text-lg sm:text-xl font-bold truncate">{problem.title}</h1>
                <DifficultyBadge difficulty={problem.difficulty} />
                <CollegeBadge source={problem.source} collegeName={problem.collegeName} />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
              <Select 
                value={selectedLanguage.id.toString()} 
                onValueChange={handleLanguageChange}
              >
                <SelectTrigger className="w-[140px] h-9 border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang.id} value={lang.id.toString()}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden animate-fade-in">
        <div className="h-full max-w-[98vw] mx-auto px-4 sm:px-6 py-4">
          <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Problem Statement Panel */}
            <div className="flex flex-col overflow-hidden">
              <Card className="flex flex-col h-full shadow-card border-border">
                <Tabs defaultValue="problem" className="flex flex-col h-full">
                  <div className="border-b px-6 pt-4">
                    <TabsList className="grid w-full max-w-[400px] grid-cols-2">
                      <TabsTrigger value="problem" className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        Problem
                      </TabsTrigger>
                      <TabsTrigger value="hints" className="flex items-center gap-2">
                        <Lightbulb className="w-4 h-4" />
                        Test Cases
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <div className="flex-1 overflow-auto px-6 py-4">
                    <TabsContent value="problem" className="space-y-6 mt-0">
                      <div className="space-y-3">
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                          <div className="w-1 h-5 bg-primary rounded-full" />
                          Description
                        </h3>
                        <p className="text-base text-muted-foreground leading-relaxed whitespace-pre-wrap pl-4">
                          {problem.description || "No description available"}
                        </p>
                      </div>

                      {problem.testCases && problem.testCases.length > 0 && (
                        <div className="space-y-3">
                          <h3 className="font-semibold text-lg flex items-center gap-2">
                            <div className="w-1 h-5 bg-primary rounded-full" />
                            Sample Test Cases
                          </h3>
                          <div className="space-y-3 pl-4">
                            {problem.testCases.slice(0, 2).map((testCase, index) => (
                              <div key={index} className="bg-muted/30 p-4 rounded-lg border border-border space-y-3">
                                <div className="font-medium text-sm text-muted-foreground">Example {index + 1}</div>
                                <div>
                                  <span className="font-medium text-sm">Input:</span>
                                  <code className="block bg-card/50 px-3 py-2 rounded mt-1.5 text-sm font-mono whitespace-pre-wrap border border-border">
                                    {testCase.input}
                                  </code>
                                </div>
                                <div>
                                  <span className="font-medium text-sm">Output:</span>
                                  <code className="block bg-card/50 px-3 py-2 rounded mt-1.5 text-sm font-mono whitespace-pre-wrap border border-border">
                                    {testCase.output}
                                  </code>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="hints" className="mt-0 space-y-4">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <div className="w-1 h-5 bg-primary rounded-full" />
                        All Test Cases
                      </h3>
                      {problem.testCases && problem.testCases.length > 0 ? (
                        <div className="space-y-3">
                          {problem.testCases.map((testCase, index) => (
                            <div key={index} className="bg-muted/30 p-4 rounded-lg border border-border space-y-3">
                              <div className="font-medium text-sm text-muted-foreground">Test Case {index + 1}</div>
                              <div className="space-y-2">
                                <div>
                                  <span className="text-sm font-medium">Input:</span>
                                  <code className="block bg-card/50 px-3 py-2 rounded mt-1.5 text-xs font-mono whitespace-pre-wrap border border-border">
                                    {testCase.input}
                                  </code>
                                </div>
                                <div>
                                  <span className="text-sm font-medium">Expected Output:</span>
                                  <code className="block bg-card/50 px-3 py-2 rounded mt-1.5 text-xs font-mono whitespace-pre-wrap border border-border">
                                    {testCase.output}
                                  </code>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <Alert>
                          <AlertDescription>No test cases available</AlertDescription>
                        </Alert>
                      )}
                    </TabsContent>
                  </div>
                </Tabs>
              </Card>
            </div>

            {/* Code Editor Panel */}
            <div className="flex flex-col overflow-hidden min-h-[600px]">
              <Card className="flex flex-col h-full shadow-card border-border">
                <div className="border-b px-6 py-4 flex items-center justify-between">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-primary" />
                    Code Editor
                  </h3>
                  
                  {/* Theme Toggle Switch */}
                  <button
                    onClick={toggleEditorTheme}
                    className={cn(
                      "relative inline-flex h-8 w-16 items-center rounded-full transition-all duration-300 ease-in-out",
                      "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
                      editorTheme === 'vs-dark' 
                        ? "bg-slate-700 hover:bg-slate-600" 
                        : "bg-amber-400 hover:bg-amber-500"
                    )}
                    aria-label="Toggle editor theme"
                  >
                    <span
                      className={cn(
                        "inline-flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-lg transform transition-all duration-300 ease-in-out",
                        editorTheme === 'vs-dark' ? "translate-x-1" : "translate-x-9"
                      )}
                    >
                      {editorTheme === 'vs-dark' ? (
                        <Moon className="h-3.5 w-3.5 text-slate-700 transition-transform duration-300" />
                      ) : (
                        <Sun className="h-3.5 w-3.5 text-amber-500 transition-transform duration-300" />
                      )}
                    </span>
                  </button>
                </div>

                <div className="flex-1 flex flex-col gap-4 p-6 min-h-0">
                  {/* Monaco Code Editor */}
                  <div className="flex-1 min-h-[300px] rounded-lg overflow-hidden border border-border shadow-inner transition-all duration-300">
                    <CodeEditor
                      value={code}
                      onChange={setCode}
                      language={selectedLanguage.name}
                      theme={editorTheme}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      variant="outline"
                      onClick={handleRunCode}
                      disabled={isRunning || !code.trim()}
                      size="sm"
                      className="hover:border-primary transition-colors"
                    >
                      {isRunning ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Running...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Run Code
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={!code.trim() || isRunning}
                      size="sm"
                      className="bg-gradient-to-r from-primary to-accent hover:shadow-glow transition-all"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Submit
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setCode(selectedLanguage.template);
                        setOutput("");
                        setOutputType('idle');
                        setTestResults([]);
                      }}
                      size="sm"
                      className="hover:bg-muted"
                    >
                      Reset
                    </Button>
                  </div>

                  {/* Output Section */}
                  <div className="flex-1 flex flex-col min-h-[180px]">
                    <div className="flex items-center gap-2 mb-2">
                      <Terminal className="w-4 h-4 text-muted-foreground" />
                      <label className="text-sm font-medium">Output</label>
                      {outputType === 'success' && <CheckCircle2 className="w-4 h-4 text-success ml-auto" />}
                      {outputType === 'error' && <XCircle className="w-4 h-4 text-destructive ml-auto" />}
                    </div>
                    <div className={cn(
                      "flex-1 p-4 rounded-lg border overflow-auto transition-colors",
                      outputType === 'success' && "border-success/30 bg-success/5",
                      outputType === 'error' && "border-destructive/30 bg-destructive/5",
                      outputType === 'idle' && "bg-muted/30 border-border",
                      outputType === 'running' && "bg-primary/5 border-primary/30"
                    )}>
                      {output ? (
                        <pre className="text-sm whitespace-pre-wrap break-words font-mono">
                          {output}
                        </pre>
                      ) : (
                        <div className="text-center text-muted-foreground py-8 space-y-2">
                          <Terminal className="w-8 h-8 mx-auto opacity-30" />
                          <p className="text-sm">Run or submit your code to see output</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};