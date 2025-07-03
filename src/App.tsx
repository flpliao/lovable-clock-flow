import { Toaster } from '@/components/ui/toaster';
import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

// 不再需要 UserProvider！
import Header from '@/components/Header';
import { LeaveManagementProvider } from '@/contexts/LeaveManagementContext';
import { useAutoInitAuth } from '@/hooks/useStores'; // 自動初始化認證

// Auth pages
import AccountSettings from '@/pages/AccountSettings';
import AuthCallback from '@/pages/AuthCallback';
import ForgotPassword from '@/pages/ForgotPassword';
import Login from '@/pages/Login';
import MagicLinkLogin from '@/pages/MagicLinkLogin';
import Register from '@/pages/Register';
import ResetPassword from '@/pages/ResetPassword';

// Main pages
import Index from '@/pages/Index';
import LeaveRequest from '@/pages/LeaveRequest';
import OvertimeHistoryPage from '@/pages/OvertimeHistoryPage';
import OvertimeRequest from '@/pages/OvertimeRequest';
import PersonalAttendance from '@/pages/PersonalAttendance';
import StaffDashboard from '@/pages/StaffDashboard';

// Management pages
import AnnouncementManagementPage from '@/pages/AnnouncementManagementPage';
import ApprovalCenter from '@/pages/ApprovalCenter';
import CompanyAnnouncements from '@/pages/CompanyAnnouncements';
import CompanyBranchManagement from '@/pages/CompanyBranchManagement';
import HolidayManagement from '@/pages/HolidayManagement';
import HRManagement from '@/pages/HRManagement';
import LeaveTypeManagement from '@/pages/LeaveTypeManagement';
import MissedCheckinManagement from '@/pages/MissedCheckinManagement';
import OvertimeManagement from '@/pages/OvertimeManagement';
import OvertimeManagementPage from '@/pages/OvertimeManagementPage';
import OvertimeRequestPage from '@/pages/OvertimeRequestPage';
import PersonnelManagement from '@/pages/PersonnelManagement';
import ScheduleStatistics from '@/pages/ScheduleStatistics';
import Scheduling from '@/pages/Scheduling';
import SystemSettings from '@/pages/SystemSettings';

// 404 page
import NotFound from '@/pages/NotFound';

// 認證初始化組件（替代 UserProvider）
const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 自動初始化認證系統
  useAutoInitAuth();
  
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      {/* 🎉 不再需要 UserProvider！ */}
      <AuthInitializer>
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
      </AuthInitializer>
    </Router>
  );
}

export default App; 