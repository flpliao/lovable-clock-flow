
import { useState, useEffect } from 'react';
import { UseFormWatch } from 'react-hook-form';
import { LeaveFormValues } from '@/utils/leaveTypes';
import { calculateWorkHours } from '@/utils/leaveUtils';

export function useLeaveFormCalculations(watch: UseFormWatch<LeaveFormValues>) {
  const [calculatedHours, setCalculatedHours] = useState<number>(0);
  const [selectedLeaveType, setSelectedLeaveType] = useState<string | null>(null);
  
  // Calculate hours whenever start_date or end_date changes
  useEffect(() => {
    const start = watch('start_date');
    const end = watch('end_date');
    
    if (start && end && end >= start) {
      // Use the new work hours calculation function
      const workHours = calculateWorkHours(start, end);
      setCalculatedHours(workHours);
    } else {
      setCalculatedHours(0);
    }
  }, [watch('start_date'), watch('end_date')]);

  // Update selected leave type when the form value changes
  useEffect(() => {
    const leaveType = watch('leave_type');
    if (leaveType) {
      setSelectedLeaveType(leaveType);
    }
  }, [watch('leave_type')]);

  return {
    calculatedHours,
    selectedLeaveType
  };
}
