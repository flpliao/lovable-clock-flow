
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "@/contexts/UserContext";
import { LeaveManagementProvider } from "@/contexts/LeaveManagementContext";
import { StaffManagementProvider } from "@/contexts/StaffManagementContext";
import { SchedulingProvider } from "@/contexts/SchedulingContext";
import Index from "./pages/Index";
import PersonalAttendance from "./pages/PersonalAttendance";
import CompanyAnnouncements from "./pages/CompanyAnnouncements";
import LeaveRequest from "./pages/LeaveRequest";
import LeaveApprovalView from "./pages/LeaveApprovalView";
import Scheduling from "./pages/Scheduling";
import PersonnelManagement from "./pages/PersonnelManagement";
import StaffDashboard from "./pages/StaffDashboard";
import AnnouncementManagementPage from "./pages/AnnouncementManagementPage";
import CompanyBranchManagement from "./pages/CompanyBranchManagement";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <UserProvider>
          <LeaveManagementProvider>
            <StaffManagementProvider>
              <SchedulingProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/personal-attendance" element={<PersonalAttendance />} />
                    <Route path="/company-announcements" element={<CompanyAnnouncements />} />
                    <Route path="/leave-request" element={<LeaveRequest />} />
                    <Route path="/leave-approval/:requestId" element={<LeaveApprovalView />} />
                    <Route path="/scheduling" element={<Scheduling />} />
                    <Route path="/company-branch-management" element={<CompanyBranchManagement />} />
                    <Route path="/personnel-management" element={<PersonnelManagement />} />
                    <Route path="/staff-dashboard" element={<StaffDashboard />} />
                    <Route path="/announcement-management" element={<AnnouncementManagementPage />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </SchedulingProvider>
            </StaffManagementProvider>
          </LeaveManagementProvider>
        </UserProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
