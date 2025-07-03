import { toast } from '@/components/ui/use-toast';
import { useLeaveManagementContext } from '@/contexts/LeaveManagementContext';
import { useCurrentUser } from '@/hooks/useStores';
import { getApprovers } from '@/services/leaveRequestService';
import { LeaveUsage, LeaveValidationService, ValidationResult } from '@/services/leaveValidationService';
import { leaveFormSchema, LeaveFormValues } from '@/utils/leaveTypes';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

export function useLeaveRequestFormLogic(onSubmit?: () => void) {
  const currentUser = useCurrentUser();
  const { createLeaveRequest } = useLeaveManagementContext();
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const validationTimeoutRef = useRef<NodeJS.Timeout>();
  const lastValidationKeyRef = useRef<string>('');
  
  // Memoize approvers to prevent unnecessary recalculations
  const approvers = useMemo(() => getApprovers(), []);
  
  const form = useForm<LeaveFormValues>({
    resolver: zodResolver(leaveFormSchema),
    defaultValues: {
      reason: "",
    },
  });

  const watchedValues = form.watch();
  
  // Stable mock leave usage data
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

  // Stable calculation with proper dependencies
  const calculatedHours = useMemo(() => {
    if (watchedValues.start_date && watchedValues.end_date) {
      return LeaveValidationService.calculateLeaveHours(
        watchedValues.start_date,
        watchedValues.end_date
      );
    }
    return 0;
  }, [watchedValues.start_date, watchedValues.end_date]);

  // Create a stable validation key to prevent unnecessary validations
  const validationKey = useMemo(() => {
    if (!currentUser || !watchedValues.start_date || !watchedValues.end_date || !watchedValues.leave_type) {
      return '';
    }
    return JSON.stringify({
      userId: currentUser.id,
      startDate: watchedValues.start_date.toISOString(),
      endDate: watchedValues.end_date.toISOString(),
      leaveType: watchedValues.leave_type,
      reason: watchedValues.reason
    });
  }, [currentUser?.id, watchedValues.start_date, watchedValues.end_date, watchedValues.leave_type, watchedValues.reason]);

  // Optimized validation function
  const validateForm = useCallback(async () => {
    if (!validationKey || validationKey === lastValidationKeyRef.current) {
      return;
    }

    lastValidationKeyRef.current = validationKey;
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

  // Optimized debounced validation
  React.useEffect(() => {
    if (!validationKey) {
      setValidationResult(null);
      return;
    }

    // Clear existing timeout
    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current);
    }

    // Set new timeout only if validation key changed
    validationTimeoutRef.current = setTimeout(validateForm, 800);

    return () => {
      if (validationTimeoutRef.current) {
        clearTimeout(validationTimeoutRef.current);
      }
    };
  }, [validationKey, validateForm]);

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
        leave_type: data.leave_type as 'annual' | 'sick' | 'personal' | 'marriage' | 'bereavement' | 'maternity' | 'paternity' | 'parental' | 'occupational' | 'menstrual' | 'other',
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
        lastValidationKeyRef.current = '';
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
