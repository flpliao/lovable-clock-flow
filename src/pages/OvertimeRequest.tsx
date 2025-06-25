
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, FileText, History } from 'lucide-react';
import OvertimeRequestForm from '@/components/overtime/OvertimeRequestForm';
import OvertimeHistory from '@/components/overtime/OvertimeHistory';
import OvertimeRequestDetail from '@/components/overtime/OvertimeRequestDetail';
import { OvertimeRequest } from '@/types/overtime';

const OvertimeRequestPage = () => {
  const [activeTab, setActiveTab] = useState<string>('request');
  const [selectedOvertimeRequest, setSelectedOvertimeRequest] = useState<OvertimeRequest | null>(null);

  // 模擬待審核的加班申請
  const pendingOvertimeRequest: OvertimeRequest | null = {
    id: '1',
    overtime_date: '2024-06-25',
    start_time: '18:00',
    end_time: '20:00',
    hours: 2,
    reason: '專案緊急需求，需要加班完成系統開發',
    status: 'pending',
    created_at: '2024-06-25T10:00:00Z',
    updated_at: '2024-06-25T10:00:00Z'
  };

  const handleNewOvertimeRequest = () => {
    setActiveTab('view');
  };

  const handleViewOvertimeDetail = (overtime: OvertimeRequest) => {
    setSelectedOvertimeRequest(overtime);
    setActiveTab('view');
  };

  const handleBackToList = () => {
    setSelectedOvertimeRequest(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-purple-600 pt-32 md:pt-36 py-[50px]">
      <div className="w-full px-4 sm:px-6 lg:px-8 pb-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl overflow-hidden">
            <div className="p-4 border-b border-white/30">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Clock className="h-4 w-4 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-white drop-shadow-md">加班管理</h2>
              </div>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="p-4">
                <TabsList className="grid w-full grid-cols-3 backdrop-blur-xl bg-white/30 border border-white/30 rounded-xl p-1 h-12">
                  <TabsTrigger value="request" className="text-gray-800 data-[state=active]:bg-white/40 data-[state=active]:text-gray-900 data-[state=active]:shadow-sm rounded-lg font-medium transition-all duration-200 py-2 px-4">
                    申請加班
                  </TabsTrigger>
                  <TabsTrigger value="view" className="text-gray-800 data-[state=active]:bg-white/40 data-[state=active]:text-gray-900 data-[state=active]:shadow-sm rounded-lg font-medium transition-all duration-200 py-2 px-4">
                    查看加班
                  </TabsTrigger>
                  <TabsTrigger value="history" className="text-gray-800 data-[state=active]:bg-white/40 data-[state=active]:text-gray-900 data-[state=active]:shadow-sm rounded-lg font-medium transition-all duration-200 py-2 px-4">
                    加班紀錄
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <div className="px-4 pb-4">
                <TabsContent value="request" className="mt-0">
                  <OvertimeRequestForm onSubmit={handleNewOvertimeRequest} />
                </TabsContent>
                
                <TabsContent value="view" className="mt-0">
                  {selectedOvertimeRequest ? (
                    <OvertimeRequestDetail 
                      overtimeRequest={selectedOvertimeRequest} 
                      onBack={handleBackToList}
                    />
                  ) : pendingOvertimeRequest ? (
                    <OvertimeRequestDetail 
                      overtimeRequest={pendingOvertimeRequest} 
                    />
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <p className="text-white font-medium drop-shadow-sm">尚無待審核的加班申請</p>
                      <p className="text-white/80 mt-1 font-medium drop-shadow-sm">您可以在申請加班頁面提交新的加班申請</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="history" className="mt-0">
                  <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                        <History className="h-4 w-4 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-white drop-shadow-md">加班紀錄</h3>
                    </div>
                    <OvertimeHistory onClick={handleViewOvertimeDetail} />
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OvertimeRequestPage;
