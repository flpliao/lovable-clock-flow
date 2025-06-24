
import React, { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LeaveApprovalDetail from '@/components/leave/LeaveApprovalDetail';
import { useApprovalStats } from './approval/hooks/useApprovalStats';
import { useLeaveRequests } from './approval/hooks/useLeaveRequests';
import { useMissedCheckinRequests } from './approval/hooks/useMissedCheckinRequests';
import { useOvertimeRequests } from './approval/hooks/useOvertimeRequests';
import ApprovalHeader from './approval/components/ApprovalHeader';
import ApprovalStats from './approval/components/ApprovalStats';
import LeaveApprovalTab from './approval/components/LeaveApprovalTab';
import MissedCheckinApprovalTab from './approval/components/MissedCheckinApprovalTab';
import OvertimeApprovalTab from './approval/components/OvertimeApprovalTab';

const ApprovalCenter = () => {
  const { currentUser } = useUser();
  const [activeTab, setActiveTab] = useState<string>('leave');
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  // Custom hooks for data management
  const { approvalStats, loadApprovalStats } = useApprovalStats();
  const {
    pendingRequests,
    isLoading,
    refreshing,
    loadPendingRequests,
    handleApprove,
    handleReject
  } = useLeaveRequests();
  const {
    missedCheckinRequests,
    loadMissedCheckinRequests,
    handleMissedCheckinApproval
  } = useMissedCheckinRequests();
  const {
    overtimeRequests,
    loadOvertimeRequests,
    handleOvertimeApproval
  } = useOvertimeRequests();

  useEffect(() => {
    if (currentUser?.id) {
      loadPendingRequests();
      loadMissedCheckinRequests();
      loadOvertimeRequests();
      loadApprovalStats();
    }
  }, [currentUser?.id, loadPendingRequests, loadMissedCheckinRequests, loadOvertimeRequests, loadApprovalStats]);

  const handleViewDetail = (request: any) => {
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
    loadOvertimeRequests();
    loadApprovalStats();
  };

  // If viewing detail page, show detailed approval page
  if (selectedRequest) {
    return <LeaveApprovalDetail request={selectedRequest} onBack={handleBackToList} onApprovalComplete={handleApprovalComplete} />;
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-purple-600 pt-32 md:pt-36">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-8">
              <h1 className="text-2xl font-bold text-white mb-4">請先登入</h1>
              <p className="text-white/80">您需要登入系統才能查看待審核的申請</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const totalApproved = approvalStats.todayApproved + approvalStats.missedCheckinApproved + approvalStats.overtimeApproved;
  const totalRejected = approvalStats.todayRejected + approvalStats.missedCheckinRejected + approvalStats.overtimeRejected;

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
            pendingOvertime={overtimeRequests.length}
            todayApproved={totalApproved}
            todayRejected={totalRejected}
          />

          {/* Main Content Area */}
          <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 backdrop-blur-xl bg-white/30 border border-white/30 rounded-xl p-1 h-12 mb-6">
                <TabsTrigger value="leave" className="text-gray-800 data-[state=active]:bg-white/40 data-[state=active]:text-gray-900 data-[state=active]:shadow-sm rounded-lg font-medium transition-all duration-200 py-2 px-4">
                  請假審核 ({pendingRequests.length})
                </TabsTrigger>
                <TabsTrigger value="missed-checkin" className="text-gray-800 data-[state=active]:bg-white/40 data-[state=active]:text-gray-900 data-[state=active]:shadow-sm rounded-lg font-medium transition-all duration-200 py-2 px-4">
                  忘記打卡 ({missedCheckinRequests.length})
                </TabsTrigger>
                <TabsTrigger value="overtime" className="text-gray-800 data-[state=active]:bg-white/40 data-[state=active]:text-gray-900 data-[state=active]:shadow-sm rounded-lg font-medium transition-all duration-200 py-2 px-4">
                  加班審核 ({overtimeRequests.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="leave" className="mt-0">
                <h2 className="text-xl font-semibold text-white drop-shadow-md mb-6">待審核請假申請</h2>
                <LeaveApprovalTab
                  pendingRequests={pendingRequests}
                  isLoading={isLoading}
                  onViewDetail={handleViewDetail}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              </TabsContent>

              <TabsContent value="missed-checkin" className="mt-0">
                <h2 className="text-xl font-semibold text-white drop-shadow-md mb-6">待審核忘記打卡申請</h2>
                <MissedCheckinApprovalTab
                  missedCheckinRequests={missedCheckinRequests}
                  onApproval={handleMissedCheckinApproval}
                />
              </TabsContent>

              <TabsContent value="overtime" className="mt-0">
                <h2 className="text-xl font-semibold text-white drop-shadow-md mb-6">待審核加班申請</h2>
                <OvertimeApprovalTab
                  overtimeRequests={overtimeRequests}
                  onApproval={handleOvertimeApproval}
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
