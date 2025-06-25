
import React from 'react';
import { Clock, Calendar, User, FileText } from 'lucide-react';

interface ApplicationTypeIconProps {
  type: string;
}

const ApplicationTypeIcon: React.FC<ApplicationTypeIconProps> = ({ type }) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'overtime':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'missed_checkin':
        return <Calendar className="h-4 w-4 text-purple-500" />;
      case 'leave':
        return <User className="h-4 w-4 text-green-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'overtime':
        return '加班申請';
      case 'missed_checkin':
        return '忘記打卡';
      case 'leave':
        return '請假申請';
      default:
        return '申請';
    }
  };

  return (
    <>
      {getTypeIcon(type)}
      <h4 className="text-lg font-semibold text-white">{getTypeText(type)}</h4>
    </>
  );
};

export default ApplicationTypeIcon;
