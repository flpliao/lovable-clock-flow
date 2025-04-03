
import { useState } from 'react';
import { useStaffManagementContext } from '@/contexts/StaffManagementContext';
import { useUser } from '@/contexts/UserContext';
import { getCheckInRecords } from '@/utils/checkInUtils';
import { CheckInRecord } from '@/types';
import { Staff } from '../types';

export const useTeamCheckInData = () => {
  const { currentUser, isAdmin } = useUser();
  const { staffList, getSubordinates } = useStaffManagementContext();
  const [filter, setFilter] = useState<'today' | 'week' | 'month'>('today');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  
  const allCheckInRecords = getCheckInRecords();
  
  const departments = Array.from(new Set(staffList.map(staff => staff.department)));
  
  const teamMembers = isAdmin() 
    ? staffList
    : currentUser?.id 
      ? getSubordinates(currentUser.id)
      : [];
  
  const getFilteredByDate = (records: CheckInRecord[]): CheckInRecord[] => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const weekAgo = today - 7 * 24 * 60 * 60 * 1000;
    const monthAgo = today - 30 * 24 * 60 * 60 * 1000;
    
    return records.filter(record => {
      const recordTime = new Date(record.timestamp).getTime();
      switch (filter) {
        case 'today':
          return recordTime >= today;
        case 'week':
          return recordTime >= weekAgo;
        case 'month':
          return recordTime >= monthAgo;
        default:
          return true;
      }
    });
  };
  
  const filteredTeamMembers = departmentFilter === 'all'
    ? teamMembers
    : teamMembers.filter(member => member.department === departmentFilter);
  
  const teamCheckInData = filteredTeamMembers.map(member => {
    const userRecords = allCheckInRecords.filter(record => record.userId === member.id);
    const filteredRecords = getFilteredByDate(userRecords);
    
    const latestRecord = filteredRecords.length > 0
      ? filteredRecords.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]
      : null;
    
    return {
      staff: member,
      totalRecords: filteredRecords.length,
      successRecords: filteredRecords.filter(r => r.status === 'success').length,
      failedRecords: filteredRecords.filter(r => r.status === 'failed').length,
      latestRecord
    };
  });
  
  const hasPermission = isAdmin() || (currentUser && getSubordinates(currentUser.id).length > 0);

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

export type TeamMemberCheckInData = ReturnType<typeof useTeamCheckInData>['teamCheckInData'][0];
