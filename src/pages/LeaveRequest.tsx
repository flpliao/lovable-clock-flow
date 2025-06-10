
import React, { useState } from 'react';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-white">
      {/* Header */}
      <div className="bg-white/40 backdrop-blur-lg border-b border-white/20 shadow-sm">
        <div className="container mx-auto py-4 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-8 bg-orange-400 rounded-full"></div>
              <h1 className="text-2xl font-bold text-gray-800">請假管理</h1>
            </div>
            <div className="text-sm text-gray-600">Dreams POS</div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-6 px-4 space-y-6">
        {/* Shift Reminder Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/50 shadow-xl">
          <ShiftReminder />
        </div>
        
        {/* Leave Balance Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/50 shadow-xl">
          <LeaveBalance />
        </div>
        
        {/* Main Content Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/50 shadow-xl">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="p-6 border-b border-white/20">
              <TabsList className="grid w-full grid-cols-2 bg-white/60 backdrop-blur-xl rounded-xl border border-white/40 p-1">
                <TabsTrigger 
                  value="request" 
                  className="text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm rounded-lg font-medium transition-all duration-200"
                >
                  申請請假
                </TabsTrigger>
                <TabsTrigger 
                  value="view" 
                  className="text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm rounded-lg font-medium transition-all duration-200"
                >
                  查看請假
                </TabsTrigger>
              </TabsList>
            </div>
            
            <div className="p-6">
              <TabsContent value="request" className="mt-0">
                <LeaveRequestForm onSubmit={handleNewLeaveRequest} />
              </TabsContent>
              
              <TabsContent value="view" className="mt-0">
                {currentLeaveRequest ? (
                  <LeaveRequestDetail 
                    leaveRequest={currentLeaveRequest} 
                    isApprover={isApproverForRequest(currentLeaveRequest)}
                  />
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 font-medium">尚無進行中的請假申請</p>
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>
        
        {/* Leave History Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/50 shadow-xl">
          <LeaveHistory />
        </div>
      </div>
    </div>
  );
};

export default LeaveRequest;
