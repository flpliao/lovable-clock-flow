// 路由相關型別定義
import React from 'react';

export interface RouteConfig {
  path: string;
  name: string;
  component: React.ComponentType<unknown>;
  icon?: string;
  children?: RouteConfig[];
}

export interface RouteGroup {
  name: string;
  routes: RouteConfig[];
}

export interface ApiRouteConfig {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  description: string;
  requiresAuth?: boolean;
  roles?: string[];
}
