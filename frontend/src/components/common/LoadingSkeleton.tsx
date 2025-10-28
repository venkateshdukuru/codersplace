// src/components/common/Loader.tsx

import React from 'react';

export const Loader: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
    </div>
  );
};

export const EmptyState: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500">
      <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
      </svg>
      <p className="text-lg font-medium">{message}</p>
    </div>
  );
};

import { Card, CardContent } from "@/components/ui/card";

export const ProblemCardSkeleton = () => {
  return (
    <Card className="animate-pulse">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-6 w-48 bg-muted rounded shimmer" />
              <div className="h-5 w-16 bg-muted rounded shimmer" />
              <div className="h-5 w-24 bg-muted rounded shimmer" />
            </div>
            <div className="h-4 w-full bg-muted rounded shimmer" />
            <div className="h-4 w-3/4 bg-muted rounded shimmer" />
            <div className="flex items-center gap-4">
              <div className="h-4 w-20 bg-muted rounded shimmer" />
              <div className="h-4 w-24 bg-muted rounded shimmer" />
            </div>
          </div>
          <div className="h-10 w-32 bg-muted rounded shimmer" />
        </div>
      </CardContent>
    </Card>
  );
};

export const StatsCardSkeleton = () => {
  return (
    <Card className="animate-pulse">
      <CardContent className="p-4 text-center space-y-2">
        <div className="w-8 h-8 bg-muted rounded mx-auto shimmer" />
        <div className="h-8 w-16 bg-muted rounded mx-auto shimmer" />
        <div className="h-4 w-24 bg-muted rounded mx-auto shimmer" />
      </CardContent>
    </Card>
  );
};

export const TopicCardSkeleton = () => {
  return (
    <Card className="animate-pulse h-28">
      <CardContent className="flex items-center justify-center h-full p-4">
        <div className="h-4 w-20 bg-muted rounded shimmer" />
      </CardContent>
    </Card>
  );
};
