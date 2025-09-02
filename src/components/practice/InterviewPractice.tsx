import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Clock, Building2, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface InterviewPracticeProps {
  question: {
    id: number;
    title: string;
    level: string;
    topic: string;
    description: string;
    difficulty: string;
    askedBy: string;
    detailedAnswer?: string;
    keyPoints?: string[];
    relatedQuestions?: string[];
  };
  onClose: () => void;
}

const InterviewPractice = ({ question, onClose }: InterviewPracticeProps) => {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState("question");

  // Mock detailed content for demo
  const detailedAnswer = question.detailedAnswer || `
    This is a comprehensive answer to "${question.title}".
    
    The key aspects to cover include:
    1. Definition and core concepts
    2. Real-world applications and use cases
    3. Advantages and disadvantages
    4. Implementation considerations
    5. Best practices and common pitfalls
    
    When answering this question in an interview, start with a clear definition, 
    then provide context about why this concept is important. Use specific examples 
    from your experience or well-known systems to illustrate your points.
    
    Make sure to demonstrate your understanding of the trade-offs involved and 
    show that you can think critically about when to apply this concept versus alternatives.
  `;

  const keyPoints = question.keyPoints || [
    "Always start with a clear, concise definition",
    "Provide real-world examples to demonstrate understanding",
    "Discuss trade-offs and alternative approaches",
    "Mention performance implications where relevant",
    "Connect to broader system design principles",
    "Be prepared for follow-up questions"
  ];

  const relatedQuestions = question.relatedQuestions || [
    "How would you implement this in a distributed system?",
    "What are the scalability considerations?",
    "How does this compare to alternative approaches?",
    "What monitoring would you put in place?",
    "How would you handle failure scenarios?"
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner': return 'bg-blue-100 text-blue-800';
      case 'intermediate': return 'bg-purple-100 text-purple-800';
      case 'advanced': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Store practice session
  const handleComplete = () => {
    const sessions = JSON.parse(localStorage.getItem('interviewSessions') || '[]');
    sessions.push({
      questionId: question.id,
      title: question.title,
      level: question.level,
      topic: question.topic,
      difficulty: question.difficulty,
      timestamp: new Date().toISOString(),
      userId: user?.email
    });
    localStorage.setItem('interviewSessions', JSON.stringify(sessions));
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <CardTitle className="text-xl">{question.title}</CardTitle>
              <Badge className={getDifficultyColor(question.difficulty)}>
                {question.difficulty}
              </Badge>
              <Badge className={getLevelColor(question.level)}>
                {question.level}
              </Badge>
              <Badge variant="outline">{question.topic}</Badge>
            </div>
            <Button variant="outline" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Building2 className="w-4 h-4" />
              Asked by: {question.askedBy}
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="question">Question</TabsTrigger>
              <TabsTrigger value="answer">Answer</TabsTrigger>
              <TabsTrigger value="tips">Tips</TabsTrigger>
              <TabsTrigger value="related">Related</TabsTrigger>
            </TabsList>
            
            <TabsContent value="question" className="mt-6 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Question Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base leading-relaxed">{question.description}</p>
                  
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Interview Tips:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Take a moment to think before answering</li>
                      <li>• Structure your response clearly</li>
                      <li>• Use examples from your experience when possible</li>
                      <li>• Ask clarifying questions if needed</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="answer" className="mt-6 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Complete Answer</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <div className="whitespace-pre-line text-sm leading-relaxed">
                      {detailedAnswer}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="tips" className="mt-6 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Key Points to Remember</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {keyPoints.map((point, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold mt-0.5">
                          {index + 1}
                        </div>
                        <p className="text-sm leading-relaxed">{point}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="related" className="mt-6 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Related Follow-up Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {relatedQuestions.map((relatedQ, index) => (
                      <Card key={index} className="bg-muted/50">
                        <CardContent className="p-4">
                          <p className="text-sm">{relatedQ}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={() => { handleComplete(); onClose(); }}>
              Mark as Completed
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InterviewPractice;