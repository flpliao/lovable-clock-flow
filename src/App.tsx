
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import PersonnelManagement from '@/pages/PersonnelManagement';
import AnnouncementManagementPage from '@/pages/AnnouncementManagementPage';
import { UserProvider } from '@/contexts/UserContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StaffManagementProvider } from '@/contexts/StaffManagementContext';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <UserProvider>
          <StaffManagementProvider>
            <div className="min-h-screen bg-gray-50">
              <Toaster />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/personnel" element={<PersonnelManagement />} />
                <Route path="/announcements" element={<AnnouncementManagementPage />} />
              </Routes>
            </div>
          </StaffManagementProvider>
        </UserProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
