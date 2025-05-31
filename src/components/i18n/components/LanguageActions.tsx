
import React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Save, RefreshCw } from 'lucide-react';

interface LanguageActionsProps {
  onSave: () => void;
  onReset: () => void;
  isLoading: boolean;
  hasChanges: boolean;
}

export const LanguageActions: React.FC<LanguageActionsProps> = ({
  onSave,
  onReset,
  isLoading,
  hasChanges
}) => {
  return (
    <>
      <div className="flex gap-2 pt-1">
        <Button
          onClick={onSave}
          disabled={isLoading || !hasChanges}
          className="flex-1 bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              儲存中...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              儲存設定
            </>
          )}
        </Button>
        
        <Button
          variant="outline"
          onClick={onReset}
          disabled={isLoading}
          className="px-4"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          重置
        </Button>
      </div>

      {hasChanges && (
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertDescription className="text-sm text-yellow-800">
            您有未儲存的變更，請記得點擊「儲存設定」。
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};
