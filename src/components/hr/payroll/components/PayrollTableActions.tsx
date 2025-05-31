
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Check, X, DollarSign, Clock } from 'lucide-react';

interface PayrollTableActionsProps {
  payroll: any;
  isMobile?: boolean;
  onEdit: (payroll: any) => void;
  onDelete: (id: string) => void;
  onOpenApprovalDialog: (payroll: any) => void;
  onOpenPaymentDialog: (payroll: any) => void;
}

const PayrollTableActions: React.FC<PayrollTableActionsProps> = ({
  payroll,
  isMobile = false,
  onEdit,
  onDelete,
  onOpenApprovalDialog,
  onOpenPaymentDialog
}) => {
  const buttonSize = isMobile ? "sm" : "sm";
  const iconSize = isMobile ? "h-3 w-3" : "h-4 w-4";
  const textClass = isMobile ? "text-xs" : "";

  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size={buttonSize} 
        className={`${isMobile ? 'flex-1' : ''} ${textClass}`}
        onClick={() => onEdit(payroll)}
      >
        <Edit className={`${iconSize} ${isMobile ? 'mr-1' : ''}`} />
        {isMobile && '編輯'}
      </Button>
      
      {payroll.status === 'calculated' && (
        <Button 
          size={buttonSize} 
          className={`${textClass} bg-blue-600 hover:bg-blue-700`}
          onClick={() => onOpenApprovalDialog(payroll)}
        >
          <Clock className={`${iconSize} ${isMobile ? 'mr-1' : ''}`} />
          {isMobile && '核准'}
        </Button>
      )}
      
      {payroll.status === 'approved' && (
        <Button 
          size={buttonSize} 
          className={`${textClass} bg-green-600 hover:bg-green-700`}
          onClick={() => onOpenPaymentDialog(payroll)}
        >
          <DollarSign className={`${iconSize} ${isMobile ? 'mr-1' : ''}`} />
          {isMobile && '發放'}
        </Button>
      )}
      
      <Button 
        variant="outline" 
        size={buttonSize} 
        className={`text-red-600 ${textClass}`} 
        onClick={() => onDelete(payroll.id)}
      >
        <Trash2 className={iconSize} />
      </Button>
    </div>
  );
};

export default PayrollTableActions;
