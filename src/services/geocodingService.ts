// 地理編碼服務 - 將地址轉換為GPS座標
export interface GeocodeResult {
  latitude: number;
  longitude: number;
  formattedAddress: string;
  confidence?: number;
  source?: string;
}

export interface AddressSuggestion {
  address: string;
  source: string;
  confidence: number;
}

export class GeocodingService {
  // 主要地理編碼方法 - 使用多重策略，優先使用 Google Maps
  static async geocodeAddress(address: string): Promise<GeocodeResult | null> {
    console.log('🌍 開始地理編碼（多重策略）:', address);
    
    // 清理和標準化地址
    const cleanedAddress = this.cleanAddress(address);
    console.log('🧹 清理後的地址:', cleanedAddress);
    
    // 策略1: 嘗試使用 Google Maps API（如果可用）
    const googleResult = await this.tryGoogleGeocoding(cleanedAddress);
    if (googleResult) {
      console.log('✅ Google Maps 地理編碼成功');
      return googleResult;
    }
    
    // 策略2: 使用 Nominatim 作為備用
    let result = await this.tryNominatimSearch(address, '原始地址');
    if (result && result.confidence && result.confidence > 0.1) return result;
    
    // 策略3: 使用清理後的地址搜尋
    if (cleanedAddress !== address) {
      result = await this.tryNominatimSearch(cleanedAddress, '清理後地址');
      if (result && result.confidence && result.confidence > 0.1) return result;
    }
    
    // 策略4: 嘗試不同的地址格式變化
    const addressVariations = this.generateAddressVariations(cleanedAddress);
    for (let i = 0; i < addressVariations.length; i++) {
      const variation = addressVariations[i];
      console.log(`🔄 嘗試地址變化 ${i + 1}:`, variation);
      result = await this.tryNominatimSearch(variation, `變化${i + 1}`);
      if (result && result.confidence && result.confidence > 0.1) return result;
      
      // 添加延遲避免API限制
      await this.delay(200);
    }
    
    // 策略5: 嘗試簡化地址（移除門牌號碼）
    const simplifiedAddress = this.simplifyAddress(cleanedAddress);
    if (simplifiedAddress !== cleanedAddress) {
      console.log('🎯 嘗試簡化地址:', simplifiedAddress);
      result = await this.tryNominatimSearch(simplifiedAddress, '簡化地址');
      if (result && result.confidence && result.confidence > 0.05) {
        // 簡化地址可接受較低的信心度
        return result;
      }
    }
    
    console.warn('⚠️ 所有地理編碼策略均失敗:', address);
    return null;
  }
  
  // Google Maps 地理編碼嘗試
  private static async tryGoogleGeocoding(address: string): Promise<GeocodeResult | null> {
    try {
      // 檢查是否有 Google Maps API 金鑰
      const apiKey = await this.getGoogleMapsApiKey();
      if (!apiKey) {
        console.log('🗺️ Google Maps API 金鑰未設定，跳過 Google 地理編碼');
        return null;
      }
      
      return await this.geocodeAddressWithGoogle(address, apiKey);
    } catch (error) {
      console.error('❌ Google Maps 地理編碼失敗:', error);
      return null;
    }
  }
  
  // 取得 Google Maps API 金鑰
  private static async getGoogleMapsApiKey(): Promise<string | null> {
    try {
      // 動態導入以避免循環依賴
      const { SystemSettingsService } = await import('@/services/systemSettingsService');
      return await SystemSettingsService.getGoogleMapsApiKey();
    } catch (error) {
      console.error('❌ 取得 Google Maps API 金鑰失敗:', error);
      return null;
    }
  }
  
  // 清理地址格式
  private static cleanAddress(address: string): string {
    return address
      .trim()
      .replace(/\s+/g, '') // 移除所有空格
      .replace(/台灣省?/g, '') // 移除"台灣"或"台灣省"
      .replace(/中華民國/g, '') // 移除"中華民國"
      .replace(/,/g, '') // 移除逗號
      .replace(/，/g, '') // 移除中文逗號
      .replace(/號$/g, '號'); // 確保以"號"結尾
  }
  
  // 生成台灣地址的多種變化格式
  private static generateAddressVariations(address: string): string[] {
    const variations = [];
    
    // 變化1: 添加台灣
    variations.push(`台灣${address}`);
    
    // 變化2: 路名變化（一段 -> 1段）
    if (address.includes('一段')) {
      variations.push(address.replace('一段', '1段'));
    }
    if (address.includes('二段')) {
      variations.push(address.replace('二段', '2段'));
    }
    if (address.includes('三段')) {
      variations.push(address.replace('三段', '3段'));
    }
    if (address.includes('四段')) {
      variations.push(address.replace('四段', '4段'));
    }
    
    // 變化3: 數字變化（85號 -> 85)
    variations.push(address.replace(/(\d+)號$/, '$1'));
    
    // 變化4: 添加郵遞區號格式
    if (address.includes('台南市東區')) {
      variations.push(address.replace('台南市東區', '701台南市東區'));
    }
    
    // 變化5: 完整格式
    if (address.startsWith('台南市')) {
      variations.push(`中華民國${address}`);
    }
    
    return variations.filter(v => v !== address); // 排除原始地址
  }
  
  // 簡化地址（移除門牌號碼）
  private static simplifyAddress(address: string): string {
    // 移除門牌號碼，保留到路名
    return address.replace(/\d+號?$/, '').replace(/[巷弄]\d*號?$/, '');
  }
  
  // 嘗試 Nominatim 搜尋
  private static async tryNominatimSearch(
    address: string, 
    strategy: string
  ): Promise<GeocodeResult | null> {
    try {
      console.log(`🔍 ${strategy} - 搜尋地址:`, address);
      
      const encodedAddress = encodeURIComponent(address);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=5&countrycodes=tw&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'AttendanceSystem/1.0 (support@company.com)'
          }
        }
      );
      
      if (!response.ok) {
        console.error(`❌ ${strategy} - API請求失敗:`, response.status);
        return null;
      }
      
      const data = await response.json();
      console.log(`📡 ${strategy} - API回應:`, data);
      
      if (!data || data.length === 0) {
        console.warn(`⚠️ ${strategy} - 找不到地址:`, address);
        return null;
      }
      
      // 選擇最佳結果（重要性最高的）
      const bestResult = data.reduce((best: any, current: any) => {
        const currentImportance = parseFloat(current.importance) || 0;
        const bestImportance = parseFloat(best.importance) || 0;
        return currentImportance > bestImportance ? current : best;
      });
      
      const result: GeocodeResult = {
        latitude: parseFloat(bestResult.lat),
        longitude: parseFloat(bestResult.lon),
        formattedAddress: bestResult.display_name,
        confidence: parseFloat(bestResult.importance) || 0,
        source: `Nominatim-${strategy}`
      };
      
      console.log(`✅ ${strategy} - 地理編碼成功:`, result);
      return result;
      
    } catch (error) {
      console.error(`❌ ${strategy} - 地理編碼失敗:`, error);
      return null;
    }
  }
  
  // Google Maps API 地理編碼
  static async geocodeAddressWithGoogle(address: string, apiKey: string): Promise<GeocodeResult | null> {
    try {
      console.log('🗺️ 使用Google Maps API進行地理編碼:', address);
      
      const encodedAddress = encodeURIComponent(address);
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}&region=tw&language=zh-TW`
      );
      
      const data = await response.json();
      console.log('📡 Google Maps API回應:', data);
      
      if (data.status !== 'OK' || !data.results?.length) {
        console.warn('⚠️ Google地理編碼失敗:', data.status, data.error_message);
        return null;
      }
      
      const result = data.results[0];
      const geocodeResult: GeocodeResult = {
        latitude: result.geometry.location.lat,
        longitude: result.geometry.location.lng,
        formattedAddress: result.formatted_address,
        confidence: 1.0,
        source: 'Google Maps'
      };
      
      console.log('✅ Google地理編碼成功:', geocodeResult);
      return geocodeResult;
      
    } catch (error) {
      console.error('❌ Google地理編碼失敗:', error);
      return null;
    }
  }
  
  // 取得地址建議
  static async getAddressSuggestions(address: string): Promise<AddressSuggestion[]> {
    const suggestions: AddressSuggestion[] = [];
    
    try {
      // 使用 Nominatim 搜尋多個結果
      const encodedAddress = encodeURIComponent(address);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=10&countrycodes=tw&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'AttendanceSystem/1.0 (support@company.com)'
          }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        
        data.forEach((result: any) => {
          const confidence = parseFloat(result.importance) || 0;
          if (confidence > 0.01) { // 只顯示有一定可信度的結果
            suggestions.push({
              address: result.display_name,
              source: 'Nominatim',
              confidence: confidence
            });
          }
        });
      }
    } catch (error) {
      console.error('❌ 取得地址建議失敗:', error);
    }
    
    // 依信心度排序
    return suggestions.sort((a, b) => b.confidence - a.confidence);
  }
  
  // 延遲函數
  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  // 地址格式驗證和建議
  static validateAddressFormat(address: string): {
    isValid: boolean;
    suggestions: string[];
    errors: string[];
  } {
    const errors: string[] = [];
    const suggestions: string[] = [];
    
    // 檢查基本格式
    if (!address || address.trim().length < 5) {
      errors.push('地址長度太短，請提供完整地址');
    }
    
    // 檢查是否包含城市
    if (!address.includes('市') && !address.includes('縣')) {
      errors.push('請包含城市名稱（如：台南市）');
      suggestions.push('建議格式：台南市東區長榮路一段85號');
    }
    
    // 檢查是否包含區域
    if (!address.includes('區') && !address.includes('鄉') && !address.includes('鎮')) {
      errors.push('請包含區域名稱（如：東區）');
    }
    
    // 檢查是否包含路名
    if (!address.includes('路') && !address.includes('街') && !address.includes('巷') && !address.includes('大道')) {
      errors.push('請包含完整路名（如：長榮路一段）');
    }
    
    // 檢查門牌號碼
    if (!/\d+號?$/.test(address)) {
      errors.push('請包含門牌號碼（如：85號）');
    }
    
    // 提供格式建議
    if (errors.length > 0) {
      suggestions.push('標準格式：城市 + 區域 + 路名 + 門牌號碼');
      suggestions.push('範例：台南市東區長榮路一段85號');
      suggestions.push('範例：高雄市前金區中正四路211號');
      suggestions.push('範例：台北市大安區忠孝東路四段169號');
      suggestions.push('建議加上郵遞區號：701台南市東區長榮路一段85號');
    }
    
    return {
      isValid: errors.length === 0,
      suggestions,
      errors
    };
  }
  
  // 記錄轉換失敗的日誌
  static logGeocodingFailure(address: string, error: string, strategy?: string) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      address: address,
      error: error,
      strategy: strategy || 'unknown',
      userAgent: navigator.userAgent
    };
    
    console.error('🚨 地址轉換失敗日誌:', logEntry);
    
    // 可以在這裡添加發送到後台日誌系統的邏輯
    // 例如發送到 Supabase 或其他日誌服務
  }
}
