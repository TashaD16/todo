import { format, formatDistanceToNow, isPast, isToday, isTomorrow } from 'date-fns';

export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return '';
  try {
    return format(new Date(dateString), 'dd.MM.yyyy');
  } catch {
    return '';
  }
};

export const formatDateTime = (dateString: string | null | undefined): string => {
  if (!dateString) return '';
  try {
    return format(new Date(dateString), 'dd.MM.yyyy HH:mm');
  } catch {
    return '';
  }
};

export const formatRelativeTime = (dateString: string | null | undefined): string => {
  if (!dateString) return '';
  try {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  } catch {
    return '';
  }
};

export const getDeadlineStatus = (deadline: string | null | undefined): 'overdue' | 'today' | 'tomorrow' | 'upcoming' | null => {
  if (!deadline) return null;
  try {
    const deadlineDate = new Date(deadline);
    if (isPast(deadlineDate) && !isToday(deadlineDate)) return 'overdue';
    if (isToday(deadlineDate)) return 'today';
    if (isTomorrow(deadlineDate)) return 'tomorrow';
    return 'upcoming';
  } catch {
    return null;
  }
};

