// File: frontend/src/components/hackathon/SearchAndFilter.tsx

import React from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Search, Filter, X, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface SearchAndFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  placeholder?: string;
  children?: React.ReactNode;
}

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchTerm,
  onSearchChange,
  onClearFilters,
  hasActiveFilters,
  placeholder = "Search...",
  children,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <motion.div 
          className="relative flex-1"
          whileFocus={{ scale: 1.02 }}
        >
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-12 pr-4 py-6 text-lg border-2 border-gray-200 focus:border-purple-500 rounded-xl transition-all duration-200 bg-white/50 backdrop-blur-sm"
          />
          {searchTerm && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => onSearchChange('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </motion.button>
          )}
        </motion.div>

        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Button
              variant="outline"
              onClick={onClearFilters}
              className="flex items-center gap-2 px-6 py-6 border-2 border-red-200 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
            >
              <X className="w-5 h-5" />
              Clear All Filters
            </Button>
          </motion.div>
        )}
      </div>
      
      {children && (
        <motion.div 
          className="flex flex-wrap gap-3 items-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Filter className="w-4 h-4" />
            <span className="font-medium">Filter by status:</span>
          </div>
          {children}
        </motion.div>
      )}
    </div>
  );
};