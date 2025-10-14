
// frontend/src/pages/Interview.tsx
import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Search, HelpCircle, Brain, CheckCircle, LogIn } from 'lucide-react';
import { useInterviews } from '../context/InterviewContext';
import { useAuth } from '../context/AuthContext';
import { InterviewCard } from '@/components/hackathon/InterviewCard';
import { InterviewPractice } from '@/components/hackathon/InterviewPractice';
import { Interview as InterviewType } from '@/services/interviewServices';
import { LoadingCard, LoadingSpinner } from '@/components/hackathon/LoadingSpinner';
import { SearchAndFilter } from '@/components/hackathon/SearchAndFilter';
import { useNavigate } from 'react-router-dom';

export const Interview: React.FC = () => {
  const { interviews, isLoading, error } = useInterviews();
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [practiceMode, setPracticeMode] = useState<InterviewType | null>(null);
  const navigate = useNavigate();

  const filteredInterviews = interviews.filter(interview => 
    interview.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const completedInterviews = interviews.filter(interview => 
    user && interview.completedBy.includes(user.studentId)
  );

  // const handlePracticeStart = (interview: InterviewType) => {
  //   if (!isAuthenticated) {
  //     // Redirect to login if not authenticated
  //     navigate('/login', { 
  //       state: { from: '/interview', message: 'Please login to practice interviews' }
  //     });
  //     return;
  //   }
  //   setPracticeMode(interview);
  // };


  //************************ */ // NEW
  const handlePracticeStart = (interview: InterviewType) => {
  setPracticeMode(interview);
};


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold">
              Master Your <span className="text-yellow-300">Interview Skills</span>
            </h1>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              Practice with real interview questions, get instant feedback, and boost your confidence 
              for technical interviews at top companies.
            </p>
            {!isAuthenticated && (
              <div className="bg-purple-800/50 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-purple-100 text-sm">
                  💡 <strong>Tip:</strong> Login to practice interviews and track your progress!
                </p>
              </div>
            )}
            <div className="flex flex-wrap justify-center gap-8 mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold">{interviews.length}+</div>
                <div className="text-purple-200">Interview Sets</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">
                  {interviews.reduce((sum, i) => sum + i.questions.length, 0)}+
                </div>
                <div className="text-purple-200">Questions</div>
              </div>
              {isAuthenticated && (
                <div className="text-center">
                  <div className="text-3xl font-bold">{completedInterviews.length}</div>
                  <div className="text-purple-200">Completed</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* User Stats - Only show if authenticated */}
      {isAuthenticated && user && (
        <section className="container mx-auto px-6 md:px-12 lg:px-20 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4 text-center">
              <Brain className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{user.completedInterviews}</p>
              <p className="text-sm text-gray-600">Interviews Completed</p>
            </Card>
            <Card className="p-4 text-center">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{user.completedProblems}</p>
              <p className="text-sm text-gray-600">Problems Solved</p>
            </Card>
            <Card className="p-4 text-center">
              <HelpCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{user.completedQuizzes}</p>
              <p className="text-sm text-gray-600">Quizzes Taken</p>
            </Card>
            <Card className="p-4 text-center">
              <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2">
                {user.totalTestScore}
              </div>
              <p className="text-2xl font-bold text-gray-900">{user.totalTestScore}</p>
              <p className="text-sm text-gray-600">Total Score</p>
            </Card>
          </div>
        </section>
      )}

      {/* Search and Filters */}
      <section className="container mx-auto px-6 md:px-12 lg:px-20 py-8">
        <SearchAndFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onClearFilters={() => setSearchTerm('')}
          hasActiveFilters={searchTerm !== ''}
          placeholder="Search interview topics..."
        />
      </section>

      {/* Error State */}
      {error && (
        <section className="container mx-auto px-6 md:px-12 lg:px-20">
          <Card className="p-8 text-center">
            <p className="text-red-600 mb-4">Error loading interviews: {error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </Card>
        </section>
      )}

      {/* Loading State */}
      {isLoading && (
        <section className="container mx-auto px-6 md:px-12 lg:px-20">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <LoadingCard key={index} />
            ))}
          </div>
        </section>
      )}

      {/* Interview Cards */}
      {!isLoading && filteredInterviews.length > 0 && (
        <section className="container mx-auto px-6 md:px-12 lg:px-20 py-8">
          <div className="flex items-center gap-3 mb-6">
            <HelpCircle className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-900">Available Interview Practice</h2>
            <Badge className="bg-purple-100 text-purple-800">
              {filteredInterviews.length} Sets
            </Badge>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredInterviews.map((interview) => (
              <InterviewCard 
                key={interview._id} 
                interview={interview} 
                onStartPractice={handlePracticeStart}
              />
            ))}
          </div>
        </section>
      )}

      {/* No Results */}
      {!isLoading && filteredInterviews.length === 0 && interviews.length > 0 && (
        <section className="container mx-auto px-6 md:px-12 lg:px-20">
          <Card className="p-8 text-center">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No interviews found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms.
            </p>
            <Button 
              onClick={() => setSearchTerm('')}
              variant="outline"
            >
              Clear Search
            </Button>
          </Card>
        </section>
      )}

      {/* Empty State */}
      {!isLoading && interviews.length === 0 && !error && (
        <section className="container mx-auto px-6 md:px-12 lg:px-20">
          <Card className="p-8 text-center">
            <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No interviews available</h3>
            <p className="text-gray-600">
              Check back soon for new interview practice opportunities!
            </p>
          </Card>
        </section>
      )}

      {/* Interview Practice Modal */}
      {practiceMode && (
        <InterviewPractice
          interview={practiceMode}
          onClose={() => setPracticeMode(null)}
        />
      )}
    </div>
  );
};