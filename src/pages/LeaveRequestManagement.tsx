import { NewLeaveRequestForm } from '@/components/leave/NewLeaveRequestForm';
import LeaveHistory from '@/components/LeaveHistory';
import LeaveRequestDetail from '@/components/LeaveRequestDetail';
import ShiftReminder from '@/components/ShiftReminder';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { leaveRequestService } from '@/services/leaveRequestService';
import useEmployeeStore from '@/stores/employeeStore';
import type { LeaveRequest } from '@/types/leave';
import { FileText, History } from 'lucide-react';
import { useEffect, useState } from 'react';

const LeaveRequestManagement = () => {
  const [activeTab, setActiveTab] = useState<string>('request');
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const { employee } = useEmployeeStore();

  // 載入請假申請資料
  const loadLeaveRequests = async () => {
    if (!employee) return;

    try {
      const requests = await leaveRequestService.getMyLeaveRequests();
      setLeaveRequests(requests);
    } catch (error) {
      console.error('載入請假申請失敗:', error);
    }
  };

  // 初始載入
  useEffect(() => {
    loadLeaveRequests();
  }, [employee]);

  // 獲取待審核的申請
  const pendingLeaveRequest = leaveRequests.find(leave => leave.status === 'pending') || null;

  // 檢查當前使用者是否為指定請假申請的審核者
  const isApproverForRequest = (request: LeaveRequest) => {
    if (!employee || !request.approvals) return false;

    return request.approvals.some(
      approval =>
        approval.level === request.approval_level && approval.approver_id === employee.slug
    );
  };

  // Function to handle new leave request submission
  const handleNewLeaveRequest = () => {
    setActiveTab('view');
    loadLeaveRequests(); // 重新載入資料
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
                  <NewLeaveRequestForm onSubmit={handleNewLeaveRequest} />
                </TabsContent>

                <TabsContent value="view" className="mt-0">
                  {pendingLeaveRequest ? (
                    <LeaveRequestDetail
                      leaveRequest={pendingLeaveRequest}
                      isApprover={isApproverForRequest(pendingLeaveRequest)}
                    />
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                          className="w-8 h-8 text-white/60"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <p className="text-white font-medium drop-shadow-sm">尚無待審核的請假申請</p>
                      <p className="text-white/80 mt-1 font-medium drop-shadow-sm">
                        您可以在申請請假頁面提交新的請假申請
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="history" className="mt-0">
                  <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                        <History className="h-4 w-4 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-white drop-shadow-md">請假紀錄</h3>
                    </div>
                    <LeaveHistory />
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
