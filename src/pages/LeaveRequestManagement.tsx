import PageHeader from '@/components/layout/PageHeader';
import PageLayout from '@/components/layout/PageLayout';
import EmployeeInfoCard from '@/components/leave/EmployeeInfoCard';
import LeaveRequestForm from '@/components/leave/LeaveRequestForm';
import MyLeaveRequestList from '@/components/leave/MyLeaveRequestList';
import MyPendingLeaveRequestsList from '@/components/leave/MyPendingLeaveRequestsList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RequestStatus } from '@/constants/requestStatus';
import { useMyLeaveRequest } from '@/hooks/useMyLeaveRequest';
import useEmployeeStore from '@/stores/employeeStore';
import { FileText, History } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

const LeaveRequestManagement = () => {
  const [activeTab, setActiveTab] = useState<string>('request');
  const { employee } = useEmployeeStore();
  const { requests, isLoading, loadMyLeaveRequests } = useMyLeaveRequest();

  // 初始載入
  useEffect(() => {
    loadMyLeaveRequests(employee.slug);
  }, []);

  const pendingRequests = useMemo(() => {
    return requests.filter(
      r => r.status === RequestStatus.PENDING && r.employee?.slug === employee.slug
    );
  }, [requests, employee.slug]);

  const historyRequests = useMemo(() => {
    return requests.filter(
      r =>
        [RequestStatus.CANCELLED, RequestStatus.REJECTED, RequestStatus.APPROVED].includes(
          r.status
        ) && r.employee?.slug === employee.slug
    );
  }, [requests, employee.slug]);

  // 處理請假申請成功
  const handleLeaveRequestSuccess = () => {
    setActiveTab('view');
  };

  return (
    <PageLayout>
      <PageHeader
        icon={FileText}
        title="請假申請"
        description="用於查看與送出自己的請假申請"
        iconBgColor="bg-blue-500"
      />
      {/* Main Content */}
      <EmployeeInfoCard />
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
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
            <MyPendingLeaveRequestsList requests={pendingRequests} isLoading={isLoading} />
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
            <MyLeaveRequestList requests={historyRequests} isLoading={isLoading} />
          </div>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default LeaveRequestManagement;
