
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from '@/pages/Login';
import StaffManagement from '@/pages/PersonnelManagement';
import LeaveRequest from '@/pages/LeaveRequest';
import AnnouncementManagement from '@/pages/AnnouncementManagementPage';
import HolidayManagement from '@/pages/HolidayManagement';
import DepartmentManagement from '@/pages/CompanyBranchManagement';
import ScheduleManagement from '@/pages/Scheduling';
import AttendancePage from '@/pages/PersonalAttendance';
import ApprovalCenter from '@/pages/ApprovalCenter';
import HRManagement from '@/pages/HRManagement';
import OvertimeManagement from '@/pages/OvertimeManagement';
import OvertimeRequestPage from '@/pages/OvertimeRequest';
import MissedCheckinRequestPage from '@/pages/MissedCheckinManagement';
import Dashboard from '@/pages/Index';
import Header from '@/components/Header';
import { UserProvider } from '@/contexts/UserContext';
import { LeaveManagementProvider } from '@/contexts/LeaveManagementContext';
import { Toaster } from '@/components/ui/toaster';

const App = () => {
  return (
    <>
      <UserProvider>
        <LeaveManagementProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Header />
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/staff-management" element={<StaffManagement />} />
                <Route path="/leave-request" element={<LeaveRequest />} />
                <Route path="/announcement-management" element={<AnnouncementManagement />} />
                <Route path="/holiday-management" element={<HolidayManagement />} />
                <Route path="/department-management" element={<DepartmentManagement />} />
                <Route path="/schedule-management" element={<ScheduleManagement />} />
                <Route path="/attendance" element={<AttendancePage />} />
                <Route path="/approval-center" element={<ApprovalCenter />} />
                <Route path="/hr-management" element={<HRManagement />} />
                <Route path="/overtime-management" element={<OvertimeManagement />} />
                <Route path="/missed-checkin-request" element={<MissedCheckinRequestPage />} />
                <Route path="/" element={<Dashboard />} />
                <Route path="/overtime-request" element={<OvertimeRequestPage />} />
              </Routes>
            </div>
          </Router>
        </LeaveManagementProvider>
      </UserProvider>
      <Toaster />
    </>
  );
};

export default App;
