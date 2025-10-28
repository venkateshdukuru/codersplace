// src/pages/WeeklyTestPage.tsx

import React, { useEffect } from 'react';
import { useWeeklyTest } from '../context/WeeklyTestContext';
import { CountdownTimer } from '../components/common/CountdownTimer';
import { CollegeBadge } from '../components/common/CollegeBadge';
import { Loader, EmptyState } from '../components/common/LoadingSkeleton';

export const WeeklyTestPage: React.FC = () => {
  const { weeklyTests, loading, meta, fetchWeeklyTests } = useWeeklyTest();

  useEffect(() => {
    fetchWeeklyTests();
  }, [fetchWeeklyTests]);

  const upcomingTests = weeklyTests.filter(t => new Date(t.deadline) > new Date());
  const pastTests = weeklyTests.filter(t => new Date(t.deadline) <= new Date());

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Weekly Tests</h1>
          <p className="text-gray-600">
            Time-bound tests to evaluate your skills
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {loading ? (
          <Loader />
        ) : (
          <>
            {/* Ongoing/Upcoming Tests */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Upcoming Tests</h2>
              {upcomingTests.length === 0 ? (
                <EmptyState message="No upcoming tests" />
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {upcomingTests.map((test) => (
                    <div
                      key={test._id}
                      className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg font-bold">{test.title}</h3>
                          <p className="text-sm text-gray-600">Week {test.weekNumber}</p>
                        </div>
                        <CollegeBadge source={test.source} />
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
                          </svg>
                          {test.questions.length} Questions
                        </div>
                        {test.timeLimit && (
                          <div className="flex items-center text-sm text-gray-600">
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                            </svg>
                            {test.timeLimit} minutes
                          </div>
                        )}
                        <div className="flex items-center text-sm text-gray-600">
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                          </svg>
                          {test.completedBy.length} attempted
                        </div>
                      </div>

                      <div className="mb-4">
                        <CountdownTimer deadline={test.deadline} />
                      </div>

                      <button
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        onClick={() => {/* Navigate to test attempt */}}
                      >
                        Start Test
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Past Tests */}
            {pastTests.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4">Past Tests</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {pastTests.map((test) => (
                    <div
                      key={test._id}
                      className="bg-gray-50 rounded-lg border p-6 opacity-75"
                    >
                      <h3 className="text-lg font-bold mb-2">{test.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">Week {test.weekNumber}</p>
                      <span className="inline-block px-3 py-1 text-xs bg-red-100 text-red-700 rounded-full">
                        Expired
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
};