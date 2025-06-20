
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
      
      // 驗證地址格式 - 使用更寬鬆的條件
      if (address.trim().length < 5) {
        console.warn('⚠️ 地址長度不足');
        await this.updateDepartmentGPSStatus(departmentId, 'failed', '地址長度不足');
        GeocodingService.logGeocodingFailure(address, '地址長度不足', 'validation');
        
        toast({
          title: "地址格式不正確",
          description: "請輸入更完整的地址資訊（至少5個字元）",
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
      
      // 更新部門GPS資料 - 確保所有必要欄位都被正確設定
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
        
        toast({
          title: "地址轉換成功！",
          description: `來源：${geocodeResult.source || 'Google Maps'}。座標：(${geocodeResult.latitude.toFixed(6)}, ${geocodeResult.longitude.toFixed(6)}) ${confidenceText}`,
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
      
      // 如果有格式化地址，也一併更新location欄位
      if (formattedAddress && formattedAddress.trim()) {
        updateData.location = formattedAddress.trim();
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
      
      // 確認更新成功後，再次檢查部門狀態
      const { data: updatedDepartment } = await supabase
        .from('departments')
        .select('*')
        .eq('id', departmentId)
        .single();
        
      if (updatedDepartment) {
        console.log('✅ 部門更新後狀態確認:', {
          name: updatedDepartment.name,
          gps_status: updatedDepartment.gps_status,
          latitude: updatedDepartment.latitude,
          longitude: updatedDepartment.longitude,
          address_verified: updatedDepartment.address_verified
        });
      }
      
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
