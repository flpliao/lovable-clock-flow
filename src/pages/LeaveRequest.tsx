
import React, { useState } from 'react';
import { NewLeaveRequestForm } from '@/components/leave/NewLeaveRequestForm';
import LeaveBalance from '@/components/LeaveBalance';
import LeaveHistory from '@/components/LeaveHistory';
import ShiftReminder from '@/components/ShiftReminder';
import LeaveRequestDetail from '@/components/LeaveRequestDetail';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLeaveManagementContext } from '@/contexts/LeaveManagementContext';
import { PiggyBank, FileText, History } from 'lucide-react';

const LeaveRequest = () => {
  const [activeTab, setActiveTab] = useState<string>('request');
  const {
    currentLeaveRequest,
    isApproverForRequest
  } = useLeaveManagementContext();

  // Function to handle new leave request submission
  const handleNewLeaveRequest = () => {
    setActiveTab('view');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400/35 via-blue-300/25 to-blue-200/15 pt-32 md:pt-36">
      <div className="w-full px-4 sm:px-6 lg:px-8 pb-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Shift Reminder */}
          <ShiftReminder />

          {/* Main Content */}
          <div className="backdrop-blur-2xl bg-gradient-to-br from-white/75 to-white/55 border border-white/40 rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 border-b border-white/30">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500/90 rounded-xl flex items-center justify-center">
                  <FileText className="h-4 w-4 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">請假管理</h2>
              </div>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="p-6 border-b border-white/30">
                <TabsList className="grid w-full grid-cols-2 bg-white/30 backdrop-blur-sm rounded-lg p-1 h-12">
                  <TabsTrigger 
                    value="request" 
                    className="text-gray-700 data-[state=active]:bg-white/80 data-[state=active]:text-gray-900 data-[state=active]:shadow-sm rounded-md font-medium transition-all duration-200 py-2 px-4"
                  >
                    申請請假
                  </TabsTrigger>
                  <TabsTrigger 
                    value="view" 
                    className="text-gray-700 data-[state=active]:bg-white/80 data-[state=active]:text-gray-900 data-[state=active]:shadow-sm rounded-md font-medium transition-all duration-200 py-2 px-4"
                  >
                    查看請假
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <div className="p-6">
                <TabsContent value="request" className="mt-0">
                  <NewLeaveRequestForm onSubmit={handleNewLeaveRequest} />
                </TabsContent>
                
                <TabsContent value="view" className="mt-0">
                  {currentLeaveRequest ? (
                    <LeaveRequestDetail 
                      leaveRequest={currentLeaveRequest} 
                      isApprover={isApproverForRequest(currentLeaveRequest)} 
                    />
                  ) : (
                    <div className="text-center py-16">
                      <div className="w-16 h-16 bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <p className="text-gray-700 font-medium">尚無進行中的請假申請</p>
                      <p className="text-gray-600 mt-1">您可以在申請請假頁面提交新的請假申請</p>
                    </div>
                  )}
                </TabsContent>
              </div>
            </Tabs>
          </div>
          
          {/* Leave History */}
          <div className="backdrop-blur-2xl bg-gradient-to-br from-white/75 to-white/55 border border-white/40 rounded-2xl shadow-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-purple-500/90 rounded-xl flex items-center justify-center">
                <History className="h-4 w-4 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">請假記錄</h2>
            </div>
            <LeaveHistory />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequest;
