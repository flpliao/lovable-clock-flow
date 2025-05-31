
import React from 'react';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CompanyAnnouncement } from '@/types/announcement';
import { formatAnnouncementDate } from '@/utils/announcementUtils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface AnnouncementTableProps {
  announcements: CompanyAnnouncement[];
  onView: (announcement: CompanyAnnouncement) => void;
  onEdit: (announcement: CompanyAnnouncement) => void;
}

const AnnouncementTable: React.FC<AnnouncementTableProps> = ({
  announcements,
  onView,
  onEdit
}) => {
  return (
    <div className="border rounded-md overflow-hidden bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">標題</TableHead>
            <TableHead>分類</TableHead>
            <TableHead>發布日期</TableHead>
            <TableHead>發布者</TableHead>
            <TableHead className="text-center">置頂</TableHead>
            <TableHead className="text-center">狀態</TableHead>
            <TableHead className="text-center">附件</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {announcements.map((announcement) => (
            <TableRow key={announcement.id}>
              <TableCell className="font-medium">
                <div className="truncate max-w-[280px]" title={announcement.title}>
                  {announcement.title}
                </div>
              </TableCell>
              <TableCell>
                {announcement.category ? (
                  <Badge variant="outline">{announcement.category}</Badge>
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </TableCell>
              <TableCell>{formatAnnouncementDate(announcement.created_at)}</TableCell>
              <TableCell>{announcement.created_by.name}</TableCell>
              <TableCell className="text-center">
                {announcement.is_pinned ? (
                  <Badge className="bg-yellow-500">置頂</Badge>
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </TableCell>
              <TableCell className="text-center">
                {announcement.is_active ? (
                  <Badge className="bg-green-500">啟用</Badge>
                ) : (
                  <Badge variant="outline" className="text-gray-500">停用</Badge>
                )}
              </TableCell>
              <TableCell className="text-center">
                {announcement.file ? (
                  <Badge variant="outline">有附件</Badge>
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onView(announcement)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onEdit(announcement)}
                  >
                    編輯
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AnnouncementTable;
