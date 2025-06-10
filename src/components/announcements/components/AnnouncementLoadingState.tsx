
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { visionProStyles } from '@/utils/visionProStyles';

const AnnouncementLoadingState: React.FC = () => {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className={`${visionProStyles.liquidGlassCard} p-6 border border-white/40 shadow-lg`}>
          <div className="space-y-4">
            {/* Header with badges */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-16 rounded-full bg-white/30" />
              <Skeleton className="h-6 w-12 rounded-full bg-white/30" />
              <Skeleton className="h-6 w-20 rounded-full bg-white/30" />
            </div>
            
            {/* Title */}
            <Skeleton className="h-8 w-3/4 bg-white/30" />
            
            {/* Content */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full bg-white/30" />
              <Skeleton className="h-4 w-2/3 bg-white/30" />
            </div>
            
            {/* Footer */}
            <div className="flex justify-between items-center pt-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32 bg-white/30" />
                <Skeleton className="h-4 w-28 bg-white/30" />
              </div>
              <Skeleton className="h-10 w-24 rounded-lg bg-white/30" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnnouncementLoadingState;
