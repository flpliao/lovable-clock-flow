
import React from 'react';
import { Calendar, User, Eye, FileText, Pin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CompanyAnnouncement } from '@/types/announcement';
import { formatAnnouncementDate } from '@/utils/announcementUtils';
import { visionProStyles } from '@/utils/visionProStyles';

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
        return 'bg-blue-500/80 text-white border-blue-400/50';
      case 'Administration':
        return 'bg-amber-500/80 text-white border-amber-400/50';
      case 'Meeting':
        return 'bg-emerald-500/80 text-white border-emerald-400/50';
      case 'Official':
        return 'bg-red-500/80 text-white border-red-400/50';
      default:
        return 'bg-gray-500/80 text-white border-gray-400/50';
    }
  };

  return (
    <Card 
      className={`mb-3 sm:mb-4 cursor-pointer transition-all duration-300 hover:scale-[1.02] shadow-2xl ${visionProStyles.cardBackground} border-white/30 relative overflow-hidden ${
        !isRead ? 'border-l-4 border-l-blue-400/80' : 'border-l-4 border-l-transparent'
      }`}
      onClick={() => onClick(announcement)}
    >
      {/* Vision Pro 風格的光效 */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <CardContent className="p-4 relative z-10">
        {/* Header with badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {announcement.is_pinned && (
            <Badge className="bg-yellow-500/80 text-white border-yellow-400/50 text-xs flex items-center gap-1 font-medium">
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
            <Badge className={`text-xs flex items-center gap-1 ${visionProStyles.glassButton} border-white/40 text-white font-medium`}>
              <FileText className="h-3 w-3" />
              附件
            </Badge>
          )}
          
          {!isRead && (
            <Badge className="bg-blue-600/80 text-white border-blue-400/50 text-xs font-medium">
              新
            </Badge>
          )}
        </div>

        {/* Title */}
        <h3 className={`text-base sm:text-lg font-semibold mb-2 line-clamp-2 ${visionProStyles.primaryText} text-white drop-shadow-lg`}>
          {announcement.title}
        </h3>

        {/* Content preview */}
        <p className="text-sm text-white/70 mb-3 line-clamp-2 font-medium drop-shadow-md">
          {announcement.content}
        </p>

        {/* Footer with meta info and action */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex flex-col gap-1 text-xs text-white/60">
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span className="font-medium drop-shadow-md">{announcement.created_by.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span className="font-medium drop-shadow-md">{formatAnnouncementDate(announcement.created_at)}</span>
            </div>
          </div>
          
          <Button 
            size="sm" 
            className={`w-full sm:w-auto h-8 text-xs ${visionProStyles.glassButton} border-white/40 text-white font-semibold hover:bg-white/30 transition-all duration-200`}
            onClick={(e) => {
              e.stopPropagation();
              onClick(announcement);
            }}
          >
            <Eye className="h-3 w-3 mr-1" />
            查看詳情
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnnouncementCard;
