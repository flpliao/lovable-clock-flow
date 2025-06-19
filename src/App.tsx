import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import PersonnelManagement from '@/pages/PersonnelManagement';
import AnnouncementManagement from '@/pages/AnnouncementManagement';
import CompanyManagement from '@/pages/CompanyManagement';
import LeaveManagement from '@/pages/LeaveManagement';
import PayrollManagement from '@/pages/PayrollManagement';
import { UserProvider } from '@/contexts/UserContext';
import { QueryClient } from '@tanstack/react-query';
import { StaffManagementProvider } from '@/contexts/StaffManagementContext';

function App() {
  return (
    <QueryClient>
      <BrowserRouter>
        <UserProvider>
          <StaffManagementProvider>
            <div className="min-h-screen bg-gray-50">
              <Toaster />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/personnel" element={<PersonnelManagement />} />
                <Route path="/announcements" element={<AnnouncementManagement />} />
                <Route path="/company" element={<CompanyManagement />} />
                <Route path="/leave" element={<LeaveManagement />} />
                <Route path="/payroll" element={<PayrollManagement />} />
              </Routes>
            </div>
          </StaffManagementProvider>
        </UserProvider>
      </BrowserRouter>
    </QueryClient>
  );
}

export default App;
