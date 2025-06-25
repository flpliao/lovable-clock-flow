
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from '@/pages/Login';
import LeaveRequest from '@/pages/LeaveRequest';
import AnnouncementManagementPage from '@/pages/AnnouncementManagementPage';
import HolidayManagement from '@/pages/HolidayManagement';
import ApprovalCenter from '@/pages/ApprovalCenter';
import HRManagement from '@/pages/HRManagement';
import OvertimeManagement from '@/pages/OvertimeManagement';
import OvertimeRequestPage from '@/pages/OvertimeRequest';
import MissedCheckinManagement from '@/pages/MissedCheckinManagement';
import CompanyBranchManagement from '@/pages/CompanyBranchManagement';
import Index from '@/pages/Index';
import PersonalAttendance from '@/pages/PersonalAttendance';
import { UserProvider } from '@/contexts/UserContext';
import { LeaveManagementProvider } from '@/contexts/LeaveManagementContext';
import { Toaster } from '@/components/ui/toaster';

const App = () => {
  return (
    <>
      <Toaster />
      <UserProvider>
        <LeaveManagementProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/leave-request" element={<LeaveRequest />} />
                <Route path="/announcement-management" element={<AnnouncementManagementPage />} />
                <Route path="/holiday-management" element={<HolidayManagement />} />
                <Route path="/attendance" element={<PersonalAttendance />} />
                <Route path="/approval-center" element={<ApprovalCenter />} />
                <Route path="/hr-management" element={<HRManagement />} />
                <Route path="/overtime-management" element={<OvertimeManagement />} />
                <Route path="/missed-checkin-management" element={<MissedCheckinManagement />} />
                <Route path="/company-branch-management" element={<CompanyBranchManagement />} />
                <Route path="/" element={<Index />} />
                <Route path="/overtime-request" element={<OvertimeRequestPage />} />
              </Routes>
            </div>
          </Router>
        </LeaveManagementProvider>
      </UserProvider>
    </>
  );
};

export default App;
