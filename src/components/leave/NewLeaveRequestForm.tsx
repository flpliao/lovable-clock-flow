
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { useLeaveManagementContext } from '@/contexts/LeaveManagementContext';
import { LeaveFormValues, leaveFormSchema } from '@/utils/leaveTypes';
import { LeaveRequestSimplifiedFormFields } from './LeaveRequestSimplifiedFormFields';
import { LeaveTypeDetailCard } from './LeaveTypeDetailCard';
import { LeaveBalanceCard } from './LeaveBalanceCard';
import { calculateWorkingHours } from '@/utils/workingHoursCalculator';
import { validateLeaveRequest } from '@/utils/leaveValidation';
import { datePickerToDatabase } from '@/utils/dateUtils';
import { calculateAnnualLeaveDays } from '@/utils/annualLeaveCalculator';
import { Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface NewLeaveRequestFormProps {
  onSubmit?: () => void;
}

export function NewLeaveRequestForm({ onSubmit }: NewLeaveRequestFormProps) {
  const { toast } = useToast();
  const { currentUser, isAuthenticated } = useUser();
  const { createLeaveRequest } = useLeaveManagementContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calculatedHours, setCalculatedHours] = useState<number>(0);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [userStaffData, setUserStaffData] = useState<any>(null);
  const [isLoadingStaffData, setIsLoadingStaffData] = useState(true);
  const [staffValidationError, setStaffValidationError] = useState<string | null>(null);

  const form = useForm<LeaveFormValues>({
    resolver: zodResolver(leaveFormSchema),
    defaultValues: {
      leave_type: '',
      start_date: undefined,
      end_date: undefined,
      reason: ''
    }
  });

  const watchedStartDate = form.watch('start_date');
  const watchedEndDate = form.watch('end_date');
  const watchedLeaveType = form.watch('leave_type');

  // Secure staff data validation function
  const validateStaffData = async (userId: string) => {
    console.log('🔍 Validating staff data for authenticated user');
    
    try {
      // Check via user_id query first
      const { data: staffByUserId, error: userIdError } = await supabase
        .from('staff')
        .select('id, user_id, name, department, position, hire_date, supervisor_id')
        .eq('user_id', userId)
        .maybeSingle();

      if (staffByUserId && !userIdError) {
        console.log('✅ Found staff data via user_id');
        return { staff: staffByUserId, error: null };
      }

      // If not found via user_id, try via id query
      const { data: staffById, error: idError } = await supabase
        .from('staff')
        .select('id, user_id, name, department, position, hire_date, supervisor_id')
        .eq('id', userId)
        .maybeSingle();

      if (staffById && !idError) {
        console.log('✅ Found staff data via id');
        return { staff: staffById, error: null };
      }

      console.error('❌ Unable to find staff data');
      return { 
        staff: null, 
        error: 'Staff data record not found, please contact administrator for account setup' 
      };
    } catch (error) {
      console.error('❌ Error validating staff data:', error);
      return { 
        staff: null, 
        error: 'System error occurred while validating staff data' 
      };
    }
  };

  // Load staff data with secure validation
  useEffect(() => {
    const loadStaffData = async () => {
      if (!currentUser?.id) {
        console.log('❌ No current user');
        setIsLoadingStaffData(false);
        setStaffValidationError('Please log in to the system first');
        return;
      }

      console.log('🚀 Starting to load staff data for authenticated user');
      setIsLoadingStaffData(true);
      setStaffValidationError(null);
      
      try {
        // Check authentication status
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        console.log('🔍 Authentication status check');

        if (authError || !user) {
          setStaffValidationError('User authentication has expired, please log in again');
          return;
        }

        // Validate staff data
        const { staff, error } = await validateStaffData(currentUser.id);
        
        if (error || !staff) {
          console.error('❌ Staff data validation failed:', error);
          setStaffValidationError(error || 'Staff data not found');
          setUserStaffData(null);
          return;
        }

        const hireDate = staff.hire_date;
        console.log('📅 Hire date available');
        
        // Calculate years of service and annual leave days
        let yearsOfService = 'Not Set';
        let totalAnnualLeaveDays = 0;
        let usedAnnualLeaveDays = 0;
        let remainingAnnualLeaveDays = 0;

        if (hireDate) {
          const hireDateObj = new Date(hireDate);
          const now = new Date();
          const diffTime = Math.abs(now.getTime() - hireDateObj.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          const years = Math.floor(diffDays / 365);
          const months = Math.floor((diffDays % 365) / 30);
          
          yearsOfService = years > 0 ? 
            (months > 0 ? `${years} years ${months} months` : `${years} years`) : 
            `${months} months`;

          totalAnnualLeaveDays = calculateAnnualLeaveDays(hireDateObj);
          console.log('📊 Calculated annual leave days:', totalAnnualLeaveDays);

          // Calculate used annual leave days - use staff.id for query
          const currentYear = new Date().getFullYear();
          const { data: leaveRecords, error: leaveError } = await supabase
            .from('leave_requests')
            .select('hours')
            .eq('staff_id', staff.id) // Use correct staff.id
            .eq('leave_type', 'annual')
            .eq('status', 'approved')
            .gte('start_date', `${currentYear}-01-01`)
            .lte('start_date', `${currentYear}-12-31`);

          if (!leaveError && leaveRecords) {
            usedAnnualLeaveDays = leaveRecords.reduce((total, record) => {
              return total + (Number(record.hours) / 8);
            }, 0);
          }
          console.log('📈 Used annual leave days:', usedAnnualLeaveDays);

          remainingAnnualLeaveDays = Math.max(0, totalAnnualLeaveDays - usedAnnualLeaveDays);
          console.log('📉 Remaining annual leave days:', remainingAnnualLeaveDays);
        }

        // Set complete staff data
        const completeStaffData = {
          id: staff.id, // Ensure staff.id is included
          name: staff.name,
          department: staff.department,
          position: staff.position,
          hire_date: hireDate,
          supervisor_id: staff.supervisor_id,
          yearsOfService,
          totalAnnualLeaveDays,
          usedAnnualLeaveDays,
          remainingAnnualLeaveDays
        };

        console.log('✅ Complete staff data loaded successfully');
        setUserStaffData(completeStaffData);

      } catch (error) {
        console.error('❌ Error loading staff data:', error);
        setStaffValidationError('System error occurred while loading staff data, please try again later or contact administrator');
        setUserStaffData(null);
      } finally {
        setIsLoadingStaffData(false);
      }
    };

    loadStaffData();
  }, [currentUser?.id, isAuthenticated]);

  // Calculate leave hours
  useEffect(() => {
    if (watchedStartDate && watchedEndDate) {
      const hours = calculateWorkingHours(watchedStartDate, watchedEndDate);
      setCalculatedHours(hours);
      console.log('⏰ Calculated leave hours:', hours);
    } else {
      setCalculatedHours(0);
    }
  }, [watchedStartDate, watchedEndDate]);

  // Validate leave request
  useEffect(() => {
    const validateRequest = async () => {
      if (watchedStartDate && watchedEndDate && watchedLeaveType && currentUser) {
        try {
          console.log('🔍 Starting leave request validation');

          const validation = await validateLeaveRequest({
            leave_type: watchedLeaveType,
            start_date: watchedStartDate,
            end_date: watchedEndDate,
            hours: calculatedHours,
            user_id: currentUser.id
          });

          if (!validation.isValid) {
            setValidationError(validation.message);
            console.log('❌ Validation failed:', validation.message);
          } else {
            setValidationError(null);
            console.log('✅ Validation passed');
          }
        } catch (error) {
          console.error('❌ Error during validation process:', error);
          setValidationError('Error occurred during validation process, please try again later');
        }
      } else {
        setValidationError(null);
      }
    };

    if (calculatedHours > 0) {
      validateRequest();
    }
  }, [watchedStartDate, watchedEndDate, watchedLeaveType, calculatedHours, currentUser]);

  // Get leave data by leave type
  const getLeaveData = (leaveType: string) => {
    if (leaveType === 'annual' && userStaffData) {
      return {
        remainingDays: userStaffData.remainingAnnualLeaveDays,
        usedDays: userStaffData.usedAnnualLeaveDays
      };
    }

    // Mock data for other leave types
    const mockData: Record<string, { remainingDays?: number; usedDays: number }> = {
      'sick': { remainingDays: 27, usedDays: 3 },
      'personal': { remainingDays: 12, usedDays: 2 },
      'marriage': { remainingDays: 8, usedDays: 0 },
      'bereavement': { remainingDays: 8, usedDays: 0 },
      'maternity': { remainingDays: 56, usedDays: 0 },
      'paternity': { remainingDays: 7, usedDays: 0 },
      'menstrual': { remainingDays: 10, usedDays: 2 },
      'occupational': { usedDays: 0 },
      'parental': { usedDays: 0 },
      'other': { usedDays: 0 }
    };
    
    return mockData[leaveType] || { usedDays: 0 };
  };

  const handleSubmit = async (data: LeaveFormValues) => {
    // Pre-submission validation with enhanced security checks
    if (!currentUser) {
      toast({
        title: "Error",
        description: "Please log in to the system first",
        variant: "destructive"
      });
      return;
    }

    if (!isAuthenticated) {
      toast({
        title: "Authentication Error",
        description: "User authentication status is abnormal, please log in again",
        variant: "destructive"
      });
      return;
    }

    if (staffValidationError || !userStaffData) {
      toast({
        title: "Staff Data Error",
        description: staffValidationError || "Staff data not found, please contact administrator",
        variant: "destructive"
      });
      return;
    }

    if (validationError) {
      toast({
        title: "Application Failed",
        description: validationError,
        variant: "destructive"
      });
      return;
    }

    if (calculatedHours <= 0) {
      toast({
        title: "Application Failed", 
        description: "Please select valid leave dates",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      console.log('📝 Submitting leave request with secure validation');

      const startDateStr = datePickerToDatabase(data.start_date);
      const endDateStr = datePickerToDatabase(data.end_date);

      const leaveRequest = {
        id: '',
        user_id: currentUser.id,
        staff_id: userStaffData.id, // Use validated staff.id
        start_date: startDateStr,
        end_date: endDateStr,
        leave_type: data.leave_type as any,
        status: 'pending' as const,
        hours: calculatedHours,
        reason: data.reason,
        approval_level: 1,
        current_approver: userStaffData?.supervisor_id || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('📋 Prepared to create leave request with validated data');

      const success = await createLeaveRequest(leaveRequest);
      
      if (success) {
        toast({
          title: "Application Successful",
          description: "Leave request has been submitted, awaiting approval",
        });
        
        form.reset();
        setCalculatedHours(0);
        setValidationError(null);
        
        if (onSubmit) {
          onSubmit();
        }
      }
    } catch (error) {
      console.error('❌ Failed to submit leave request:', error);
      toast({
        title: "Application Failed",
        description: "Error occurred while submitting leave request",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasHireDate = Boolean(userStaffData?.hire_date);

  return (
    <div className="space-y-6">
      {/* Authentication status warning */}
      {!isAuthenticated && (
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
                !isAuthenticated || 
                !!staffValidationError || 
                !userStaffData
              }
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-2 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Application'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
