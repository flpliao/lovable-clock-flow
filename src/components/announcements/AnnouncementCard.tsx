
import React from 'react';
import { Calendar, User, Eye, FileText, Pin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CompanyAnnouncement } from '@/types/announcement';
import { formatAnnouncementDate } from '@/utils/announcementUtils';
import { visionProStyles, createLiquidGlassEffect } from '@/utils/visionProStyles';

interface AnnouncementCardProps {
  announcement: CompanyAnnouncement;
  isRead: boolean;
  onClick: (announcement: CompanyAnnouncement) => void;
}

const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
  announcement,
  isRead,
  onClick
}) => {
  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'HR':
        return visionProStyles.coloredIconContainer.blue;
      case 'Administration':
        return visionProStyles.coloredIconContainer.orange;
      case 'Meeting':
        return visionProStyles.coloredIconContainer.green;
      case 'Official':
        return visionProStyles.coloredIconContainer.red;
      default:
        return visionProStyles.coloredIconContainer.gray;
    }
  };

  return (
    <Card 
      className={`cursor-pointer transition-all duration-300 hover:scale-[1.02] group ${createLiquidGlassEffect(true)} overflow-hidden relative ${
        !isRead ? 'border-l-4 border-l-blue-400/80' : 'border-l-4 border-l-transparent'
      }`}
      onClick={() => onClick(announcement)}
    >
      {/* 柔和的背景光效 */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/2 group-hover:from-white/8 group-hover:to-white/4 transition-all duration-500"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-60"></div>
      
      <CardContent className="p-6 relative z-10">
        {/* Header with badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {announcement.is_pinned && (
            <Badge className={`text-xs flex items-center gap-1 font-medium ${visionProStyles.coloredIconContainer.orange}`}>
              <Pin className="h-3 w-3" />
              置頂
            </Badge>
          )}
          
          {announcement.category && (
            <Badge className={`text-xs font-medium ${getCategoryColor(announcement.category)}`}>
              {announcement.category}
            </Badge>
          )}
          
          {announcement.file && (
            <Badge className={`text-xs flex items-center gap-1 ${visionProStyles.glassButton} border-white/40 text-gray-800 font-medium bg-white/60`}>
              <FileText className="h-3 w-3" />
              附件
            </Badge>
          )}
          
          {!isRead && (
            <Badge className={`text-xs font-medium ${visionProStyles.coloredIconContainer.blue}`}>
              新
            </Badge>
          )}
        </div>

        {/* Title */}
        <h3 className={`text-base sm:text-lg font-bold mb-3 line-clamp-2 ${visionProStyles.primaryText} group-hover:drop-shadow-md transition-all duration-300`}>
          {announcement.title}
        </h3>

        {/* Content preview */}
        <p className={`text-sm mb-4 line-clamp-2 font-medium ${visionProStyles.secondaryText}`}>
          {announcement.content}
        </p>

        {/* Footer with meta info and action */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className={`flex flex-col gap-2 text-xs ${visionProStyles.secondaryText}`}>
            <div className="flex items-center gap-2">
              <div className={visionProStyles.iconContainer}>
                <User className="h-3 w-3" />
              </div>
              <span className="font-medium">{announcement.created_by.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={visionProStyles.iconContainer}>
                <Calendar className="h-3 w-3" />
              </div>
              <span className="font-medium">{formatAnnouncementDate(announcement.created_at)}</span>
            </div>
          </div>
          
          <Button 
            size="sm" 
            className={`w-full sm:w-auto h-10 text-sm ${visionProStyles.glassButton} border-white/40 text-gray-800 font-semibold hover:bg-white/60 transition-all duration-300 group-hover:scale-105`}
            onClick={(e) => {
              e.stopPropagation();
              onClick(announcement);
            }}
          >
            <Eye className="h-4 w-4 mr-2" />
            查看詳情
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnnouncementCard;
