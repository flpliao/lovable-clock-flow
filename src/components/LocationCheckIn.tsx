
import React, { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';

// New components
import CheckInStatusDisplay from './check-in/CheckInStatusDisplay';
import CheckInCompletedMessage from './check-in/CheckInCompletedMessage';
import ActionTypeSelector from './check-in/ActionTypeSelector';
import CheckInMethodSelector from './check-in/CheckInMethodSelector';

// Custom hook
import { useCheckIn } from '@/hooks/useCheckIn';

const LocationCheckIn: React.FC = () => {
  const { currentUser } = useUser();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authUserId, setAuthUserId] = useState<string | null>(null);
  
  // 檢查 Supabase 認證狀態
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      console.log('Auth check result:', { user, error });
      
      if (user && !error) {
        setIsAuthenticated(true);
        setAuthUserId(user.id);
      } else {
        setIsAuthenticated(false);
        setAuthUserId(null);
      }
    };

    checkAuth();

    // 監聽認證狀態變化
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      if (session?.user) {
        setIsAuthenticated(true);
        setAuthUserId(session.user.id);
      } else {
        setIsAuthenticated(false);
        setAuthUserId(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);
  
  // 使用 Supabase 認證的用戶 ID
  const userId = authUserId || '';
  
  console.log('LocationCheckIn - Current user:', currentUser);
  console.log('LocationCheckIn - Authenticated:', isAuthenticated);
  console.log('LocationCheckIn - Using userId:', userId);
  
  const {
    loading,
    error,
    distance,
    checkInMethod,
    setCheckInMethod,
    actionType,
    setActionType,
    todayRecords,
    onLocationCheckIn,
    onIpCheckIn
  } = useCheckIn(userId);
  
  // 如果沒有用戶登入，顯示登入提示
  if (!currentUser || !isAuthenticated) {
    return (
      <div className="mt-10 flex flex-col items-center justify-center relative">
        <Alert variant="destructive" className="mb-4 max-w-md mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>請先登入才能使用打卡功能</AlertDescription>
        </Alert>
      </div>
    );
  }
  
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
        <CheckInStatusDisplay todayRecords={todayRecords} />
      )}
      
      {/* Action type selection (check-in or check-out) */}
      <ActionTypeSelector
        actionType={actionType}
        setActionType={setActionType}
        todayRecords={todayRecords}
      />
      
      {/* If both check-in and check-out are done, show completion message */}
      {todayRecords.checkIn && todayRecords.checkOut ? (
        <CheckInCompletedMessage />
      ) : (
        /* Method selection (location or IP) and action buttons */
        <CheckInMethodSelector
          checkInMethod={checkInMethod}
          setCheckInMethod={setCheckInMethod}
          onLocationCheckIn={onLocationCheckIn}
          onIpCheckIn={onIpCheckIn}
          loading={loading}
          actionType={actionType}
          distance={distance}
          error={error}
        />
      )}
    </div>
  );
};

export default LocationCheckIn;
