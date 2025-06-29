
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { SystemSettingsService } from '@/services/systemSettingsService';
import { Loader2, MapPin, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';

const CheckInDistanceSettings = () => {
  const { toast } = useToast();
  const [distance, setDistance] = useState<number>(500);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<{
    canRead: boolean;
    canWrite: boolean;
    error?: string;
  } | null>(null);

  // 載入當前設定
  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      try {
        console.log('📋 載入打卡距離設定...');
        
        // 測試權限
        const permissions = await SystemSettingsService.checkUserPermissions();
        setPermissionStatus(permissions);
        
        if (!permissions.canRead) {
          console.error('❌ 沒有讀取權限');
          toast({
            title: "權限不足",
            description: permissions.error || "無法讀取系統設定，請檢查您的權限",
            variant: "destructive"
          });
          return;
        }

        const currentDistance = await SystemSettingsService.getCheckInDistanceLimit();
        setDistance(currentDistance);
        console.log('✅ 成功載入打卡距離限制:', currentDistance, '公尺');
      } catch (error) {
        console.error('❌ 載入打卡距離設定失敗:', error);
        toast({
          title: "載入失敗",
          description: "無法載入打卡距離設定",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [toast]);

  const handleSave = async () => {
    if (distance < 50 || distance > 2000) {
      toast({
        title: "設定錯誤",
        description: "打卡距離限制必須在 50-2000 公尺之間",
        variant: "destructive"
      });
      return;
    }

    if (!permissionStatus?.canWrite) {
      toast({
        title: "權限不足",
        description: permissionStatus?.error || "沒有寫入權限，無法儲存設定",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    try {
      console.log('💾 嘗試儲存打卡距離設定:', distance, '公尺');
      
      const success = await SystemSettingsService.setCheckInDistanceLimit(distance);
      
      if (success) {
        toast({
          title: "設定已更新",
          description: `打卡距離限制已調整為 ${distance} 公尺`,
        });
        console.log('✅ 打卡距離限制更新成功:', distance, '公尺');
      } else {
        throw new Error('儲存失敗');
      }
    } catch (error) {
      console.error('❌ 儲存打卡距離設定失敗:', error);
      
      // 重新測試權限
      const permissions = await SystemSettingsService.checkUserPermissions();
      setPermissionStatus(permissions);
      
      let errorMessage = "無法儲存打卡距離設定";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "儲存失敗",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setDistance(500);
  };

  if (loading) {
    return (
      <Card className="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl">
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin text-white mr-2" />
          <span className="text-white">載入中...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-white text-lg">
          <MapPin className="h-5 w-5" />
          GPS 打卡距離設定
        </CardTitle>
        <CardDescription className="text-white/80">
          調整員工GPS打卡時的允許距離範圍
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* 權限狀態 */}
        {permissionStatus && (
          <Alert className={`backdrop-blur-xl ${
            permissionStatus.canWrite 
              ? 'bg-green-500/20 border-green-400/30' 
              : permissionStatus.canRead 
                ? 'bg-yellow-500/20 border-yellow-400/30'
                : 'bg-red-500/20 border-red-400/30'
          }`}>
            {permissionStatus.canWrite ? (
              <CheckCircle className="h-4 w-4 text-green-400" />
            ) : permissionStatus.canRead ? (
              <ShieldAlert className="h-4 w-4 text-yellow-400" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-red-400" />
            )}
            <AlertDescription className={`${
              permissionStatus.canWrite 
                ? 'text-green-100' 
                : permissionStatus.canRead 
                  ? 'text-yellow-100'
                  : 'text-red-100'
            } text-sm`}>
              {permissionStatus.canWrite 
                ? '✅ 完整權限 - 可以讀取和修改設定' 
                : permissionStatus.canRead 
                  ? '⚠️ 僅讀取權限 - 需要管理員或主管權限才能修改'
                  : `❌ 權限不足：${permissionStatus.error || '無法存取系統設定'}`
              }
            </AlertDescription>
          </Alert>
        )}

        {/* 距離設定 */}
        <div className="space-y-3">
          <Label htmlFor="distance" className="text-white font-medium">
            打卡距離限制（公尺）
          </Label>
          <Input
            id="distance"
            type="number"
            min="50"
            max="2000"
            value={distance}
            onChange={(e) => setDistance(parseInt(e.target.value) || 500)}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur-xl"
            placeholder="輸入距離限制"
            disabled={!permissionStatus?.canRead}
          />
          <div className="text-sm text-white/70">
            建議範圍：50-2000 公尺（預設 500 公尺）
          </div>
        </div>

        {/* 操作按鈕 */}
        <div className="flex gap-2 pt-2">
          <Button 
            onClick={handleSave} 
            disabled={saving || !permissionStatus?.canWrite}
            className="flex-1 bg-blue-500/80 hover:bg-blue-600/80 text-white disabled:opacity-50 backdrop-blur-xl"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                儲存中...
              </>
            ) : (
              '儲存設定'
            )}
          </Button>
          <Button 
            variant="outline" 
            onClick={handleReset}
            disabled={saving || !permissionStatus?.canRead}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 disabled:opacity-50 backdrop-blur-xl"
          >
            重設
          </Button>
        </div>

        {/* 權限說明 */}
        {permissionStatus && !permissionStatus.canWrite && (
          <div className="mt-4 p-3 bg-blue-500/20 border border-blue-400/30 rounded-2xl backdrop-blur-xl">
            <div className="flex items-start gap-2">
              <ShieldAlert className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-100">
                <p className="font-medium mb-1">需要更高權限</p>
                <p>若要修改GPS打卡距離設定，請聯繫系統管理員授予您相應權限，或使用管理員帳號登入。</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CheckInDistanceSettings;
