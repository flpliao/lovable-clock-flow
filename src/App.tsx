
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider, useUser } from "@/contexts/UserContext";
import { LeaveManagementProvider } from "@/contexts/LeaveManagementContext";
import { StaffManagementProvider } from "@/contexts/StaffManagementContext";
import { SchedulingProvider } from "@/contexts/SchedulingContext";
import { initCredentialStore } from "@/utils/credentialStore";
import { useEffect } from "react";
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// 受保護的路由組件
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, isUserLoaded } = useUser();
  
  console.log('ProtectedRoute - User loaded:', isUserLoaded, 'Current user:', currentUser?.name);
  
  // 如果用戶上下文還未加載，顯示加載中
  if (!isUserLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p>載入中...</p>
        </div>
      </div>
    );
  }
  
  // 如果沒有用戶登錄，跳轉到登錄頁面
  if (!currentUser) {
    console.log('No current user, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// 應用路由組件
const AppRoutes = () => {
  const { currentUser, isUserLoaded } = useUser();
  
  console.log('AppRoutes - User loaded:', isUserLoaded, 'Current user:', currentUser?.name);
  
  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          currentUser ? <Navigate to="/" replace /> : <Login />
        } 
      />
      <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
      <Route path="/personal-attendance" element={<ProtectedRoute><PersonalAttendance /></ProtectedRoute>} />
      <Route path="/company-announcements" element={<ProtectedRoute><CompanyAnnouncements /></ProtectedRoute>} />
      <Route path="/leave-request" element={<ProtectedRoute><LeaveRequest /></ProtectedRoute>} />
      <Route path="/leave-approval/:requestId" element={<ProtectedRoute><LeaveApprovalView /></ProtectedRoute>} />
      <Route path="/scheduling" element={<ProtectedRoute><Scheduling /></ProtectedRoute>} />
      <Route path="/company-branch-management" element={<ProtectedRoute><CompanyBranchManagement /></ProtectedRoute>} />
      <Route path="/personnel-management" element={<ProtectedRoute><PersonnelManagement /></ProtectedRoute>} />
      <Route path="/staff-dashboard" element={<ProtectedRoute><StaffDashboard /></ProtectedRoute>} />
      <Route path="/announcement-management" element={<ProtectedRoute><AnnouncementManagementPage /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

function App() {
  useEffect(() => {
    // 初始化憑證儲存
    initCredentialStore();
    console.log('App initialized, credential store ready');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <UserProvider>
          <BrowserRouter>
            <Routes>
              {/* 登錄頁面不需要其他 Provider */}
              <Route path="/login" element={<Login />} />
              
              {/* 其他頁面才需要完整的 Provider 包裝 */}
              <Route path="/*" element={
                <LeaveManagementProvider>
                  <StaffManagementProvider>
                    <SchedulingProvider>
                      <AppRoutes />
                    </SchedulingProvider>
                  </StaffManagementProvider>
                </LeaveManagementProvider>
              } />
            </Routes>
          </BrowserRouter>
          <Toaster />
          <Sonner />
        </UserProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
