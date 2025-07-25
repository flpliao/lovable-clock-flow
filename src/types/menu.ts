import { RouteConfig } from '@/routes';
import React from 'react';

// 擴展 RouteConfig，加入 icon 元件
export interface MenuItemWithIcon extends RouteConfig {
  iconComponent?: React.ComponentType<React.PropsWithChildren<Record<string, unknown>>>;
}
