import { toast } from '@/hooks/use-toast';
import { GeocodingService } from '@/services/geocodingService';
import { supabase } from '@/integrations/supabase/client';

export class DepartmentGeocodingService {
  static async convertDepartmentAddressToGPS(departmentId: string, address: string): Promise<boolean> {
    try {
      console.log('🗺️ 開始轉換部門地址為GPS座標:', { departmentId, address });
      
      if (!address?.trim()) {
        await this.updateDepartmentGPSStatus(departmentId, 'failed', '地址不能為空');
        GeocodingService.logGeocodingFailure(address, '地址不能為空', 'validation');
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
        await this.updateDepartmentGPSStatus(departmentId, 'failed', validation.errors[0]);
        GeocodingService.logGeocodingFailure(address, validation.errors[0], 'validation');
        
        toast({
          title: "地址格式不正確",
          description: `${validation.errors[0]}。建議：${validation.suggestions[0] || '請參考標準格式範例'}`,
          variant: "destructive",
        });
        return false;
      }
      
      // 使用增強的地理編碼服務轉換地址
      const geocodeResult = await GeocodingService.geocodeAddress(address);
      
      if (!geocodeResult) {
        const errorMessage = '無法找到該地址對應的GPS座標';
        await this.updateDepartmentGPSStatus(departmentId, 'failed', errorMessage);
        GeocodingService.logGeocodingFailure(address, errorMessage, 'geocoding-all-failed');
        
        // 取得地址建議
        const suggestions = await GeocodingService.getAddressSuggestions(address);
        const suggestionText = suggestions.length > 0 
          ? `建議嘗試：${suggestions[0].address}` 
          : '請檢查地址格式或參考 Google Maps';
        
        toast({
          title: "地址轉換失敗",
          description: `${errorMessage}。${suggestionText}`,
          variant: "destructive",
        });
        return false;
      }
      
      // 檢查結果的可信度
      if (geocodeResult.confidence && geocodeResult.confidence < 0.1) {
        console.warn('⚠️ 地址轉換結果可信度極低:', geocodeResult.confidence);
        await this.updateDepartmentGPSStatus(departmentId, 'failed', '轉換結果可信度極低');
        GeocodingService.logGeocodingFailure(
          address, 
          `轉換結果可信度極低: ${geocodeResult.confidence}`, 
          geocodeResult.source || 'unknown'
        );
        
        toast({
          title: "地址轉換品質不佳",
          description: `找到座標但可信度極低（${(geocodeResult.confidence * 100).toFixed(1)}%），請確認地址是否正確並重新嘗試`,
          variant: "destructive",
        });
        return false;
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
        const confidenceText = geocodeResult.confidence 
          ? `（信心度: ${(geocodeResult.confidence * 100).toFixed(1)}%）`
          : '';
        
        const successMessage = geocodeResult.confidence && geocodeResult.confidence < 0.3
          ? `地址已轉換為GPS座標，建議再次確認地址準確性`
          : `地址轉換成功！來源：${geocodeResult.source || 'Unknown'}`;
          
        toast({
          title: successMessage,
          description: `座標：(${geocodeResult.latitude.toFixed(6)}, ${geocodeResult.longitude.toFixed(6)}) ${confidenceText}`,
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
      const errorMessage = error instanceof Error ? error.message : '系統發生錯誤';
      
      await this.updateDepartmentGPSStatus(departmentId, 'failed', errorMessage);
      GeocodingService.logGeocodingFailure(address, errorMessage, 'system-error');
      
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
        gps_status: 'converted',
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
        await this.updateDepartmentGPSStatus(departmentId, 'failed', error.message);
        return false;
      }

      console.log('✅ 部門GPS座標更新成功，資料來源:', source);
      return true;
      
    } catch (error) {
      console.error('❌ 更新部門GPS座標失敗:', error);
      await this.updateDepartmentGPSStatus(departmentId, 'failed', '更新失敗');
      return false;
    }
  }
  
  private static async updateDepartmentGPSStatus(
    departmentId: string, 
    status: 'not_converted' | 'converted' | 'failed',
    errorMessage?: string
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('departments')
        .update({ 
          gps_status: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', departmentId);

      if (error) {
        console.error('❌ 更新部門GPS狀態失敗:', error);
      } else {
        console.log('✅ 部門GPS狀態已更新:', { departmentId, status, errorMessage });
      }
    } catch (error) {
      console.error('❌ 更新部門GPS狀態系統錯誤:', error);
    }
  }
}
