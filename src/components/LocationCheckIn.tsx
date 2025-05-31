
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
import CheckInReminderSystem from './check-in/CheckInReminderSystem';

// Custom hook
import { useCheckIn } from '@/hooks/useCheckIn';

const LocationCheckIn: React.FC = () => {
  const { currentUser } = useUser();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authUserId, setAuthUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // 檢查 Supabase 認證狀態
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        console.log('Auth check result:', { user, error, currentUser });
        
        if (user && !error) {
          setIsAuthenticated(true);
          setAuthUserId(user.id);
          console.log('User authenticated via Supabase:', user.id);
        } else if (currentUser?.id) {
          // 如果沒有 Supabase 認證但有 currentUser，使用 mock 認證
          setIsAuthenticated(true);
          setAuthUserId(currentUser.id);
          console.log('User authenticated via mock system:', currentUser.id);
        } else {
          setIsAuthenticated(false);
          setAuthUserId(null);
          console.log('No authentication found');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        // 如果 Supabase 檢查失敗但有 currentUser，還是允許使用
        if (currentUser?.id) {
          setIsAuthenticated(true);
          setAuthUserId(currentUser.id);
          console.log('Fallback to currentUser auth:', currentUser.id);
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // 監聽認證狀態變化
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.id, currentUser);
      if (session?.user) {
        setIsAuthenticated(true);
        setAuthUserId(session.user.id);
      } else if (currentUser?.id) {
        // 保持 mock 認證
        setIsAuthenticated(true);
        setAuthUserId(currentUser.id);
      } else {
        setIsAuthenticated(false);
        setAuthUserId(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [currentUser]);
  
  // 使用有效的用戶 ID，確保認證正確
  const effectiveUserId = authUserId || currentUser?.id || '';
  
  console.log('LocationCheckIn - Current user:', currentUser);
  console.log('LocationCheckIn - Authenticated:', isAuthenticated);
  console.log('LocationCheckIn - Effective userId:', effectiveUserId);
  
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
  } = useCheckIn(effectiveUserId);
  
  // 載入中狀態
  if (isLoading) {
    return (
      <div className="mt-10 flex flex-col items-center justify-center relative">
        <div className="text-center">載入中...</div>
      </div>
    );
  }
  
  // 確保有有效的用戶且認證通過才顯示打卡功能
  if (!currentUser || !isAuthenticated || !effectiveUserId) {
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
      
      {/* 自動補卡提醒系統 */}
      <CheckInReminderSystem />
      
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
