
import React, { useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useStaffManagementSafe } from '@/components/company/hooks/useStaffManagementSafe';

interface StaffSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  required?: boolean;
}

const StaffSelector: React.FC<StaffSelectorProps> = ({
  value,
  onValueChange,
  required = false
}) => {
  const { staffList, loading, refreshStaffList } = useStaffManagementSafe();

  useEffect(() => {
    console.log('📋 StaffSelector 組件載入，員工資料狀態:', {
      staffCount: staffList.length,
      loading,
      firstStaff: staffList[0]
    });
  }, [staffList, loading]);

  const handleRefresh = () => {
    console.log('🔄 手動重新載入員工資料');
    refreshStaffList();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <Label htmlFor="staff_id">員工</Label>
        {(staffList.length === 0 && !loading) && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="text-xs"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            重新載入
          </Button>
        )}
      </div>
      
      <Select value={value} onValueChange={onValueChange} required={required}>
        <SelectTrigger>
          <SelectValue placeholder={loading ? "載入中..." : "選擇員工"} />
        </SelectTrigger>
        <SelectContent>
          {loading ? (
            <SelectItem value="loading" disabled>
              正在載入員工資料...
            </SelectItem>
          ) : staffList.length === 0 ? (
            <SelectItem value="empty" disabled>
              尚未載入員工資料
            </SelectItem>
          ) : (
            staffList.map((staff) => (
              <SelectItem key={staff.id} value={staff.id}>
                {staff.name} - {staff.position} ({staff.department})
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
      
      {staffList.length === 0 && !loading && (
        <p className="text-xs text-gray-500 mt-1">
          請先在人員管理中新增員工資料，或點擊重新載入按鈕
        </p>
      )}
      
      {loading && (
        <p className="text-xs text-blue-500 mt-1">
          正在載入員工資料...
        </p>
      )}
      
      {staffList.length > 0 && (
        <p className="text-xs text-green-600 mt-1">
          已載入 {staffList.length} 位員工
        </p>
      )}
    </div>
  );
};

export default StaffSelector;
