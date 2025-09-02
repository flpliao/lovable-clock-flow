import ProtectedRoute from '@/components/common/ProtectedRoute';
import Header from '@/components/layouts/Header';
import Sidebar from '@/components/layouts/Sidebar';
import { protectedRoutes, publicRoutes } from '@/routes/routes';
import React from 'react';
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
    <Routes>
      {/* 主要頁面路由 - 使用 DashboardLayout */}
      <Route
        path="/"
        element={
          <ProtectedRoute route={protectedRoutes[0]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {protectedRoutes.map((route, id) => (
          <Route
            path={route.path}
            element={<ProtectedRoute route={route}>{<route.component />}</ProtectedRoute>}
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
  );
};

export default AppRoutes;
