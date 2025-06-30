
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Shield, CheckCircle2, AlertTriangle, RefreshCw, Lock, Users, Database } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { securityService } from '@/services/securityService';
import { enhancedPermissionService } from '@/services/enhancedPermissionService';

interface SecurityStatus {
  rls_enabled: boolean;
  policy_count: number;
  user_count: number;
  admin_count: number;
  last_check: string;
}

/**
 * 安全儀表板元件
 * 顯示系統安全狀態和統計資訊
 */
export const SecurityDashboard: React.FC = () => {
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadSecurityStatus = async () => {
    try {
      setIsLoading(true);

      // 檢查 RLS 狀態
      const { data: rlsData } = await supabase.rpc('test_staff_rls');
      
      // 獲取用戶統計
      const { data: staffData } = await supabase
        .from('staff')
        .select('role')
        .limit(1000);

      const userCount = staffData?.length || 0;
      const adminCount = staffData?.filter(s => s.role === 'admin').length || 0;

      setSecurityStatus({
        rls_enabled: rlsData?.[0]?.result || false,
        policy_count: rlsData?.length || 0,
        user_count: userCount,
        admin_count: adminCount,
        last_check: new Date().toISOString()
      });
    } catch (error) {
      console.error('載入安全狀態失敗:', error);
      await securityService.logSecurityEvent('security_status_load_failed', { error });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    enhancedPermissionService.clearCache();
    await loadSecurityStatus();
  };

  const handleClearCache = () => {
    enhancedPermissionService.clearCache();
    securityService.logSecurityEvent('cache_cleared_manually');
  };

  useEffect(() => {
    loadSecurityStatus();
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin mr-2" />
            <span>載入安全狀態中...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            系統安全狀態
          </CardTitle>
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            刷新
          </Button>
        </CardHeader>
        <CardContent>
          {securityStatus ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-green-100">
                  <Database className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">RLS 狀態</p>
                  <div className="flex items-center space-x-2">
                    {securityStatus.rls_enabled ? (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        啟用
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        未啟用
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-blue-100">
                  <Lock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">安全政策</p>
                  <p className="text-2xl font-bold">{securityStatus.policy_count}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-purple-100">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">用戶總數</p>
                  <p className="text-2xl font-bold">{securityStatus.user_count}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-orange-100">
                  <Shield className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">管理員數量</p>
                  <p className="text-2xl font-bold">{securityStatus.admin_count}</p>
                </div>
              </div>
            </div>
          ) : (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                無法載入安全狀態資訊
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>安全操作</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">權限快取管理</h4>
                <p className="text-sm text-gray-600">清除權限快取以確保最新權限設定生效</p>
              </div>
              <Button onClick={handleClearCache} variant="outline">
                清除快取
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">安全狀態檢查</h4>
                <p className="text-sm text-gray-600">執行完整的系統安全檢查</p>
              </div>
              <Button onClick={handleRefresh} variant="outline" disabled={isRefreshing}>
                {isRefreshing ? '檢查中...' : '執行檢查'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {securityStatus && (
        <Card>
          <CardHeader>
            <CardTitle>安全統計</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600">
              <p>最後檢查時間: {new Date(securityStatus.last_check).toLocaleString()}</p>
              <p className="mt-2">系統安全狀態: {securityStatus.rls_enabled ? '良好' : '需要注意'}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
