
import React, { useState } from 'react';
import Header from '@/components/Header';
import LeaveRequestForm from '@/components/LeaveRequestForm';
import LeaveBalance from '@/components/LeaveBalance';
import LeaveHistory from '@/components/LeaveHistory';
import ShiftReminder from '@/components/ShiftReminder';
import LeaveRequestDetail from '@/components/LeaveRequestDetail';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LeaveRequest as LeaveRequestType, ApprovalRecord } from '@/types';
import { useUser } from '@/contexts/UserContext';

// Mock leave request data for demo
const mockLeaveRequest: LeaveRequestType = {
  id: '4',
  user_id: '1',
  start_date: '2024-04-10',
  end_date: '2024-04-12',
  leave_type: 'annual',
  status: 'pending',
  hours: 24,
  reason: '個人休假',
  approval_level: 1,
  current_approver: '2',
  created_at: '2024-04-03T08:00:00Z',
  updated_at: '2024-04-03T08:00:00Z',
  approvals: [
    {
      id: '1',
      leave_request_id: '4',
      approver_id: '2',
      approver_name: '王小明',
      status: 'pending',
      level: 1
    },
    {
      id: '2',
      leave_request_id: '4',
      approver_id: '3',
      approver_name: '李經理',
      status: 'pending',
      level: 2
    },
    {
      id: '3',
      leave_request_id: '4',
      approver_id: '4',
      approver_name: '人事部 張小姐',
      status: 'pending',
      level: 3
    }
  ]
};

const LeaveRequest = () => {
  const [activeTab, setActiveTab] = useState<string>('request');
  const [leaveRequest, setLeaveRequest] = useState<LeaveRequestType | null>(mockLeaveRequest);
  const { currentUser } = useUser();
  
  // Mock function to check if current user is approver
  const isApprover = () => {
    // In a real app, you would check if the current user is an approver
    // For demo, let's assume the current user is an approver for level 1
    if (!leaveRequest) return false;
    
    const isCurrentApprover = leaveRequest.approvals?.some(
      a => a.level === leaveRequest.approval_level && a.approver_id === currentUser?.id
    );
    
    // For demo purposes, always return true
    return true; // In real app, return isCurrentApprover
  };
  
  // Function to handle leave request changes (approval/rejection)
  const handleLeaveRequestChange = (updatedRequest: LeaveRequestType) => {
    setLeaveRequest(updatedRequest);
  };
  
  // Function to handle new leave request submission
  const handleNewLeaveRequest = (newRequest: LeaveRequestType) => {
    setLeaveRequest(newRequest);
    setActiveTab('view');
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col gap-6">
        <Header />
        
        <ShiftReminder />
        
        <LeaveBalance />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="request">申請請假</TabsTrigger>
            <TabsTrigger value="view">查看請假</TabsTrigger>
          </TabsList>
          
          <TabsContent value="request">
            <LeaveRequestForm onSubmit={handleNewLeaveRequest} />
          </TabsContent>
          
          <TabsContent value="view">
            {leaveRequest ? (
              <LeaveRequestDetail 
                leaveRequest={leaveRequest} 
                onRequestChange={handleLeaveRequestChange}
                isApprover={isApprover()}
              />
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                尚無進行中的請假申請
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <LeaveHistory />
      </div>
    </div>
  );
};

export default LeaveRequest;
