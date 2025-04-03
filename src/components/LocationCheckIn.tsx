
import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { MapPin, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Company office location (coordinates)
const OFFICE_LOCATION = {
  latitude: 25.033964, // Example: Taipei 101 coordinates
  longitude: 121.564468,
  name: "公司總部", 
  maxDistanceMeters: 100 // Maximum allowed distance in meters
};

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

const LocationCheckIn: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<GeolocationPosition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [distance, setDistance] = useState<number | null>(null);

  const handleCheckIn = () => {
    setLoading(true);
    setError(null);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(position);
          
          // Calculate distance between user and office
          const userLatitude = position.coords.latitude;
          const userLongitude = position.coords.longitude;
          const calculatedDistance = getDistanceInMeters(
            userLatitude, 
            userLongitude, 
            OFFICE_LOCATION.latitude, 
            OFFICE_LOCATION.longitude
          );
          
          setDistance(calculatedDistance);
          
          // Check if user is within the allowed radius
          if (calculatedDistance <= OFFICE_LOCATION.maxDistanceMeters) {
            // Success: User is within the allowed radius
            setLoading(false);
            toast({
              title: "打卡成功！",
              description: `您已成功在${OFFICE_LOCATION.name}打卡。距離: ${Math.round(calculatedDistance)}公尺`,
            });
          } else {
            // Error: User is too far from the office
            setLoading(false);
            setError(`您距離${OFFICE_LOCATION.name}太遠，無法打卡。距離: ${Math.round(calculatedDistance)}公尺，最大允許距離: ${OFFICE_LOCATION.maxDistanceMeters}公尺`);
            toast({
              title: "打卡失敗",
              description: `您距離${OFFICE_LOCATION.name}太遠，無法打卡`,
              variant: "destructive",
            });
          }
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

  return (
    <div className="mt-10 flex flex-col items-center justify-center relative">
      <div className="bg-pattern bg-repeat-x w-full h-64 absolute -bottom-10 opacity-10 z-0"></div>
      
      {error && (
        <Alert variant="destructive" className="mb-4 max-w-md mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <button
        onClick={handleCheckIn}
        disabled={loading}
        className="relative h-40 w-40 rounded-full bg-white border-8 border-[#E6F4F9] flex items-center justify-center z-10 focus:outline-none transition-all duration-300 hover:border-[#0091D0]/50"
      >
        <div className="location-ring bg-[#0091D0]/20 h-32 w-32"></div>
        <div className="location-ring bg-[#0091D0]/10 h-36 w-36" style={{ animationDelay: "0.5s" }}></div>
        
        <div className="h-24 w-24 rounded-full bg-[#0091D0] flex items-center justify-center">
          <MapPin className="h-12 w-12 text-white" />
        </div>
      </button>
      
      <div className="mt-6 text-center z-10">
        <p className="text-xl font-bold">上班了！<span className="text-[#0091D0]">定位打卡</span></p>
        {distance !== null && !error && (
          <p className="text-sm text-gray-600 mt-2">
            距離公司: <span className="font-medium">{Math.round(distance)} 公尺</span>
          </p>
        )}
      </div>
      
      <div className="absolute bottom-0 right-5 z-10">
        <img src="/lovable-uploads/25eb8e3e-34ff-43a3-a4fc-f9aecbc2f9f5.png" alt="StayFun" className="h-12" />
      </div>
    </div>
  );
};

export default LocationCheckIn;
