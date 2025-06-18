
import React, { useState } from 'react';
import LeaveRequestForm from '@/components/LeaveRequestForm';
import LeaveBalance from '@/components/LeaveBalance';
import LeaveHistory from '@/components/LeaveHistory';
import ShiftReminder from '@/components/ShiftReminder';
import LeaveRequestDetail from '@/components/LeaveRequestDetail';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LeaveRequest as LeaveRequestType } from '@/types';
import { useLeaveManagementContext } from '@/contexts/LeaveManagementContext';
import { Clock, Calendar, Bell, PiggyBank, FileText, History, User } from 'lucide-react';

const LeaveRequest = () => {
  const [activeTab, setActiveTab] = useState<string>('request');
  const { currentLeaveRequest, isApproverForRequest } = useLeaveManagementContext();
  
  // Function to handle new leave request submission
  const handleNewLeaveRequest = () => {
    setActiveTab('view');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-purple-600 pt-32 md:pt-36">
      <div className="w-full px-4 sm:px-6 lg:px-8 pb-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Welcome Header */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/30 shadow-lg p-6">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                您好，廖俊雄
              </h1>
              <p className="text-gray-600">
                歡迎使用員工請假系統
              </p>
            </div>
            
            {/* Time and Date Cards */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center">
              <div className="bg-gray-50 rounded-xl border p-4 flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900">15:01</div>
                  <div className="text-gray-600 text-sm">當前時間</div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-xl border p-4 flex items-center gap-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">2025年6月10日 星期二</div>
                  <div className="text-gray-600 text-sm">今天日期</div>
                </div>
              </div>
            </div>
          </div>

          {/* Shift Reminder */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/30 shadow-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                  <Bell className="h-4 w-4 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">班次提醒</h2>
              </div>
            </div>
            <ShiftReminder />
          </div>
          
          {/* Leave Balance */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/30 shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <PiggyBank className="h-4 w-4 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">特休假餘額</h2>
            </div>
            <LeaveBalance />
          </div>

          {/* Main Content */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/30 shadow-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <FileText className="h-4 w-4 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">請假管理</h2>
              </div>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="p-4">
                <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-xl p-1 h-12">
                  <TabsTrigger 
                    value="request" 
                    className="text-gray-600 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm rounded-lg font-medium transition-all duration-200 py-2 px-4"
                  >
                    申請請假
                  </TabsTrigger>
                  <TabsTrigger 
                    value="view" 
                    className="text-gray-600 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm rounded-lg font-medium transition-all duration-200 py-2 px-4"
                  >
                    查看請假
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <div className="px-4 pb-4">
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
                      <p className="text-gray-600 font-medium">尚無進行中的請假申請</p>
                      <p className="text-gray-500 mt-1">您可以在申請請假頁面提交新的請假申請</p>
                    </div>
                  )}
                </TabsContent>
              </div>
            </Tabs>
          </div>
          
          {/* Leave History */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/30 shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <History className="h-4 w-4 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">請假記錄</h2>
            </div>
            <LeaveHistory />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequest;
