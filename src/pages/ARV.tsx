import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Brain, Calculator, MessageCircle, Clock, Users, Target, BookOpen, Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import ARVPractice from "@/components/practice/ARVPractice";

const ARV = () => {
  const { user, isAuthenticated } = useAuth();
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("aptitude");
  const [practiceMode, setPracticeMode] = useState<any>(null);
  const [userScore, setUserScore] = useState(0);

  const categories = [
    { id: "aptitude", label: "Aptitude", icon: Calculator, color: "text-primary" },
    { id: "reasoning", label: "Reasoning", icon: Brain, color: "text-success" },
    { id: "verbal", label: "Verbal", icon: MessageCircle, color: "text-warning" }
  ];

  const topics = {
    aptitude: [
      "Quantitative Aptitude", "Data Interpretation", "Probability", "Permutation & Combination",
      "Profit & Loss", "Time & Work", "Speed & Distance", "Simple & Compound Interest",
      "Ratio & Proportion", "Percentages", "Algebra", "Geometry"
    ],
    reasoning: [
      "Logical Reasoning", "Analytical Reasoning", "Verbal Reasoning", "Non-Verbal Reasoning",
      "Data Sufficiency", "Statement & Conclusions", "Syllogisms", "Blood Relations",
      "Direction Sense", "Coding-Decoding", "Pattern Recognition", "Series Completion"
    ],
    verbal: [
      "Reading Comprehension", "Grammar", "Vocabulary", "Sentence Correction", "Para Jumbles",
      "Fill in the Blanks", "Synonyms & Antonyms", "Idioms & Phrases", "One Word Substitution",
      "Error Detection", "Active & Passive Voice", "Direct & Indirect Speech"
    ]
  };

  const problems = {
    aptitude: [
      // Easy Problems (13)
      { id: 1, title: "Simple Profit Calculation", difficulty: "easy", topic: "Profit & Loss", description: "Find profit when cost price is ₹500 and selling price is ₹600.", time: "2 min", solved: 850 },
      { id: 2, title: "Percentage Increase", difficulty: "easy", topic: "Percentages", description: "Calculate percentage increase from 80 to 100.", time: "1 min", solved: 920 },
      { id: 3, title: "Simple Interest", difficulty: "easy", topic: "Simple & Compound Interest", description: "Find SI for principal ₹1000, rate 10% per annum for 2 years.", time: "2 min", solved: 780 },
      { id: 4, title: "Basic Ratio", difficulty: "easy", topic: "Ratio & Proportion", description: "If A:B = 3:4 and B:C = 2:5, find A:B:C.", time: "3 min", solved: 690 },
      { id: 5, title: "Time and Work", difficulty: "easy", topic: "Time & Work", description: "A can complete work in 10 days, B in 15 days. In how many days together?", time: "3 min", solved: 750 },
      { id: 6, title: "Average Problems", difficulty: "easy", topic: "Quantitative Aptitude", description: "Average of 5 numbers is 20. If one number is 30, find average of remaining.", time: "2 min", solved: 820 },
      { id: 7, title: "Speed Distance", difficulty: "easy", topic: "Speed & Distance", description: "Find speed if distance is 100km and time is 2 hours.", time: "1 min", solved: 900 },
      { id: 8, title: "Basic Algebra", difficulty: "easy", topic: "Algebra", description: "Solve for x: 3x + 5 = 20", time: "2 min", solved: 950 },
      { id: 9, title: "Simple Probability", difficulty: "easy", topic: "Probability", description: "Probability of getting head when tossing a fair coin.", time: "1 min", solved: 980 },
      { id: 10, title: "Basic Geometry", difficulty: "easy", topic: "Geometry", description: "Find area of rectangle with length 10cm and width 8cm.", time: "1 min", solved: 890 },
      { id: 11, title: "Unitary Method", difficulty: "easy", topic: "Quantitative Aptitude", description: "If 5 books cost ₹100, find cost of 8 books.", time: "2 min", solved: 860 },
      { id: 12, title: "Loss Percentage", difficulty: "easy", topic: "Profit & Loss", description: "Find loss% when CP = ₹200 and SP = ₹180.", time: "2 min", solved: 770 },
      { id: 13, title: "Compound Ratio", difficulty: "easy", topic: "Ratio & Proportion", description: "Find compound ratio of 2:3 and 4:5.", time: "2 min", solved: 720 },
      
      // Medium Problems (12)
      { id: 14, title: "Compound Interest", difficulty: "medium", topic: "Simple & Compound Interest", description: "Calculate CI for ₹10,000 at 10% for 3 years compounded annually.", time: "5 min", solved: 600 },
      { id: 15, title: "Partnership Problems", difficulty: "medium", topic: "Profit & Loss", description: "A invests ₹3000 for 4 months, B invests ₹4000 for 3 months. Find profit ratio.", time: "4 min", solved: 550 },
      { id: 16, title: "Mixture and Alligation", difficulty: "medium", topic: "Quantitative Aptitude", description: "Mix 40% and 60% solutions to get 50% solution. Find ratio.", time: "6 min", solved: 480 },
      { id: 17, title: "Relative Speed", difficulty: "medium", topic: "Speed & Distance", description: "Two trains moving in opposite directions. Find relative speed.", time: "4 min", solved: 620 },
      { id: 18, title: "Quadratic Equations", difficulty: "medium", topic: "Algebra", description: "Solve x² - 5x + 6 = 0", time: "4 min", solved: 580 },
      { id: 19, title: "Circular Permutation", difficulty: "medium", topic: "Permutation & Combination", description: "In how many ways can 5 people sit around a circular table?", time: "3 min", solved: 450 },
      { id: 20, title: "Probability with Cards", difficulty: "medium", topic: "Probability", description: "Find probability of drawing a king or queen from deck of cards.", time: "3 min", solved: 520 },
      { id: 21, title: "Triangles and Angles", difficulty: "medium", topic: "Geometry", description: "Find third angle of triangle if two angles are 45° and 60°.", time: "2 min", solved: 680 },
      { id: 22, title: "Compound Percentage", difficulty: "medium", topic: "Percentages", description: "Population increases by 10% first year, 20% second year. Find overall increase.", time: "4 min", solved: 560 },
      { id: 23, title: "Pipes and Cisterns", difficulty: "medium", topic: "Time & Work", description: "Pipe A fills tank in 4 hours, pipe B empties in 6 hours. Time to fill when both open?", time: "5 min", solved: 490 },
      { id: 24, title: "Chart Analysis", difficulty: "medium", topic: "Data Interpretation", description: "Analyze bar chart showing sales data for 5 months.", time: "8 min", solved: 420 },
      { id: 25, title: "Boat and Stream", difficulty: "medium", topic: "Speed & Distance", description: "Boat speed 15 km/hr, stream 3 km/hr. Find upstream and downstream speeds.", time: "3 min", solved: 590 },
      
      // Hard Problems (10)
      { id: 26, title: "Complex Data Interpretation", difficulty: "hard", topic: "Data Interpretation", description: "Multi-layered chart with percentages, ratios and comparative analysis.", time: "15 min", solved: 300 },
      { id: 27, title: "Advanced Probability", difficulty: "hard", topic: "Probability", description: "Conditional probability with multiple events and dependencies.", time: "10 min", solved: 250 },
      { id: 28, title: "Complex Mixture", difficulty: "hard", topic: "Quantitative Aptitude", description: "Three solutions mixed in specific ratios with multiple constraints.", time: "12 min", solved: 280 },
      { id: 29, title: "Advanced Partnership", difficulty: "hard", topic: "Profit & Loss", description: "Partnership with varying investments, joining at different times.", time: "8 min", solved: 320 },
      { id: 30, title: "Polynomial Equations", difficulty: "hard", topic: "Algebra", description: "Solve cubic equation with multiple variables and constraints.", time: "10 min", solved: 200 },
      { id: 31, title: "Complex Geometry", difficulty: "hard", topic: "Geometry", description: "Find area of irregular polygon with given constraints.", time: "12 min", solved: 180 },
      { id: 32, title: "Advanced Permutation", difficulty: "hard", topic: "Permutation & Combination", description: "Arrangements with restrictions and multiple conditions.", time: "8 min", solved: 240 },
      { id: 33, title: "Time Speed Distance", difficulty: "hard", topic: "Speed & Distance", description: "Multiple objects moving with varying speeds and directions.", time: "10 min", solved: 220 },
      { id: 34, title: "Complex Interest", difficulty: "hard", topic: "Simple & Compound Interest", description: "Compound interest with quarterly compounding and partial payments.", time: "12 min", solved: 160 },
      { id: 35, title: "Advanced Work Problems", difficulty: "hard", topic: "Time & Work", description: "Multiple workers with varying efficiency and work schedules.", time: "10 min", solved: 190 }
    ],
    
    reasoning: [
      // Easy Problems (13)
      { id: 36, title: "Basic Blood Relations", difficulty: "easy", topic: "Blood Relations", description: "A is B's father. B is C's mother. What is A's relation to C?", time: "2 min", solved: 750 },
      { id: 37, title: "Number Series", difficulty: "easy", topic: "Series Completion", description: "Find next number: 2, 4, 6, 8, ?", time: "1 min", solved: 890 },
      { id: 38, title: "Simple Coding", difficulty: "easy", topic: "Coding-Decoding", description: "If CAT = 31, find value of DOG.", time: "2 min", solved: 820 },
      { id: 39, title: "Direction Sense", difficulty: "easy", topic: "Direction Sense", description: "A walks 10m north, then 5m east. Find distance from starting point.", time: "2 min", solved: 780 },
      { id: 40, title: "Simple Syllogism", difficulty: "easy", topic: "Syllogisms", description: "All birds fly. Sparrow is a bird. Conclusion?", time: "2 min", solved: 850 },
      { id: 41, title: "Alphabet Series", difficulty: "easy", topic: "Series Completion", description: "Find next letter: A, C, E, G, ?", time: "1 min", solved: 920 },
      { id: 42, title: "Basic Analogies", difficulty: "easy", topic: "Logical Reasoning", description: "Cat : Kitten :: Dog : ?", time: "1 min", solved: 950 },
      { id: 43, title: "Mirror Images", difficulty: "easy", topic: "Non-Verbal Reasoning", description: "Find mirror image of given figure.", time: "2 min", solved: 740 },
      { id: 44, title: "Ranking Order", difficulty: "easy", topic: "Logical Reasoning", description: "A is taller than B. B is taller than C. Who is shortest?", time: "2 min", solved: 860 },
      { id: 45, title: "Basic Patterns", difficulty: "easy", topic: "Pattern Recognition", description: "Identify pattern in given sequence of shapes.", time: "2 min", solved: 800 },
      { id: 46, title: "Simple Statements", difficulty: "easy", topic: "Statement & Conclusions", description: "All students are hardworking. Ram is a student. Conclusion?", time: "2 min", solved: 870 },
      { id: 47, title: "Water Images", difficulty: "easy", topic: "Non-Verbal Reasoning", description: "Find water image of given figure.", time: "2 min", solved: 760 },
      { id: 48, title: "Letter Coding", difficulty: "easy", topic: "Coding-Decoding", description: "If A=1, B=2, C=3, find value of HELLO.", time: "3 min", solved: 810 },
      
      // Medium Problems (12)
      { id: 49, title: "Complex Blood Relations", difficulty: "medium", topic: "Blood Relations", description: "Multi-generational family tree with complex relationships.", time: "4 min", solved: 550 },
      { id: 50, title: "Logical Sequence", difficulty: "medium", topic: "Logical Reasoning", description: "Find pattern in: 2, 6, 12, 20, 30, ?", time: "4 min", solved: 520 },
      { id: 51, title: "Statement Analysis", difficulty: "medium", topic: "Statement & Conclusions", description: "Analyze multiple statements and derive valid conclusions.", time: "5 min", solved: 480 },
      { id: 52, title: "Direction Complex", difficulty: "medium", topic: "Direction Sense", description: "Multiple turns and distance calculations in directions.", time: "6 min", solved: 450 },
      { id: 53, title: "Coding Patterns", difficulty: "medium", topic: "Coding-Decoding", description: "Decode pattern where CHAIR = FKDLU", time: "4 min", solved: 490 },
      { id: 54, title: "Analytical Reasoning", difficulty: "medium", topic: "Analytical Reasoning", description: "Seating arrangement problem with multiple constraints.", time: "8 min", solved: 380 },
      { id: 55, title: "Number Patterns", difficulty: "medium", topic: "Pattern Recognition", description: "Find complex pattern in matrix of numbers.", time: "5 min", solved: 420 },
      { id: 56, title: "Data Sufficiency", difficulty: "medium", topic: "Data Sufficiency", description: "Determine if given data is sufficient to answer the question.", time: "4 min", solved: 460 },
      { id: 57, title: "Clock Reasoning", difficulty: "medium", topic: "Logical Reasoning", description: "Angle between clock hands at different times.", time: "3 min", solved: 530 },
      { id: 58, title: "Calendar Problems", difficulty: "medium", topic: "Logical Reasoning", description: "Day and date calculations across different years.", time: "4 min", solved: 510 },
      { id: 59, title: "Figure Series", difficulty: "medium", topic: "Non-Verbal Reasoning", description: "Complete the series of geometric figures.", time: "5 min", solved: 440 },
      { id: 60, title: "Verbal Reasoning", difficulty: "medium", topic: "Verbal Reasoning", description: "Logical deduction from given verbal statements.", time: "6 min", solved: 410 },
      
      // Hard Problems (10)
      { id: 61, title: "Complex Syllogism", difficulty: "hard", topic: "Syllogisms", description: "Multi-statement syllogism with complex logical relationships.", time: "8 min", solved: 250 },
      { id: 62, title: "Advanced Analytical", difficulty: "hard", topic: "Analytical Reasoning", description: "Complex puzzle with multiple variables and constraints.", time: "12 min", solved: 180 },
      { id: 63, title: "Matrix Reasoning", difficulty: "hard", topic: "Non-Verbal Reasoning", description: "Find missing element in 3x3 matrix pattern.", time: "10 min", solved: 200 },
      { id: 64, title: "Complex Coding", difficulty: "hard", topic: "Coding-Decoding", description: "Multi-level coding with mathematical operations.", time: "8 min", solved: 220 },
      { id: 65, title: "Advanced Blood Relations", difficulty: "hard", topic: "Blood Relations", description: "Complex family relationships spanning multiple generations.", time: "10 min", solved: 170 },
      { id: 66, title: "Critical Reasoning", difficulty: "hard", topic: "Logical Reasoning", description: "Analyze argument structure and identify logical flaws.", time: "12 min", solved: 160 },
      { id: 67, title: "Complex Patterns", difficulty: "hard", topic: "Pattern Recognition", description: "Multi-dimensional pattern recognition with variables.", time: "10 min", solved: 190 },
      { id: 68, title: "Advanced Statements", difficulty: "hard", topic: "Statement & Conclusions", description: "Complex logical deduction from multiple premises.", time: "8 min", solved: 210 },
      { id: 69, title: "Puzzle Solving", difficulty: "hard", topic: "Analytical Reasoning", description: "Multi-step logical puzzle with interdependent clues.", time: "15 min", solved: 140 },
      { id: 70, title: "Abstract Reasoning", difficulty: "hard", topic: "Non-Verbal Reasoning", description: "Complex abstract pattern identification and completion.", time: "12 min", solved: 150 }
    ],
    
    verbal: [
      // Easy Problems (13)
      { id: 71, title: "Basic Grammar", difficulty: "easy", topic: "Grammar", description: "Identify grammatical error in simple sentence.", time: "1 min", solved: 900 },
      { id: 72, title: "Simple Synonyms", difficulty: "easy", topic: "Synonyms & Antonyms", description: "Find synonym for 'happy'.", time: "1 min", solved: 950 },
      { id: 73, title: "Easy Antonyms", difficulty: "easy", topic: "Synonyms & Antonyms", description: "Find antonym for 'hot'.", time: "1 min", solved: 930 },
      { id: 74, title: "Fill in Blanks", difficulty: "easy", topic: "Fill in the Blanks", description: "Complete sentence with appropriate word.", time: "2 min", solved: 880 },
      { id: 75, title: "One Word Substitution", difficulty: "easy", topic: "One Word Substitution", description: "One word for 'fear of heights'.", time: "1 min", solved: 820 },
      { id: 76, title: "Simple Idioms", difficulty: "easy", topic: "Idioms & Phrases", description: "Meaning of 'break the ice'.", time: "1 min", solved: 860 },
      { id: 77, title: "Sentence Formation", difficulty: "easy", topic: "Grammar", description: "Arrange words to form meaningful sentence.", time: "2 min", solved: 840 },
      { id: 78, title: "Basic Comprehension", difficulty: "easy", topic: "Reading Comprehension", description: "Read short passage and answer questions.", time: "5 min", solved: 750 },
      { id: 79, title: "Active Voice", difficulty: "easy", topic: "Active & Passive Voice", description: "Convert passive to active voice.", time: "2 min", solved: 790 },
      { id: 80, title: "Direct Speech", difficulty: "easy", topic: "Direct & Indirect Speech", description: "Convert indirect to direct speech.", time: "2 min", solved: 770 },
      { id: 81, title: "Simple Para Jumble", difficulty: "easy", topic: "Para Jumbles", description: "Arrange 4 sentences in logical order.", time: "3 min", solved: 720 },
      { id: 82, title: "Error Detection", difficulty: "easy", topic: "Error Detection", description: "Find error in simple sentence structure.", time: "2 min", solved: 810 },
      { id: 83, title: "Basic Vocabulary", difficulty: "easy", topic: "Vocabulary", description: "Choose correct meaning of common word.", time: "1 min", solved: 890 },
      
      // Medium Problems (12)
      { id: 84, title: "Reading Comprehension", difficulty: "medium", topic: "Reading Comprehension", description: "Detailed passage with inference-based questions.", time: "10 min", solved: 650 },
      { id: 85, title: "Complex Grammar", difficulty: "medium", topic: "Grammar", description: "Identify multiple grammatical errors in paragraph.", time: "4 min", solved: 580 },
      { id: 86, title: "Advanced Synonyms", difficulty: "medium", topic: "Synonyms & Antonyms", description: "Context-based synonym selection.", time: "3 min", solved: 540 },
      { id: 87, title: "Contextual Vocabulary", difficulty: "medium", topic: "Vocabulary", description: "Choose word that fits context perfectly.", time: "3 min", solved: 520 },
      { id: 88, title: "Complex Para Jumbles", difficulty: "medium", topic: "Para Jumbles", description: "Arrange 6 sentences in logical sequence.", time: "6 min", solved: 450 },
      { id: 89, title: "Sentence Correction", difficulty: "medium", topic: "Sentence Correction", description: "Improve sentence structure and clarity.", time: "4 min", solved: 480 },
      { id: 90, title: "Idioms and Usage", difficulty: "medium", topic: "Idioms & Phrases", description: "Correct usage of idiomatic expressions.", time: "3 min", solved: 510 },
      { id: 91, title: "Voice Conversion", difficulty: "medium", topic: "Active & Passive Voice", description: "Complex voice changes with modal verbs.", time: "3 min", solved: 490 },
      { id: 92, title: "Speech Conversion", difficulty: "medium", topic: "Direct & Indirect Speech", description: "Complex narration changes with tense shifts.", time: "4 min", solved: 460 },
      { id: 93, title: "Cloze Test", difficulty: "medium", topic: "Fill in the Blanks", description: "Fill blanks in passage maintaining coherence.", time: "8 min", solved: 420 },
      { id: 94, title: "Word Usage", difficulty: "medium", topic: "Error Detection", description: "Detect subtle errors in word usage.", time: "3 min", solved: 470 },
      { id: 95, title: "Phrase Substitution", difficulty: "medium", topic: "One Word Substitution", description: "Replace phrase with single appropriate word.", time: "2 min", solved: 530 },
      
      // Hard Problems (5)
      { id: 96, title: "Advanced Vocabulary", difficulty: "hard", topic: "Vocabulary", description: "Context-dependent word choice with subtle differences.", time: "5 min", solved: 400 },
      { id: 97, title: "Complex Comprehension", difficulty: "hard", topic: "Reading Comprehension", description: "Abstract passage with critical reasoning questions.", time: "15 min", solved: 280 },
      { id: 98, title: "Advanced Para Jumbles", difficulty: "hard", topic: "Para Jumbles", description: "8 sentences with complex logical relationships.", time: "10 min", solved: 220 },
      { id: 99, title: "Critical Error Detection", difficulty: "hard", topic: "Error Detection", description: "Subtle grammatical and contextual errors.", time: "6 min", solved: 250 },
      { id: 100, title: "Literary Analysis", difficulty: "hard", topic: "Reading Comprehension", description: "Analyze literary text for themes and techniques.", time: "12 min", solved: 180 }
    ]
  };

  const filteredProblems = problems[selectedCategory as keyof typeof problems].filter(problem => {
    return selectedDifficulty === "all" || problem.difficulty === selectedDifficulty;
  });

  const getDifficultyVariant = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "easy";
      case "medium": return "medium";
      case "hard": return "hard";
      default: return "default";
    }
  };

  const handlePracticeStart = (problem: any) => {
    if (!isAuthenticated) {
      return;
    }
    setPracticeMode(problem);
  };

  const handlePracticeComplete = (score: number) => {
    setUserScore(prev => prev + score);
    setPracticeMode(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="p-8">
            <div className="flex justify-center mb-4">
              <Lock className="w-16 h-16 text-muted-foreground" />
            </div>
            <CardTitle className="text-2xl mb-4">Authentication Required</CardTitle>
            <CardDescription className="text-lg mb-6">
              Please log in to access ARV practice questions and track your progress.
            </CardDescription>
            <Alert>
              <Lock className="w-4 h-4" />
              <AlertDescription>
                ARV practice requires authentication to save your progress and scores.
              </AlertDescription>
            </Alert>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Aptitude, Reasoning & Verbal (ARV)
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Master aptitude tests with comprehensive practice in quantitative aptitude, 
            logical reasoning, and verbal ability sections.
          </p>
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  {category.label}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Target className="w-8 h-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-foreground">200+</div>
                    <div className="text-sm text-muted-foreground">Questions</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <BookOpen className="w-8 h-8 text-success mx-auto mb-2" />
                    <div className="text-2xl font-bold text-foreground">{topics[category.id as keyof typeof topics].length}</div>
                    <div className="text-sm text-muted-foreground">Topics</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Clock className="w-8 h-8 text-warning mx-auto mb-2" />
                    <div className="text-2xl font-bold text-foreground">2-15</div>
                    <div className="text-sm text-muted-foreground">Minutes</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Users className="w-8 h-8 text-hard mx-auto mb-2" />
                    <div className="text-2xl font-bold text-foreground">3000+</div>
                    <div className="text-sm text-muted-foreground">Attempts</div>
                  </CardContent>
                </Card>
              </div>

              {/* Topics Grid */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  {category.label} Topics
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {topics[category.id as keyof typeof topics].map((topic) => (
                    <Card key={topic} className="cursor-pointer transition-all duration-200 hover:shadow-elevated hover:-translate-y-1">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium text-foreground">{topic}</div>
                          <Badge variant="outline">
                            {Math.floor(Math.random() * 50) + 10} Q's
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Difficulty Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Select Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={() => setSelectedDifficulty("all")}>
            Clear Filter
          </Button>
        </div>

        {/* Problems List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Practice Questions ({filteredProblems.length})
          </h2>
          
          {filteredProblems.map((problem) => (
            <Card key={problem.id} className="hover:shadow-elevated transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{problem.title}</h3>
                      <Badge variant={getDifficultyVariant(problem.difficulty) as any}>
                        {problem.difficulty}
                      </Badge>
                      <Badge variant="outline">{problem.topic}</Badge>
                    </div>
                    <p className="text-muted-foreground mb-2">{problem.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{problem.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{problem.solved} attempted</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm"
                      onClick={() => handlePracticeStart(problem)}
                    >
                      Practice Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {practiceMode && (
        <ARVPractice 
          problem={practiceMode}
          onComplete={handlePracticeComplete}
          onClose={() => setPracticeMode(null)}
        />
      )}
    </div>
  );
};

export default ARV;