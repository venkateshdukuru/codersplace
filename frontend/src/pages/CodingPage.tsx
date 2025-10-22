"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { X, BookOpen, Lightbulb, Terminal, Settings, Code } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Problem {
  id: number
  title: string
  difficulty: string
  topic: string
  description: string
  problemStatement: string
  time: string
  solved: number
}

interface QuestionData {
  description: string
  examples: {
    input: string
    output: string
    explanation: string
  }[]
  constraints: string[]
  hints: string[]
  approach: string
  timeComplexity: string
  spaceComplexity: string
  testCases: {
    input: string
    output: string
  }[]
}

const CodingPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation() as { state?: { problem?: Problem } } | undefined
  const { toast } = useToast()
  const [selectedLanguage, setSelectedLanguage] = useState("python")
  const [code, setCode] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [output, setOutput] = useState("")
  const [question, setQuestion] = useState<Problem | null>(null)

  const languages = [
    {
      id: "javascript",
      name: "JavaScript",
      template: "function solve() {\n    // Write your code here\n    return result;\n}",
    },
    { id: "python", name: "Python", template: "def solve():\n    # Write your code here\n    return result" },
    {
      id: "java",
      name: "Java",
      template:
        "public class Solution {\n    public int solve() {\n        // Write your code here\n        return result;\n    }\n}",
    },
    {
      id: "cpp",
      name: "C++",
      template:
        "#include <iostream>\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int solve() {\n        // Write your code here\n        return result;\n    }\n};",
    },
    {
      id: "c",
      name: "C",
      template: "#include <stdio.h>\n\nint solve() {\n    // Write your code here\n    return result;\n}",
    },
    { id: "sql", name: "SQL", template: "-- Write your SQL query here\nSELECT * FROM table_name;" },
  ]

  useEffect(() => {
    if (!id) return

    const questionId = Number.parseInt(id)
    const stateProblem = location?.state?.problem as Problem | undefined

    const loadedQuestion = stateProblem && stateProblem.id === questionId ? stateProblem : getQuestionById(questionId)

    if (loadedQuestion) {
      setQuestion(loadedQuestion)
      // initialize code template for current language if needed
      setCode(languages.find((l) => l.id === selectedLanguage)?.template || "")
    } else {
      navigate("/coding")
    }
  }, [id, navigate, location])

  useEffect(() => {
    const selectedLang = languages.find((lang) => lang.id === selectedLanguage)
    if (selectedLang) {
      setCode(selectedLang.template)
    }
  }, [selectedLanguage])

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language)
  }

  const handleRunCode = () => {
    setIsRunning(true)
    setTimeout(() => {
      const sampleOutput =
        selectedLanguage === "python"
          ? "Hello World\n42\n[1, 2, 3]"
          : selectedLanguage === "java"
            ? "Hello World\n42"
            : "Hello World\n42\n[1, 2, 3]"

      setOutput(
        `Execution completed:\n\n${sampleOutput}\n\n--- Debug Info ---\nLanguage: ${selectedLanguage}\nExecution time: 1.2s\nMemory used: 15.4 MB`,
      )
      setIsRunning(false)
    }, 2000)
  }

  const handleSubmitCode = () => {
    if (!code.trim()) return

    setIsRunning(true)

    setTimeout(() => {
      if (question) {
        const questionData = getDetailedQuestionData(question)
        const testCases = questionData.testCases || []

        let passedTests = 0
        const testResults = []

        const codeQuality =
          code.length > 50 && (code.includes("function") || code.includes("def") || code.includes("class")) ? 0.8 : 0.4

        for (let i = 0; i < testCases.length; i++) {
          const testCase = testCases[i]
          const passed = Math.random() < codeQuality
          if (passed) passedTests++

          testResults.push({
            testCase: i + 1,
            input: testCase.input,
            expected: testCase.output,
            actual: passed ? testCase.output : "Wrong output",
            passed: passed,
          })
        }

        const allPassed = passedTests === testCases.length
        const submissionTime = new Date().toISOString()

        let output = `🔍 TEST RESULTS\n\n`
        output += `Passed: ${passedTests}/${testCases.length} test cases\n`
        output += `Submission Time: ${new Date(submissionTime).toLocaleString()}\n\n`

        testResults.forEach((result) => {
          const status = result.passed ? "✅ PASS" : "❌ FAIL"
          output += `Test Case ${result.testCase}: ${status}\n`
          output += `Input: ${result.input}\n`
          output += `Expected: ${result.expected}\n`
          output += `Your Output: ${result.actual}\n\n`
        })

        const solution = {
          id: `${question.id}_${Date.now()}`,
          problemId: question.id,
          title: question.title,
          difficulty: question.difficulty,
          topic: question.topic,
          language: selectedLanguage,
          code: code,
          timestamp: submissionTime,
          testsPassed: passedTests,
          totalTests: testCases.length,
          passed: allPassed,
          runtime: `${(Math.random() * 1000 + 100).toFixed(0)}ms`,
          memory: `${(Math.random() * 20 + 10).toFixed(1)} MB`,
          status: allPassed ? "Accepted" : "Failed",
        }

        const savedSolutions = JSON.parse(localStorage.getItem("codingSolutions") || "[]")
        savedSolutions.unshift(solution)

        if (savedSolutions.length > 50) {
          savedSolutions.splice(50)
        }

        localStorage.setItem("codingSolutions", JSON.stringify(savedSolutions))

        if (allPassed) {
          output += `🎉 CONGRATULATIONS!\n`
          output += `All test cases passed! Your solution has been saved.\n\n`
          output += `📊 Submission Details:\n`
          output += `• Problem: ${question.title}\n`
          output += `• Difficulty: ${question.difficulty}\n`
          output += `• Language: ${selectedLanguage}\n`
          output += `• Runtime: ${solution.runtime}\n`
          output += `• Memory: ${solution.memory}\n`
          output += `• Status: ${solution.status}\n\n`
          output += `💾 Solution saved to your profile!\n`

          toast({
            title: "Success!",
            description: "All test cases passed! Solution saved.",
          })
        } else {
          output += `❌ SOLUTION INCOMPLETE\n`
          output += `${testCases.length - passedTests} test case(s) failed.\n`
          output += `💡 Hints:\n`
          output += `• Check your logic against the failed test cases\n`
          output += `• Consider edge cases and boundary conditions\n`
          output += `• Verify your algorithm's correctness\n\n`
          output += `📊 Submission Details:\n`
          output += `• Status: ${solution.status}\n`
          output += `• Runtime: ${solution.runtime}\n`
          output += `• Memory: ${solution.memory}\n\n`
          output += `💾 Attempt saved to your history.\n`

          toast({
            title: "Tests Failed",
            description: `${testCases.length - passedTests} test case(s) failed.`,
            variant: "destructive",
          })
        }

        setOutput(output)
      }
      setIsRunning(false)
    }, 3000)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "text-green-600 bg-green-50 border-green-200"
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "hard":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  if (!question) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-muted-foreground">Loading problem...</p>
      </div>
    )
  }

  const questionData = getDetailedQuestionData(question)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-[98vw] mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-lg sm:text-xl font-bold">{question.title}</h1>
              <Badge className={getDifficultyColor(question.difficulty)}>{question.difficulty}</Badge>
              <Badge variant="outline">{question.topic}</Badge>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 flex-shrink-0" />
                <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                  <SelectTrigger className="w-[120px] sm:w-[140px] h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.id} value={lang.id}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate("/coding")} className="h-9 w-9 p-0">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <div className="h-full max-w-[98vw] mx-auto px-4 sm:px-6 py-4">
          <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Problem Statement Panel */}
            <div className="flex flex-col overflow-hidden">
              <Tabs defaultValue="problem" className="flex flex-col h-full">
                <TabsList className="grid w-full grid-cols-3 h-9 sm:h-10">
                  <TabsTrigger value="problem" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                    <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden xs:inline">Problem</span>
                  </TabsTrigger>
                  <TabsTrigger value="solution" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                    <Code className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden xs:inline">Solution</span>
                  </TabsTrigger>
                  <TabsTrigger value="hints" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                    <Lightbulb className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden xs:inline">Hints</span>
                  </TabsTrigger>
                </TabsList>

                <div className="flex-1 overflow-auto mt-3 sm:mt-4 px-1">
                  <TabsContent value="problem" className="space-y-4 sm:space-y-6 mt-0">
                    <div>
                      <h3 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3">Description</h3>
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                        {questionData.description}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3">Examples</h3>
                      <div className="space-y-3 sm:space-y-4">
                        {questionData.examples.map((example, index) => (
                          <div key={index} className="bg-muted/50 p-3 sm:p-4 rounded-lg">
                            <div className="mb-2">
                              <span className="font-medium text-sm sm:text-base">Input:</span>{" "}
                              <code className="bg-muted px-2 py-1 rounded text-xs sm:text-sm break-all">
                                {example.input}
                              </code>
                            </div>
                            <div className="mb-2">
                              <span className="font-medium text-sm sm:text-base">Output:</span>{" "}
                              <code className="bg-muted px-2 py-1 rounded text-xs sm:text-sm break-all">
                                {example.output}
                              </code>
                            </div>
                            <div className="text-sm sm:text-base">
                              <span className="font-medium">Explanation:</span> {example.explanation}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3">Constraints</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm sm:text-base text-muted-foreground">
                        {questionData.constraints.map((constraint, index) => (
                          <li key={index} className="break-words">
                            {constraint}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <Card>
                        <CardContent className="p-3 sm:p-4">
                          <div className="text-xs sm:text-sm font-medium text-muted-foreground">Time Complexity</div>
                          <div className="text-base sm:text-lg font-bold text-foreground">
                            {questionData.timeComplexity}
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-3 sm:p-4">
                          <div className="text-xs sm:text-sm font-medium text-muted-foreground">Space Complexity</div>
                          <div className="text-base sm:text-lg font-bold text-foreground">
                            {questionData.spaceComplexity}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="solution" className="mt-0">
                    <div className="space-y-3 sm:space-y-4">
                      <div className="bg-muted/50 p-3 sm:p-4 rounded-lg">
                        <h3 className="font-semibold mb-2 text-sm sm:text-base">Solution Code</h3>
                        <pre className="bg-background p-3 sm:p-4 rounded border overflow-x-auto text-xs sm:text-sm">
                          <code>{`// Solution will be provided here
function solve(input) {
    // Implementation details
    return result;
}`}</code>
                        </pre>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2 text-sm sm:text-base">Explanation</h3>
                        <p className="text-sm sm:text-base text-muted-foreground">
                          Detailed step-by-step explanation of the solution approach and implementation will be provided
                          here.
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="hints" className="mt-0">
                    <div className="space-y-3 sm:space-y-4">
                      <h3 className="font-semibold text-base sm:text-lg">Hints to solve this problem</h3>
                      <div className="space-y-2 sm:space-y-3">
                        {questionData.hints.map((hint, index) => (
                          <div key={index} className="bg-muted/50 p-3 sm:p-4 rounded-lg">
                            <div className="flex items-start gap-2 sm:gap-3">
                              <div className="bg-primary text-primary-foreground rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">
                                {index + 1}
                              </div>
                              <p className="flex-1 text-sm sm:text-base">{hint}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>

            {/* Code Editor Panel */}
            <div className="flex flex-col overflow-hidden min-h-[400px] sm:min-h-[500px]">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <h3 className="font-semibold text-base sm:text-lg">Code Editor</h3>
              </div>

              <div className="flex-1 flex flex-col gap-2 sm:gap-3 min-h-0">
                {/* Code Input Section */}
                <div className="flex-1 flex flex-col min-h-0">
                  <label className="text-xs sm:text-sm font-medium mb-1 sm:mb-2">Your Code</label>
                  <Textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder={languages.find((l) => l.id === selectedLanguage)?.template}
                    className="flex-1 font-mono text-xs sm:text-sm resize-none border-border min-h-[180px] sm:min-h-[220px] lg:min-h-[250px]"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    onClick={handleRunCode}
                    disabled={isRunning}
                    size="sm"
                    className="text-xs sm:text-sm h-8 sm:h-9 flex-1 sm:flex-none bg-transparent"
                  >
                    {isRunning ? "Running..." : "Run Code"}
                  </Button>
                  <Button
                    onClick={handleSubmitCode}
                    disabled={!code.trim() || isRunning}
                    size="sm"
                    className="text-xs sm:text-sm h-8 sm:h-9 flex-1 sm:flex-none"
                  >
                    Submit
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setCode(languages.find((l) => l.id === selectedLanguage)?.template || "")}
                    size="sm"
                    className="text-xs sm:text-sm h-8 sm:h-9 w-full sm:w-auto"
                  >
                    Reset
                  </Button>
                </div>

                {/* Output Section */}
                <div className="flex-1 flex flex-col min-h-0">
                  <label className="text-xs sm:text-sm font-medium mb-1 sm:mb-2">Output / Test Results</label>
                  <div className="flex-1 bg-muted/50 p-2 sm:p-3 rounded-md border overflow-auto min-h-[120px] sm:min-h-[150px]">
                    {output ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Terminal className="w-3 h-3 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
                          <span className="text-xs sm:text-sm font-medium">Execution Result:</span>
                        </div>
                        <pre className="text-xs sm:text-sm text-muted-foreground whitespace-pre-wrap break-words">
                          {output}
                        </pre>
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground py-4 sm:py-6">
                        <Terminal className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-2 opacity-50" />
                        <p className="text-xs sm:text-sm">Run your code to see the output here</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Test Cases Section */}
                <div className="bg-muted/30 p-2 sm:p-3 rounded-lg">
                  <h4 className="font-medium mb-1 sm:mb-2 text-xs sm:text-sm">Test Cases</h4>
                  <div className="space-y-1 sm:space-y-2 max-h-20 sm:max-h-24 overflow-auto">
                    {questionData.testCases?.map((testCase, index) => (
                      <div
                        key={index}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-xs bg-background p-2 rounded"
                      >
                        <span className="truncate">
                          Input: <code className="bg-muted px-1 rounded break-all">{testCase.input}</code>
                        </span>
                        <span className="truncate">
                          Expected: <code className="bg-muted px-1 rounded break-all">{testCase.output}</code>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

// Helper function to get question by ID (same data as in Coding.tsx)
const getQuestionById = (id: number): Problem | null => {
  const problems: Problem[] = [
    {
      id: 1,
      title: "Two Sum",
      difficulty: "easy",
      topic: "Arrays",
      description:
        "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      problemStatement: "",
      time: "15 min",
      solved: 1234,
    },
    {
      id: 2,
      title: "Best Time to Buy and Sell Stock",
      difficulty: "easy",
      topic: "Arrays",
      description: "You are given an array prices where prices[i] is the price of a given stock on the ith day.",
      problemStatement: "",
      time: "20 min",
      solved: 1098,
    },
    {
      id: 3,
      title: "Contains Duplicate",
      difficulty: "easy",
      topic: "Arrays",
      description: "Given an integer array nums, return true if any value appears at least twice in the array.",
      problemStatement: "",
      time: "10 min",
      solved: 1456,
    },
  ]

  return problems.find((p) => p.id === id) || null
}

// Helper function to get detailed question data
const getDetailedQuestionData = (question: Problem): QuestionData => {
  const questionData: Record<number, QuestionData> = {
    1: {
      description:
        "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.",
      examples: [
        {
          input: "nums = [2,7,11,15], target = 9",
          output: "[0,1]",
          explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
        },
        {
          input: "nums = [3,2,4], target = 6",
          output: "[1,2]",
          explanation: "Because nums[1] + nums[2] == 6, we return [1, 2].",
        },
        {
          input: "nums = [3,3], target = 6",
          output: "[0,1]",
          explanation: "Because nums[0] + nums[1] == 6, we return [0, 1].",
        },
      ],
      constraints: [
        "2 ≤ nums.length ≤ 10⁴",
        "-10⁹ ≤ nums[i] ≤ 10⁹",
        "-10⁹ ≤ target ≤ 10⁹",
        "Only one valid answer exists.",
      ],
      hints: [
        "Use a hash map to store values and their indices",
        "For each element, check if target - element exists in the map",
        "Return indices when complement is found",
      ],
      approach: "Hash Map",
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)",
      testCases: [
        { input: "[2,7,11,15], 9", output: "[0,1]" },
        { input: "[3,2,4], 6", output: "[1,2]" },
        { input: "[3,3], 6", output: "[0,1]" },
      ],
    },
    2: {
      description:
        "You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.",
      examples: [
        {
          input: "prices = [7,1,5,3,6,4]",
          output: "5",
          explanation: "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.",
        },
        {
          input: "prices = [7,6,4,3,1]",
          output: "0",
          explanation: "In this case, no transactions are done and the max profit = 0.",
        },
      ],
      constraints: ["1 ≤ prices.length ≤ 10⁵", "0 ≤ prices[i] ≤ 10⁴"],
      hints: [
        "Keep track of the minimum price seen so far",
        "Calculate profit for each day",
        "Track maximum profit achieved",
      ],
      approach: "One Pass",
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      testCases: [
        { input: "[7,1,5,3,6,4]", output: "5" },
        { input: "[7,6,4,3,1]", output: "0" },
        { input: "[1,2,3,4,5]", output: "4" },
      ],
    },
    3: {
      description:
        "Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.",
      examples: [
        { input: "nums = [1,2,3,1]", output: "true", explanation: "The element 1 occurs at indices 0 and 3." },
        { input: "nums = [1,2,3,4]", output: "false", explanation: "All elements are distinct." },
        { input: "nums = [1,1,1,3,3,4,3,2,4,2]", output: "true", explanation: "Multiple duplicates exist." },
      ],
      constraints: ["1 ≤ nums.length ≤ 10⁵", "-10⁹ ≤ nums[i] ≤ 10⁹"],
      hints: [
        "Use a set to track seen elements",
        "Return true immediately when duplicate found",
        "Consider sorting approach as alternative",
      ],
      approach: "Hash Set",
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)",
      testCases: [
        { input: "[1,2,3,1]", output: "true" },
        { input: "[1,2,3,4]", output: "false" },
      ],
    },
  }

  const defaultData: QuestionData = {
    description: `Solve this ${question.topic.toLowerCase()} problem: ${question.description}`,
    examples: [
      {
        input: "Example input will be provided",
        output: "Expected output",
        explanation: "Detailed explanation of the solution approach.",
      },
    ],
    constraints: ["Constraints will be specified based on problem requirements"],
    hints: ["Analyze the problem requirements", "Consider edge cases", "Optimize for time and space complexity"],
    approach: "Problem-specific approach",
    timeComplexity: "To be determined",
    spaceComplexity: "To be determined",
    testCases: [
      { input: "Test case 1", output: "Expected result 1" },
      { input: "Test case 2", output: "Expected result 2" },
    ],
  }

  return questionData[question.id] || defaultData
}

export default CodingPage