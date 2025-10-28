// src/components/common/CountdownTimer.tsx

import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  deadline: Date;
  onExpire?: () => void;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ deadline, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(deadline).getTime() - now;

      if (distance < 0) {
        setTimeLeft('Expired');
        onExpire?.();
        clearInterval(timer);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, [deadline, onExpire]);

  return (
    <div className="inline-flex items-center px-3 py-1 text-sm font-medium text-orange-700 bg-orange-100 rounded-full">
      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
      </svg>
      {timeLeft}
    </div>
  );
};