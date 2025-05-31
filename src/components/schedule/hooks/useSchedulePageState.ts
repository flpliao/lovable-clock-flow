
import { useState } from 'react';

export const useSchedulePageState = () => {
  const [viewMode, setViewMode] = useState<'self' | 'subordinates' | 'all'>('self');
  
  return {
    viewMode,
    setViewMode,
  };
};
