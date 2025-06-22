
import React from 'react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-purple-600 pt-32 md:pt-36">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-4xl font-bold text-white mb-4">歡迎使用人事管理系統</h1>
            <p className="text-white/80 text-lg">請使用上方選單進行各項操作</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
