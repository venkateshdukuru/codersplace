// File: frontend/src/components/hackathon/HackathonCard.tsx

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Calendar, 
  Clock, 
  Users, 
  ExternalLink, 
  Zap, 
  Trophy, 
  Flame, 
  ArrowRight,
  MapPin,
  Globe,
  Monitor,
  Sparkles,
  Star
} from 'lucide-react';
import { Hackathon } from '../../services/hackathonService';
import { formatDateTime, getEventStatus } from '../../lib/utils';
import { motion } from 'framer-motion';

interface HackathonCardProps {
  hackathon: Hackathon;
}

// Helper function to get days until event
const getDaysUntil = (date: string | Date): number => {
  const now = new Date();
  const target = new Date(date);
  const diffTime = target.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Helper function to get domain-specific colors
const getDomainGradient = (title: string): string => {
  const titleLower = title.toLowerCase();
  if (titleLower.includes('ai') || titleLower.includes('artificial')) {
    return 'from-purple-500 via-indigo-500 to-blue-500';
  }
  if (titleLower.includes('web3') || titleLower.includes('blockchain') || titleLower.includes('defi')) {
    return 'from-indigo-500 via-purple-500 to-pink-500';
  }
  if (titleLower.includes('health') || titleLower.includes('medical')) {
    return 'from-green-400 via-emerald-500 to-teal-500';
  }
  if (titleLower.includes('sustain') || titleLower.includes('green') || titleLower.includes('climate')) {
    return 'from-emerald-500 via-green-500 to-lime-500';
  }
  if (titleLower.includes('fintech') || titleLower.includes('finance')) {
    return 'from-yellow-400 via-orange-500 to-red-500';
  }
  if (titleLower.includes('game') || titleLower.includes('gaming')) {
    return 'from-pink-500 via-rose-500 to-red-500';
  }
  // Default gradient
  return 'from-blue-500 via-indigo-500 to-purple-500';
};

export const HackathonCard: React.FC<HackathonCardProps> = ({ hackathon }) => {
  const status = getEventStatus(hackathon.startDate, hackathon.endDate);
  const daysUntil = getDaysUntil(hackathon.startDate);
  const domainGradient = getDomainGradient(hackathon.title);

  const handleExternalLink = () => {
    if (hackathon.link) {
      window.open(hackathon.link, '_blank', 'noopener,noreferrer');
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'upcoming':
        return (
          <div className="flex items-center gap-2">
            <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 px-3 py-1.5 shadow-lg hover:shadow-xl transition-all duration-300">
              <Zap className="w-3 h-3 mr-1" />
              Upcoming
            </Badge>
            {daysUntil > 0 && (
              <span className="text-xs text-blue-600 font-semibold bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                {daysUntil} days
              </span>
            )}
          </div>
        );
      case 'ongoing':
        return (
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 px-3 py-1.5 animate-pulse shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
            <Flame className="w-3 h-3 mr-1 animate-pulse relative z-10" />
            <span className="relative z-10">Live Now</span>
          </Badge>
        );
      case 'completed':
        return (
          <Badge className="bg-gradient-to-r from-gray-500 to-slate-600 text-white border-0 px-3 py-1.5 shadow-lg">
            <Trophy className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      default:
        return null;
    }
  };

  const getActionButton = () => {
    if (status === 'completed') {
      return (
        <Button 
          variant="outline" 
          className="w-full group border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 relative overflow-hidden" 
          disabled
        >
          <Trophy className="w-4 h-4 mr-2 text-gray-400" />
          Event Completed
        </Button>
      );
    }

    if (hackathon.link) {
      return (
        <Button
          onClick={handleExternalLink}
          className={`w-full bg-gradient-to-r ${domainGradient} hover:shadow-2xl text-white font-semibold rounded-xl transition-all duration-500 transform hover:scale-105 group relative overflow-hidden`}
        >
          {/* Animated background overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          
          <ExternalLink className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300 relative z-10" />
          <span className="relative z-10">Register Now</span>
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300 relative z-10" />
        </Button>
      );
    }

    return (
      <Button
        variant="outline"
        className="w-full border-2 border-dashed border-gray-300 text-gray-500 hover:border-gray-400 transition-all duration-300"
        disabled
      >
        Registration Not Available
      </Button>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8 }}
    >
      <Card className="h-full hover:shadow-2xl transition-all duration-500 border-0 bg-white/90 backdrop-blur-sm overflow-hidden group relative">
        {/* Animated gradient border */}
        <div className={`absolute inset-0 bg-gradient-to-r ${domainGradient} rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500`}>
          <div className="absolute inset-[2px] bg-white rounded-lg"></div>
        </div>

        {/* Gradient overlay on hover */}
        <div className={`absolute inset-0 bg-gradient-to-br ${domainGradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 pointer-events-none`} />
        
        {/* Status indicator dot */}
        <div className="absolute top-4 right-4 z-20">
          {status === 'ongoing' && (
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg"></div>
          )}
          {status === 'upcoming' && (
            <div className="w-3 h-3 bg-blue-500 rounded-full shadow-lg"></div>
          )}
        </div>

        <CardHeader className="pb-4 relative z-10">
          <div className="flex justify-between items-start mb-4">
            <CardTitle className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-purple-600 group-hover:to-blue-600 transition-all duration-300">
              {hackathon.title}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
          
          {/* Status badge */}
          <div className="mb-3">
            {getStatusBadge()}
          </div>

          {hackathon.description && (
            <p className="text-sm text-gray-600 line-clamp-3 group-hover:text-gray-700 transition-colors leading-relaxed">
              {hackathon.description}
            </p>
          )}
        </CardHeader>

        <CardContent className="pt-0 relative z-10">
          <div className="space-y-5">
            {/* Enhanced info cards */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="space-y-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl p-5 group-hover:from-blue-50/30 group-hover:to-purple-50/30 transition-all duration-500 border border-gray-100 group-hover:border-blue-200/50"
            >
              <div className="flex items-center gap-4 text-sm">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 mb-1">Start Date</div>
                  <div className="text-gray-600">{formatDateTime(hackathon.startDate)}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm">
                <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl text-white shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 mb-1">End Date</div>
                  <div className="text-gray-600">{formatDateTime(hackathon.endDate)}</div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl text-white shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <Users className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 mb-1">Participants</div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">{hackathon.completedBy.length} registered</span>
                    {hackathon.completedBy.length > 100 && (
                      <Badge variant="outline" className="px-2 py-0.5 text-xs bg-green-50 text-green-700 border-green-200">
                        <Star className="w-3 h-3 mr-1" />
                        Popular
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Registration info */}
            {hackathon.link && status !== 'completed' && (
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-3 text-sm text-blue-700 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200 group-hover:border-blue-300 transition-all duration-300"
              >
                <div className="p-2 bg-blue-100 rounded-lg">
                  <ExternalLink className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold">External Registration Available</div>
                  <div className="text-xs text-blue-600">Click to register on external platform</div>
                </div>
              </motion.div>
            )}

            {/* Enhanced action button */}
            <div className="pt-2">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {getActionButton()}
              </motion.div>
            </div>
          </div>
        </CardContent>

        {/* Floating particles effect on hover */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-4 left-4 w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-60 group-hover:animate-ping transition-opacity duration-500 delay-100"></div>
          <div className="absolute top-8 right-8 w-1 h-1 bg-purple-400 rounded-full opacity-0 group-hover:opacity-60 group-hover:animate-ping transition-opacity duration-500 delay-300"></div>
          <div className="absolute bottom-8 left-8 w-1 h-1 bg-pink-400 rounded-full opacity-0 group-hover:opacity-60 group-hover:animate-ping transition-opacity duration-500 delay-500"></div>
        </div>
      </Card>
    </motion.div>
  );
};