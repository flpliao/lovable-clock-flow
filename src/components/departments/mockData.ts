
import { Department } from './types';

export const mockDepartments: Department[] = [
  {
    id: '1',
    name: '總部人資部',
    type: 'department',
    location: '台北市信義區',
    managerName: '王經理',
    managerContact: '0912-345-678',
    staffCount: 8
  },
  {
    id: '2',
    name: '技術部',
    type: 'department',
    location: '台北市信義區',
    managerName: '張資訊長',
    managerContact: '0923-456-789',
    staffCount: 15
  },
  {
    id: '3',
    name: '信義區門市',
    type: 'store',
    location: '台北市信義區忠孝東路',
    managerName: '陳店長',
    managerContact: '0934-567-890',
    staffCount: 10
  },
  {
    id: '4',
    name: '西門門市',
    type: 'store',
    location: '台北市萬華區西門町',
    managerName: '林店長',
    managerContact: '0945-678-901',
    staffCount: 12
  },
  {
    id: '5',
    name: '行銷部',
    type: 'department',
    location: '台北市信義區',
    managerName: '黃經理',
    managerContact: '0956-789-012',
    staffCount: 6
  }
];
