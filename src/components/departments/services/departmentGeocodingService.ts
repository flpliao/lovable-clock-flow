
import { toast } from '@/hooks/use-toast';
import { GeocodingService } from '@/services/geocodingService';
import { DepartmentService } from './departmentService';

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
      // 這裡需要調用更新部門GPS的API
      // 暫時使用現有的DepartmentService，需要擴展其功能
      console.log('📍 更新部門GPS座標:', { departmentId, latitude, longitude });
      
      // 實際的更新邏輯會在下一步實現
      return true;
      
    } catch (error) {
      console.error('❌ 更新部門GPS座標失敗:', error);
      return false;
    }
  }
}
