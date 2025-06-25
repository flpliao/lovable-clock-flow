
import React from 'react';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

interface ApplicationStatusBadgeProps {
  status: string;
}

const ApplicationStatusBadge: React.FC<ApplicationStatusBadgeProps> = ({ status }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-gray-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return '已核准';
      case 'rejected':
        return '已拒絕';
      case 'cancelled':
        return '已取消';
      default:
        return '審核中';
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  return (
    <>
      {getStatusIcon(status)}
      <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeClass(status)}`}>
        {getStatusText(status)}
      </div>
    </>
  );
};

export default ApplicationStatusBadge;
