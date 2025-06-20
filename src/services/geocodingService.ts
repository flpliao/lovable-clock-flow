
// 地理編碼服務 - 將地址轉換為GPS座標
export interface GeocodeResult {
  latitude: number;
  longitude: number;
  formattedAddress: string;
}

export class GeocodingService {
  // 使用 OpenStreetMap Nominatim API (免費替代方案)
  static async geocodeAddress(address: string): Promise<GeocodeResult | null> {
    try {
      console.log('🌍 開始地理編碼:', address);
      
      // 使用 Nominatim API (OpenStreetMap的免費地理編碼服務)
      const encodedAddress = encodeURIComponent(address);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1&countrycodes=tw`
      );
      
      if (!response.ok) {
        throw new Error(`地理編碼API請求失敗: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data || data.length === 0) {
        console.warn('⚠️ 找不到地址對應的座標:', address);
        return null;
      }
      
      const result = data[0];
      const geocodeResult: GeocodeResult = {
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        formattedAddress: result.display_name
      };
      
      console.log('✅ 地理編碼成功:', geocodeResult);
      return geocodeResult;
      
    } catch (error) {
      console.error('❌ 地理編碼失敗:', error);
      return null;
    }
  }
  
  // 備用方案：使用Google Maps API (需要API密鑰)
  static async geocodeAddressWithGoogle(address: string, apiKey?: string): Promise<GeocodeResult | null> {
    if (!apiKey) {
      console.warn('⚠️ Google Maps API密鑰未設定，改用OpenStreetMap');
      return this.geocodeAddress(address);
    }
    
    try {
      const encodedAddress = encodeURIComponent(address);
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}&region=tw`
      );
      
      const data = await response.json();
      
      if (data.status !== 'OK' || !data.results?.length) {
        console.warn('⚠️ Google地理編碼失敗:', data.status);
        return null;
      }
      
      const result = data.results[0];
      return {
        latitude: result.geometry.location.lat,
        longitude: result.geometry.location.lng,
        formattedAddress: result.formatted_address
      };
      
    } catch (error) {
      console.error('❌ Google地理編碼失敗:', error);
      return null;
    }
  }
}
