
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
import { UserProvider } from '@/contexts/UserContext';
import { LeaveManagementProvider } from '@/contexts/LeaveManagementContext';
import { AnnouncementProvider } from '@/contexts/AnnouncementContext';
import { HolidayProvider } from '@/contexts/HolidayContext';
import { DepartmentProvider } from '@/contexts/DepartmentContext';
import { ScheduleProvider } from '@/contexts/ScheduleContext';
import { StaffProvider } from '@/contexts/StaffContext';
import { AttendanceProvider } from '@/contexts/AttendanceContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { Toaster } from '@/components/ui/toaster';
import { UnifiedPermissionService } from '@/services/unifiedPermissionService';

const App = () => {
  return (
    <>
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
      <Toaster />
    </>
  );
};

export default App;
