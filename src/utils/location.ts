
// Haversine formula to calculate distance between two points on Earth
export const getDistanceInMeters = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371000; // Earth radius in meters
  const toRad = (angle: number) => angle * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Check if IP is in CIDR range (simplified)
export const isIpInRange = (ip: string, cidr: string): boolean => {
  // This is a simplified check for demo purposes
  // In a real application, you would use a proper CIDR matching library
  const [range] = cidr.split('/');
  const ipPrefix = range.substring(0, range.lastIndexOf('.'));
  return ip.startsWith(ipPrefix);
};

// Mock function to get client IP (in a real app, this would be from the server)
export const getClientIp = async (): Promise<string> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error("Error fetching IP:", error);
    return '192.168.1.100'; // Fallback for demo purposes
  }
};

// Company office location (coordinates)
export const OFFICE_LOCATION = {
  latitude: 25.033964, // Example: Taipei 101 coordinates
  longitude: 121.564468,
  name: "公司總部", 
  maxDistanceMeters: 100 // Maximum allowed distance in meters
};

// Company office IP range (simplified for demo)
export const OFFICE_IP_RANGES = [
  { cidr: '192.168.1.0/24', name: '公司總部網路' },
  { cidr: '10.0.0.0/8', name: '公司VPN網路' }
];
