
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const AnnouncementLoadingState: React.FC = () => {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl p-6 shadow-lg">
          <div className="space-y-4">
            {/* Header with badges */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-16 rounded-full bg-white/20" />
              <Skeleton className="h-6 w-12 rounded-full bg-white/20" />
              <Skeleton className="h-6 w-20 rounded-full bg-white/20" />
            </div>
            
            {/* Title */}
            <Skeleton className="h-8 w-3/4 bg-white/20 rounded-xl" />
            
            {/* Content */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full bg-white/20 rounded-lg" />
              <Skeleton className="h-4 w-2/3 bg-white/20 rounded-lg" />
            </div>
            
            {/* Footer */}
            <div className="flex justify-between items-center pt-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32 bg-white/20 rounded-lg" />
                <Skeleton className="h-4 w-28 bg-white/20 rounded-lg" />
              </div>
              <Skeleton className="h-10 w-24 rounded-xl bg-white/20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnnouncementLoadingState;
