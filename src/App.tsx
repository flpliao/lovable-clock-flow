import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from '@/pages/LoginPage';
import StaffManagement from '@/pages/StaffManagement';
import LeaveRequest from '@/pages/LeaveRequest';
import AnnouncementManagement from '@/pages/AnnouncementManagement';
import HolidayManagement from '@/pages/HolidayManagement';
import DepartmentManagement from '@/pages/DepartmentManagement';
import ScheduleManagement from '@/pages/ScheduleManagement';
import AttendancePage from '@/pages/AttendancePage';
import ApprovalCenter from '@/pages/ApprovalCenter';
import HRManagement from '@/pages/HRManagement';
import OvertimeManagement from '@/pages/OvertimeManagement';
import OvertimeRequestPage from '@/pages/OvertimeRequest';
import MissedCheckinRequestPage from '@/pages/MissedCheckinRequestPage';
import Dashboard from '@/pages/Dashboard';
import { UserProvider } from '@/contexts/UserContext';
import { LeaveManagementProvider } from '@/contexts/LeaveManagementContext';
import { AnnouncementProvider } from '@/contexts/AnnouncementContext';
import { HolidayProvider } from '@/contexts/HolidayContext';
import { DepartmentProvider } from '@/contexts/DepartmentContext';
import { ScheduleProvider } from '@/contexts/ScheduleContext';
import { StaffProvider } from '@/contexts/StaffContext';
import { AttendanceProvider } from '@/contexts/AttendanceContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { ToastProvider } from '@/components/ui/use-toast';
import { UnifiedPermissionService } from '@/services/unifiedPermissionService';

const App = () => {
  return (
    <ToastProvider>
      <NotificationProvider>
        <UserProvider>
          <StaffProvider>
            <AnnouncementProvider>
              <HolidayProvider>
                <DepartmentProvider>
                  <ScheduleProvider>
                    <AttendanceProvider>
                      <LeaveManagementProvider>
                        <Router>
                          <div className="min-h-screen bg-gray-50">
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
                    </AttendanceProvider>
                  </ScheduleProvider>
                </DepartmentProvider>
              </HolidayProvider>
            </AnnouncementProvider>
          </StaffProvider>
        </UserProvider>
      </NotificationProvider>
    </ToastProvider>
  );
};

export default App;
