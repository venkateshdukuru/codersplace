// src/components/quiz/QuizAttempt.tsx

import React, { useState } from 'react';
import { Quiz } from '../../types';

interface QuizAttemptProps {
  quiz: Quiz;
  onSubmit: (answers: number[]) => Promise<void>;
  onClose: () => void;
}

export const QuizAttempt: React.FC<QuizAttemptProps> = ({ quiz, onSubmit, onClose }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(quiz.questions.length).fill(-1));
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const res = await onSubmit(answers);
      setResult(res);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const question = quiz.questions[currentQuestion];

  if (result) {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-8 max-w-md w-full">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <svg className="h-10 w-10 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-2">Quiz Completed!</h3>
            <p className="text-4xl font-bold text-blue-600 mb-4">
              {result.score}/{result.total}
            </p>
            <p className="text-gray-600 mb-6">
              You scored {Math.round((result.score / result.total) * 100)}%
            </p>
            <button
              onClick={onClose}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">{quiz.title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Progress */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </span>
            <span className="text-sm text-gray-600">
              {answers.filter(a => a !== -1).length} answered
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="flex-1 overflow-y-auto p-6">
          <h3 className="text-lg font-semibold mb-4">{question.question}</h3>
          <div className="space-y-3">
            {question.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                  answers[currentQuestion] === idx
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="font-medium mr-2">{String.fromCharCode(65 + idx)}.</span>
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="p-4 border-t flex justify-between">
          <button
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            className="px-4 py-2 text-gray-700 border rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          
          {currentQuestion === quiz.questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={submitting || answers.includes(-1)}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Quiz'}
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestion(Math.min(quiz.questions.length - 1, currentQuestion + 1))}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};