
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from '@/contexts/UserContext';
import Index from './pages/Index';
import Login from './pages/Login';
import LeaveRequest from './pages/LeaveRequest';
import ApprovalCenter from './pages/ApprovalCenter';
import SystemSettings from './pages/SystemSettings';

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/leave-request" element={<LeaveRequest />} />
          <Route path="/approval-center" element={<ApprovalCenter />} />
          <Route path="/system-settings" element={<SystemSettings />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
