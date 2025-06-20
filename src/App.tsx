
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "@/contexts/UserContext";
import { LeaveManagementProvider } from "@/contexts/LeaveManagementContext";
import { SchedulingProvider } from "@/contexts/SchedulingContext";
import { StaffManagementProvider } from "@/contexts/StaffManagementContext";
import { DepartmentManagementProvider } from "@/components/departments/DepartmentManagementContext";
import Header from "@/components/Header";
import Index from "./pages/Index";
import Login from "./pages/Login";
import PersonalAttendance from "./pages/PersonalAttendance";
import LeaveRequest from "./pages/LeaveRequest";
import Scheduling from "./pages/Scheduling";
import HRManagement from "./pages/HRManagement";
import CompanyAnnouncements from "./pages/CompanyAnnouncements";
import AnnouncementManagementPage from "./pages/AnnouncementManagementPage";
import PersonnelManagement from "./pages/PersonnelManagement";
import CompanyBranchManagement from "./pages/CompanyBranchManagement";
import SystemSettings from "./pages/SystemSettings";
import HolidayManagement from "./pages/HolidayManagement";
import OvertimeManagement from "./pages/OvertimeManagement";
import LeaveApprovalView from "./pages/LeaveApprovalView";
import StaffDashboard from "./pages/StaffDashboard";
import NotFound from "./pages/NotFound";
import "./App.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <UserProvider>
          <LeaveManagementProvider>
            <SchedulingProvider>
              <StaffManagementProvider>
                <DepartmentManagementProvider>
                  <Toaster />
                  <Sonner />
                  <BrowserRouter>
                    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600">
                      <Header />
                      <main>
                        <Routes>
                          <Route path="/" element={<Index />} />
                          <Route path="/login" element={<Login />} />
                          <Route path="/personal-attendance" element={<PersonalAttendance />} />
                          <Route path="/leave-request" element={<LeaveRequest />} />
                          <Route path="/scheduling" element={<Scheduling />} />
                          <Route path="/overtime-management" element={<OvertimeManagement />} />
                          <Route path="/holiday-management" element={<HolidayManagement />} />
                          <Route path="/hr-management" element={<HRManagement />} />
                          <Route path="/company-announcements" element={<CompanyAnnouncements />} />
                          <Route path="/announcement-management" element={<AnnouncementManagementPage />} />
                          <Route path="/personnel-management" element={<PersonnelManagement />} />
                          <Route path="/company-branch-management" element={<CompanyBranchManagement />} />
                          <Route path="/system-settings" element={<SystemSettings />} />
                          <Route path="/leave-approval/:id" element={<LeaveApprovalView />} />
                          <Route path="/staff-dashboard" element={<StaffDashboard />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </main>
                    </div>
                  </BrowserRouter>
                </DepartmentManagementProvider>
              </StaffManagementProvider>
            </SchedulingProvider>
          </LeaveManagementProvider>
        </UserProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
