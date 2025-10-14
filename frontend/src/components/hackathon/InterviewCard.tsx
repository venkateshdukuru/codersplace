// import React, { useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
// import { Button } from '../ui/button';
// import { Badge } from '../ui/badge';
// import { Calendar, HelpCircle, CheckCircle, Play } from 'lucide-react';
// // import { Interview } from '../services/interviewService';
// // import { formatDate } from '../lib/utils';
// // import { useAuth } from '../context/AuthContext';
// import { Interview } from '@/services/interviewServices';
// import { formatDate } from '@/lib/utils';
// import { useAuth } from '@/context/AuthContext';

// interface InterviewCardProps {
//   interview: Interview;
//   onStartPractice: (interview: Interview) => void;
// }

// export const InterviewCard: React.FC<InterviewCardProps> = ({ 
//   interview, 
//   onStartPractice 
// }) => {
//   const { user } = useAuth();
//   const isCompleted = user && interview.completedBy.includes(user.studentId);

//   return (
//     <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border border-gray-200">
//       <CardHeader className="pb-3">
//         <div className="flex justify-between items-start mb-2">
//           <CardTitle className="text-lg font-bold text-gray-900 line-clamp-2">
//             {interview.title}
//           </CardTitle>
//           {isCompleted && (
//             <Badge className="bg-green-100 text-green-800">
//               <CheckCircle className="w-3 h-3 mr-1" />
//               Completed
//             </Badge>
//           )}
//         </div>
//       </CardHeader>

//       <CardContent className="pt-0">
//         <div className="space-y-3">
//           <div className="flex items-center gap-2 text-sm text-gray-600">
//             <Calendar className="w-4 h-4 text-blue-500" />
//             <span>Created: {formatDate(interview.createdAt)}</span>
//           </div>
          
//           <div className="flex items-center gap-2 text-sm text-gray-600">
//             <HelpCircle className="w-4 h-4 text-purple-500" />
//             <span>{interview.questions.length} questions</span>
//           </div>

//           <div className="flex items-center gap-2 text-sm text-gray-600">
//             <CheckCircle className="w-4 h-4 text-green-500" />
//             <span>{interview.completedBy.length} completed</span>
//           </div>

//           <div className="pt-4">
//             <Button
//               onClick={() => onStartPractice(interview)}
//               className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
//             >
//               <Play className="w-4 h-4" />
//               {isCompleted ? 'Practice Again' : 'Start Practice'}
//             </Button>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// frontend/src/components/hackathon/InterviewCard.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Calendar, HelpCircle, CheckCircle, Play, LogIn } from 'lucide-react';
import { Interview } from '@/services/interviewServices';
import { formatDate } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

interface InterviewCardProps {
  interview: Interview;
  onStartPractice: (interview: Interview) => void;
}

export const InterviewCard: React.FC<InterviewCardProps> = ({ 
  interview, 
  onStartPractice 
}) => {
  const { user, isAuthenticated } = useAuth();
  const isCompleted = user && interview.completedBy.includes(user.studentId);

  const getActionButton = () => {
    if (false) { //instead of !isAuthenticated *****
      return (
        <Button
          onClick={() => onStartPractice(interview)}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
        >
          <LogIn className="w-4 h-4" />
          Login to Practice
        </Button>
      );
    }

    return (
      <Button
        onClick={() => onStartPractice(interview)}
        className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
      >
        <Play className="w-4 h-4" />
        {isCompleted ? 'Practice Again' : 'Start Practice'}
      </Button>
    );
  };

  return (
    <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border border-gray-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-lg font-bold text-gray-900 line-clamp-2">
            {interview.title}
          </CardTitle>
          {isAuthenticated && isCompleted && (
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle className="w-3 h-3 mr-1" />
              Completed
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4 text-blue-500" />
            <span>Created: {formatDate(interview.createdAt)}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <HelpCircle className="w-4 h-4 text-purple-500" />
            <span>{interview.questions.length} questions</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>{interview.completedBy.length} completed</span>
          </div>

          {!isAuthenticated && (
            <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
              Login required to track progress
            </div>
          )}

          <div className="pt-4">
            {getActionButton()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};