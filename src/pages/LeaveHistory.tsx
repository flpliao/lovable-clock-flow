
import React from 'react';
import { useUser } from '@/contexts/UserContext';
import { Navigate } from 'react-router-dom';
import LeaveHistory from '@/components/LeaveHistory';

const LeaveHistoryPage = () => {
  const { currentUser, isAuthenticated, isUserLoaded } = useUser();

  if (!isUserLoaded) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p>載入中...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/80 via-blue-500/60 to-purple-600/80"></div>
      <div className="relative z-10 w-full min-h-screen pb-safe pt-12 md:pt-20">
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white text-center mb-8">請假紀錄</h1>
          <LeaveHistory />
        </div>
      </div>
    </div>
  );
};

export default LeaveHistoryPage;
