
import React, { useState } from 'react';
import LeaveRequestForm from '@/components/LeaveRequestForm';
import LeaveBalance from '@/components/LeaveBalance';
import LeaveHistory from '@/components/LeaveHistory';
import ShiftReminder from '@/components/ShiftReminder';
import LeaveRequestDetail from '@/components/LeaveRequestDetail';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LeaveRequest as LeaveRequestType } from '@/types';
import { useLeaveManagementContext } from '@/contexts/LeaveManagementContext';
import { Clock, Calendar, Bell, PiggyBank, FileText, History } from 'lucide-react';

const LeaveRequest = () => {
  const [activeTab, setActiveTab] = useState<string>('request');
  const { currentLeaveRequest, isApproverForRequest } = useLeaveManagementContext();
  
  const handleNewLeaveRequest = () => {
    setActiveTab('view');
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-8">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        {/* 標題區域 */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            請假管理系統
          </h1>
          <p className="text-gray-600">
            歡迎使用員工請假系統
          </p>
        </div>

        {/* 時間資訊 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-lg font-semibold text-gray-900">15:01</div>
                <div className="text-sm text-gray-600">當前時間</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-green-500" />
              <div>
                <div className="text-lg font-semibold text-gray-900">2025/06/10</div>
                <div className="text-sm text-gray-600">今天日期</div>
              </div>
            </div>
          </div>
        </div>

        {/* 班次提醒 */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-amber-500" />
              <h2 className="font-semibold text-gray-900">班次提醒</h2>
            </div>
          </div>
          <div className="p-4">
            <ShiftReminder />
          </div>
        </div>
        
        {/* 特休假餘額 */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <PiggyBank className="h-5 w-5 text-green-500" />
              <h2 className="font-semibold text-gray-900">特休假餘額</h2>
            </div>
          </div>
          <div className="p-4">
            <LeaveBalance />
          </div>
        </div>

        {/* 請假管理主要區域 */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-blue-500" />
              <h2 className="font-semibold text-gray-900">請假管理</h2>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="p-4 pb-0">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="request">申請請假</TabsTrigger>
                <TabsTrigger value="view">查看請假</TabsTrigger>
              </TabsList>
            </div>
            
            <div className="p-4">
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
                      <FileText className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600 font-medium">尚無進行中的請假申請</p>
                    <p className="text-gray-500 text-sm mt-1">您可以在申請請假頁面提交新的請假申請</p>
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>
        
        {/* 請假記錄 */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <History className="h-5 w-5 text-purple-500" />
              <h2 className="font-semibold text-gray-900">請假記錄</h2>
            </div>
          </div>
          <div className="p-4">
            <LeaveHistory />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequest;
