
import { useState, useMemo, useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUser } from '@/contexts/UserContext';
import { useLeaveManagementContext } from '@/contexts/LeaveManagementContext';
import { leaveFormSchema, LeaveFormValues } from '@/utils/leaveTypes';
import { LeaveValidationService, ValidationResult, LeaveUsage } from '@/services/leaveValidationService';
import { getApprovers } from '@/services/leaveRequestService';
import { toast } from '@/components/ui/use-toast';
import React from 'react';

export function useLeaveRequestFormLogic(onSubmit?: () => void) {
  const { currentUser } = useUser();
  const { createLeaveRequest } = useLeaveManagementContext();
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const validationTimeoutRef = useRef<NodeJS.Timeout>();
  
  // Memoize approvers to prevent unnecessary recalculations
  const approvers = useMemo(() => getApprovers(), []);
  
  const form = useForm<LeaveFormValues>({
    resolver: zodResolver(leaveFormSchema),
    defaultValues: {
      reason: "",
    },
  });

  const watchedValues = form.watch();
  
  // Memoize mock leave usage data to prevent recreating on every render
  const mockLeaveUsage: LeaveUsage = useMemo(() => ({
    annualUsed: 5,
    personalUsed: 2,
    sickUsed: 3,
    menstrualUsed: 2,
    marriageUsed: false,
    paternalUsed: 0,
    bereavementUsed: {},
    monthlyMenstrualUsage: {
      '2024-01': 1,
      '2024-02': 1,
    }
  }), []);

  // Calculate hours with useMemo to prevent unnecessary recalculations
  const calculatedHours = useMemo(() => {
    if (watchedValues.start_date && watchedValues.end_date) {
      return LeaveValidationService.calculateLeaveHours(
        watchedValues.start_date,
        watchedValues.end_date
      );
    }
    return 0;
  }, [watchedValues.start_date, watchedValues.end_date]);

  // Memoize validation dependencies to prevent unnecessary re-validation
  const validationKey = useMemo(() => {
    if (!currentUser || !watchedValues.start_date || !watchedValues.end_date || !watchedValues.leave_type) {
      return null;
    }
    return {
      userId: currentUser.id,
      startDate: watchedValues.start_date.toISOString(),
      endDate: watchedValues.end_date.toISOString(),
      leaveType: watchedValues.leave_type,
      reason: watchedValues.reason
    };
  }, [currentUser?.id, watchedValues.start_date, watchedValues.end_date, watchedValues.leave_type, watchedValues.reason]);

  // Stable validation function with useCallback
  const validateForm = useCallback(async () => {
    if (!validationKey) {
      setValidationResult(null);
      return;
    }

    setIsValidating(true);
    
    try {
      const result = await LeaveValidationService.validateLeaveRequest(
        watchedValues,
        currentUser!,
        mockLeaveUsage,
        []
      );
      setValidationResult(result);
    } catch (error) {
      console.error('Validation error:', error);
      setValidationResult(null);
    } finally {
      setIsValidating(false);
    }
  }, [validationKey, watchedValues, currentUser, mockLeaveUsage]);

  // Debounced validation with proper cleanup
  React.useEffect(() => {
    // Clear existing timeout
    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current);
    }

    // Set new timeout
    validationTimeoutRef.current = setTimeout(validateForm, 500);

    // Cleanup function
    return () => {
      if (validationTimeoutRef.current) {
        clearTimeout(validationTimeoutRef.current);
      }
    };
  }, [validateForm]);

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (validationTimeoutRef.current) {
        clearTimeout(validationTimeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = useCallback(async (data: LeaveFormValues) => {
    if (!currentUser) return;

    setIsSubmitting(true);
    
    try {
      // Final validation before submission  
      const finalValidation = await LeaveValidationService.validateLeaveRequest(
        data,
        currentUser,
        mockLeaveUsage,
        []
      );

      if (!finalValidation.isValid) {
        toast({
          title: "表單驗證失敗",
          description: finalValidation.errors.join('\n'),
          variant: "destructive"
        });
        return;
      }

      // Create the leave request
      const leaveRequest = {
        id: '',
        user_id: currentUser.id,
        start_date: data.start_date.toISOString().split('T')[0],
        end_date: data.end_date.toISOString().split('T')[0],
        leave_type: data.leave_type as any,
        status: 'pending' as const,
        hours: calculatedHours,
        reason: data.reason,
        approval_level: 1,
        current_approver: approvers[0]?.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        approvals: approvers.map((approver, index) => ({
          id: `${Date.now()}-${index}`,
          leave_request_id: '',
          approver_id: approver.id,
          approver_name: approver.name,
          status: 'pending' as const,
          level: approver.level
        }))
      };

      const success = await createLeaveRequest(leaveRequest);
      
      if (success) {
        toast({
          title: "申請成功",
          description: "請假申請已送出，等待主管審核",
        });
        
        if (onSubmit) {
          onSubmit();
        }
        
        form.reset();
        setValidationResult(null);
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast({
        title: "提交失敗",
        description: "請檢查網路連線後重試",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [currentUser, calculatedHours, mockLeaveUsage, approvers, createLeaveRequest, onSubmit, form]);

  const canSubmit = useMemo(() => {
    return validationResult?.isValid && !isValidating && !isSubmitting;
  }, [validationResult?.isValid, isValidating, isSubmitting]);

  return {
    form,
    currentUser,
    approvers,
    calculatedHours,
    watchedValues,
    validationResult,
    isValidating,
    isSubmitting,
    canSubmit,
    handleSubmit
  };
}
