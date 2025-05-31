
export const getBranchTypeLabel = (type: string) => {
  switch (type) {
    case 'headquarters':
      return '總公司';
    case 'branch':
      return '分公司';
    case 'store':
      return '門市';
    default:
      return type;
  }
};

export const getBranchTypeColor = (type: string) => {
  switch (type) {
    case 'headquarters':
      return 'bg-blue-100 text-blue-800';
    case 'branch':
      return 'bg-green-100 text-green-800';
    case 'store':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
