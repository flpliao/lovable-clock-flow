import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { MapPin, Wifi, Clock, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUser } from '@/contexts/UserContext';

// Company office location (coordinates)
const OFFICE_LOCATION = {
  latitude: 25.033964, // Example: Taipei 101 coordinates
  longitude: 121.564468,
  name: "公司總部", 
  maxDistanceMeters: 100 // Maximum allowed distance in meters
};

// Company office IP range (simplified for demo)
const OFFICE_IP_RANGES = [
  { cidr: '192.168.1.0/24', name: '公司總部網路' },
  { cidr: '10.0.0.0/8', name: '公司VPN網路' }
];

// Check-in record type
export interface CheckInRecord {
  id: string;
  userId: string;
  timestamp: string;
  type: 'location' | 'ip';
  status: 'success' | 'failed';
  details: {
    latitude?: number;
    longitude?: number;
    distance?: number;
    ip?: string;
    locationName?: string;
  };
}

// Haversine formula to calculate distance between two points on Earth
const getDistanceInMeters = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
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
const isIpInRange = (ip: string, cidr: string): boolean => {
  // This is a simplified check for demo purposes
  // In a real application, you would use a proper CIDR matching library
  const [range] = cidr.split('/');
  const ipPrefix = range.substring(0, range.lastIndexOf('.'));
  return ip.startsWith(ipPrefix);
};

// Mock function to get client IP (in a real app, this would be from the server)
const getClientIp = async (): Promise<string> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error("Error fetching IP:", error);
    return '192.168.1.100'; // Fallback for demo purposes
  }
};

// Store check-in records in localStorage (would be a database in a real app)
const saveCheckInRecord = (record: CheckInRecord): void => {
  const records = getCheckInRecords();
  records.push(record);
  localStorage.setItem('checkInRecords', JSON.stringify(records));
};

// Get all check-in records
export const getCheckInRecords = (): CheckInRecord[] => {
  const recordsJson = localStorage.getItem('checkInRecords');
  return recordsJson ? JSON.parse(recordsJson) : [];
};

// Get user's check-in records
export const getUserCheckInRecords = (userId: string): CheckInRecord[] => {
  return getCheckInRecords().filter(record => record.userId === userId);
};

// Get today's check-in record for a user
export const getUserTodayCheckIn = (userId: string): CheckInRecord | undefined => {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  return getUserCheckInRecords(userId).find(record => 
    record.timestamp.startsWith(today)
  );
};

const LocationCheckIn: React.FC = () => {
  const { toast } = useToast();
  const { currentUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [checkInMethod, setCheckInMethod] = useState<'location' | 'ip'>('location');
  const [todayCheckIn, setTodayCheckIn] = useState<CheckInRecord | undefined>(undefined);

  useEffect(() => {
    if (currentUser?.id) {
      const checkIn = getUserTodayCheckIn(currentUser.id);
      setTodayCheckIn(checkIn);
    }
  }, [currentUser?.id]);

  const createCheckInRecord = (
    type: 'location' | 'ip', 
    status: 'success' | 'failed', 
    details: any
  ): CheckInRecord => {
    return {
      id: Date.now().toString(),
      userId: currentUser?.id || 'unknown',
      timestamp: new Date().toISOString(),
      type,
      status,
      details
    };
  };

  const handleLocationCheckIn = () => {
    setLoading(true);
    setError(null);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLatitude = position.coords.latitude;
          const userLongitude = position.coords.longitude;
          const calculatedDistance = getDistanceInMeters(
            userLatitude, 
            userLongitude, 
            OFFICE_LOCATION.latitude, 
            OFFICE_LOCATION.longitude
          );
          
          setDistance(calculatedDistance);
          
          let record: CheckInRecord;
          
          // Check if user is within the allowed radius
          if (calculatedDistance <= OFFICE_LOCATION.maxDistanceMeters) {
            // Success: User is within the allowed radius
            record = createCheckInRecord('location', 'success', {
              latitude: userLatitude,
              longitude: userLongitude,
              distance: calculatedDistance,
              locationName: OFFICE_LOCATION.name
            });
            
            toast({
              title: "打卡成功！",
              description: `您已成功在${OFFICE_LOCATION.name}打卡。距離: ${Math.round(calculatedDistance)}公尺`,
            });
          } else {
            // Error: User is too far from the office
            record = createCheckInRecord('location', 'failed', {
              latitude: userLatitude,
              longitude: userLongitude,
              distance: calculatedDistance,
              locationName: OFFICE_LOCATION.name
            });
            
            setError(`您距離${OFFICE_LOCATION.name}太遠，無法打卡。距離: ${Math.round(calculatedDistance)}公尺，最大允許距離: ${OFFICE_LOCATION.maxDistanceMeters}公尺`);
            
            toast({
              title: "打卡失敗",
              description: `您距離${OFFICE_LOCATION.name}太遠，無法打卡`,
              variant: "destructive",
            });
          }
          
          saveCheckInRecord(record);
          setTodayCheckIn(record);
          setLoading(false);
        },
        (positionError) => {
          setLoading(false);
          setError("無法取得位置資訊，請確保您已開啟位置服務");
          
          toast({
            title: "無法取得位置",
            description: "請確保您已開啟位置服務",
            variant: "destructive",
          });
          
          console.error("Error getting location:", positionError);
        }
      );
    } else {
      setLoading(false);
      setError("您的設備不支援位置服務");
      
      toast({
        title: "不支援位置服務",
        description: "您的設備不支援位置服務",
        variant: "destructive",
      });
    }
  };

  const handleIpCheckIn = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const ip = await getClientIp();
      
      // Modified: Allow any IP address to check in
      // Create a success record for any IP
      const record = createCheckInRecord('ip', 'success', {
        ip,
        locationName: '遠端辦公'
      });
      
      toast({
        title: "打卡成功！",
        description: `您已成功遠端打卡。IP: ${ip}`,
      });
      
      saveCheckInRecord(record);
      setTodayCheckIn(record);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError("無法取得您的網路資訊");
      
      toast({
        title: "無法取得網路資訊",
        description: "請確保您的網路連線正常",
        variant: "destructive",
      });
      
      console.error("Error checking IP:", error);
    }
  };
  
  return (
    <div className="mt-10 flex flex-col items-center justify-center relative">
      <div className="bg-pattern bg-repeat-x w-full h-64 absolute -bottom-10 opacity-10 z-0"></div>
      
      {error && (
        <Alert variant="destructive" className="mb-4 max-w-md mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {todayCheckIn ? (
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto z-10">
          <div className="flex items-center justify-center mb-4">
            <Clock className="h-10 w-10 text-green-500 mr-2" />
            <h2 className="text-xl font-bold">今日已打卡</h2>
          </div>
          
          <div className="text-center mb-4">
            <p className="text-lg font-medium">
              {new Date(todayCheckIn.timestamp).toLocaleTimeString('zh-TW', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
            <p className="text-sm text-gray-500">
              {new Date(todayCheckIn.timestamp).toLocaleDateString('zh-TW')}
            </p>
          </div>
          
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
            {todayCheckIn.type === 'location' ? (
              <>
                <MapPin className="h-4 w-4" />
                <span>位置打卡</span>
                {todayCheckIn.details.locationName && (
                  <span className="ml-1">- {todayCheckIn.details.locationName}</span>
                )}
              </>
            ) : (
              <>
                <Wifi className="h-4 w-4" />
                <span>IP打卡</span>
                {todayCheckIn.details.locationName && (
                  <span className="ml-1">- {todayCheckIn.details.locationName}</span>
                )}
              </>
            )}
          </div>
        </div>
      ) : (
        <Tabs 
          value={checkInMethod} 
          onValueChange={(value) => setCheckInMethod(value as 'location' | 'ip')}
          className="w-full max-w-md z-10"
        >
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="location" className="text-center">
              <MapPin className="h-4 w-4 mr-2" />
              位置打卡
            </TabsTrigger>
            <TabsTrigger value="ip" className="text-center">
              <Wifi className="h-4 w-4 mr-2" />
              IP打卡
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="location" className="mt-0">
            <button
              onClick={handleLocationCheckIn}
              disabled={loading}
              className="relative h-40 w-40 mx-auto rounded-full bg-white border-8 border-[#E6F4F9] flex items-center justify-center z-10 focus:outline-none transition-all duration-300 hover:border-[#0091D0]/50"
            >
              <div className="location-ring bg-[#0091D0]/20 h-32 w-32"></div>
              <div className="location-ring bg-[#0091D0]/10 h-36 w-36" style={{ animationDelay: "0.5s" }}></div>
              
              <div className="h-24 w-24 rounded-full bg-[#0091D0] flex items-center justify-center">
                <MapPin className="h-12 w-12 text-white" />
              </div>
            </button>
            
            <div className="mt-6 text-center">
              <p className="text-xl font-bold">上班了！<span className="text-[#0091D0]">定位打卡</span></p>
              {distance !== null && !error && (
                <p className="text-sm text-gray-600 mt-2">
                  距離公司: <span className="font-medium">{Math.round(distance)} 公尺</span>
                </p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="ip" className="mt-0">
            <button
              onClick={handleIpCheckIn}
              disabled={loading}
              className="relative h-40 w-40 mx-auto rounded-full bg-white border-8 border-[#E6F4F9] flex items-center justify-center z-10 focus:outline-none transition-all duration-300 hover:border-[#0091D0]/50"
            >
              <div className="location-ring bg-[#0091D0]/20 h-32 w-32"></div>
              <div className="location-ring bg-[#0091D0]/10 h-36 w-36" style={{ animationDelay: "0.5s" }}></div>
              
              <div className="h-24 w-24 rounded-full bg-[#0091D0] flex items-center justify-center">
                <Wifi className="h-12 w-12 text-white" />
              </div>
            </button>
            
            <div className="mt-6 text-center">
              <p className="text-xl font-bold">上班了！<span className="text-[#0091D0]">IP打卡</span></p>
              <p className="text-sm text-gray-600 mt-2">
                使用公司網路自動打卡
              </p>
            </div>
          </TabsContent>
        </Tabs>
      )}
      
      <div className="absolute bottom-0 right-5 z-10">
        <img src="/lovable-uploads/25eb8e3e-34ff-43a3-a4fc-f9aecbc2f9f5.png" alt="StayFun" className="h-12" />
      </div>
    </div>
  );
};

export default LocationCheckIn;
