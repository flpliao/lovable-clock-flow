import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { leaveRequestService } from '@/services/leaveRequestService';
import useEmployeeStore from '@/stores/employeeStore';
import { LeaveFormData } from '@/types/leave';
import { calculateAnnualLeaveDays } from '@/utils/annualLeaveCalculator';
import { leaveFormSchema, LeaveFormValues } from '@/utils/leaveTypes';
import { validateLeaveRequest } from '@/utils/leaveValidation';
import { calculateWorkingHours } from '@/utils/workingHoursCalculator';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { LeaveBalanceCard } from './LeaveBalanceCard';
import { LeaveRequestSimplifiedFormFields } from './LeaveRequestSimplifiedFormFields';
import { LeaveTypeDetailCard } from './LeaveTypeDetailCard';

interface NewLeaveRequestFormProps {
  onSubmit?: () => void;
}

interface StaffData {
  id: string;
  user_id?: string;
  name: string;
  department: string;
  position: string;
  hire_date: string;
  supervisor_id: string | null;
  yearsOfService: string;
  totalAnnualLeaveDays: number;
  usedAnnualLeaveDays: number;
  remainingAnnualLeaveDays: number;
}

export function NewLeaveRequestForm({ onSubmit }: NewLeaveRequestFormProps) {
  // 使用新的 Zustand hooks
  const { employee } = useEmployeeStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calculatedHours, setCalculatedHours] = useState<number>(0);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [userStaffData, setUserStaffData] = useState<StaffData | null>(null);
  const [isLoadingStaffData, setIsLoadingStaffData] = useState(false);
  const [staffValidationError, setStaffValidationError] = useState<string | null>(null);

  const form = useForm<LeaveFormValues>({
    resolver: zodResolver(leaveFormSchema),
    defaultValues: {
      reason: '',
    },
  });

  const watchedLeaveType = form.watch('leave_type');

  // Validate staff data
  const validateStaffData = async (userId: string) => {
    try {
      const { data: staffData, error } = await supabase
        .from('staff')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('❌ Staff data validation failed:', error);
        setStaffValidationError('員工資料驗證失敗，請聯繫管理員');
        return null;
      }

      if (!staffData) {
        console.error('❌ Staff data not found for user:', userId);
        setStaffValidationError('找不到員工資料，請聯繫管理員');
        return null;
      }

      // Calculate annual leave days
      const hireDate = new Date(staffData.hire_date);
      const currentDate = new Date();
      const yearsOfService = Math.floor(
        (currentDate.getTime() - hireDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
      );

      const totalAnnualLeaveDays = calculateAnnualLeaveDays(yearsOfService);
      const usedAnnualLeaveDays = staffData.used_annual_leave_days || 0;
      const remainingAnnualLeaveDays = totalAnnualLeaveDays - usedAnnualLeaveDays;

      const processedStaffData: StaffData = {
        id: staffData.id,
        user_id: staffData.user_id,
        name: staffData.name,
        department: staffData.department,
        position: staffData.position,
        hire_date: staffData.hire_date,
        supervisor_id: staffData.supervisor_id,
        yearsOfService: `${yearsOfService} 年`,
        totalAnnualLeaveDays,
        usedAnnualLeaveDays,
        remainingAnnualLeaveDays,
      };

      console.log('✅ Staff data validated successfully:', processedStaffData);
      setStaffValidationError(null);
      return processedStaffData;
    } catch (error) {
      console.error('❌ Staff data validation error:', error);
      setStaffValidationError('員工資料驗證過程中發生錯誤');
      return null;
    }
  };

  // Load staff data
  useEffect(() => {
    const loadStaffData = async () => {
      if (!employee?.slug) return;

      setIsLoadingStaffData(true);
      try {
        const staffData = await validateStaffData(employee.slug);
        if (staffData) {
          setUserStaffData(staffData);
        }
      } catch (error) {
        console.error('❌ Failed to load staff data:', error);
        setStaffValidationError('載入員工資料失敗');
      } finally {
        setIsLoadingStaffData(false);
      }
    };

    loadStaffData();
  }, [employee?.slug]);

  // Calculate leave hours
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'start_date' || name === 'end_date') {
        const startDate = value.start_date;
        const endDate = value.end_date;

        if (startDate && endDate) {
          const hours = calculateWorkingHours(startDate, endDate);
          setCalculatedHours(hours);
        } else {
          setCalculatedHours(0);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form.watch]);

  // Validate request
  useEffect(() => {
    const validateRequest = async () => {
      const formData = form.getValues();
      if (!formData.start_date || !formData.end_date || !formData.leave_type || !userStaffData) {
        setValidationError(null);
        return;
      }

      try {
        const validationResult = await validateLeaveRequest({
          start_date: formData.start_date,
          end_date: formData.end_date,
          leave_type: formData.leave_type,
          userStaffData,
        });

        setValidationError(validationResult.error || null);
      } catch (error) {
        console.error('❌ Request validation error:', error);
        setValidationError('請假申請驗證失敗');
      }
    };

    validateRequest();
  }, [form.watch(), userStaffData]);

  const handleSubmit = async (data: LeaveFormValues) => {
    // Pre-submission validation with enhanced security checks
    if (!employee) {
      toast({
        title: 'Error',
        description: 'Please log in to the system first',
        variant: 'destructive',
      });
      return;
    }

    if (staffValidationError || !userStaffData) {
      toast({
        title: 'Staff Data Error',
        description: staffValidationError || 'Staff data not found, please contact administrator',
        variant: 'destructive',
      });
      return;
    }

    if (validationError) {
      toast({
        title: 'Application Failed',
        description: validationError,
        variant: 'destructive',
      });
      return;
    }

    if (calculatedHours <= 0) {
      toast({
        title: 'Application Failed',
        description: 'Please select valid leave dates',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);

      console.log('📝 Submitting leave request with secure validation');

      // Create the leave request using LeaveFormData format
      const leaveFormData: LeaveFormData = {
        start_date: data.start_date,
        end_date: data.end_date,
        leave_type: data.leave_type as 'annual' | 'sick' | 'personal' | 'other',
        reason: data.reason,
      };

      console.log('📋 Prepared to create leave request with validated data');

      await leaveRequestService.submitLeaveRequest(leaveFormData);

      toast({
        title: 'Application Successful',
        description: 'Leave request has been submitted, awaiting approval',
      });

      form.reset();
      setCalculatedHours(0);
      setValidationError(null);

      if (onSubmit) {
        onSubmit();
      }
    } catch (error) {
      console.error('❌ Failed to submit leave request:', error);
      toast({
        title: 'Application Failed',
        description: 'Error occurred while submitting leave request',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasHireDate = Boolean(userStaffData?.hire_date);

  return (
    <div className="space-y-6">
      {/* Authentication status warning */}
      {!employee && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            User is not properly authenticated, please log in again and try
          </AlertDescription>
        </Alert>
      )}

      {/* Staff data validation error warning */}
      {staffValidationError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Staff data validation failed:</strong> {staffValidationError}
          </AlertDescription>
        </Alert>
      )}

      {/* Staff data and annual leave balance display */}
      <LeaveBalanceCard
        userStaffData={userStaffData}
        hasHireDate={hasHireDate}
        isLoading={isLoadingStaffData}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Use simplified form field components */}
          <LeaveRequestSimplifiedFormFields
            form={form}
            calculatedHours={calculatedHours}
            validationError={validationError}
            hasHireDate={hasHireDate}
            userStaffData={userStaffData}
          />

          {/* Leave type detail information card */}
          {watchedLeaveType && (
            <LeaveTypeDetailCard
              leaveType={watchedLeaveType}
              remainingDays={userStaffData?.remainingAnnualLeaveDays}
              usedDays={userStaffData?.usedAnnualLeaveDays || 0}
            />
          )}

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={
                isSubmitting ||
                validationError !== null ||
                calculatedHours <= 0 ||
                !employee ||
                !!staffValidationError ||
                !userStaffData
              }
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-2 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  提交中...
                </>
              ) : (
                '提交申請'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
