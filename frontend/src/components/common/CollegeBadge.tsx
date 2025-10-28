// frontend/src/components/common/CollegeBadge.tsx
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Building2, Globe, GraduationCap } from 'lucide-react';

interface CollegeBadgeProps {
  source: 'your-college' | 'public' | 'other-college';
  collegeName?: string;
}

export const CollegeBadge: React.FC<CollegeBadgeProps> = ({ source, collegeName }) => {
  const getIcon = () => {
    switch (source) {
      case 'your-college':
        return <Building2 className="w-3 h-3 mr-1" />;
      case 'public':
        return <Globe className="w-3 h-3 mr-1" />;
      case 'other-college':
        return <GraduationCap className="w-3 h-3 mr-1" />;
    }
  };

  const getLabel = () => {
    switch (source) {
      case 'your-college':
        // Show the actual college name if available, otherwise show "Your College"
        return 'Your College Problem';
      case 'public':
        return 'Public';
      case 'other-college':
        return collegeName || 'Other College';
    }
  };

  const getColorClass = () => {
    switch (source) {
      case 'your-college':
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800';
      case 'public':
        return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800';
      case 'other-college':
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
    }
  };

  return (
    <Badge variant="outline" className={`flex items-center ${getColorClass()}`}>
      {getIcon()}
      {getLabel()}
    </Badge>
  );
};