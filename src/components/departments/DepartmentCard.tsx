
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building, MapPin, Users, Edit, Trash, Navigation } from 'lucide-react';
import { Department } from './types';
import DepartmentGPSStatus from './DepartmentGPSStatus';

interface DepartmentCardProps {
  department: Department;
  canManage: boolean;
  onEdit: (department: Department) => void;
  onDelete: (id: string) => void;
  checkInDistanceLimit: number;
}

const DepartmentCard: React.FC<DepartmentCardProps> = ({
  department,
  canManage,
  onEdit,
  onDelete,
  checkInDistanceLimit
}) => {
  return (
    <Card className="backdrop-blur-xl bg-white/25 border border-white/30 shadow-lg hover:bg-white/30 transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/80 rounded-lg shadow-sm">
              <Building className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{department.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs bg-blue-100/60 text-blue-800">
                  {department.type}
                </Badge>
                <span className="flex items-center gap-1 text-gray-600 text-xs">
                  <Users className="h-3 w-3" />
                  {department.staff_count}
                </span>
              </div>
            </div>
          </div>
          {canManage && (
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(department)}
                className="h-8 w-8 p-0 text-gray-600 hover:text-gray-900 hover:bg-white/50"
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(department.id)}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50/50"
              >
                <Trash className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>

        {department.location && (
          <div className="flex items-start gap-2 mb-3">
            <MapPin className="h-3 w-3 text-gray-500 mt-0.5 flex-shrink-0" />
            <span className="text-xs text-gray-700 line-clamp-2">{department.location}</span>
          </div>
        )}

        <div className="flex items-center justify-between bg-white/40 rounded-lg p-2">
          <div className="flex items-center gap-2">
            <DepartmentGPSStatus department={department} />
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <Navigation className="h-3 w-3" />
              <span>{checkInDistanceLimit}m</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DepartmentCard;
