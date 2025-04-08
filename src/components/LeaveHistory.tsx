
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LeaveRequest } from '@/types';
import { useLeaveHistory } from '@/hooks/useLeaveHistory';
import { LeaveHistoryItem } from '@/components/leave/LeaveHistoryItem';

interface LeaveHistoryProps {
  onClick?: (leave: LeaveRequest) => void;
}

const LeaveHistory: React.FC<LeaveHistoryProps> = ({ onClick }) => {
  const { leaveHistory, isLoading } = useLeaveHistory();
  
  const handleClick = (leave: LeaveRequest) => {
    if (onClick) {
      onClick(leave);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">請假記錄</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <p className="text-muted-foreground">載入中...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {leaveHistory.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">尚無請假記錄</p>
            ) : (
              leaveHistory.map((leave) => (
                <LeaveHistoryItem 
                  key={leave.id} 
                  leave={leave}
                  onClick={handleClick} 
                />
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LeaveHistory;
