
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useUser } from '@/contexts/UserContext';

// New components
import CheckInStatusDisplay from './check-in/CheckInStatusDisplay';
import CheckInCompletedMessage from './check-in/CheckInCompletedMessage';
import ActionTypeSelector from './check-in/ActionTypeSelector';
import CheckInMethodSelector from './check-in/CheckInMethodSelector';

// Custom hook
import { useCheckIn } from '@/hooks/useCheckIn';

const LocationCheckIn: React.FC = () => {
  const { currentUser } = useUser();
  
  // 確保 userId 正確傳遞，如果沒有用戶則使用空字符串
  const userId = currentUser?.id || '';
  
  console.log('LocationCheckIn - Current user:', currentUser);
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
  if (!currentUser) {
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
