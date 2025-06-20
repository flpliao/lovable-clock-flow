
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { SystemSettingsService } from '@/services/systemSettingsService';
import { Loader2, MapPin, Settings } from 'lucide-react';

const CheckInDistanceSettings = () => {
  const { toast } = useToast();
  const [distance, setDistance] = useState<number>(500);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // 載入當前設定
  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      try {
        const currentDistance = await SystemSettingsService.getCheckInDistanceLimit();
        setDistance(currentDistance);
        console.log('📍 目前打卡距離限制:', currentDistance, '公尺');
      } catch (error) {
        console.error('載入打卡距離設定失敗:', error);
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

    setSaving(true);
    try {
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
      console.error('儲存打卡距離設定失敗:', error);
      toast({
        title: "儲存失敗",
        description: "無法儲存打卡距離設定",
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            打卡距離設定
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">載入中...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          GPS 打卡距離設定
        </CardTitle>
        <CardDescription>
          調整員工GPS打卡時的允許距離範圍，以降低定位誤差導致的打卡失敗問題
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="distance">打卡距離限制（公尺）</Label>
          <Input
            id="distance"
            type="number"
            min="50"
            max="2000"
            value={distance}
            onChange={(e) => setDistance(parseInt(e.target.value) || 500)}
            placeholder="輸入距離限制"
          />
          <p className="text-sm text-gray-600">
            建議範圍：50-2000 公尺。預設值為 500 公尺，適合處理一般GPS定位誤差。
          </p>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
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
            disabled={saving}
            className="flex-1"
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
          >
            重設為預設值
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CheckInDistanceSettings;
