
/**
 * 計算兩個GPS座標之間的距離（公尺）
 * @param lat1 第一個座標的緯度
 * @param lng1 第一個座標的經度
 * @param lat2 第二個座標的緯度
 * @param lng2 第二個座標的經度
 * @returns 距離（公尺）
 */
export const calculateDistance = (
  lat1: number, 
  lng1: number, 
  lat2: number, 
  lng2: number
): number => {
  const R = 6371000; // 地球半徑（公尺）
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return Math.round(distance);
};
