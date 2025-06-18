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
      <div className="w-full px-0 sm:px-4 lg:px-8 pb-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Welcome Header */}
          <div className="bg-white/20 backdrop-blur-2xl rounded-3xl border border-white/30 shadow-2xl mx-4 p-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-xl border border-white/30 shadow-lg">
                  <User className="h-8 w-8 text-white" />
                </div>
              </div>
              <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
                您好，廖俊雄
              </h1>
              <p className="text-white/80 text-lg font-medium drop-shadow-md">
                歡迎使用員工請假系統
              </p>
            </div>
            
            {/* Time and Date Cards */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
              <div className="bg-white/30 backdrop-blur-xl rounded-2xl border border-white/40 p-4 flex items-center gap-3 shadow-lg">
                <div className="p-3 bg-blue-500/80 rounded-xl">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white drop-shadow-md">15:01</div>
                  <div className="text-white/70 text-sm">當前時間</div>
                </div>
              </div>
              
              <div className="bg-white/30 backdrop-blur-xl rounded-2xl border border-white/40 p-4 flex items-center gap-3 shadow-lg">
                <div className="p-3 bg-green-500/80 rounded-xl">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-lg font-bold text-white drop-shadow-md">2025年6月10日 星期二</div>
                  <div className="text-white/70 text-sm">今天日期</div>
                </div>
              </div>
            </div>
          </div>

          {/* Shift Reminder - 直接放在淡藍色背景上 */}
          <div className="mx-4">
            <div className="bg-white/20 backdrop-blur-2xl rounded-3xl border border-white/30 shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-500/80 rounded-xl flex items-center justify-center">
                    <Bell className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-white drop-shadow-md">班次提醒</h2>
                </div>
              </div>
              <ShiftReminder />
            </div>
          </div>
          
          {/* Leave Balance - 直接放在淡藍色背景上 */}
          <div className="mx-4">
            <div className="bg-white/20 backdrop-blur-2xl rounded-3xl border border-white/30 shadow-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-500/80 rounded-xl flex items-center justify-center">
                  <PiggyBank className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-white drop-shadow-md">特休假餘額</h2>
              </div>
              <LeaveBalance />
            </div>
          </div>

          {/* Main Content - 直接放在淡藍色背景上 */}
          <div className="mx-4">
            <div className="bg-white/20 backdrop-blur-2xl rounded-3xl border border-white/30 shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-white/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-500/80 rounded-xl flex items-center justify-center">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-white drop-shadow-md">請假管理</h2>
                </div>
              </div>
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="p-6">
                  <TabsList className="grid w-full grid-cols-2 bg-white/30 backdrop-blur-xl rounded-2xl border border-white/40 p-1 shadow-lg h-14">
                    <TabsTrigger 
                      value="request" 
                      className="text-white/90 data-[state=active]:bg-white/50 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-semibold transition-all duration-300 py-3 px-6 text-base data-[state=active]:backdrop-blur-xl"
                    >
                      申請請假
                    </TabsTrigger>
                    <TabsTrigger 
                      value="view" 
                      className="text-white/90 data-[state=active]:bg-white/50 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-semibold transition-all duration-300 py-3 px-6 text-base data-[state=active]:backdrop-blur-xl"
                    >
                      查看請假
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <div className="px-6 pb-6">
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
          </div>
          
          {/* Leave History - 直接放在淡藍色背景上 */}
          <div className="mx-4">
            <div className="bg-white/20 backdrop-blur-2xl rounded-3xl border border-white/30 shadow-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-500/80 rounded-xl flex items-center justify-center">
                  <History className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-white drop-shadow-md">請假記錄</h2>
              </div>
              <LeaveHistory />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequest;
