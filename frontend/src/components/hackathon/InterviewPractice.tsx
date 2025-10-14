import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { X, ChevronLeft, ChevronRight, Trophy } from 'lucide-react';
// import { Interview } from '../services/interviewService';
// import { useInterviews } from '../context/InterviewContext';
import { Interview } from '@/services/interviewServices';
import { useInterviews } from '@/context/InterviewContext';
import { useToast } from '../ui/tooast';

interface InterviewPracticeProps {
  interview: Interview;
  onClose: () => void;
}

export const InterviewPractice: React.FC<InterviewPracticeProps> = ({ 
  interview, 
  onClose 
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(interview.questions.length).fill(-1));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState<{ score: number; total: number } | null>(null);
  const { submitInterview } = useInterviews();
  const { addToast } = useToast();

  const currentQuestion = interview.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === interview.questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;
  const allQuestionsAnswered = answers.every(answer => answer !== -1);

  const handleAnswerSelect = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstQuestion) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!allQuestionsAnswered) {
      addToast({
        title: 'Incomplete',
        description: 'Please answer all questions before submitting.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitInterview(interview._id, { answers });
      setResults(result);
      addToast({
        title: 'Success!',
        description: `You scored ${result.score} out of ${result.total}!`,
        variant: 'success',
      });
    } catch (error: unknown) {
      addToast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to submit interview.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (results) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-between items-center mb-4">
              <CardTitle className="text-xl font-bold">Results</CardTitle>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="text-center">
              <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <p className="text-3xl font-bold text-gray-900 mb-2">
                {results.score}/{results.total}
              </p>
              <p className="text-lg text-gray-600">
                {Math.round((results.score / results.total) * 100)}% Correct
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <Button onClick={onClose} className="w-full">
              Close
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[80vh] flex flex-col">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center mb-4">
            <CardTitle className="text-xl font-bold">{interview.title}</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex justify-between items-center">
            <Badge variant="outline">
              Question {currentQuestionIndex + 1} of {interview.questions.length}
            </Badge>
            <div className="text-sm text-gray-600">
              Progress: {answers.filter(a => a !== -1).length}/{interview.questions.length}
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">{currentQuestion.text}</h3>
            
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-4 text-left rounded-lg border transition-all duration-200 ${
                    answers[currentQuestionIndex] === index
                      ? 'border-blue-500 bg-blue-50 text-blue-900'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      answers[currentQuestionIndex] === index
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {answers[currentQuestionIndex] === index && (
                        <div className="w-full h-full rounded-full bg-white scale-50"></div>
                      )}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </CardContent>

        <div className="p-6 border-t bg-gray-50">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={isFirstQuestion}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            {isLastQuestion ? (
              <Button
                onClick={handleSubmit}
                disabled={!allQuestionsAnswered || isSubmitting}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Interview'}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={answers[currentQuestionIndex] === -1}
                className="flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};