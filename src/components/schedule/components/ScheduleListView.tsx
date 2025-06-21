
import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useScheduleListLogic } from './scheduleList/hooks/useScheduleListLogic';
import ScheduleListHeader from './scheduleList/ScheduleListHeader';
import ScheduleListPagination from './scheduleList/ScheduleListPagination';
import ScheduleListTable from './scheduleList/ScheduleListTable';
import ScheduleListEmptyState from './scheduleList/ScheduleListEmptyState';
import ScheduleListLoadingState from './scheduleList/ScheduleListLoadingState';

interface ScheduleListViewProps {
  schedules: any[];
  getUserName: (userId: string) => string;
  canDeleteSchedule: (schedule: any) => boolean;
  onRemoveSchedule: (scheduleId: string) => Promise<void>;
}

const ScheduleListView: React.FC<ScheduleListViewProps> = ({
  schedules,
  getUserName,
  canDeleteSchedule,
  onRemoveSchedule
}) => {
  const {
    mounted,
    refreshing,
    currentPage,
    activeView,
    viewSchedules,
    currentSchedules,
    totalPages,
    currentUser,
    isAdmin,
    handleRefresh,
    handleScheduleDelete,
    handleViewChange,
    handlePreviousPage,
    handleNextPage,
    getViewTitle,
  } = useScheduleListLogic({ schedules, onRemoveSchedule });

  if (!currentUser) {
    return (
      <div className="bg-red-100/60 backdrop-blur-xl rounded-xl p-4 border border-red-200/40">
        <div className="flex items-center space-x-2 text-red-600">
          <AlertCircle className="h-4 w-4" />
          <span>請先登入才能查看排班記錄</span>
        </div>
      </div>
    );
  }

  if (!mounted) {
    return (
      <div className="text-center py-8">
        <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-white/60" />
        <p className="text-white/80 font-medium drop-shadow-md">初始化中...</p>
      </div>
    );
  }

  const renderContent = () => {
    if (refreshing) {
      return <ScheduleListLoadingState title={getViewTitle(activeView)} />;
    }

    if (viewSchedules.length === 0) {
      return <ScheduleListEmptyState title={getViewTitle(activeView)} />;
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h4 className="text-white font-medium drop-shadow-md flex items-center gap-2">
              {getViewTitle(activeView)}
            </h4>
            <div className="text-sm text-white/80 font-medium drop-shadow-md">
              總共 {viewSchedules.length} 筆記錄
            </div>
          </div>
        </div>

        <ScheduleListPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalRecords={viewSchedules.length}
          onPreviousPage={handlePreviousPage}
          onNextPage={handleNextPage}
        />
        
        <ScheduleListTable
          schedules={currentSchedules}
          activeView={activeView}
          getUserName={getUserName}
          onDeleteSchedule={handleScheduleDelete}
          isAdmin={isAdmin}
        />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {isAdmin ? (
        <Tabs value={activeView} onValueChange={handleViewChange} className="w-full">
          <ScheduleListHeader
            activeView={activeView}
            onViewChange={handleViewChange}
            onRefresh={handleRefresh}
            isLoading={refreshing}
            isAdmin={isAdmin}
          />

          <TabsContent value={activeView} className="space-y-4">
            {renderContent()}
          </TabsContent>
        </Tabs>
      ) : (
        <div className="space-y-4">
          <ScheduleListHeader
            activeView={activeView}
            onViewChange={handleViewChange}
            onRefresh={handleRefresh}
            isLoading={refreshing}
            isAdmin={isAdmin}
          />
          {renderContent()}
        </div>
      )}
    </div>
  );
};

export default ScheduleListView;
