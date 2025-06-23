
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getLeaveTypeById } from '@/utils/leaveTypes';
import { AlertCircle, FileText, Calendar, DollarSign } from 'lucide-react';

interface LeaveTypeDetailCardProps {
  leaveType: string;
  remainingDays?: number;
}

export function LeaveTypeDetailCard({ leaveType, remainingDays }: LeaveTypeDetailCardProps) {
  const typeInfo = getLeaveTypeById(leaveType);
  
  if (!typeInfo) {
    return null;
  }

  const getSalaryStatus = () => {
    if (leaveType === 'sick') {
      return { status: '半薪', color: 'bg-yellow-500/20 text-yellow-700' };
    }
    return typeInfo.isPaid 
      ? { status: '有薪', color: 'bg-green-500/20 text-green-700' }
      : { status: '無薪', color: 'bg-red-500/20 text-red-700' };
  };

  const salaryInfo = getSalaryStatus();

  return (
    <Card className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-lg">
      <CardHeader>
        <CardTitle className="text-white text-lg flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          {typeInfo.name} - 詳細資訊
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 薪資狀況 */}
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-white/80" />
          <span className="text-white/80 text-sm">薪資狀況：</span>
          <Badge className={`${salaryInfo.color} border-0`}>
            {salaryInfo.status}
          </Badge>
        </div>

        {/* 說明 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-white/80" />
            <span className="text-white/80 text-sm">說明：</span>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-white/90 text-sm leading-relaxed">
              {typeInfo.description}
            </p>
          </div>
        </div>

        {/* 附件要求 */}
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-white/80" />
          <span className="text-white/80 text-sm">是否需要上傳附件：</span>
          <Badge className={typeInfo.requiresAttachment 
            ? 'bg-orange-500/20 text-orange-700 border-0' 
            : 'bg-gray-500/20 text-gray-700 border-0'
          }>
            {typeInfo.requiresAttachment ? '需要' : '不需要'}
          </Badge>
        </div>

        {/* 剩餘次數/天數 */}
        {(remainingDays !== undefined || typeInfo.maxDaysPerYear) && (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-white/80" />
            <span className="text-white/80 text-sm">剩餘次數：</span>
            <Badge className="bg-blue-500/20 text-blue-700 border-0">
              {remainingDays !== undefined 
                ? `${remainingDays} 天` 
                : typeInfo.maxDaysPerYear 
                  ? `年度上限 ${typeInfo.maxDaysPerYear} 天`
                  : '無限制'
              }
            </Badge>
          </div>
        )}

        {/* 特殊提醒 */}
        {leaveType === 'sick' && (
          <div className="bg-yellow-500/10 border border-yellow-300/30 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-300 mt-0.5" />
              <div className="text-yellow-100 text-sm">
                <p className="font-medium">重要提醒：</p>
                <p>病假前30天給半薪，超過30天後視情況可申請留職停薪</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
