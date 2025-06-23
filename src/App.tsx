
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from '@/contexts/UserContext';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import CheckIn from './pages/CheckIn';
import LeaveRequest from './pages/LeaveRequest';
import LeaveHistory from './pages/LeaveHistory';
import CompanyManagement from './pages/CompanyManagement';
import StaffManagement from './pages/StaffManagement';
import AnnouncementsManagement from './pages/AnnouncementsManagement';
import SchedulesManagement from './pages/SchedulesManagement';
import ApprovalCenter from './pages/ApprovalCenter';
import NotificationCenter from './pages/NotificationCenter';
import AttendanceManagement from './pages/AttendanceManagement';
import AttendanceExceptionManagement from './pages/AttendanceExceptionManagement';
import PayrollManagement from './pages/PayrollManagement';
import SystemSettings from './pages/SystemSettings';
import AttendanceReports from './pages/AttendanceReports';
import MissedCheckin from './pages/MissedCheckin';

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/check-in" element={<CheckIn />} />
          <Route path="/leave-request" element={<LeaveRequest />} />
          <Route path="/leave-history" element={<LeaveHistory />} />
          <Route path="/company-management" element={<CompanyManagement />} />
          <Route path="/staff-management" element={<StaffManagement />} />
          <Route path="/announcements-management" element={<AnnouncementsManagement />} />
          <Route path="/schedules-management" element={<SchedulesManagement />} />
          <Route path="/approval-center" element={<ApprovalCenter />} />
          <Route path="/notifications" element={<NotificationCenter />} />
          <Route path="/attendance-management" element={<AttendanceManagement />} />
          <Route path="/attendance-exception-management" element={<AttendanceExceptionManagement />} />
          <Route path="/payroll-management" element={<PayrollManagement />} />
          <Route path="/system-settings" element={<SystemSettings />} />
          <Route path="/attendance-reports" element={<AttendanceReports />} />
          <Route path="/missed-checkin" element={<MissedCheckin />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
