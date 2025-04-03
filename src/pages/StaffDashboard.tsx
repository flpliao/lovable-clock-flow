
import React, { useState } from 'react';
import Header from '@/components/Header';
import StaffAnalyticsDashboard from '@/components/staff/StaffAnalyticsDashboard';
import { useUser } from '@/contexts/UserContext';
import { Navigate } from 'react-router-dom';

const StaffDashboard = () => {
  const { currentUser, isAdmin } = useUser();
  
  // Only allow admin users to access this page
  if (!currentUser || !(isAdmin() || currentUser.department === 'HR')) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header notificationCount={0} />
      
      <main className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">員工考勤分析儀表板</h1>
          <p className="text-gray-500">查看所有員工的考勤、請假和打卡狀況</p>
        </div>
        
        <StaffAnalyticsDashboard />
      </main>
    </div>
  );
};

export default StaffDashboard;
