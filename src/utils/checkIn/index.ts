
// Check-in utilities index - centralized export for all check-in related functions
export { handleLocationCheckIn } from './locationCheckIn';
export { handleIpCheckIn } from './ipCheckIn';

// Re-export other utilities for backward compatibility
export {
  COMPANY_LOCATION,
  ALLOWED_DISTANCE,
  calculateDistance,
  getCurrentPosition
} from '../geolocation';

export {
  getUserIP
} from '../networkUtils';

export {
  formatDate,
  formatTime
} from '../dateUtils';

export {
  getUserCheckInRecords,
  getCheckInRecords,
  getUserTodayRecords,
  saveCheckInRecord
} from '../localStorageUtils';
