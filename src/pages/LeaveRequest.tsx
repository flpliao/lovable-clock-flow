
import React, { useState } from 'react';
import Header from '@/components/Header';
import LeaveRequestForm from '@/components/LeaveRequestForm';
import LeaveBalance from '@/components/LeaveBalance';
import LeaveHistory from '@/components/LeaveHistory';
import ShiftReminder from '@/components/ShiftReminder';
import LeaveRequestDetail from '@/components/LeaveRequestDetail';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LeaveRequest as LeaveRequestType } from '@/types';
import { useLeaveManagementContext } from '@/contexts/LeaveManagementContext';

const LeaveRequest = () => {
  const [activeTab, setActiveTab] = useState<string>('request');
  const { currentLeaveRequest, isApproverForRequest } = useLeaveManagementContext();
  
  // Function to handle new leave request submission
  const handleNewLeaveRequest = () => {
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
            {currentLeaveRequest ? (
              <LeaveRequestDetail 
                leaveRequest={currentLeaveRequest} 
                isApprover={isApproverForRequest(currentLeaveRequest)}
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
