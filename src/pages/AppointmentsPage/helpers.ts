import { addDays, format,startOfWeek } from "date-fns";

export const getWeekDays = (baseDate: Date): Date[] =>
  Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(baseDate, { weekStartsOn: 1 }), i));

export const formatDateKey = (d: Date): string => format(d, "yyyy-MM-dd");
