import LeaveApprovalDetail from '@/components/leave/LeaveApprovalDetail';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCurrentUser } from '@/hooks/useStores';
import { LeaveRequest } from '@/types';

import { useEffect, useState } from 'react';
import ApprovalHeader from './approval/components/ApprovalHeader';
import ApprovalStats from './approval/components/ApprovalStats';
import LeaveApprovalTab from './approval/components/LeaveApprovalTab';
import MissedCheckinApprovalTab from './approval/components/MissedCheckinApprovalTab';

import { useApprovalStats } from './approval/hooks/useApprovalStats';
import { useLeaveRequests } from './approval/hooks/useLeaveRequests';
import { useMissedCheckinRequests } from './approval/hooks/useMissedCheckInRequests';

const ApprovalCenter = () => {
  // 使用新的 Zustand hooks
  const currentUser = useCurrentUser();

  const [activeTab, setActiveTab] = useState<string>('leave');
  // 修復：使用具體的 LeaveRequest 類型而不是通用類型
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);

  // Custom hooks for data management
  const { approvalStats, loadApprovalStats } = useApprovalStats();
  const {
    pendingRequests,
    isLoading,
    refreshing,
    loadPendingRequests,
    handleApprove,
    handleReject,
  } = useLeaveRequests();
  const { missedCheckinRequests, loadMissedCheckinRequests, handleMissedCheckinApproval } =
    useMissedCheckinRequests();

  useEffect(() => {
    if (currentUser?.id) {
      loadPendingRequests();
      loadMissedCheckinRequests();
      loadApprovalStats();
    }
  }, [currentUser?.id, loadPendingRequests, loadMissedCheckinRequests, loadApprovalStats]);

  // 修復：使用具體的 LeaveRequest 類型
  const handleViewDetail = (request: LeaveRequest) => {
    setSelectedRequest(request);
  };

  const handleBackToList = () => {
    setSelectedRequest(null);
  };

  const handleApprovalComplete = () => {
    setSelectedRequest(null);
    loadPendingRequests();
    loadApprovalStats();
  };

  const refreshData = () => {
    loadPendingRequests();
    loadMissedCheckinRequests();
    loadApprovalStats();
  };

  // If viewing detail page, show detailed approval page
  if (selectedRequest) {
    return (
      <LeaveApprovalDetail
        request={selectedRequest}
        onBack={handleBackToList}
        onApprovalComplete={handleApprovalComplete}
      />
    );
  }

  const totalApproved = approvalStats.todayApproved + approvalStats.missedCheckinApproved;
  const totalRejected = approvalStats.todayRejected + approvalStats.missedCheckinRejected;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-purple-600 pt-32 md:pt-36 py-[50px]">
      <div className="w-full px-4 sm:px-6 lg:px-8 pb-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Page Header */}
          <ApprovalHeader refreshData={refreshData} refreshing={refreshing} />

          {/* Statistics */}
          <ApprovalStats
            pendingLeave={pendingRequests.length}
            pendingMissedCheckin={missedCheckinRequests.length}
            todayApproved={totalApproved}
            todayRejected={totalRejected}
          />

          {/* Main Content Area */}
          <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 backdrop-blur-xl bg-white/30 border border-white/30 rounded-xl p-1 h-12 mb-6">
                <TabsTrigger
                  value="leave"
                  className="text-gray-800 data-[state=active]:bg-white/40 data-[state=active]:text-gray-900 data-[state=active]:shadow-sm rounded-lg font-medium transition-all duration-200 py-2 px-3 text-sm data-[state=active]:backdrop-blur-xl"
                >
                  請假審核 ({pendingRequests.length})
                </TabsTrigger>
                <TabsTrigger
                  value="missed-checkin"
                  className="text-gray-800 data-[state=active]:bg-white/40 data-[state=active]:text-gray-900 data-[state=active]:shadow-sm rounded-lg font-medium transition-all duration-200 py-2 px-3 text-sm data-[state=active]:backdrop-blur-xl"
                >
                  忘記打卡 ({missedCheckinRequests.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="leave" className="mt-0">
                <h2 className="text-xl font-semibold text-white drop-shadow-md mb-6">
                  待審核請假申請
                </h2>
                <LeaveApprovalTab
                  pendingRequests={pendingRequests}
                  isLoading={isLoading}
                  onViewDetail={handleViewDetail}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              </TabsContent>

              <TabsContent value="missed-checkin" className="mt-0">
                <h2 className="text-xl font-semibold text-white drop-shadow-md mb-6">
                  待審核忘記打卡申請
                </h2>
                <MissedCheckinApprovalTab
                  missedCheckinRequests={missedCheckinRequests}
                  onApproval={handleMissedCheckinApproval}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalCenter;
