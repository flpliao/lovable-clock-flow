
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "@/contexts/UserContext";
import { StaffManagementProvider } from "@/contexts/StaffManagementContext";
import Header from "@/components/Header";
import Index from "./pages/Index";
import Login from "./pages/Login";
import PersonnelManagement from "./pages/PersonnelManagement";
import OvertimeManagement from "./pages/OvertimeManagement";
import StaffDebugPage from "./pages/StaffDebugPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Layout component for authenticated pages
const Layout = () => (
  <div className="min-h-screen bg-gray-50">
    <Header />
    <main className="container mx-auto px-4 py-8">
      <Routes>
        <Route index element={<Index />} />
        <Route path="personnel-management" element={<PersonnelManagement />} />
        <Route path="overtime-management" element={<OvertimeManagement />} />
      </Routes>
    </main>
  </div>
);

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
              <Route path="/*" element={<Layout />} />
            </Routes>
          </StaffManagementProvider>
        </UserProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
