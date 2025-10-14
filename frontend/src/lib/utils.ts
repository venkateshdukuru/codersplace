import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function isUpcoming(dateString: string): boolean {
  return new Date(dateString) > new Date();
}

export function isOngoing(startDate: string, endDate: string): boolean {
  const now = new Date();
  return new Date(startDate) <= now && now <= new Date(endDate);
}

export function isPast(dateString: string): boolean {
  return new Date(dateString) < new Date();
}

export function getEventStatus(startDate: string, endDate: string): 'upcoming' | 'ongoing' | 'completed' {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now < start) return 'upcoming';
  if (now >= start && now <= end) return 'ongoing';
  return 'completed';
}