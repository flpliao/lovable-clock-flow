
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './pages/Index';
import PersonalAttendance from './pages/PersonalAttendance';
import LeaveRequest from './pages/LeaveRequest';
import CompanyAnnouncements from './pages/CompanyAnnouncements';
import ManagementDashboard from './pages/StaffDashboard';
import StaffManagement from './pages/PersonnelManagement';
import ScheduleManagement from './pages/Scheduling';
import ApprovalCenter from './pages/ApprovalCenter';
import PayrollManagement from './pages/HRManagement';
import { Toaster } from '@/components/ui/toaster';
import AnnouncementManagement from './pages/AnnouncementManagementPage';
import LeaveManagement from './pages/LeaveTypeManagement';
import MissedCheckinManagement from './pages/MissedCheckinManagement';
// Import LocationCheckIn component for the check-in page
import LocationCheckIn from './components/LocationCheckIn';

// Create a simple CheckIn page component
const CheckIn = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-purple-600 pt-32 md:pt-36">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <LocationCheckIn />
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/check-in" element={<CheckIn />} />
            <Route path="/personal-attendance" element={<PersonalAttendance />} />
            <Route path="/leave-request" element={<LeaveRequest />} />
            <Route path="/company-announcements" element={<CompanyAnnouncements />} />
            <Route path="/management-dashboard" element={<ManagementDashboard />} />
            <Route path="/staff-management" element={<StaffManagement />} />
            <Route path="/schedule-management" element={<ScheduleManagement />} />
            <Route path="/approval-center" element={<ApprovalCenter />} />
            <Route path="/payroll-management" element={<PayrollManagement />} />
            <Route path="/announcement-management" element={<AnnouncementManagement />} />
            <Route path="/leave-management" element={<LeaveManagement />} />
            <Route path="/missed-checkin-management" element={<MissedCheckinManagement />} />
          </Routes>
        </main>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
