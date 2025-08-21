
// Date formatting utility functions
export const formatDateRange = (startDate: string, endDate: string): string => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const formatDate = (date: Date) => {
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };
  
  if (startDate === endDate) {
    return formatDate(start);
  }
  
  return `${formatDate(start)} - ${formatDate(end)}`;
};
