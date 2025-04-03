
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
  const userId = currentUser?.id || 'unknown';
  
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
      
      {/* If both check-in and check-out are done, show a message */}
      {todayRecords.checkIn && todayRecords.checkOut ? (
        <CheckInCompletedMessage />
      ) : (
        <>
          {/* Action type selection (check-in or check-out) */}
          <ActionTypeSelector
            actionType={actionType}
            setActionType={setActionType}
            todayRecords={todayRecords}
          />
          
          {/* Method selection (location or IP) and action buttons */}
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
        </>
      )}
      
      <div className="absolute bottom-0 right-5 z-10">
        <img src="/lovable-uploads/25eb8e3e-34ff-43a3-a4fc-f9aecbc2f9f5.png" alt="StayFun" className="h-12" />
      </div>
    </div>
  );
};

export default LocationCheckIn;
