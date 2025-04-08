
import { useState, useEffect } from 'react';
import { differenceInHours } from 'date-fns';
import { UseFormWatch } from 'react-hook-form';
import { LeaveFormValues } from '@/utils/leaveTypes';

export function useLeaveFormCalculations(watch: UseFormWatch<LeaveFormValues>) {
  const [calculatedHours, setCalculatedHours] = useState<number>(0);
  const [selectedLeaveType, setSelectedLeaveType] = useState<string | null>(null);
  
  // Calculate hours whenever start_date or end_date changes
  useEffect(() => {
    const start = watch('start_date');
    const end = watch('end_date');
    
    if (start && end) {
      // Calculate work hours (assuming 8 hours per workday)
      const hoursDiff = differenceInHours(end, start);
      // Simplified calculation - in a real app, this would account for
      // weekends, holidays, and working hours
      const workHours = Math.max(hoursDiff, 0);
      setCalculatedHours(workHours);
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
