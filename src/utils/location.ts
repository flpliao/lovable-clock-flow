// 取得目前經緯度
export const getCurrentPosition = (): Promise<{ latitude: number; longitude: number }> => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        resolve({ latitude, longitude });
      },
      error => reject(error)
    );
  });
};

// 取得目前 public IP
export const getCurrentIp = async (): Promise<string> => {
  const ipResponse = await fetch('https://api.ipify.org?format=json');
  const ipData = await ipResponse.json();
  return ipData.ip;
};

// 計算兩點之間的距離
export const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
};
