import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, Award } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface ARVPracticeProps {
  problem: {
    id: number;
    title: string;
    difficulty: string;
    topic: string;
    description: string;
    time: string;
    options?: string[];
    correctAnswer?: number;
    explanation?: string;
  };
  onComplete: (score: number) => void;
  onClose: () => void;
}

const ARVPractice = ({ problem, onComplete, onClose }: ARVPracticeProps) => {
  const { user } = useAuth();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(parseInt(problem.time) * 60); // Convert to seconds
  const [showSolution, setShowSolution] = useState(false);

  // Mock options and answers for demo
  const options = problem.options || [
    "Option A - First possible answer",
    "Option B - Second possible answer", 
    "Option C - Third possible answer",
    "Option D - Fourth possible answer"
  ];
  
  const correctAnswer = problem.correctAnswer || Math.floor(Math.random() * 4);
  const explanation = problem.explanation || "This is the correct answer because it follows the fundamental principles of the topic and aligns with standard practices.";

  const handleSubmit = () => {
    if (selectedOption === null) return;
    
    setSubmitted(true);
    const isCorrect = selectedOption === correctAnswer;
    const score = isCorrect ? 10 : 0;
    
    // Store result in localStorage
    const results = JSON.parse(localStorage.getItem('arvResults') || '[]');
    results.push({
      problemId: problem.id,
      title: problem.title,
      difficulty: problem.difficulty,
      topic: problem.topic,
      selectedOption,
      correctAnswer,
      isCorrect,
      score,
      timestamp: new Date().toISOString(),
      userId: user?.email
    });
    localStorage.setItem('arvResults', JSON.stringify(results));
    
    onComplete(score);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <CardTitle className="text-xl">{problem.title}</CardTitle>
              <Badge className={getDifficultyColor(problem.difficulty)}>
                {problem.difficulty}
              </Badge>
              <Badge variant="outline">{problem.topic}</Badge>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                {formatTime(timeLeft)}
              </div>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="prose prose-sm max-w-none">
            <p className="text-base">{problem.description}</p>
          </div>

          {!submitted && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Choose the correct answer:</h3>
              <div className="grid gap-3">
                {options.map((option, index) => (
                  <Card 
                    key={index}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedOption === index 
                        ? 'ring-2 ring-primary bg-primary/5' 
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedOption(index)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedOption === index 
                            ? 'border-primary bg-primary text-primary-foreground' 
                            : 'border-muted-foreground'
                        }`}>
                          {selectedOption === index && (
                            <div className="w-2 h-2 bg-current rounded-full" />
                          )}
                        </div>
                        <span className="text-sm">{option}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <Button 
                onClick={handleSubmit} 
                disabled={selectedOption === null}
                className="w-full"
              >
                Submit Answer
              </Button>
            </div>
          )}

          {submitted && (
            <div className="space-y-4">
              <Card className={`border-2 ${
                selectedOption === correctAnswer 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-red-500 bg-red-50'
              }`}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    {selectedOption === correctAnswer ? (
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    ) : (
                      <XCircle className="w-8 h-8 text-red-600" />
                    )}
                    <div>
                      <h3 className="text-xl font-semibold">
                        {selectedOption === correctAnswer ? 'Correct!' : 'Incorrect'}
                      </h3>
                      <p className="text-muted-foreground">
                        {selectedOption === correctAnswer 
                          ? 'Well done! You earned 10 points.' 
                          : 'Better luck next time. You earned 0 points.'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="font-medium">Your answer: {options[selectedOption!]}</p>
                    {selectedOption !== correctAnswer && (
                      <p className="font-medium text-green-600">
                        Correct answer: {options[correctAnswer]}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Button 
                onClick={() => setShowSolution(!showSolution)}
                variant="outline"
                className="w-full"
              >
                {showSolution ? 'Hide Solution' : 'View Solution'}
              </Button>

              {showSolution && (
                <Card className="border border-blue-200 bg-blue-50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Award className="w-5 h-5 text-blue-600" />
                      Solution & Explanation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-blue-900">{explanation}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ARVPractice;