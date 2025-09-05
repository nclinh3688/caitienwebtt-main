import dynamic from 'next/dynamic';
import React from 'react';

// Lazy load heavy components
export const AdvancedDashboard = dynamic(() => import('@/app/dashboard/advanced/page'), {
  loading: () => React.createElement('div', { className: 'loading-spinner' }, 'Loading...'),
  ssr: false,
});

// Demo components removed - pages were deleted for production
export const AnalyticsDemo = () => React.createElement('div', { className: 'loading-spinner' }, 'Analytics Demo - Coming Soon');
export const AIExerciseDemo = () => React.createElement('div', { className: 'loading-spinner' }, 'AI Exercise Demo - Coming Soon');
export const GamificationDemo = () => React.createElement('div', { className: 'loading-spinner' }, 'Gamification Demo - Coming Soon');
