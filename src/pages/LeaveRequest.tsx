
import React, { useState } from 'react';
import LeaveRequestForm from '@/components/LeaveRequestForm';
import LeaveBalance from '@/components/LeaveBalance';
import LeaveHistory from '@/components/LeaveHistory';
import ShiftReminder from '@/components/ShiftReminder';
import LeaveRequestDetail from '@/components/LeaveRequestDetail';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LeaveRequest as LeaveRequestType } from '@/types';
import { useLeaveManagementContext } from '@/contexts/LeaveManagementContext';
import { Clock, Calendar } from 'lucide-react';

const LeaveRequest = () => {
  const [activeTab, setActiveTab] = useState<string>('request');
  const { currentLeaveRequest, isApproverForRequest } = useLeaveManagementContext();
  
  // Function to handle new leave request submission
  const handleNewLeaveRequest = () => {
    setActiveTab('view');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-purple-600 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Header */}
        <div className="bg-white/20 backdrop-blur-2xl rounded-3xl border border-white/30 shadow-2xl p-8">
          <div className="text-center">
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

        {/* Shift Reminder */}
        <div className="bg-white/20 backdrop-blur-2xl rounded-3xl border border-white/30 shadow-2xl overflow-hidden">
          <ShiftReminder />
        </div>
        
        {/* Leave Balance */}
        <div className="bg-white/20 backdrop-blur-2xl rounded-3xl border border-white/30 shadow-2xl p-6">
          <LeaveBalance />
        </div>

        {/* Main Content */}
        <div className="bg-white/20 backdrop-blur-2xl rounded-3xl border border-white/30 shadow-2xl overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="p-8 border-b border-white/20">
              <TabsList className="grid w-full grid-cols-2 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 p-2 shadow-lg">
                <TabsTrigger 
                  value="request" 
                  className="text-white/80 data-[state=active]:bg-white/30 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-semibold transition-all duration-300 py-3"
                >
                  申請請假
                </TabsTrigger>
                <TabsTrigger 
                  value="view" 
                  className="text-white/80 data-[state=active]:bg-white/30 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-semibold transition-all duration-300 py-3"
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
        
        {/* Leave History */}
        <div className="bg-white/20 backdrop-blur-2xl rounded-3xl border border-white/30 shadow-2xl p-6">
          <LeaveHistory />
        </div>
      </div>
    </div>
  );
};

export default LeaveRequest;
