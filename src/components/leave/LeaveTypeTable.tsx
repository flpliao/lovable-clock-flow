
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2 } from 'lucide-react';

interface LeaveType {
  id: string;
  code: string;
  name_zh: string;
  name_en: string;
  is_paid: boolean;
  annual_reset: boolean;
  max_days_per_year?: number;
  requires_attachment: boolean;
  is_system_default: boolean;
  is_active: boolean;
  sort_order: number;
  description?: string;
}

interface LeaveTypeTableProps {
  leaveTypes: LeaveType[];
  onEdit: (leaveType: LeaveType) => void;
  onDelete: (leaveType: LeaveType) => void;
}

export function LeaveTypeTable({ leaveTypes, onEdit, onDelete }: LeaveTypeTableProps) {
  return (
    <Card className="backdrop-blur-sm bg-white/80 border border-white/40 shadow-md rounded-xl overflow-hidden">
      <CardHeader className="bg-white/60 border-b border-white/30 pb-4">
        <CardTitle className="text-slate-800 text-xl font-bold">假別列表</CardTitle>
        <CardDescription className="text-slate-600 font-medium">管理系統中的所有請假類型</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {/* 添加水平滾動容器 */}
        <div className="w-full overflow-x-auto">
          <div className="min-w-full">
            <Table>
              <TableHeader>
                <TableRow className="border-white/30 hover:bg-white/20 transition-colors">
                  <TableHead className="text-slate-700 font-semibold text-sm py-3 px-4 min-w-[100px] whitespace-nowrap">假別代碼</TableHead>
                  <TableHead className="text-slate-700 font-semibold text-sm py-3 px-4 min-w-[120px] whitespace-nowrap">中文名稱</TableHead>
                  <TableHead className="text-slate-700 font-semibold text-sm py-3 px-4 min-w-[120px] whitespace-nowrap">英文名稱</TableHead>
                  <TableHead className="text-slate-700 font-semibold text-sm py-3 px-4 min-w-[80px] whitespace-nowrap">薪資</TableHead>
                  <TableHead className="text-slate-700 font-semibold text-sm py-3 px-4 min-w-[100px] whitespace-nowrap">年度重置</TableHead>
                  <TableHead className="text-slate-700 font-semibold text-sm py-3 px-4 min-w-[100px] whitespace-nowrap">最大天數</TableHead>
                  <TableHead className="text-slate-700 font-semibold text-sm py-3 px-4 min-w-[120px] whitespace-nowrap">狀態</TableHead>
                  <TableHead className="text-slate-700 font-semibold text-sm py-3 px-4 min-w-[100px] whitespace-nowrap">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaveTypes.map((leaveType) => (
                  <TableRow 
                    key={leaveType.id} 
                    className="border-white/30 hover:bg-white/40 transition-all duration-200"
                  >
                    <TableCell className="py-3 px-4 whitespace-nowrap">
                      <code className="bg-slate-800/90 text-white px-2 py-1 rounded-lg text-sm font-mono shadow-sm">
                        {leaveType.code}
                      </code>
                    </TableCell>
                    <TableCell className="font-semibold text-slate-800 py-3 px-4 whitespace-nowrap">
                      <span className="truncate block max-w-[120px]" title={leaveType.name_zh}>
                        {leaveType.name_zh}
                      </span>
                    </TableCell>
                    <TableCell className="text-slate-700 font-medium py-3 px-4 whitespace-nowrap">
                      <span className="truncate block max-w-[120px]" title={leaveType.name_en}>
                        {leaveType.name_en}
                      </span>
                    </TableCell>
                    <TableCell className="py-3 px-4 whitespace-nowrap">
                      <Badge 
                        className={leaveType.is_paid 
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200 font-medium px-2 py-1 rounded-lg" 
                          : "bg-slate-100 text-slate-700 border border-slate-200 font-medium px-2 py-1 rounded-lg"
                        }
                      >
                        {leaveType.is_paid ? "有薪" : "無薪"}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3 px-4 whitespace-nowrap">
                      <Badge 
                        variant="outline" 
                        className={leaveType.annual_reset 
                          ? "border-blue-300 text-blue-800 bg-blue-50 font-medium px-2 py-1 rounded-lg" 
                          : "border-slate-300 text-slate-700 bg-slate-50 font-medium px-2 py-1 rounded-lg"
                        }
                      >
                        {leaveType.annual_reset ? "是" : "否"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-800 font-medium py-3 px-4 whitespace-nowrap">
                      {leaveType.max_days_per_year ? `${leaveType.max_days_per_year}天` : "無限制"}
                    </TableCell>
                    <TableCell className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 flex-nowrap">
                        <Badge 
                          className={leaveType.is_active 
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200 font-medium px-2 py-1 rounded-lg" 
                            : "bg-slate-100 text-slate-700 border border-slate-200 font-medium px-2 py-1 rounded-lg"
                          }
                        >
                          {leaveType.is_active ? "啟用" : "停用"}
                        </Badge>
                        {leaveType.is_system_default && (
                          <Badge 
                            variant="outline" 
                            className="text-violet-800 border-violet-300 bg-violet-50 font-medium px-2 py-1 rounded-lg flex-shrink-0"
                          >
                            系統預設
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 flex-nowrap">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => onEdit(leaveType)} 
                          className="hover:bg-blue-100 text-blue-700 hover:text-blue-800 rounded-lg border border-transparent hover:border-blue-200 transition-all duration-200 flex-shrink-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => onDelete(leaveType)} 
                          disabled={leaveType.is_system_default} 
                          className="hover:bg-red-100 text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg border border-transparent hover:border-red-200 transition-all duration-200 flex-shrink-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
