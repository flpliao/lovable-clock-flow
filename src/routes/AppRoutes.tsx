import ProtectedRoute from '@/components/common/ProtectedRoute';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { protectedRoutes, publicRoutes } from '@/routes/routes';
import React, { Suspense } from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';

// 佈局組件定義
const DashboardLayout: React.FC = () => {
  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />
      <Outlet />
    </div>
  );
};

const AuthLayout: React.FC = () => {
  return (
    <>
      <Outlet />
    </>
  );
};

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<div>載入中...</div>}>
      <Routes>
        {/* 主要頁面路由 - 使用 DashboardLayout */}
        <Route path="/" element={<DashboardLayout />}>
          {protectedRoutes.map((route, id) => (
            <Route
              path={route.path}
              element={<ProtectedRoute>{<route.component />}</ProtectedRoute>}
              key={id}
            />
          ))}
        </Route>

        {/* 認證路由 - 使用 AuthLayout */}
        <Route path="/" element={<AuthLayout />}>
          {publicRoutes.map((route, id) => (
            <Route path={route.path} element={<route.component />} key={id} />
          ))}
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
