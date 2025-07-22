import ProtectedRouteOld from '@/components/common/ProtectedRouteOld';
import Header from '@/components/Header';
import { Toaster } from '@/components/ui/toaster';
import { LeaveManagementProvider } from '@/contexts/LeaveManagementContext';
import { useAutoInitAuth } from '@/hooks/useStores';
import { notFoundRoute, protectedRoutesOld, publicRoutes } from '@/routes/routes';
import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useAutoInitAuth();
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <AuthInitializer>
        <LeaveManagementProvider>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <Routes>
              {/* 公開路由自動渲染 */}
              {publicRoutes.map(route => (
                <Route key={route.path} path={route.path} element={<route.component />} />
              ))}
              {/* {protectedRoutes.map(route => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    <ProtectedRoute>
                      <route.component />
                    </ProtectedRoute>
                  }
                />
              ))} */}
              {/* 受保護路由自動渲染 */}
              {protectedRoutesOld.map(route => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    <ProtectedRouteOld>
                      <route.component />
                    </ProtectedRouteOld>
                  }
                />
              ))}
              {/* 404 */}
              <Route path={notFoundRoute.path} element={<notFoundRoute.component />} />
            </Routes>
            <Toaster />
          </div>
        </LeaveManagementProvider>
      </AuthInitializer>
    </Router>
  );
}

export default App;
