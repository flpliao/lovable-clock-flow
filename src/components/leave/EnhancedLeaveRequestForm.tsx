
import React, { useState, useMemo, useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useUser } from '@/contexts/UserContext';
import { useLeaveManagementContext } from '@/contexts/LeaveManagementContext';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { leaveFormSchema, LeaveFormValues, LEAVE_TYPES } from '@/utils/leaveTypes';
import { LeaveValidationService, ValidationResult, LeaveUsage } from '@/services/leaveValidationService';
import { LeaveDateSelector } from '@/components/leave/LeaveDateSelector';
import { LeaveTypeSelector } from '@/components/leave/LeaveTypeSelector';
import { LeaveFormDetails } from '@/components/leave/LeaveFormDetails';
import { LeaveApprovalWorkflow } from '@/components/leave/LeaveApprovalWorkflow';
import { getApprovers } from '@/services/leaveRequestService';
import { Send, AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/components/ui/use-toast';

interface EnhancedLeaveRequestFormProps {
  onSubmit?: () => void;
}

export function EnhancedLeaveRequestForm({ onSubmit }: EnhancedLeaveRequestFormProps) {
  const { currentUser } = useUser();
  const { createLeaveRequest } = useLeaveManagementContext();
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const approvers = useMemo(() => getApprovers(), []);
  
  const form = useForm<LeaveFormValues>({
    resolver: zodResolver(leaveFormSchema),
    defaultValues: {
      reason: "",
    },
  });

  const watchedValues = form.watch();
  
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

  // Mock leave usage data - in real app this would come from API
  const mockLeaveUsage: LeaveUsage = useMemo(() => ({
    annualUsed: 5,
    personalUsed: 2,
    sickUsed: 3,
    marriageUsed: false,
    paternalUsed: 0,
    bereavementUsed: {}
  }), []);

  // Debounced validation with useCallback
  const validateForm = useCallback(async () => {
    if (!currentUser || !watchedValues.start_date || !watchedValues.end_date || !watchedValues.leave_type) {
      setValidationResult(null);
      return;
    }

    setIsValidating(true);
    
    try {
      const result = await LeaveValidationService.validateLeaveRequest(
        watchedValues,
        currentUser,
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
  }, [watchedValues, currentUser, mockLeaveUsage]);

  // Use setTimeout for debouncing validation
  React.useEffect(() => {
    const timeoutId = setTimeout(validateForm, 500);
    return () => clearTimeout(timeoutId);
  }, [validateForm]);

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

  const canSubmit = validationResult?.isValid && !isValidating && !isSubmitting;

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-white drop-shadow-md mb-2">
          請假申請
        </h2>
        <p className="text-white/80 font-medium drop-shadow-sm">
          請填寫以下資訊提交您的請假申請
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* 員工資訊區塊 */}
          <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
            <h3 className="text-lg font-semibold text-white drop-shadow-md mb-4">員工資訊</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-white/70 font-medium">員工姓名</p>
                <p className="text-white font-semibold">{currentUser?.name || '未知'}</p>
              </div>
              <div>
                <p className="text-sm text-white/70 font-medium">部門</p>
                <p className="text-white font-semibold">{currentUser?.department || '未指定'}</p>
              </div>
            </div>
          </div>
          
          {/* 日期選擇區塊 */}
          <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
            <h3 className="text-lg font-semibold text-white drop-shadow-md mb-4">請假日期</h3>
            <LeaveDateSelector 
              form={form} 
              calculatedHours={calculatedHours} 
            />
          </div>
          
          {/* 請假類型選擇 */}
          <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
            <h3 className="text-lg font-semibold text-white drop-shadow-md mb-4">請假類型</h3>
            <LeaveTypeSelector 
              form={form}
              selectedLeaveType={watchedValues.leave_type}
            />
          </div>
          
          {/* 請假詳情 */}
          <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
            <h3 className="text-lg font-semibold text-white drop-shadow-md mb-4">請假詳情</h3>
            <LeaveFormDetails 
              form={form}
              selectedLeaveType={watchedValues.leave_type}
            />
          </div>

          {/* 驗證結果顯示 */}
          {(isValidating || validationResult) && (
            <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
              <h3 className="text-lg font-semibold text-white drop-shadow-md mb-4">
                {isValidating ? '檢查中...' : '表單檢查'}
              </h3>
              
              {isValidating && (
                <div className="flex items-center space-x-2 text-white">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>正在驗證表單...</span>
                </div>
              )}

              {validationResult && (
                <>
                  {/* 錯誤提示 */}
                  {validationResult.errors.length > 0 && (
                    <Alert className="mb-4 bg-red-50 border-red-200">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800">
                        <ul className="list-disc list-inside space-y-1">
                          {validationResult.errors.map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* 警告提示 */}
                  {validationResult.warnings.length > 0 && (
                    <Alert className="mb-4 bg-yellow-50 border-yellow-200">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <AlertDescription className="text-yellow-800">
                        <ul className="list-disc list-inside space-y-1">
                          {validationResult.warnings.map((warning, index) => (
                            <li key={index}>{warning}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* 成功提示 */}
                  {validationResult.isValid && validationResult.errors.length === 0 && (
                    <Alert className="bg-green-50 border-green-200">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        表單驗證通過，可以提交申請
                      </AlertDescription>
                    </Alert>
                  )}
                </>
              )}
            </div>
          )}
          
          {/* 審核流程 */}
          <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
            <h3 className="text-lg font-semibold text-white drop-shadow-md mb-4">審核流程</h3>
            <LeaveApprovalWorkflow approvers={approvers} />
          </div>

          {/* 提交按鈕 */}
          <div className="flex justify-center pt-6">
            <Button 
              type="submit" 
              disabled={!canSubmit}
              className={`w-full sm:w-auto px-8 py-3 backdrop-blur-xl border border-white/40 font-semibold shadow-lg transition-all duration-300 rounded-xl ${
                canSubmit 
                  ? 'bg-white/30 text-white hover:bg-white/50' 
                  : 'bg-gray-400/30 text-gray-300 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  提交中...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  提交請假申請
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default EnhancedLeaveRequestForm;
