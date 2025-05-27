
// 公司位置 (台南市永康區振興路132號) - 使用更精確的座標
export const COMPANY_LOCATION = {
  latitude: 23.0316,
  longitude: 120.2328,
  name: "總公司 - 台南市永康區振興路132號"
};

// 允許的打卡距離 (公尺)
export const ALLOWED_DISTANCE = 100;

// 計算兩點間距離的函數
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371000; // 地球半徑（公尺）
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// 取得當前位置的函數
export const getCurrentPosition = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('瀏覽器不支援地理位置功能'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('取得的使用者位置:', {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
        console.log('公司位置:', COMPANY_LOCATION);
        
        const distance = calculateDistance(
          position.coords.latitude,
          position.coords.longitude,
          COMPANY_LOCATION.latitude,
          COMPANY_LOCATION.longitude
        );
        console.log('計算的距離:', distance, '公尺');
        
        resolve(position);
      },
      (error) => {
        let errorMessage = '無法取得位置資訊';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = '位置權限被拒絕，請在瀏覽器設定中允許位置存取';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = '位置資訊無法取得';
            break;
          case error.TIMEOUT:
            errorMessage = '位置請求逾時';
            break;
        }
        console.error('定位錯誤:', errorMessage, error);
        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 30000
      }
    );
  });
};
