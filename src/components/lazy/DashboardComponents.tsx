'use client';

import dynamic from 'next/dynamic';

// Lazy load dashboard components
export const AdvancedDashboard = dynamic(() => import('@/app/dashboard/advanced/page'), {
  loading: () => <div className="dashboard-loading">Loading Advanced Dashboard...</div>,
  ssr: false
});

// Demo components removed - pages were deleted for production
export const AnalyticsDemo = () => <div className="analytics-loading">Analytics Demo - Coming Soon</div>;
export const AIExerciseDemo = () => <div className="ai-loading">AI Exercise Demo - Coming Soon</div>;
export const GamificationDemo = () => <div className="gamification-loading">Gamification Demo - Coming Soon</div>;
