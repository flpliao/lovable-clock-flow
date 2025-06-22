
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Home as HomeIcon } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-purple-600 pt-32 md:pt-36">
      <div className="w-full px-4 sm:px-6 lg:px-8 pb-6">
        <div className="max-w-4xl mx-auto">
          <Card className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                <HomeIcon className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-white drop-shadow-md">
                人事管理系統
              </CardTitle>
              <CardDescription className="text-white/80 font-medium drop-shadow-sm">
                歡迎使用企業人事管理系統
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center text-white">
              <p>請使用頂部選單導航到不同功能模組</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
