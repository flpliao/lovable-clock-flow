
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';

const Overtime = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-purple-600 pt-32 md:pt-36">
      <div className="w-full px-4 sm:px-6 lg:px-8 pb-6">
        <div className="max-w-4xl mx-auto">
          <Card className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-white drop-shadow-md">
                加班申請
              </CardTitle>
              <CardDescription className="text-white/80 font-medium drop-shadow-sm">
                申請加班時數與補償
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center text-white">
              <p>加班申請功能開發中...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Overtime;
