
import React from 'react';
import { Calendar, User, Eye, FileText, Pin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CompanyAnnouncement } from '@/types/announcement';
import { formatAnnouncementDate } from '@/utils/announcementUtils';

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
        return 'bg-blue-500/20 text-blue-700 border-blue-300/30';
      case 'Administration':
        return 'bg-orange-500/20 text-orange-700 border-orange-300/30';
      case 'Meeting':
        return 'bg-green-500/20 text-green-700 border-green-300/30';
      case 'Official':
        return 'bg-red-500/20 text-red-700 border-red-300/30';
      default:
        return 'bg-gray-500/20 text-gray-700 border-gray-300/30';
    }
  };

  return (
    <Card 
      className={`cursor-pointer transition-all duration-300 hover:scale-[1.02] group backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-lg hover:shadow-xl hover:bg-white/30 overflow-hidden relative ${
        !isRead ? 'ring-2 ring-blue-400/50' : ''
      }`}
      onClick={() => onClick(announcement)}
    >
      {/* 玻璃效果邊框光暈 */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-white/10 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <CardContent className="p-6 relative z-10">
        {/* Header with badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {announcement.is_pinned && (
            <Badge className="text-xs flex items-center gap-1 font-medium bg-yellow-500/20 text-yellow-700 border-yellow-300/30 backdrop-blur-xl">
              <Pin className="h-3 w-3" />
              置頂
            </Badge>
          )}
          
          {announcement.category && (
            <Badge className={`text-xs font-medium backdrop-blur-xl ${getCategoryColor(announcement.category)}`}>
              {announcement.category}
            </Badge>
          )}
          
          {announcement.file && (
            <Badge className="text-xs flex items-center gap-1 bg-purple-500/20 text-purple-700 border-purple-300/30 backdrop-blur-xl font-medium">
              <FileText className="h-3 w-3" />
              附件
            </Badge>
          )}
          
          {!isRead && (
            <Badge className="text-xs font-medium bg-blue-500/20 text-blue-700 border-blue-300/30 backdrop-blur-xl">
              新
            </Badge>
          )}
        </div>

        {/* Title */}
        <h3 className="font-bold text-gray-900 text-lg sm:text-xl mb-3 line-clamp-2">
          {announcement.title}
        </h3>

        {/* Content preview */}
        <p className="text-gray-700 text-sm sm:text-base leading-relaxed font-medium mb-6 line-clamp-2">
          {announcement.content}
        </p>

        {/* Footer with meta info and action */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col gap-2 text-sm text-gray-700 font-medium">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-white/40 rounded-lg backdrop-blur-xl">
                <User className="h-4 w-4" />
              </div>
              <span>{announcement.created_by.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-white/40 rounded-lg backdrop-blur-xl">
                <Calendar className="h-4 w-4" />
              </div>
              <span>{formatAnnouncementDate(announcement.created_at)}</span>
            </div>
          </div>
          
          <Button 
            size="sm" 
            className="w-full sm:w-auto h-10 text-sm bg-white/40 text-gray-800 border-white/30 backdrop-blur-xl font-semibold hover:bg-white/60 transition-all duration-300 group-hover:scale-105 shadow-lg rounded-xl"
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
