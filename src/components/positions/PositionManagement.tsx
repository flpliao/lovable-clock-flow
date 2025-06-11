
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PositionManagementProvider } from './PositionManagementContext';
import PositionTable from './PositionTable';
import AddPositionDialog from './AddPositionDialog';
import EditPositionDialog from './EditPositionDialog';
import PositionFilters from './PositionFilters';

const PositionManagement = () => {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 relative overflow-hidden mobile-fullscreen pt-20 md:pt-24">
      {/* 動態背景漸層 */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/80 via-blue-500/60 to-purple-600/80"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-400/20 via-transparent to-transparent"></div>
      
      {/* 浮動光點效果 */}
      <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-white/30 rounded-full animate-pulse"></div>
      <div className="absolute top-3/5 right-1/3 w-2 h-2 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-2/3 w-1 h-1 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: '4s' }}></div>
      <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-blue-200/40 rounded-full animate-pulse" style={{ animationDelay: '6s' }}></div>

      <div className="relative z-10 pt-16 md:pt-20">
        <PositionManagementProvider>
          <div className="space-y-6 p-6">
            <Card className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg text-white font-bold drop-shadow-sm">職位管理</CardTitle>
                <AddPositionDialog />
              </CardHeader>
              <CardContent className="pt-0">
                <PositionFilters />
                <PositionTable />
              </CardContent>
            </Card>

            <EditPositionDialog />
          </div>
        </PositionManagementProvider>
      </div>
    </div>
  );
};

export default PositionManagement;
