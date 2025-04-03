
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from '@/components/ui/calendar';
import { ChevronLeft } from 'lucide-react';
import { format } from 'date-fns';
import Header from '@/components/Header';

const PersonalAttendance = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto py-6 px-4">
        <div className="flex flex-col gap-6">
          {/* Header with back button */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate('/')}
              className="text-gray-500 hover:text-gray-700"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
            <h1 className="text-3xl font-bold text-gray-800">個人出勤</h1>
          </div>
          
          {/* Calendar Card */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="mx-auto"
              // Customize caption to show only month and year
              captionLayout="buttons"
              formatters={{
                formatCaption: (date, options) => {
                  return format(date, 'MMMM yyyy');
                },
              }}
            />
          </div>
          
          {/* Attendance Records - can be expanded in the future */}
          <div className="bg-white rounded-lg shadow-sm p-6 mt-4">
            <h2 className="text-xl font-semibold mb-4">出勤記錄</h2>
            <p className="text-gray-600">選擇日期查看詳細出勤記錄</p>
            
            {date && (
              <div className="mt-4 border-t pt-4">
                <p className="font-medium">{format(date, 'yyyy年MM月dd日')}</p>
                {/* This can be expanded to show actual attendance data */}
                <div className="mt-2 text-gray-700">
                  <p>上班時間: 9:00</p>
                  <p>下班時間: 18:00</p>
                  <p>狀態: 正常</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalAttendance;
