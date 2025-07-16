import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, Clock, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAttendanceRecords } from '@/hooks/useAttendanceRecords';
import { ExtendedCheckInRecord, AttendanceAnomalyRecord } from '@/stores/attendanceRecordStore';
import AttendanceFilters from '@/components/attendance/AttendanceFilters';
import AttendanceRecordTable from '@/components/attendance/AttendanceRecordTable';
import AttendanceAnomalyTable from '@/components/attendance/AttendanceAnomalyTable';

const AttendanceRecordManagement: React.FC = () => {
  const {
    // 資料狀態
    staffList,
    departments,

    // 計算後的資料
    paginationData,

    // UI狀態
    loading,
    activeTab,
    filters,

    // 權限
    permissions,

    // 操作方法
    setActiveTab,
    setFilters,
    clearFilters,

    // 業務操作
    deleteRecord,
    createMissedCheckinCompensation,
    refresh,
    search,
    goToPreviousPage,
    goToNextPage,
  } = useAttendanceRecords();

  return (
    <div className="space-y-6">
      {/* 主要 Tab 切換 */}
      <Tabs
        value={activeTab}
        onValueChange={value => setActiveTab(value as 'normal' | 'anomaly')}
        className="w-full"
      >
        <div className="flex items-center justify-between mb-4">
          <TabsList className="bg-white/20 backdrop-blur-xl border-white/30">
            <TabsTrigger value="normal" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              上下班/休息/外出
            </TabsTrigger>
            <TabsTrigger value="anomaly" className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              異常
            </TabsTrigger>
          </TabsList>
          <Button
            variant="outline"
            size="sm"
            onClick={refresh}
            disabled={loading}
            className="bg-white/20 backdrop-blur-xl border-white/30 text-white hover:bg-white/30 rounded-xl"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? '載入中...' : '重新載入'}
          </Button>
        </div>

        {/* 篩選區域 */}
        <AttendanceFilters
          filters={filters}
          departments={departments}
          staffList={staffList}
          activeTab={activeTab}
          loading={loading}
          onFiltersChange={setFilters}
          onClearFilters={clearFilters}
          onSearch={search}
        />

        {/* Tab 內容 */}
        <TabsContent value="normal" className="space-y-4">
          <div className="space-y-4">
            {/* 記錄統計和分頁控制 */}
            <div className="flex items-center justify-between">
              <p className="text-white/80 font-medium drop-shadow-md">
                總共 {paginationData.totalItems} 筆記錄
              </p>
              {paginationData.totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToPreviousPage}
                    disabled={!paginationData.hasPreviousPage}
                    className="bg-white/20 backdrop-blur-xl border-white/30 text-white hover:bg-white/30"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-white/80 text-sm font-medium px-3">
                    {paginationData.totalItems > 0
                      ? Math.floor((paginationData.currentData.length - 1) / 10) + 1
                      : 1}{' '}
                    / {paginationData.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToNextPage}
                    disabled={!paginationData.hasNextPage}
                    className="bg-white/20 backdrop-blur-xl border-white/30 text-white hover:bg-white/30"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* 正常記錄表格 */}
            <AttendanceRecordTable
              records={paginationData.currentData as ExtendedCheckInRecord[]}
              loading={loading}
              canDeleteRecords={permissions.canDeleteRecords}
              onDeleteRecord={deleteRecord}
            />
          </div>
        </TabsContent>

        <TabsContent value="anomaly" className="space-y-4">
          <div className="space-y-4">
            {/* 異常統計和分頁控制 */}
            <div className="flex items-center justify-between">
              <p className="text-white/80 font-medium drop-shadow-md">
                發現 {paginationData.totalItems} 筆異常記錄
              </p>
              {paginationData.totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToPreviousPage}
                    disabled={!paginationData.hasPreviousPage}
                    className="bg-white/20 backdrop-blur-xl border-white/30 text-white hover:bg-white/30"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-white/80 text-sm font-medium px-3">
                    {paginationData.totalItems > 0
                      ? Math.floor((paginationData.currentData.length - 1) / 10) + 1
                      : 1}{' '}
                    / {paginationData.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToNextPage}
                    disabled={!paginationData.hasNextPage}
                    className="bg-white/20 backdrop-blur-xl border-white/30 text-white hover:bg-white/30"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* 異常記錄表格 */}
            <AttendanceAnomalyTable
              anomalies={paginationData.currentData as AttendanceAnomalyRecord[]}
              loading={loading}
              canCreateMissedRequests={permissions.canCreateMissedRequests}
              onMissedCheckinCompensation={createMissedCheckinCompensation}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AttendanceRecordManagement;
