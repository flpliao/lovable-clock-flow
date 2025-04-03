
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "@/contexts/UserContext";
import { StaffManagementProvider } from "@/contexts/StaffManagementContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import LeaveRequest from "./pages/LeaveRequest";
import PersonalAttendance from "./pages/PersonalAttendance";
import Scheduling from "./pages/Scheduling";
import StaffDashboard from "./pages/StaffDashboard";
import PersonnelManagement from "./pages/PersonnelManagement";
import LeaveApprovalView from "./pages/LeaveApprovalView";
import NotFound from "./pages/NotFound";

// Create a new QueryClient instance outside of the component
const queryClient = new QueryClient();

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <UserProvider>
          <StaffManagementProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/leave-request" element={<LeaveRequest />} />
                <Route path="/personal-attendance" element={<PersonalAttendance />} />
                <Route path="/scheduling" element={<Scheduling />} />
                <Route path="/staff-dashboard" element={<StaffDashboard />} />
                <Route path="/personnel-management" element={<PersonnelManagement />} />
                <Route path="/leave-approval/:requestId" element={<LeaveApprovalView />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </StaffManagementProvider>
        </UserProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
