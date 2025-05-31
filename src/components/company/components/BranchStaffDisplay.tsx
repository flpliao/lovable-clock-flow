
import React from 'react';
import { Users } from 'lucide-react';
import { useStaffManagementSafe } from '../hooks/useStaffManagementSafe';

interface BranchStaffDisplayProps {
  branchId: string;
  mobile?: boolean;
}

export const BranchStaffDisplay: React.FC<BranchStaffDisplayProps> = ({ branchId, mobile = false }) => {
  const { staffList } = useStaffManagementSafe();

  // 安全地取得營業處員工數量，避免 RLS 錯誤
  const getBranchStaffCount = (branchId: string) => {
    try {
      if (!staffList || !Array.isArray(staffList)) {
        return 0;
      }
      return staffList.filter(staff => staff.branch_id === branchId).length;
    } catch (error) {
      console.log('⚠️ 無法取得員工數量，可能是 RLS 限制:', error);
      return 0;
    }
  };

  const getBranchStaffList = (branchId: string) => {
    try {
      if (!staffList || !Array.isArray(staffList)) {
        return [];
      }
      return staffList.filter(staff => staff.branch_id === branchId);
    } catch (error) {
      console.log('⚠️ 無法取得員工列表，可能是 RLS 限制:', error);
      return [];
    }
  };

  const staffCount = getBranchStaffCount(branchId);
  const branchStaff = getBranchStaffList(branchId);

  if (mobile) {
    return (
      <div className="flex items-center text-xs">
        <Users className="h-3 w-3 mr-1 flex-shrink-0 text-gray-500" />
        <span className="font-medium">{staffCount} 人</span>
        {staffCount > 0 && branchStaff.length > 0 && (
          <span className="text-gray-500 ml-1">
            ({branchStaff.slice(0, 2).map(staff => staff.name).join(', ')}
            {staffCount > 2 && `等 ${staffCount} 人`})
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <span className="font-medium">{staffCount} 人</span>
      {staffCount > 0 && branchStaff.length > 0 && (
        <div className="text-xs text-gray-500 mt-1">
          {branchStaff.slice(0, 2).map(staff => staff.name).join(', ')}
          {staffCount > 2 && `等 ${staffCount} 人`}
        </div>
      )}
      {staffCount === 0 && (
        <span className="text-xs text-gray-400">尚無員工</span>
      )}
    </div>
  );
};
