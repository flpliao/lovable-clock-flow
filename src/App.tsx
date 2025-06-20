
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from '@/contexts/UserContext';
import { LeaveManagementProvider } from '@/contexts/LeaveManagementContext';
import { SchedulingProvider } from '@/contexts/SchedulingContext';
import { DepartmentManagementProvider } from '@/components/departments/DepartmentManagementContext';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { initCredentialStore } from '@/utils/credentialStore';
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
  // 在應用程式啟動時初始化憑證存儲
  useEffect(() => {
    console.log('🚀 應用程式啟動，初始化憑證存儲');
    initCredentialStore();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <DepartmentManagementProvider>
          <LeaveManagementProvider>
            <SchedulingProvider>
              <Router>
                <div className="w-full min-h-screen">
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
                  <Toaster />
                  <Sonner />
                </div>
              </Router>
            </SchedulingProvider>
          </LeaveManagementProvider>
        </DepartmentManagementProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;
