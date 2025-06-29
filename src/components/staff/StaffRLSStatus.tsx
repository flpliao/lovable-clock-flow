
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import { useStaffRLSValidation } from '@/hooks/useStaffRLSValidation';

/**
 * Staff RLS 狀態顯示元件
 */
export const StaffRLSStatus: React.FC = () => {
  const { isValidating, validationResult, validateRLS } = useStaffRLSValidation();

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-sm">
          <Shield className="h-4 w-4 mr-2" />
          資料庫安全政策狀態
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isValidating ? (
          <div className="flex items-center text-sm text-gray-600">
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            驗證 RLS 政策中...
          </div>
        ) : validationResult ? (
          <div className="space-y-3">
            <Alert className={validationResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
              <div className="flex items-start">
                {validationResult.success ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
                )}
                <AlertDescription className={`text-sm ${validationResult.success ? 'text-green-800' : 'text-red-800'}`}>
                  {validationResult.message}
                </AlertDescription>
              </div>
            </Alert>
            
            {validationResult.details && (
              <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                <div>用戶: {validationResult.details.userEmail}</div>
                <div>管理員權限: {validationResult.details.isSuperAdmin ? '是' : '否'}</div>
                <div>可訪問員工數: {validationResult.details.accessibleStaffCount}</div>
              </div>
            )}
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={validateRLS}
              className="text-xs"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              重新驗證
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};
