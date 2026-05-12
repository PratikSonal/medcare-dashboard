export const getWeekDays = (baseDate: Date): Date[] => {
  const days: Date[] = [];
  const start = new Date(baseDate);
  start.setDate(start.getDate() - start.getDay() + 1);
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push(d);
  }
  return days;
};

export const formatDateKey = (d: Date): string => d.toISOString().split('T')[0];
