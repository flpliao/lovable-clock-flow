
import { getClientIp, OFFICE_LOCATION, getDistanceInMeters } from './location';
import { CheckInRecord } from '@/types';

// Store check-in records in localStorage (would be a database in a real app)
export const saveCheckInRecord = (record: CheckInRecord): void => {
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

// Helper to format time
export const formatTime = (timestamp: string) => {
  return new Date(timestamp).toLocaleTimeString('zh-TW', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

// Helper to format date
export const formatDate = (timestamp: string) => {
  return new Date(timestamp).toLocaleDateString('zh-TW');
};

// Create check-in record
export const createCheckInRecord = (
  userId: string,
  type: 'location' | 'ip', 
  status: 'success' | 'failed',
  action: 'check-in' | 'check-out',
  details: any
): CheckInRecord => {
  return {
    id: Date.now().toString(),
    userId,
    timestamp: new Date().toISOString(),
    type,
    status,
    action,
    details
  };
};

// Handle location check-in
export const handleLocationCheckIn = (
  userId: string,
  action: 'check-in' | 'check-out',
  onSuccess: (record: CheckInRecord) => void,
  onError: (errorMessage: string) => void,
  setDistance?: (distance: number) => void
) => {
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
        
        if (setDistance) {
          setDistance(calculatedDistance);
        }
        
        let record: CheckInRecord;
        
        // Check if user is within the allowed radius
        if (calculatedDistance <= OFFICE_LOCATION.maxDistanceMeters) {
          // Success: User is within the allowed radius
          record = createCheckInRecord(
            userId,
            'location', 
            'success', 
            action, 
            {
              latitude: userLatitude,
              longitude: userLongitude,
              distance: calculatedDistance,
              locationName: OFFICE_LOCATION.name
            }
          );
          
          saveCheckInRecord(record);
          onSuccess(record);
        } else {
          // Error: User is too far from the office
          record = createCheckInRecord(
            userId,
            'location', 
            'failed', 
            action, 
            {
              latitude: userLatitude,
              longitude: userLongitude,
              distance: calculatedDistance,
              locationName: OFFICE_LOCATION.name
            }
          );
          
          saveCheckInRecord(record);
          onError(`您距離${OFFICE_LOCATION.name}太遠，無法打卡。距離: ${Math.round(calculatedDistance)}公尺，最大允許距離: ${OFFICE_LOCATION.maxDistanceMeters}公尺`);
        }
      },
      (positionError) => {
        console.error("Error getting location:", positionError);
        onError("無法取得位置資訊，請確保您已開啟位置服務");
      }
    );
  } else {
    onError("您的設備不支援位置服務");
  }
};

// Handle IP check-in
export const handleIpCheckIn = async (
  userId: string,
  action: 'check-in' | 'check-out',
  onSuccess: (record: CheckInRecord) => void,
  onError: (errorMessage: string) => void
) => {
  try {
    const ip = await getClientIp();
    
    // Modified: Allow any IP address to check in
    // Create a success record for any IP
    const record = createCheckInRecord(
      userId,
      'ip', 
      'success', 
      action, 
      {
        ip,
        locationName: '遠端辦公'
      }
    );
    
    saveCheckInRecord(record);
    onSuccess(record);
  } catch (error) {
    console.error("Error checking IP:", error);
    onError("無法取得您的網路資訊");
  }
};
