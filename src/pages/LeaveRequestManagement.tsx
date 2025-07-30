import EmployeeInfoCard from '@/components/leave/EmployeeInfoCard';
import LeaveRequestForm from '@/components/leave/LeaveRequestForm';
import MyLeaveRequestList from '@/components/leave/MyLeaveRequestList';
import MyPendingLeaveRequestsList from '@/components/leave/MyPendingLeaveRequestsList';
import ShiftReminder from '@/components/ShiftReminder';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, History } from 'lucide-react';
import { useState } from 'react';

const LeaveRequestManagement = () => {
  const [activeTab, setActiveTab] = useState<string>('request');

  // 處理請假申請成功
  const handleLeaveRequestSuccess = () => {
    setActiveTab('view');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-purple-600 pt-32 md:pt-36 py-[50px]">
      <div className="w-full px-4 sm:px-6 lg:px-8 pb-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Shift Reminder */}
          <ShiftReminder />

          {/* Main Content */}
          <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl overflow-hidden">
            <div className="p-4 border-b border-white/30">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <FileText className="h-4 w-4 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-white drop-shadow-md">請假管理</h2>
              </div>
            </div>
            <div className="px-4 pt-4">
              <EmployeeInfoCard />
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="p-4">
                <TabsList className="grid w-full grid-cols-3 backdrop-blur-xl bg-white/30 border border-white/30 rounded-xl p-1 h-12">
                  <TabsTrigger
                    value="request"
                    className="text-gray-800 data-[state=active]:bg-white/40 data-[state=active]:text-gray-900 data-[state=active]:shadow-sm rounded-lg font-medium transition-all duration-200 py-2 px-4"
                  >
                    申請請假
                  </TabsTrigger>
                  <TabsTrigger
                    value="view"
                    className="text-gray-800 data-[state=active]:bg-white/40 data-[state=active]:text-gray-900 data-[state=active]:shadow-sm rounded-lg font-medium transition-all duration-200 py-2 px-4"
                  >
                    查看請假
                  </TabsTrigger>
                  <TabsTrigger
                    value="history"
                    className="text-gray-800 data-[state=active]:bg-white/40 data-[state=active]:text-gray-900 data-[state=active]:shadow-sm rounded-lg font-medium transition-all duration-200 py-2 px-4"
                  >
                    請假紀錄
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="px-4 pb-4">
                <TabsContent value="request" className="mt-0">
                  <LeaveRequestForm onSuccess={handleLeaveRequestSuccess} />
                </TabsContent>

                <TabsContent value="view" className="mt-0">
                  <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <FileText className="h-4 w-4 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-white drop-shadow-md">查看請假</h3>
                    </div>
                    <MyPendingLeaveRequestsList />
                  </div>
                </TabsContent>

                <TabsContent value="history" className="mt-0">
                  <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                        <History className="h-4 w-4 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-white drop-shadow-md">請假紀錄</h3>
                    </div>
                    <MyLeaveRequestList />
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
export default LeaveRequestManagement;
