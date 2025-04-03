
import { useState, useMemo } from 'react';
import { useUser } from '@/contexts/UserContext';
import { getCheckInRecords } from '@/utils/checkInUtils';
import { useStaffManagement } from '../useStaffManagement';
import { CheckInRecord } from '@/types';
import { Staff } from '../types';

export interface TeamMemberCheckInData {
  staff: Staff;
  totalRecords: number;
  successRecords: number;
  latestRecord: CheckInRecord | null;
}

export const useTeamCheckInData = () => {
  const { currentUser, isAdmin, isManager } = useUser();
  const { staffMembers } = useStaffManagement();
  const [filter, setFilter] = useState<'today' | 'week' | 'month'>('today');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  // Check if user has permission to view this page
  const hasPermission = isAdmin() || isManager();

  // Get all departments
  const departments = useMemo(() => {
    const deptSet = new Set<string>();
    staffMembers.forEach(staff => {
      if (staff.department) {
        deptSet.add(staff.department);
      }
    });
    return Array.from(deptSet);
  }, [staffMembers]);

  // Filter staff members by department
  const filteredStaff = useMemo(() => {
    if (departmentFilter === 'all') {
      return staffMembers;
    }
    return staffMembers.filter(staff => staff.department === departmentFilter);
  }, [staffMembers, departmentFilter]);

  // Process check-in data
  const teamCheckInData = useMemo(() => {
    if (!hasPermission) return [];

    const allRecords = getCheckInRecords();
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const weekStart = new Date(today - (now.getDay() > 0 ? now.getDay() - 1 : 6) * 86400000).getTime();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

    return filteredStaff.map(staff => {
      // Filter records by date range and user ID
      const userRecords = allRecords.filter(record => {
        const recordTime = new Date(record.timestamp).getTime();
        
        if (record.userId !== staff.id) return false;
        
        if (filter === 'today') {
          return recordTime >= today;
        } else if (filter === 'week') {
          return recordTime >= weekStart;
        } else if (filter === 'month') {
          return recordTime >= monthStart;
        }
        
        return false;
      });

      // Get stats
      const totalRecords = userRecords.length;
      const successRecords = userRecords.filter(r => r.status === 'success').length;
      
      // Get latest record
      const latestRecord = userRecords.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )[0] || null;

      return {
        staff,
        totalRecords,
        successRecords,
        latestRecord
      };
    });
  }, [filteredStaff, filter, hasPermission]);

  return {
    filter,
    setFilter,
    departmentFilter,
    setDepartmentFilter,
    departments,
    teamCheckInData,
    hasPermission
  };
};
