// File: frontend/src/pages/Hackathons.tsx

import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Calendar, Trophy, Users, Search, Filter } from 'lucide-react';
import { useHackathons } from '../context/HackathonContext';
import { useAuth } from '../context/AuthContext';
import { HackathonCard } from '../components/hackathon/HackathonCard';
import { LoadingCard, LoadingSpinner } from '../components/hackathon/LoadingSpinner';
import { SearchAndFilter } from '../components/hackathon/SearchAndFilter';
import { Hackathon } from '../services/hackathonService';
import { getEventStatus } from '../lib/utils';

export const Hackathons: React.FC = () => {
  const { hackathons, isLoading, error } = useHackathons();
  const { isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'upcoming' | 'ongoing' | 'completed'>('all');

  // Filter hackathons based on search and status
  const filteredHackathons = hackathons.filter(hackathon => {
    const matchesSearch = hackathon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (hackathon.description?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (!matchesSearch) return false;

    if (statusFilter === 'all') return true;
    
    const status = getEventStatus(hackathon.startDate, hackathon.endDate);
    return status === statusFilter;
  });

  const upcomingHackathons = filteredHackathons.filter(h => getEventStatus(h.startDate, h.endDate) === 'upcoming');
  const ongoingHackathons = filteredHackathons.filter(h => getEventStatus(h.startDate, h.endDate) === 'ongoing');
  const completedHackathons = filteredHackathons.filter(h => getEventStatus(h.startDate, h.endDate) === 'completed');

  return (
    <div className="min-h-screen bg-gray-50 ">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold">
              Discover Amazing <span className="text-yellow-300">Hackathons</span>
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Join exciting hackathons, compete with the best developers, and build innovative solutions 
              while winning amazing prizes and networking opportunities.
            </p>
            {!isAuthenticated && (
              <div className="bg-blue-800/50 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-blue-100 text-sm">
                  💡 <strong>Tip:</strong> Login to register for hackathons and track your progress!
                </p>
              </div>
            )}
            <div className="flex flex-wrap justify-center gap-8 mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold">{hackathons.length}+</div>
                <div className="text-blue-200">Total Events</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{hackathons.reduce((sum, h) => sum + h.completedBy.length, 0)}+</div>
                <div className="text-blue-200">Participants</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{ongoingHackathons.length}</div>
                <div className="text-blue-200">Live Events</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="container mx-auto px-6 md:px-12 lg:px-20 py-8">
        <SearchAndFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onClearFilters={() => {
            setSearchTerm('');
            setStatusFilter('all');
          }}
          hasActiveFilters={searchTerm !== '' || statusFilter !== 'all'}
          placeholder="Search hackathons..."
        >
          <div className="flex flex-wrap gap-2">
            {(['all', 'upcoming', 'ongoing', 'completed'] as const).map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(status)}
                className="capitalize"
              >
                {status}
              </Button>
            ))}
          </div>
        </SearchAndFilter>
      </section>

      {/* Error State */}
      {error && (
        <section className="container mx-auto px-6 md:px-12 lg:px-20">
          <Card className="p-8 text-center">
            <p className="text-red-600 mb-4">Error loading hackathons: {error}</p>
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

      {/* Ongoing Hackathons */}
      {!isLoading && ongoingHackathons.length > 0 && (
        <section className="container mx-auto px-6 md:px-12 lg:px-20 py-8">
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900">Live Hackathons</h2>
            <Badge className="bg-green-100 text-green-800">
              {ongoingHackathons.length} Active
            </Badge>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {ongoingHackathons.map((hackathon) => (
              <HackathonCard key={hackathon._id} hackathon={hackathon} />
            ))}
          </div>
        </section>
      )}

      {/* Upcoming Hackathons */}
      {!isLoading && upcomingHackathons.length > 0 && (
        <section className="container mx-auto px-6 md:px-12 lg:px-20 py-8">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Upcoming Hackathons</h2>
            <Badge className="bg-blue-100 text-blue-800">
              {upcomingHackathons.length} Events
            </Badge>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingHackathons.map((hackathon) => (
              <HackathonCard key={hackathon._id} hackathon={hackathon} />
            ))}
          </div>
        </section>
      )}

      {/* Completed Hackathons */}
      {!isLoading && completedHackathons.length > 0 && (
        <section className="container mx-auto px-6 md:px-12 lg:px-20 py-8">
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="w-6 h-6 text-gray-600" />
            <h2 className="text-2xl font-bold text-gray-900">Past Hackathons</h2>
            <Badge variant="outline">
              {completedHackathons.length} Completed
            </Badge>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {completedHackathons.map((hackathon) => (
              <HackathonCard key={hackathon._id} hackathon={hackathon} />
            ))}
          </div>
        </section>
      )}

      {/* No Results */}
      {!isLoading && filteredHackathons.length === 0 && hackathons.length > 0 && (
        <section className="container mx-auto px-6 md:px-12 lg:px-20">
          <Card className="p-8 text-center">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hackathons found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms or filters.
            </p>
            <Button 
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </Card>
        </section>
      )}

      {/* Empty State */}
      {!isLoading && hackathons.length === 0 && !error && (
        <section className="container mx-auto px-6 md:px-12 lg:px-20">
          <Card className="p-8 text-center">
            <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hackathons available</h3>
            <p className="text-gray-600">
              Check back soon for new hackathon opportunities!
            </p>
          </Card>
        </section>
      )}
    </div>
  );
};

export default Hackathons;