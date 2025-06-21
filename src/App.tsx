import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from '@/contexts/UserContext';
import { LeaveManagementProvider } from '@/contexts/LeaveManagementContext';
import Header from '@/components/Header';
import Index from './pages/Index';
import Login from './pages/Login';
import PersonnelManagement from './pages/PersonnelManagement';
import Scheduling from './pages/Scheduling';
import ScheduleStatistics from './pages/ScheduleStatistics';
import SystemSettings from './pages/SystemSettings';
import LeaveRequest from './pages/LeaveRequest';
import PersonalAttendance from './pages/PersonalAttendance';
import AnnouncementManagementPage from './pages/AnnouncementManagementPage';
import CompanyAnnouncements from './pages/CompanyAnnouncements';
import LeaveApprovalView from './pages/LeaveApprovalView';
import NotFound from './pages/NotFound';
import StaffDashboard from './pages/StaffDashboard';
import CompanyBranchManagement from './pages/CompanyBranchManagement';
import HRManagement from './pages/HRManagement';
import OvertimeManagement from './pages/OvertimeManagement';
import HolidayManagement from './pages/HolidayManagement';
import MissedCheckinManagement from './pages/MissedCheckinManagement';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <UserProvider>
            <LeaveManagementProvider>
              <Header />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/personnel-management" element={<PersonnelManagement />} />
                <Route path="/scheduling" element={<Scheduling />} />
                <Route path="/schedule-statistics" element={<ScheduleStatistics />} />
                <Route path="/system-settings" element={<SystemSettings />} />
                <Route path="/leave-request" element={<LeaveRequest />} />
                <Route path="/personal-attendance" element={<PersonalAttendance />} />
                <Route path="/announcement-management" element={<AnnouncementManagementPage />} />
                <Route path="/company-announcements" element={<CompanyAnnouncements />} />
                <Route path="/leave-approval" element={<LeaveApprovalView />} />
                <Route path="/staff-dashboard" element={<StaffDashboard />} />
                <Route path="/company-branch-management" element={<CompanyBranchManagement />} />
                <Route path="/hr-management" element={<HRManagement />} />
                <Route path="/overtime-management" element={<OvertimeManagement />} />
                <Route path="/holiday-management" element={<HolidayManagement />} />
                <Route path="/missed-checkin-management" element={<MissedCheckinManagement />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </LeaveManagementProvider>
          </UserProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
