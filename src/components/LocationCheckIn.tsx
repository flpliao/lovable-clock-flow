
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { MapPin, Wifi, Clock, AlertCircle, LogIn, LogOut } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  action: 'check-in' | 'check-out';  // New field to track check-in or check-out
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
  const todayRecords = getUserCheckInRecords(userId).filter(record => 
    record.timestamp.startsWith(today)
  );
  // Return the most recent check-in (if any)
  return todayRecords.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )[0];
};

// Get today's check-in and check-out records for a user
export const getUserTodayRecords = (userId: string): { checkIn?: CheckInRecord, checkOut?: CheckInRecord } => {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const todayRecords = getUserCheckInRecords(userId).filter(record => 
    record.timestamp.startsWith(today)
  );
  
  return {
    checkIn: todayRecords.find(record => record.action === 'check-in'),
    checkOut: todayRecords.find(record => record.action === 'check-out')
  };
};

const LocationCheckIn: React.FC = () => {
  const { toast } = useToast();
  const { currentUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [checkInMethod, setCheckInMethod] = useState<'location' | 'ip'>('location');
  const [actionType, setActionType] = useState<'check-in' | 'check-out'>('check-in');
  const [todayRecords, setTodayRecords] = useState<{ checkIn?: CheckInRecord, checkOut?: CheckInRecord }>({});

  useEffect(() => {
    if (currentUser?.id) {
      const records = getUserTodayRecords(currentUser.id);
      setTodayRecords(records);
    }
  }, [currentUser?.id]);

  const createCheckInRecord = (
    type: 'location' | 'ip', 
    status: 'success' | 'failed',
    action: 'check-in' | 'check-out',
    details: any
  ): CheckInRecord => {
    return {
      id: Date.now().toString(),
      userId: currentUser?.id || 'unknown',
      timestamp: new Date().toISOString(),
      type,
      status,
      action,
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
            record = createCheckInRecord('location', 'success', actionType, {
              latitude: userLatitude,
              longitude: userLongitude,
              distance: calculatedDistance,
              locationName: OFFICE_LOCATION.name
            });
            
            const actionMsg = actionType === 'check-in' ? '上班打卡' : '下班打卡';
            
            toast({
              title: `${actionMsg}成功！`,
              description: `您已成功在${OFFICE_LOCATION.name}${actionMsg}。距離: ${Math.round(calculatedDistance)}公尺`,
            });
          } else {
            // Error: User is too far from the office
            record = createCheckInRecord('location', 'failed', actionType, {
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
          
          // Update today's records
          if (record.status === 'success') {
            if (actionType === 'check-in') {
              setTodayRecords(prev => ({ ...prev, checkIn: record }));
            } else {
              setTodayRecords(prev => ({ ...prev, checkOut: record }));
            }
          }
          
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
      const record = createCheckInRecord('ip', 'success', actionType, {
        ip,
        locationName: '遠端辦公'
      });
      
      const actionMsg = actionType === 'check-in' ? '上班打卡' : '下班打卡';
      
      toast({
        title: `${actionMsg}成功！`,
        description: `您已成功遠端${actionMsg}。IP: ${ip}`,
      });
      
      saveCheckInRecord(record);
      
      // Update today's records
      if (actionType === 'check-in') {
        setTodayRecords(prev => ({ ...prev, checkIn: record }));
      } else {
        setTodayRecords(prev => ({ ...prev, checkOut: record }));
      }
      
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
  
  // Helper to format time
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('zh-TW', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  
  // Helper to format date
  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('zh-TW');
  };
  
  // Generate action options for the UI
  const getActionOptions = () => {
    const { checkIn, checkOut } = todayRecords;
    
    // If no check-in yet, only show check-in option
    if (!checkIn) {
      return (
        <Tabs 
          value={actionType} 
          onValueChange={(value) => setActionType(value as 'check-in' | 'check-out')}
          className="w-full max-w-md mb-6"
        >
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="check-in" className="text-center">
              <LogIn className="h-4 w-4 mr-2" />
              上班打卡
            </TabsTrigger>
          </TabsList>
        </Tabs>
      );
    }
    
    // If already checked in but not checked out, show both options
    if (checkIn && !checkOut) {
      return (
        <Tabs 
          value={actionType} 
          onValueChange={(value) => setActionType(value as 'check-in' | 'check-out')}
          className="w-full max-w-md mb-6"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="check-in" className="text-center" disabled>
              <LogIn className="h-4 w-4 mr-2" />
              上班打卡
            </TabsTrigger>
            <TabsTrigger value="check-out" className="text-center">
              <LogOut className="h-4 w-4 mr-2" />
              下班打卡
            </TabsTrigger>
          </TabsList>
        </Tabs>
      );
    }
    
    // If already checked in and out, all options disabled
    return (
      <Tabs 
        value={actionType} 
        onValueChange={(value) => setActionType(value as 'check-in' | 'check-out')}
        className="w-full max-w-md mb-6"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="check-in" className="text-center" disabled>
            <LogIn className="h-4 w-4 mr-2" />
            上班打卡
          </TabsTrigger>
          <TabsTrigger value="check-out" className="text-center" disabled>
            <LogOut className="h-4 w-4 mr-2" />
            下班打卡
          </TabsTrigger>
        </TabsList>
      </Tabs>
    );
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
      
      {/* Today's Check-in and Check-out Status */}
      {(todayRecords.checkIn || todayRecords.checkOut) && (
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto z-10 mb-6 w-full">
          <h2 className="text-xl font-bold text-center mb-4">今日打卡紀錄</h2>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Check-in record display */}
            <div className={`p-4 rounded-lg ${todayRecords.checkIn ? 'bg-green-50' : 'bg-gray-100'}`}>
              <div className="flex items-center mb-2">
                <LogIn className="h-5 w-5 text-green-600 mr-2" />
                <h3 className="text-lg font-medium">上班打卡</h3>
              </div>
              
              {todayRecords.checkIn ? (
                <>
                  <p className="text-lg font-medium">
                    {formatTime(todayRecords.checkIn.timestamp)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDate(todayRecords.checkIn.timestamp)}
                  </p>
                  <div className="flex items-center mt-2 text-sm text-gray-600">
                    {todayRecords.checkIn.type === 'location' ? (
                      <>
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{todayRecords.checkIn.details.locationName}</span>
                      </>
                    ) : (
                      <>
                        <Wifi className="h-4 w-4 mr-1" />
                        <span>{todayRecords.checkIn.details.locationName}</span>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-gray-500 italic">尚未打卡</p>
              )}
            </div>
            
            {/* Check-out record display */}
            <div className={`p-4 rounded-lg ${todayRecords.checkOut ? 'bg-blue-50' : 'bg-gray-100'}`}>
              <div className="flex items-center mb-2">
                <LogOut className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-medium">下班打卡</h3>
              </div>
              
              {todayRecords.checkOut ? (
                <>
                  <p className="text-lg font-medium">
                    {formatTime(todayRecords.checkOut.timestamp)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDate(todayRecords.checkOut.timestamp)}
                  </p>
                  <div className="flex items-center mt-2 text-sm text-gray-600">
                    {todayRecords.checkOut.type === 'location' ? (
                      <>
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{todayRecords.checkOut.details.locationName}</span>
                      </>
                    ) : (
                      <>
                        <Wifi className="h-4 w-4 mr-1" />
                        <span>{todayRecords.checkOut.details.locationName}</span>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-gray-500 italic">尚未打卡</p>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* If both check-in and check-out are done, show a message */}
      {todayRecords.checkIn && todayRecords.checkOut ? (
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto z-10 text-center">
          <Clock className="h-12 w-12 text-green-500 mx-auto mb-2" />
          <h2 className="text-xl font-bold">今日打卡完成</h2>
          <p className="text-gray-600 mt-2">您已完成今日的上班與下班打卡</p>
        </div>
      ) : (
        <>
          {/* Action type selection (check-in or check-out) */}
          {getActionOptions()}
          
          {/* Method selection (location or IP) and action buttons */}
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
                  {actionType === 'check-in' ? (
                    <LogIn className="h-12 w-12 text-white" />
                  ) : (
                    <LogOut className="h-12 w-12 text-white" />
                  )}
                </div>
              </button>
              
              <div className="mt-6 text-center">
                <p className="text-xl font-bold">
                  {actionType === 'check-in' ? '上班了！' : '下班了！'}
                  <span className="text-[#0091D0]">定位打卡</span>
                </p>
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
                  {actionType === 'check-in' ? (
                    <LogIn className="h-12 w-12 text-white" />
                  ) : (
                    <LogOut className="h-12 w-12 text-white" />
                  )}
                </div>
              </button>
              
              <div className="mt-6 text-center">
                <p className="text-xl font-bold">
                  {actionType === 'check-in' ? '上班了！' : '下班了！'}
                  <span className="text-[#0091D0]">IP打卡</span>
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  使用公司網路自動打卡
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
      
      <div className="absolute bottom-0 right-5 z-10">
        <img src="/lovable-uploads/25eb8e3e-34ff-43a3-a4fc-f9aecbc2f9f5.png" alt="StayFun" className="h-12" />
      </div>
    </div>
  );
};

export default LocationCheckIn;
