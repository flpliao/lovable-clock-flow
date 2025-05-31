
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, MapPin, Phone, User, Pencil, Trash2 } from 'lucide-react';
import { Branch } from '@/types/company';
import { getBranchTypeLabel, getBranchTypeColor } from '../utils/branchTypeUtils';
import { BranchStaffDisplay } from './BranchStaffDisplay';

interface BranchMobileCardProps {
  branch: Branch;
  canManage: boolean;
  onEdit: (branch: Branch) => void;
  onDelete: (id: string) => void;
}

export const BranchMobileCard: React.FC<BranchMobileCardProps> = ({
  branch,
  canManage,
  onEdit,
  onDelete
}) => {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-3">
        <div className="space-y-2">
          {/* 標題列 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Building2 className="h-4 w-4 mr-2 text-gray-500" />
              <span className="font-medium text-sm">{branch.name}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Badge className={`text-xs ${getBranchTypeColor(branch.type)}`}>
                {getBranchTypeLabel(branch.type)}
              </Badge>
              <Badge variant={branch.is_active ? "default" : "secondary"} className="text-xs">
                {branch.is_active ? "營運中" : "暫停"}
              </Badge>
            </div>
          </div>

          {/* 代碼 */}
          <div className="text-xs text-gray-600">
            代碼: {branch.code}
          </div>

          {/* 地址 */}
          <div className="flex items-start text-xs">
            <MapPin className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0 text-gray-500" />
            <span className="break-words">{branch.address}</span>
          </div>

          {/* 電話 */}
          <div className="flex items-center text-xs">
            <Phone className="h-3 w-3 mr-1 flex-shrink-0 text-gray-500" />
            <span>{branch.phone}</span>
          </div>

          {/* 人員數量 */}
          <BranchStaffDisplay branchId={branch.id} mobile />

          {/* 負責人 */}
          {branch.manager_name && (
            <div className="flex items-center text-xs">
              <User className="h-3 w-3 mr-1 flex-shrink-0 text-gray-500" />
              <div>
                <span className="font-medium">{branch.manager_name}</span>
                {branch.manager_contact && (
                  <span className="text-gray-500 ml-1">({branch.manager_contact})</span>
                )}
              </div>
            </div>
          )}

          {/* 操作按鈕 */}
          {canManage && (
            <div className="flex gap-2 pt-1">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onEdit(branch)}
                className="flex-1 flex items-center justify-center text-xs h-7"
              >
                <Pencil className="h-3 w-3 mr-1" />
                編輯
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 text-red-500 hover:text-red-700 flex items-center justify-center text-xs h-7"
                onClick={() => onDelete(branch.id)}
              >
                <Trash2 className="h-3 w-3 mr-1" />
                刪除
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
