
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from '@/contexts/UserContext';
import { LeaveManagementProvider } from '@/contexts/LeaveManagementContext';
import { SchedulingProvider } from '@/contexts/SchedulingContext';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Header from '@/components/Header';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import LeaveRequest from '@/pages/LeaveRequest';
import PersonalAttendance from '@/pages/PersonalAttendance';
import Scheduling from '@/pages/Scheduling';
import OvertimeManagement from '@/pages/OvertimeManagement';
import HolidayManagement from '@/pages/HolidayManagement';
import CompanyAnnouncements from '@/pages/CompanyAnnouncements';
import AnnouncementManagementPage from '@/pages/AnnouncementManagementPage';
import PersonnelManagement from '@/pages/PersonnelManagement';
import CompanyBranchManagement from '@/pages/CompanyBranchManagement';
import StaffDashboard from '@/pages/StaffDashboard';
import LeaveApprovalView from '@/pages/LeaveApprovalView';
import SystemSettings from '@/pages/SystemSettings';
import HRManagement from '@/pages/HRManagement';
import NotFound from '@/pages/NotFound';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <LeaveManagementProvider>
          <SchedulingProvider>
            <Router>
              <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 relative overflow-hidden">
                {/* 動態背景漸層 */}
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/80 via-blue-500/60 to-purple-600/80"></div>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent"></div>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-400/20 via-transparent to-transparent"></div>
                
                {/* 浮動光點效果 */}
                <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-white/30 rounded-full animate-pulse"></div>
                <div className="absolute top-3/5 right-1/3 w-2 h-2 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-1/2 left-2/3 w-1 h-1 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: '4s' }}></div>
                <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-blue-200/40 rounded-full animate-pulse" style={{ animationDelay: '6s' }}></div>
                
                <div className="relative z-10">
                  <Header />
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/leave-request" element={<LeaveRequest />} />
                    <Route path="/personal-attendance" element={<PersonalAttendance />} />
                    <Route path="/scheduling" element={<Scheduling />} />
                    <Route path="/overtime-management" element={<OvertimeManagement />} />
                    <Route path="/holiday-management" element={<HolidayManagement />} />
                    <Route path="/company-announcements" element={<CompanyAnnouncements />} />
                    <Route path="/announcement-management" element={<AnnouncementManagementPage />} />
                    <Route path="/personnel-management" element={<PersonnelManagement />} />
                    <Route path="/company-branch-management" element={<CompanyBranchManagement />} />
                    <Route path="/staff-dashboard" element={<StaffDashboard />} />
                    <Route path="/leave-approval/:requestId" element={<LeaveApprovalView />} />
                    <Route path="/system-settings" element={<SystemSettings />} />
                    <Route path="/hr-management" element={<HRManagement />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
                <Toaster />
                <Sonner />
              </div>
            </Router>
          </SchedulingProvider>
        </LeaveManagementProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;
