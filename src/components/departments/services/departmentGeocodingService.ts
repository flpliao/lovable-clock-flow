
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
      
      // 使用地理編碼服務轉換地址
      const geocodeResult = await GeocodingService.geocodeAddress(address);
      
      if (!geocodeResult) {
        toast({
          title: "地址轉換失敗",
          description: "無法找到該地址對應的GPS座標，請檢查地址是否正確",
          variant: "destructive",
        });
        return false;
      }
      
      // 更新部門GPS資料
      const success = await this.updateDepartmentGPS(
        departmentId, 
        geocodeResult.latitude, 
        geocodeResult.longitude
      );
      
      if (success) {
        toast({
          title: "地址轉換成功",
          description: `地址已轉換為GPS座標 (${geocodeResult.latitude.toFixed(6)}, ${geocodeResult.longitude.toFixed(6)})`,
        });
        return true;
      }
      
      return false;
      
    } catch (error) {
      console.error('💥 部門地址GPS轉換失敗:', error);
      toast({
        title: "地址轉換失敗",
        description: "系統發生錯誤，請稍後重試",
        variant: "destructive",
      });
      return false;
    }
  }
  
  private static async updateDepartmentGPS(
    departmentId: string, 
    latitude: number, 
    longitude: number
  ): Promise<boolean> {
    try {
      console.log('📍 更新部門GPS座標:', { departmentId, latitude, longitude });
      
      const { error } = await supabase
        .from('departments')
        .update({
          latitude,
          longitude,
          address_verified: true,
          updated_at: new Date().toISOString()
        })
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

      console.log('✅ 部門GPS座標更新成功');
      return true;
      
    } catch (error) {
      console.error('❌ 更新部門GPS座標失敗:', error);
      return false;
    }
  }
}
