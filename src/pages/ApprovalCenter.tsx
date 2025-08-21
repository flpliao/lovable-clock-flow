import { FeatureIcon, FeatureNumber } from '@/components/common/cards';
import PageHeader from '@/components/layout/PageHeader';
import PageLayout from '@/components/layout/PageLayout';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import {
  useLeaveCompletedRequests,
  useLeavePendingRequests,
  useLeaveRequests,
} from '@/hooks/useLeaveRequests';
import {
  useMissedCheckInCompletedRequests,
  useMissedCheckInPendingRequests,
  useMissedCheckInRequests,
} from '@/hooks/useMissedCheckInRequests';
import { getStatusColors } from '@/utils/statusConfig';
import { CheckCircle, FileText } from 'lucide-react';
import { useEffect, useState } from 'react';
import ApprovalStats from './approval/components/ApprovalStats';
import LeaveApprovalTab from './approval/components/LeaveApprovalTab';
import LeaveHistoryTable from './approval/components/LeaveHistoryTable';
import MissedCheckinApprovalTab from './approval/components/MissedCheckinApprovalTab';
import MissedCheckInHistoryTable from './approval/components/MissedCheckInHistoryTable';

const ApprovalCenter = () => {
  const [activeTab, setActiveTab] = useState<string>('');
  const {
    isLoading: isLeaveLoading,
    loadPendingLeaveRequests,
    loadCompletedLeaveRequests,
    handleLeaveRequestApprove,
    handleLeaveRequestReject,
  } = useLeaveRequests();
  const {
    isLoading: isMissedCheckInLoading,
    loadPendingMissedCheckInRequests,
    loadCompletedMissedCheckInRequests,
    handleMissedCheckInApproval,
    handleMissedCheckInRejection,
  } = useMissedCheckInRequests();

  useEffect(() => {
    loadPendingLeaveRequests();
    loadPendingMissedCheckInRequests();
  }, []);

  const pendingLeaveRequests = useLeavePendingRequests();
  const pendingMissedCheckInRequests = useMissedCheckInPendingRequests();
  const completedLeaveRequests = useLeaveCompletedRequests();
  const completedMissedCheckInRequests = useMissedCheckInCompletedRequests();
  // // 修復：使用具體的 LeaveRequest 類型
  // const handleViewDetail = (request: LeaveRequest) => {
  //   setSelectedRequest(request);
  // };

  // const handleBackToList = () => {
  //   setSelectedRequest(null);
  // };

  // const handleApprovalComplete = () => {
  //   setSelectedRequest(null);
  //   loadPendingRequests();
  // };

  // if (selectedRequest) {
  //   return (
  //     <LeaveApprovalDetail
  //       request={selectedRequest}
  //       onBack={handleBackToList}
  //       onApprovalComplete={handleApprovalComplete}
  //     />
  //   );
  // }

  return (
    <PageLayout>
      <PageHeader
        icon={CheckCircle}
        title="審核中心"
        description="管理員工審核申請"
        iconBgColor="bg-purple-500"
      />

      {/* Statistics */}
      <ApprovalStats
        cards={[
          {
            title: '待審核請假',
            description: '點擊前往審核請假申請',
            rightContent: (
              <FeatureNumber
                number={pendingLeaveRequests.length}
                iconBg={getStatusColors(pendingLeaveRequests.length, 'red').iconBg}
                iconColor={getStatusColors(pendingLeaveRequests.length, 'red').iconColor}
              />
            ),
            onClick: () => setActiveTab('pending-leave'),
          },
          {
            title: '待審核打卡',
            description: '點擊前往審核忘打卡申請',
            rightContent: (
              <FeatureNumber
                number={pendingMissedCheckInRequests.length}
                iconBg={getStatusColors(pendingMissedCheckInRequests.length, 'red').iconBg}
                iconColor={getStatusColors(pendingMissedCheckInRequests.length, 'red').iconColor}
              />
            ),
            onClick: () => setActiveTab('pending-missed-checkin'),
          },
          {
            title: '請假紀錄',
            description: '查看請假申請歷史紀錄',
            rightContent: (
              <FeatureIcon
                icon={<FileText className="h-5 w-5" />}
                iconBg="bg-blue-100"
                iconColor="text-blue-600"
              />
            ),
            onClick: () => {
              setActiveTab('leave-history');
              loadCompletedLeaveRequests();
            },
          },
          {
            title: '忘打卡紀錄',
            description: '查看忘打卡申請歷史紀錄',
            rightContent: (
              <FeatureIcon
                icon={<FileText className="h-5 w-5" />}
                iconBg="bg-purple-100"
                iconColor="text-blue-600"
              />
            ),
            onClick: () => {
              setActiveTab('missed-checkin-history');
              loadCompletedMissedCheckInRequests();
            },
          },
        ]}
      />

      {/* Main Content Area */}
      {activeTab && (
        <div className="backdrop-blur-xl border border-white/30 rounded-3xl shadow-xl p-6">
          <Tabs value={activeTab} className="w-full">
            <TabsContent value="pending-leave" className="mt-0">
              <h2 className="text-xl font-semibold text-white drop-shadow-md mb-6">
                待審核請假申請
              </h2>
              <LeaveApprovalTab
                requests={pendingLeaveRequests}
                isLoading={isLeaveLoading}
                onApprove={handleLeaveRequestApprove}
                onReject={handleLeaveRequestReject}
              />
            </TabsContent>

            <TabsContent value="pending-missed-checkin" className="mt-0">
              <h2 className="text-xl font-semibold text-white drop-shadow-md mb-6">
                待審核忘記打卡申請
              </h2>
              <MissedCheckinApprovalTab
                requests={pendingMissedCheckInRequests}
                isLoading={isMissedCheckInLoading}
                onApprove={handleMissedCheckInApproval}
                onReject={handleMissedCheckInRejection}
              />
            </TabsContent>

            <TabsContent value="leave-history" className="mt-0">
              <h2 className="text-xl font-semibold text-white drop-shadow-md mb-6">
                請假申請歷史紀錄
              </h2>
              <LeaveHistoryTable requests={completedLeaveRequests} isLoading={isLeaveLoading} />
            </TabsContent>
            <TabsContent value="missed-checkin-history" className="mt-0">
              <h2 className="text-xl font-semibold text-white drop-shadow-md mb-6">
                忘打卡申請歷史紀錄
              </h2>
              <MissedCheckInHistoryTable
                requests={completedMissedCheckInRequests}
                isLoading={isMissedCheckInLoading}
              />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </PageLayout>
  );
};

export default ApprovalCenter;
