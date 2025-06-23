
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserProvider } from '@/contexts/UserContext';
import { LeaveManagementProvider } from '@/contexts/LeaveManagementContext';
import Layout from './components/Layout';
import Index from './pages/Index';
import Login from './pages/Login';
import LeaveRequest from './pages/LeaveRequest';
import ApprovalCenter from './pages/ApprovalCenter';
import SystemSettings from './pages/SystemSettings';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <LeaveManagementProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Layout><Index /></Layout>} />
              <Route path="/login" element={<Login />} />
              <Route path="/leave-request" element={<Layout><LeaveRequest /></Layout>} />
              <Route path="/approval-center" element={<Layout><ApprovalCenter /></Layout>} />
              <Route path="/system-settings" element={<Layout><SystemSettings /></Layout>} />
            </Routes>
          </Router>
        </LeaveManagementProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;
