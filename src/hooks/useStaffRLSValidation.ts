
import { useState, useEffect } from 'react';
import { StaffRLSService } from '@/services/staffRLSService';
import { useToast } from '@/hooks/use-toast';

/**
 * Staff RLS 驗證 Hook
 */
export const useStaffRLSValidation = () => {
  const [isValidating, setIsValidating] = useState(true);
  const [validationResult, setValidationResult] = useState<{
    success: boolean;
    message: string;
    details?: any;
  } | null>(null);
  const { toast } = useToast();

  const validateRLS = async () => {
    setIsValidating(true);
    try {
      const result = await StaffRLSService.validateRLSPolicies();
      setValidationResult(result);
      
      if (result.success) {
        console.log('✅ RLS 政策驗證成功:', result.message);
      } else {
        console.error('❌ RLS 政策驗證失敗:', result.message);
        toast({
          title: "RLS 政策問題",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('❌ RLS 驗證過程發生錯誤:', error);
      setValidationResult({
        success: false,
        message: `驗證過程發生錯誤: ${error}`
      });
    } finally {
      setIsValidating(false);
    }
  };

  useEffect(() => {
    validateRLS();
  }, []);

  return {
    isValidating,
    validationResult,
    validateRLS
  };
};
