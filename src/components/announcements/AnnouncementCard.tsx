
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
      className={`cursor-pointer transition-all duration-500 hover:scale-[1.02] group ${visionProStyles.featureCard} overflow-hidden relative ${
        !isRead ? 'border-l-4 border-l-blue-400/80' : ''
      }`}
      onClick={() => onClick(announcement)}
    >
      {/* 與首頁一致的柔和背景光效 */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <CardContent className="p-6 relative z-10">
        {/* Header with badges */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
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
            <Badge className="text-xs flex items-center gap-1 bg-white/70 text-gray-800 border-white/40 backdrop-blur-xl font-semibold drop-shadow-sm px-3 py-1 rounded-full shadow-md">
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

        {/* Title - 與首頁卡片標題風格一致 */}
        <h3 className="font-bold text-gray-800 text-lg sm:text-xl mb-4 drop-shadow-sm group-hover:drop-shadow-md transition-all duration-300 line-clamp-2">
          {announcement.title}
        </h3>

        {/* Content preview - 與首頁描述文字風格一致 */}
        <p className="text-gray-700 text-sm sm:text-base leading-relaxed drop-shadow-sm font-medium mb-6 line-clamp-2">
          {announcement.content}
        </p>

        {/* Footer with meta info and action */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col gap-3 text-sm text-gray-700 font-medium">
            <div className="flex items-center gap-3">
              <div className={visionProStyles.iconContainer}>
                <User className="h-4 w-4" />
              </div>
              <span>{announcement.created_by.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className={visionProStyles.iconContainer}>
                <Calendar className="h-4 w-4" />
              </div>
              <span>{formatAnnouncementDate(announcement.created_at)}</span>
            </div>
          </div>
          
          <Button 
            size="sm" 
            className="w-full sm:w-auto h-10 text-sm bg-white/70 text-gray-800 border-white/40 backdrop-blur-xl font-semibold hover:bg-white/80 transition-all duration-300 group-hover:scale-105 shadow-md drop-shadow-sm"
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
