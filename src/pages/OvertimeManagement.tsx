
import React from 'react';
import { useUser } from '@/contexts/UserContext';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Plus, History, Timer, Calendar, FileText } from 'lucide-react';
import OvertimeRequestForm from '@/components/overtime/OvertimeRequestForm';
import OvertimeHistory from '@/components/overtime/OvertimeHistory';

const OvertimeManagement = () => {
  const { currentUser } = useUser();
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-purple-600 relative overflow-hidden">
      {/* 動態浮動元素 */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/60 rounded-full animate-float"></div>
      <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-purple-400/40 rounded-full animate-float"></div>
      <div className="absolute top-1/2 left-3/4 w-1 h-1 bg-white/30 rounded-full animate-float"></div>
      
      <div className="relative z-10 p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* 頁面標題卡片 */}
          <div className="backdrop-blur-2xl bg-white/20 border border-white/30 rounded-3xl shadow-2xl p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-xl border border-white/30 shadow-lg">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">加班管理</h1>
                  <p className="text-white/80 text-lg font-medium drop-shadow-md">申請加班、查詢加班記錄</p>
                </div>
              </div>
              <div className="hidden md:flex items-center space-x-3">
                <div className="p-3 bg-blue-500/80 rounded-xl shadow-lg backdrop-blur-xl border border-blue-400/50">
                  <Timer className="h-6 w-6 text-white" />
                </div>
                <div className="p-3 bg-green-500/80 rounded-xl shadow-lg backdrop-blur-xl border border-green-400/50">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* 功能導航卡片 */}
          <div className="backdrop-blur-2xl bg-white/20 border border-white/30 rounded-3xl shadow-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-500/80 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white drop-shadow-md">加班功能</h2>
            </div>

            <Tabs defaultValue="request" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/30 backdrop-blur-xl rounded-2xl border border-white/40 p-1 shadow-lg h-14">
                <TabsTrigger 
                  value="request" 
                  className="text-white/90 data-[state=active]:bg-white/50 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-semibold transition-all duration-300 py-3 px-6 text-base data-[state=active]:backdrop-blur-xl flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">申請加班</span>
                  <span className="sm:hidden">申請</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="history"
                  className="text-white/90 data-[state=active]:bg-white/50 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-semibold transition-all duration-300 py-3 px-6 text-base data-[state=active]:backdrop-blur-xl flex items-center gap-2"
                >
                  <History className="h-4 w-4" />
                  <span className="hidden sm:inline">加班記錄</span>
                  <span className="sm:hidden">記錄</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="request" className="mt-8">
                <OvertimeRequestForm />
              </TabsContent>
              
              <TabsContent value="history" className="mt-8">
                <OvertimeHistory />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OvertimeManagement;
