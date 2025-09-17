import { ExportButton, ImportButton } from '@/components/common/buttons';
import { FeatureIcon, FeatureNumber } from '@/components/common/cards';
import PageHeader from '@/components/layouts/PageHeader';
import PageLayout from '@/components/layouts/PageLayout';
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
import React, { useEffect, useRef, useState } from 'react';
import ApprovalStats from './approval/components/ApprovalStats';
import LeaveApprovalTab from './approval/components/LeaveApprovalTab';
import LeaveHistoryTable from './approval/components/LeaveHistoryTable';
import MissedCheckinApprovalTab from './approval/components/MissedCheckinApprovalTab';
import MissedCheckInHistoryTable from './approval/components/MissedCheckInHistoryTable';

const ApprovalCenter = () => {
  const [activeTab, setActiveTab] = useState<string>('');
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    isLoading: isLeaveLoading,
    loadPendingLeaveRequests,
    loadCompletedLeaveRequests,
    handleLeaveRequestApprove,
    handleLeaveRequestReject,
    handleDownloadSpecialLeaveTemplate,
    handleImportSpecialLeave,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pendingLeaveRequests = useLeavePendingRequests();
  const pendingMissedCheckInRequests = useMissedCheckInPendingRequests();
  const completedLeaveRequests = useLeaveCompletedRequests();
  const completedMissedCheckInRequests = useMissedCheckInCompletedRequests();

  // 處理檔案選擇
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      await handleImportSpecialLeave(file);
      // 匯入成功後重新載入資料
      loadCompletedLeaveRequests();
    } finally {
      setIsImporting(false);
      // 重置檔案輸入
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // 處理匯入按鈕點擊
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

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
            title: '請假記錄',
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
            title: '忘打卡記錄',
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
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white drop-shadow-md">
                  請假申請歷史紀錄
                </h2>
                <div className="flex gap-3">
                  <ExportButton
                    size="sm"
                    onClick={handleDownloadSpecialLeaveTemplate}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    下載範本
                  </ExportButton>
                  <ImportButton
                    size="sm"
                    onClick={handleImportClick}
                    disabled={isImporting}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 disabled:opacity-50"
                  >
                    {isImporting ? '匯入中...' : '匯入特休'}
                  </ImportButton>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              </div>
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
