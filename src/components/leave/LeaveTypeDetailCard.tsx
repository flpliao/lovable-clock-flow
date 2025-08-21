import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PaidType } from '@/constants/leave';
import { LeaveType } from '@/types/leaveType';
import classNames from 'classnames';
import { AlertCircle, DollarSign, FileText } from 'lucide-react';

interface LeaveTypeDetailCardProps {
  leaveType: LeaveType;
}

export function LeaveTypeDetailCard({ leaveType }: LeaveTypeDetailCardProps) {
  return (
    <Card className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-lg">
      <CardHeader>
        <CardTitle className="text-white text-lg flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          {leaveType.name} - 詳細資訊
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 薪資狀況 */}
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-white/80" />
          <span className="text-white/80 text-sm">薪資狀況：</span>
          <Badge
            className={classNames('border-0', {
              'bg-yellow-500/20 text-yellow-700': leaveType.paid_type === PaidType.HALF,
              'bg-green-500/20 text-green-700': leaveType.paid_type === PaidType.PAID,
              'bg-red-500/20 text-red-700': leaveType.paid_type === PaidType.UNPAID,
            })}
          >
            {leaveType.paid_type === PaidType.HALF
              ? '半薪'
              : leaveType.paid_type === PaidType.PAID
                ? '有薪'
                : '無薪'}
          </Badge>
        </div>

        {/* 說明 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-white/80" />
            <span className="text-white/80 text-sm">說明：</span>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-white/90 text-sm leading-relaxed">{leaveType.description}</p>
          </div>
        </div>

        {/* 附件要求 */}
        {/* {leaveType.required_attachment && (
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-white/80" />
            <span className="text-white/80 text-sm">是否需要上傳附件：</span>
            <Badge className="bg-orange-500/20 text-orange-700 border-0">需要</Badge>
          </div>
        )} */}

        {/* 剩餘次數/天數 */}
        {/* <div className="flex items-center gap-2">
          <CalendarIcon2 className="h-4 w-4 text-white/80" />
          <span className="text-white/80 text-sm">剩餘次數：</span>
          <Badge className="bg-blue-500/20 text-blue-700 border-0">
            {leaveType.max_per_year ? `${leaveType.max_per_year} 天 (年度上限)` : '無限制'}
          </Badge>
        </div> */}
      </CardContent>
    </Card>
  );
}
