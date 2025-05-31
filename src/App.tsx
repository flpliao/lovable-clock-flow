
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
              <div className="min-h-screen bg-gray-50">
                <Header />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/leave-request" element={<LeaveRequest />} />
                  <Route path="/personal-attendance" element={<PersonalAttendance />} />
                  <Route path="/scheduling" element={<Scheduling />} />
                  <Route path="/overtime-management" element={<OvertimeManagement />} />
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
            </Router>
          </SchedulingProvider>
        </LeaveManagementProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;
