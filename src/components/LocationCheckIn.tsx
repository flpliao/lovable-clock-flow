
import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { MapPin } from 'lucide-react';

const LocationCheckIn: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<GeolocationPosition | null>(null);

  const handleCheckIn = () => {
    setLoading(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(position);
          setLoading(false);
          toast({
            title: "打卡成功！",
            description: `位置已紀錄：${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`,
          });
        },
        (error) => {
          setLoading(false);
          toast({
            title: "無法取得位置",
            description: "請確保您已開啟位置服務",
            variant: "destructive",
          });
          console.error("Error getting location:", error);
        }
      );
    } else {
      setLoading(false);
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
      
      <button
        onClick={handleCheckIn}
        disabled={loading}
        className="relative h-40 w-40 rounded-full bg-white border-8 border-[#E6F4F9] flex items-center justify-center z-10 focus:outline-none"
      >
        <div className="location-ring bg-[#0091D0]/20 h-32 w-32"></div>
        <div className="location-ring bg-[#0091D0]/10 h-36 w-36" style={{ animationDelay: "0.5s" }}></div>
        
        <div className="h-24 w-24 rounded-full bg-[#0091D0] flex items-center justify-center">
          <MapPin className="h-12 w-12 text-white" />
        </div>
      </button>
      
      <div className="mt-6 text-center z-10">
        <p className="text-xl font-bold">上班了！<span className="text-[#0091D0]">定位打卡</span></p>
      </div>
      
      <div className="absolute bottom-0 right-5 z-10">
        <img src="/lovable-uploads/25eb8e3e-34ff-43a3-a4fc-f9aecbc2f9f5.png" alt="StayFun" className="h-12" />
      </div>
    </div>
  );
};

export default LocationCheckIn;
