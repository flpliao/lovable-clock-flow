
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { UserProvider } from '@/contexts/UserContext';
import { LeaveManagementProvider } from '@/contexts/LeaveManagementContext';
import Header from '@/components/Header';
import Home from '@/pages/Index';
import CheckIn from '@/pages/CheckIn';
import Attendance from '@/pages/Attendance';
import LeaveRequest from '@/pages/LeaveRequest';
import Overtime from '@/pages/Overtime';
import Schedule from '@/pages/Schedule';
import ApprovalCenter from '@/pages/ApprovalCenter';
import StaffManagement from '@/pages/StaffManagement';
import PayrollManagement from '@/pages/PayrollManagement';
import LeaveTypeManagement from '@/pages/LeaveTypeManagement';
import DepartmentManagement from '@/pages/DepartmentManagement';
import CompanyManagementRedesigned from '@/pages/CompanyManagementRedesigned';
import AnnouncementManagement from '@/pages/AnnouncementManagement';
import HolidaySettings from '@/pages/HolidaySettings';
import SystemSettings from '@/pages/SystemSettings';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <UserProvider>
          <LeaveManagementProvider>
            <div className="min-h-screen bg-gray-50">
              <Header />
              <Toaster />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/check-in" element={<CheckIn />} />
                <Route path="/attendance" element={<Attendance />} />
                <Route path="/leave-request" element={<LeaveRequest />} />
                <Route path="/overtime" element={<Overtime />} />
                <Route path="/schedule" element={<Schedule />} />
                <Route path="/approval-center" element={<ApprovalCenter />} />
                <Route path="/staff" element={<StaffManagement />} />
                <Route path="/payroll" element={<PayrollManagement />} />
                <Route path="/leave-type-management" element={<LeaveTypeManagement />} />
                <Route path="/departments" element={<DepartmentManagement />} />
                <Route path="/company" element={<CompanyManagementRedesigned />} />
                <Route path="/announcements" element={<AnnouncementManagement />} />
                <Route path="/holiday-settings" element={<HolidaySettings />} />
                <Route path="/system-settings" element={<SystemSettings />} />
              </Routes>
            </div>
          </LeaveManagementProvider>
        </UserProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
