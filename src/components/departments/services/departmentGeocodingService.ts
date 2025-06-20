
import { toast } from '@/hooks/use-toast';
import { GeocodingService } from '@/services/geocodingService';
import { supabase } from '@/integrations/supabase/client';

export class DepartmentGeocodingService {
  static async convertDepartmentAddressToGPS(departmentId: string, address: string): Promise<boolean> {
    try {
      console.log('🗺️ 開始轉換部門地址為GPS座標:', { departmentId, address });
      
      if (!address?.trim()) {
        toast({
          title: "地址轉換失敗",
          description: "地址不能為空",
          variant: "destructive",
        });
        return false;
      }
      
      // 驗證地址格式
      const validation = GeocodingService.validateAddressFormat(address);
      if (!validation.isValid) {
        console.warn('⚠️ 地址格式不正確:', validation.errors);
        toast({
          title: "地址格式不正確",
          description: `${validation.errors[0]}。${validation.suggestions[0] || ''}`,
          variant: "destructive",
        });
        return false;
      }
      
      // 使用改進的地理編碼服務轉換地址
      const geocodeResult = await GeocodingService.geocodeAddress(address);
      
      if (!geocodeResult) {
        // 提供更詳細的錯誤訊息和建議
        const suggestions = [
          '請確認地址格式：城市 + 區域 + 路名 + 門牌號碼',
          '範例：台南市東區長榮路一段85號',
          '確保地址確實存在且可在地圖上找到'
        ];
        
        toast({
          title: "地址轉換失敗",
          description: "無法找到該地址對應的GPS座標。" + suggestions[0],
          variant: "destructive",
        });
        
        console.error('🚫 地址轉換失敗，建議:', {
          originalAddress: address,
          suggestions: suggestions
        });
        
        return false;
      }
      
      // 檢查結果的可信度
      if (geocodeResult.confidence && geocodeResult.confidence < 0.3) {
        console.warn('⚠️ 地址轉換結果可信度較低:', geocodeResult.confidence);
        toast({
          title: "地址轉換警告",
          description: `找到座標但可信度較低，請確認地址是否正確。來源：${geocodeResult.source}`,
          variant: "destructive",
        });
      }
      
      // 更新部門GPS資料
      const success = await this.updateDepartmentGPS(
        departmentId, 
        geocodeResult.latitude, 
        geocodeResult.longitude,
        geocodeResult.formattedAddress,
        geocodeResult.source
      );
      
      if (success) {
        const successMessage = geocodeResult.confidence && geocodeResult.confidence < 0.5 
          ? `地址已轉換為GPS座標，但建議再次確認地址準確性`
          : `地址轉換成功！`;
          
        toast({
          title: successMessage,
          description: `座標：(${geocodeResult.latitude.toFixed(6)}, ${geocodeResult.longitude.toFixed(6)})
來源：${geocodeResult.source}`,
        });
        
        console.log('✅ 地址轉換成功:', {
          address,
          result: geocodeResult,
          departmentId
        });
        
        return true;
      }
      
      return false;
      
    } catch (error) {
      console.error('💥 部門地址GPS轉換失敗:', error);
      toast({
        title: "地址轉換失敗",
        description: "系統發生錯誤，請稍後重試。如問題持續，請聯繫系統管理員。",
        variant: "destructive",
      });
      return false;
    }
  }
  
  private static async updateDepartmentGPS(
    departmentId: string, 
    latitude: number, 
    longitude: number,
    formattedAddress?: string,
    source?: string
  ): Promise<boolean> {
    try {
      console.log('📍 更新部門GPS座標:', { 
        departmentId, 
        latitude, 
        longitude, 
        formattedAddress,
        source 
      });
      
      const updateData: any = {
        latitude,
        longitude,
        address_verified: true,
        updated_at: new Date().toISOString()
      };
      
      // 如果有格式化地址，也一併更新
      if (formattedAddress) {
        updateData.location = formattedAddress;
      }
      
      const { error } = await supabase
        .from('departments')
        .update(updateData)
        .eq('id', departmentId);

      if (error) {
        console.error('❌ 更新部門GPS座標失敗:', error);
        toast({
          title: "更新失敗",
          description: `無法更新部門GPS座標: ${error.message}`,
          variant: "destructive",
        });
        return false;
      }

      console.log('✅ 部門GPS座標更新成功，資料來源:', source);
      return true;
      
    } catch (error) {
      console.error('❌ 更新部門GPS座標失敗:', error);
      return false;
    }
  }
  
  // 批量地址轉換
  static async batchConvertAddresses(departments: Array<{id: string, address: string}>): Promise<{
    success: number;
    failed: Array<{id: string, address: string, error: string}>;
  }> {
    const results = {
      success: 0,
      failed: [] as Array<{id: string, address: string, error: string}>
    };
    
    for (const dept of departments) {
      try {
        const success = await this.convertDepartmentAddressToGPS(dept.id, dept.address);
        if (success) {
          results.success++;
        } else {
          results.failed.push({
            id: dept.id,
            address: dept.address,
            error: '地址轉換失敗'
          });
        }
        
        // 添加延遲避免API限制
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        results.failed.push({
          id: dept.id,
          address: dept.address,
          error: error instanceof Error ? error.message : '未知錯誤'
        });
      }
    }
    
    return results;
  }
}
