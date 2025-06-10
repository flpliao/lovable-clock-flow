
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
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-blue-600 relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-purple-300/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 right-1/4 w-60 h-60 bg-blue-300/15 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <div className="bg-white/20 backdrop-blur-2xl border-b border-white/30 shadow-lg relative z-10">
        <div className="container mx-auto py-6 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-4 h-10 bg-gradient-to-b from-orange-400 to-orange-500 rounded-full shadow-lg"></div>
              <h1 className="text-3xl font-bold text-white drop-shadow-lg">請假管理</h1>
            </div>
            <div className="text-sm text-white/80 font-medium drop-shadow-md">Dreams POS</div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4 space-y-8 relative z-10">
        {/* Shift Reminder Card */}
        <div className="bg-white/20 backdrop-blur-2xl rounded-3xl border border-white/30 shadow-2xl hover:bg-white/25 transition-all duration-300">
          <ShiftReminder />
        </div>
        
        {/* Leave Balance Card */}
        <div className="bg-white/20 backdrop-blur-2xl rounded-3xl border border-white/30 shadow-2xl hover:bg-white/25 transition-all duration-300">
          <LeaveBalance />
        </div>
        
        {/* Main Content Card */}
        <div className="bg-white/20 backdrop-blur-2xl rounded-3xl border border-white/30 shadow-2xl overflow-hidden hover:bg-white/25 transition-all duration-300">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="p-8 border-b border-white/20">
              <TabsList className="grid w-full grid-cols-2 bg-white/30 backdrop-blur-xl rounded-2xl border border-white/40 p-2 shadow-lg">
                <TabsTrigger 
                  value="request" 
                  className="text-white/80 data-[state=active]:bg-white/40 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-semibold transition-all duration-300 py-3"
                >
                  申請請假
                </TabsTrigger>
                <TabsTrigger 
                  value="view" 
                  className="text-white/80 data-[state=active]:bg-white/40 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-semibold transition-all duration-300 py-3"
                >
                  查看請假
                </TabsTrigger>
              </TabsList>
            </div>
            
            <div className="p-8">
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
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-xl border border-white/30 shadow-lg">
                      <svg className="w-10 h-10 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-white/80 font-semibold text-lg drop-shadow-md">尚無進行中的請假申請</p>
                    <p className="text-white/60 mt-2 drop-shadow-md">您可以在申請請假頁面提交新的請假申請</p>
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>
        
        {/* Leave History Card */}
        <div className="bg-white/20 backdrop-blur-2xl rounded-3xl border border-white/30 shadow-2xl hover:bg-white/25 transition-all duration-300">
          <LeaveHistory />
        </div>
      </div>
    </div>
  );
};

export default LeaveRequest;
