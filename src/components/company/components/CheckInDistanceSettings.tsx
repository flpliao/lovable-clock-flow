
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { SystemSettingsService } from '@/services/systemSettingsService';
import { Loader2, MapPin, Settings, AlertTriangle, CheckCircle } from 'lucide-react';

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
        const permissions = await SystemSettingsService.testRLSAndPermissions();
        setPermissionStatus(permissions);
        
        if (!permissions.canRead) {
          console.error('❌ 沒有讀取權限');
          toast({
            title: "權限不足",
            description: "無法讀取系統設定，請檢查您的權限",
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
        description: "沒有寫入權限，無法儲存設定",
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
      const permissions = await SystemSettingsService.testRLSAndPermissions();
      setPermissionStatus(permissions);
      
      let errorMessage = "無法儲存打卡距離設定";
      if (error instanceof Error) {
        errorMessage += `: ${error.message}`;
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
      <Card className="backdrop-blur-xl bg-white/30 border border-white/40 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 drop-shadow-sm">
            <div className="p-2 bg-blue-500/90 rounded-lg shadow-md">
              <Settings className="h-5 w-5 text-white" />
            </div>
            GPS 打卡距離設定
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-700">載入中...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="backdrop-blur-xl bg-white/30 border border-white/40 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900 drop-shadow-sm">
          <div className="p-2 bg-blue-500/90 rounded-lg shadow-md">
            <MapPin className="h-5 w-5 text-white" />
          </div>
          GPS 打卡距離設定
        </CardTitle>
        <CardDescription className="text-gray-700">
          調整員工GPS打卡時的允許距離範圍，以降低定位誤差導致的打卡失敗問題
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 權限狀態顯示 */}
        {permissionStatus && (
          <Alert className={`${permissionStatus.canWrite ? 'bg-green-50/60 border-green-200/60' : 'bg-red-50/60 border-red-200/60'} backdrop-blur-sm`}>
            <div className={`p-1.5 ${permissionStatus.canWrite ? 'bg-green-500/90' : 'bg-red-500/90'} rounded-md shadow-sm`}>
              {permissionStatus.canWrite ? (
                <CheckCircle className="h-3 w-3 text-white" />
              ) : (
                <AlertTriangle className="h-3 w-3 text-white" />
              )}
            </div>
            <AlertDescription className={`text-sm ${permissionStatus.canWrite ? 'text-green-800' : 'text-red-800'} font-medium ml-2`}>
              {permissionStatus.canWrite 
                ? '權限正常：可以讀取和寫入系統設定' 
                : `權限不足：${permissionStatus.error || '無法寫入系統設定'}`
              }
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="distance" className="text-gray-900 font-medium">打卡距離限制（公尺）</Label>
          <Input
            id="distance"
            type="number"
            min="50"
            max="2000"
            value={distance}
            onChange={(e) => setDistance(parseInt(e.target.value) || 500)}
            placeholder="輸入距離限制"
            className="bg-white/60 border-white/40 text-gray-900"
          />
          <p className="text-sm text-gray-600">
            建議範圍：50-2000 公尺。預設值為 500 公尺，適合處理一般GPS定位誤差。
          </p>
        </div>

        <div className="bg-blue-50/60 p-4 rounded-lg border border-blue-200/60">
          <h4 className="font-medium text-blue-900 mb-2">設定說明</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• 距離 ≤ {distance} 公尺：允許正常打卡</li>
            <li>• 距離 &gt; {distance} 公尺：顯示打卡失敗提示</li>
            <li>• 此設定將套用至所有部門與使用者</li>
            <li>• 建議根據實際工作環境調整合適的距離</li>
          </ul>
        </div>

        <div className="flex gap-2 pt-4">
          <Button 
            onClick={handleSave} 
            disabled={saving || !permissionStatus?.canWrite}
            className="flex-1 bg-blue-500/80 hover:bg-blue-600/80 text-white"
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
            disabled={saving}
            className="bg-white/60 border-white/40 text-gray-900 hover:bg-white/80"
          >
            重設為預設值
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CheckInDistanceSettings;
