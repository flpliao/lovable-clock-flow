
import React, { useState } from 'react';
import LeaveRequestForm from '@/components/LeaveRequestForm';
import LeaveBalance from '@/components/LeaveBalance';
import LeaveHistory from '@/components/LeaveHistory';
import ShiftReminder from '@/components/ShiftReminder';
import LeaveRequestDetail from '@/components/LeaveRequestDetail';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LeaveRequest as LeaveRequestType } from '@/types';
import { useLeaveManagementContext } from '@/contexts/LeaveManagementContext';
import { visionProStyles } from '@/utils/visionProStyles';

const LeaveRequest = () => {
  const [activeTab, setActiveTab] = useState<string>('request');
  const { currentLeaveRequest, isApproverForRequest } = useLeaveManagementContext();
  
  // Function to handle new leave request submission
  const handleNewLeaveRequest = () => {
    setActiveTab('view');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Vision Pro 風格背景效果 */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-400/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-400/15 via-transparent to-transparent"></div>
      
      {/* 浮動光點效果 */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/60 rounded-full animate-float"></div>
      <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-purple-400/40 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-3/4 w-1 h-1 bg-white/30 rounded-full animate-float" style={{ animationDelay: '4s' }}></div>

      <div className="relative z-10 container mx-auto py-8 px-4">
        <div className="flex flex-col gap-6">
          {/* 班次提醒 */}
          <div className={`${visionProStyles.cardBackground} rounded-3xl border border-white/30 shadow-2xl overflow-hidden`}>
            <ShiftReminder />
          </div>
          
          {/* 假期餘額 */}
          <div className={`${visionProStyles.cardBackground} rounded-3xl border border-white/30 shadow-2xl overflow-hidden`}>
            <LeaveBalance />
          </div>
          
          {/* 主要內容 - 請假申請和查看 */}
          <div className={`${visionProStyles.glassBackground} rounded-3xl border border-white/30 shadow-2xl overflow-hidden`}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="p-6 border-b border-white/20">
                <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/30">
                  <TabsTrigger 
                    value="request" 
                    className="text-white data-[state=active]:bg-white/30 data-[state=active]:text-white rounded-xl font-medium"
                  >
                    申請請假
                  </TabsTrigger>
                  <TabsTrigger 
                    value="view" 
                    className="text-white data-[state=active]:bg-white/30 data-[state=active]:text-white rounded-xl font-medium"
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
                      <p className="text-white/70 font-medium drop-shadow-md">尚無進行中的請假申請</p>
                    </div>
                  )}
                </TabsContent>
              </div>
            </Tabs>
          </div>
          
          {/* 請假歷史 */}
          <div className={`${visionProStyles.cardBackground} rounded-3xl border border-white/30 shadow-2xl overflow-hidden`}>
            <LeaveHistory />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequest;
