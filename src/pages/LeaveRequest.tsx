
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-32 md:pt-36">
      <div className="w-full px-4 sm:px-6 lg:px-8 pb-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Shift Reminder */}
          <ShiftReminder />

          {/* Main Content */}
          <div className="bg-white/95 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-lg">
            <div className="p-6 border-b border-gray-200/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-sm">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">請假管理</h2>
              </div>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="px-6 pt-6">
                <TabsList className="grid w-full grid-cols-2 bg-gray-100/80 border border-gray-200/50 rounded-xl p-1 h-12">
                  <TabsTrigger 
                    value="request" 
                    className="text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm rounded-lg font-medium transition-all duration-200 py-2 px-4"
                  >
                    申請請假
                  </TabsTrigger>
                  <TabsTrigger 
                    value="view" 
                    className="text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm rounded-lg font-medium transition-all duration-200 py-2 px-4"
                  >
                    查看請假
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <div className="px-6 pb-6">
                <TabsContent value="request" className="mt-6">
                  <NewLeaveRequestForm onSubmit={handleNewLeaveRequest} />
                </TabsContent>
                
                <TabsContent value="view" className="mt-6">
                  {currentLeaveRequest ? (
                    <LeaveRequestDetail 
                      leaveRequest={currentLeaveRequest} 
                      isApprover={isApproverForRequest(currentLeaveRequest)} 
                    />
                  ) : (
                    <div className="text-center py-16">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <p className="text-gray-600 font-medium">尚無進行中的請假申請</p>
                      <p className="text-gray-500 mt-1">您可以在申請請假頁面提交新的請假申請</p>
                    </div>
                  )}
                </TabsContent>
              </div>
            </Tabs>
          </div>
          
          {/* Leave History */}
          <div className="bg-white/95 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center shadow-sm">
                <History className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">請假記錄</h2>
            </div>
            <LeaveHistory />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequest;
