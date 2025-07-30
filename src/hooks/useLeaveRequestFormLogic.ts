import { toast } from '@/components/ui/use-toast';
import { createLeaveRequest } from '@/services/leaveRequestService';
import {
  LeaveUsage,
  LeaveValidationService,
  ValidationResult,
} from '@/services/leaveValidationService';
import useEmployeeStore from '@/stores/employeeStore';
import { LeaveFormData } from '@/types/leave';
import { leaveFormSchema, LeaveFormValues } from '@/utils/leaveTypes';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

export function useLeaveRequestFormLogic(onSubmit?: () => void) {
  const { employee } = useEmployeeStore();
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const validationTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const lastValidationKeyRef = useRef<string>('');

  // Mock approvers data since getApprovers is not available in leaveRequestService
  const approvers = useMemo(
    () => [
      { id: '1', name: '主管', level: 1 },
      { id: '2', name: '經理', level: 2 },
    ],
    []
  );

  const form = useForm<LeaveFormValues>({
    resolver: zodResolver(leaveFormSchema),
    defaultValues: {
      reason: '',
    },
  });

  const watchedValues = form.watch();

  // Stable mock leave usage data
  const mockLeaveUsage: LeaveUsage = useMemo(
    () => ({
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
      },
    }),
    []
  );

  // Calculate hours based on date range
  const calculatedHours = useMemo(() => {
    const startDate = watchedValues.start_date;
    const endDate = watchedValues.end_date;

    if (!startDate || !endDate) return 0;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays * 8; // 8 hours per day
  }, [watchedValues.start_date, watchedValues.end_date]);

  // Validation logic
  const validateForm = useCallback(async () => {
    const data = form.getValues();

    if (!data.start_date || !data.end_date || !data.leave_type || !data.reason) {
      return;
    }

    const validationKey = `${data.start_date}-${data.end_date}-${data.leave_type}-${data.reason}`;

    if (validationKey === lastValidationKeyRef.current) {
      return;
    }

    lastValidationKeyRef.current = validationKey;
    setIsValidating(true);

    try {
      const result = await LeaveValidationService.validateLeaveRequest(
        data,
        employee,
        mockLeaveUsage,
        approvers
      );
      setValidationResult(result);
    } catch (error) {
      console.error('Validation error:', error);
      setValidationResult({
        isValid: false,
        errors: ['驗證過程中發生錯誤'],
        warnings: [],
      });
    } finally {
      setIsValidating(false);
    }
  }, [form, employee, mockLeaveUsage, approvers]);

  // Debounced validation
  useEffect(() => {
    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current);
    }

    validationTimeoutRef.current = setTimeout(() => {
      validateForm();
    }, 500);

    return () => {
      if (validationTimeoutRef.current) {
        clearTimeout(validationTimeoutRef.current);
      }
    };
  }, [validateForm]);

  // Submit handler
  const handleSubmit = useCallback(
    async (data: LeaveFormValues) => {
      if (!employee) {
        toast({
          title: '錯誤',
          description: '請先登入',
          variant: 'destructive',
        });
        return;
      }

      setIsSubmitting(true);

      try {
        // Final validation before submission
        const finalValidation = await LeaveValidationService.validateLeaveRequest(
          data,
          employee,
          mockLeaveUsage,
          []
        );

        if (!finalValidation.isValid) {
          toast({
            title: '表單驗證失敗',
            description: finalValidation.errors.join('\n'),
            variant: 'destructive',
          });
          return;
        }

        // Create the leave request using LeaveFormData format
        const leaveFormData: LeaveFormData = {
          start_date: data.start_date,
          end_date: data.end_date,
          leave_type: data.leave_type as 'annual' | 'sick' | 'personal' | 'other',
          reason: data.reason,
        };

        await createLeaveRequest(leaveFormData);

        toast({
          title: '申請成功',
          description: '請假申請已送出，等待主管審核',
        });

        if (onSubmit) {
          onSubmit();
        }

        form.reset();
        setValidationResult(null);
        lastValidationKeyRef.current = '';
      } catch (error) {
        console.error('Submit error:', error);
        toast({
          title: '提交失敗',
          description: '請檢查網路連線後重試',
          variant: 'destructive',
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [employee, calculatedHours, mockLeaveUsage, approvers, onSubmit, form]
  );

  const canSubmit = useMemo(() => {
    return validationResult?.isValid && !isValidating && !isSubmitting;
  }, [validationResult?.isValid, isValidating, isSubmitting]);

  return {
    form,
    employee,
    approvers,
    calculatedHours,
    watchedValues,
    validationResult,
    isValidating,
    isSubmitting,
    canSubmit,
    handleSubmit,
  };
}
