
import React from 'react';
import { useUser } from '@/contexts/UserContext';
import { Navigate } from 'react-router-dom';
import Header from '@/components/Header';
import WelcomeSection from '@/components/WelcomeSection';
import FeatureCards from '@/components/FeatureCards';
import DashboardStats from '@/components/DashboardStats';
import CheckInHistory from '@/components/CheckInHistory';
import LeaveBalance from '@/components/LeaveBalance';
import ShiftReminder from '@/components/ShiftReminder';

const Index = () => {
  const { currentUser, isAuthenticated, isUserLoaded } = useUser();

  // Show loading while checking authentication
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

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 relative overflow-hidden">
      {/* Header */}
      <Header />
      
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/80 via-blue-500/60 to-purple-600/80"></div>
      
      {/* Main content */}
      <div className="relative z-10 w-full min-h-screen pb-safe pt-24">
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {/* Welcome Section */}
          <WelcomeSection />
          
          {/* Stats Dashboard */}
          <DashboardStats />
          
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Left Column - Features */}
            <div className="lg:col-span-2">
              <FeatureCards />
            </div>
            
            {/* Right Column - Quick Info */}
            <div className="space-y-6">
              <LeaveBalance />
              <ShiftReminder />
            </div>
          </div>
          
          {/* Check-in History */}
          <CheckInHistory />
        </div>
      </div>
    </div>
  );
};

export default Index;
