import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';

import { UserProvider } from '@/contexts/UserContext';
import { LeaveManagementProvider } from '@/contexts/LeaveManagementContext';
import Header from '@/components/Header';

// Auth pages
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import MagicLinkLogin from '@/pages/MagicLinkLogin';
import AuthCallback from '@/pages/AuthCallback';
import AccountSettings from '@/pages/AccountSettings';

// Main pages
import Index from '@/pages/Index';
import StaffDashboard from '@/pages/StaffDashboard';
import PersonalAttendance from '@/pages/PersonalAttendance';
import LeaveRequest from '@/pages/LeaveRequest';
import OvertimeRequest from '@/pages/OvertimeRequest';
import OvertimeHistoryPage from '@/pages/OvertimeHistoryPage';

// Management pages
import Scheduling from '@/pages/Scheduling';
import ScheduleStatistics from '@/pages/ScheduleStatistics';
import PersonnelManagement from '@/pages/PersonnelManagement';
import CompanyBranchManagement from '@/pages/CompanyBranchManagement';
import HRManagement from '@/pages/HRManagement';
import ApprovalCenter from '@/pages/ApprovalCenter';
import SystemSettings from '@/pages/SystemSettings';
import HolidayManagement from '@/pages/HolidayManagement';
import LeaveTypeManagement from '@/pages/LeaveTypeManagement';
import MissedCheckinManagement from '@/pages/MissedCheckinManagement';
import OvertimeManagement from '@/pages/OvertimeManagement';
import OvertimeManagementPage from '@/pages/OvertimeManagementPage';
import OvertimeRequestPage from '@/pages/OvertimeRequestPage';
import AnnouncementManagementPage from '@/pages/AnnouncementManagementPage';
import CompanyAnnouncements from '@/pages/CompanyAnnouncements';

// 404 page
import NotFound from '@/pages/NotFound';

function App() {
  return (
    <Router>
      <UserProvider>
        <LeaveManagementProvider>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/magic-link" element={<MagicLinkLogin />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/account-settings" element={<AccountSettings />} />
              <Route path="/staff-dashboard" element={<StaffDashboard />} />
              <Route path="/personal-attendance" element={<PersonalAttendance />} />
              <Route path="/leave-request" element={<LeaveRequest />} />
              <Route path="/overtime-request" element={<OvertimeRequest />} />
              <Route path="/overtime-history" element={<OvertimeHistoryPage />} />
              <Route path="/scheduling" element={<Scheduling />} />
              <Route path="/schedule-statistics" element={<ScheduleStatistics />} />
              <Route path="/personnel-management" element={<PersonnelManagement />} />
              <Route path="/company-branch-management" element={<CompanyBranchManagement />} />
              <Route path="/hr-management" element={<HRManagement />} />
              <Route path="/approval-center" element={<ApprovalCenter />} />
              <Route path="/system-settings" element={<SystemSettings />} />
              <Route path="/holiday-management" element={<HolidayManagement />} />
              <Route path="/leave-type-management" element={<LeaveTypeManagement />} />
              <Route path="/missed-checkin-management" element={<MissedCheckinManagement />} />
              <Route path="/overtime-management" element={<OvertimeManagement />} />
              <Route path="/overtime-management-page" element={<OvertimeManagementPage />} />
              <Route path="/overtime-request-page" element={<OvertimeRequestPage />} />
              <Route path="/announcement-management" element={<AnnouncementManagementPage />} />
              <Route path="/company-announcements" element={<CompanyAnnouncements />} />
              <Route path="/auth/reset-password" element={<ResetPassword />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </div>
        </LeaveManagementProvider>
      </UserProvider>
    </Router>
  );
}

export default App;
