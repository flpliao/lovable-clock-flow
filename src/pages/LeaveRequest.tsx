
import React, { useState } from 'react';
import { SimpleLeaveRequestForm } from '@/components/leave/SimpleLeaveRequestForm';
import { AnnualLeaveBalanceCard } from '@/components/leave/AnnualLeaveBalanceCard';
import { LeaveStatusTracker } from '@/components/leave/LeaveStatusTracker';
import LeaveHistory from '@/components/LeaveHistory';
import ShiftReminder from '@/components/ShiftReminder';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLeaveManagementContext } from '@/contexts/LeaveManagementContext';
import { useSupabaseLeaveManagement } from '@/hooks/useSupabaseLeaveManagement';
import { useUser } from '@/contexts/UserContext';
import { PiggyBank, FileText, History } from 'lucide-react';

const LeaveRequest = () => {
  const [activeTab, setActiveTab] = useState<string>('request');
  const { currentUser } = useUser();
  const {
    currentLeaveRequest,
    isApproverForRequest,
    getLeaveHistory
  } = useLeaveManagementContext();
  
  // 使用新的 hook 來載入年假餘額
  const { loadAnnualLeaveBalance } = useSupabaseLeaveManagement();
  const [balanceData, setBalanceData] = useState<any>(null);
  const [balanceLoading, setBalanceLoading] = useState(true);

  // 載入年假餘額
  React.useEffect(() => {
    const loadBalance = async () => {
      if (!currentUser?.id) {
        setBalanceLoading(false);
        return;
      }
      
      try {
        const balance = await loadAnnualLeaveBalance(currentUser.id);
        setBalanceData(balance);
      } catch (error) {
        console.error('載入年假餘額失敗:', error);
      } finally {
        setBalanceLoading(false);
      }
    };
    
    loadBalance();
  }, [currentUser?.id, loadAnnualLeaveBalance]);

  // 獲取待審核的申請（用於狀態追蹤）
  const pendingLeaveRequest = getLeaveHistory().find(leave => leave.status === 'pending') || null;

  // Function to handle new leave request submission
  const handleNewLeaveRequest = () => {
    setActiveTab('status');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-purple-600 pt-32 md:pt-36">
      <div className="w-full px-4 sm:px-6 lg:px-8 pb-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Shift Reminder */}
          <ShiftReminder />

          {/* 特別休假餘額卡片 */}
          <AnnualLeaveBalanceCard 
            currentUser={currentUser}
            balanceData={balanceData}
            loading={balanceLoading}
          />

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
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="p-4">
                <TabsList className="grid w-full grid-cols-3 backdrop-blur-xl bg-white/30 border border-white/30 rounded-xl p-1 h-12">
                  <TabsTrigger value="request" className="text-gray-800 data-[state=active]:bg-white/40 data-[state=active]:text-gray-900 data-[state=active]:shadow-sm rounded-lg font-medium transition-all duration-200 py-2 px-4">
                    申請請假
                  </TabsTrigger>
                  <TabsTrigger value="status" className="text-gray-800 data-[state=active]:bg-white/40 data-[state=active]:text-gray-900 data-[state=active]:shadow-sm rounded-lg font-medium transition-all duration-200 py-2 px-4">
                    申請狀態
                  </TabsTrigger>
                  <TabsTrigger value="history" className="text-gray-800 data-[state=active]:bg-white/40 data-[state=active]:text-gray-900 data-[state=active]:shadow-sm rounded-lg font-medium transition-all duration-200 py-2 px-4">
                    請假記錄
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <div className="px-4 pb-4">
                <TabsContent value="request" className="mt-0">
                  <SimpleLeaveRequestForm onSubmit={handleNewLeaveRequest} />
                </TabsContent>
                
                <TabsContent value="status" className="mt-0">
                  <LeaveStatusTracker leaveRequest={pendingLeaveRequest} />
                </TabsContent>

                <TabsContent value="history" className="mt-0">
                  <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center">
                        <History className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white drop-shadow-md">請假記錄</h3>
                        <p className="text-sm text-white/80 font-medium drop-shadow-sm">Leave History</p>
                      </div>
                    </div>
                    <LeaveHistory showAll={true} />
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

export default LeaveRequest;
