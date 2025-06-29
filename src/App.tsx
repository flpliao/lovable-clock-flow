
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "@/contexts/UserContext";
import { StaffManagementProvider } from "@/contexts/StaffManagementContext";
import Layout from "@/components/Layout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import LeaveManagement from "./pages/LeaveManagement";
import PersonnelManagement from "./pages/PersonnelManagement";
import CompanyManagement from "./pages/CompanyManagement";
import AnnouncementManagement from "./pages/AnnouncementManagement";
import CheckInManagement from "./pages/CheckInManagement";
import MissedCheckInManagement from "./pages/MissedCheckInManagement";
import OvertimeManagement from "./pages/OvertimeManagement";
import PayrollManagement from "./pages/PayrollManagement";
import PositionManagement from "./pages/PositionManagement";
import StaffDebugPage from "./pages/StaffDebugPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <UserProvider>
          <StaffManagementProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/debug/staff" element={<StaffDebugPage />} />
              <Route path="/" element={<Layout />}>
                <Route index element={<Index />} />
                <Route path="leave-management" element={<LeaveManagement />} />
                <Route path="personnel-management" element={<PersonnelManagement />} />
                <Route path="company-management" element={<CompanyManagement />} />
                <Route path="announcement-management" element={<AnnouncementManagement />} />
                <Route path="check-in-management" element={<CheckInManagement />} />
                <Route path="missed-checkin-management" element={<MissedCheckInManagement />} />
                <Route path="overtime-management" element={<OvertimeRequest />} />
                <Route path="payroll-management" element={<PayrollManagement />} />
                <Route path="position-management" element={<PositionManagement />} />
              </Route>
            </Routes>
          </StaffManagementProvider>
        </UserProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
