export type Priority = 'low' | 'medium' | 'high';
export type TaskStatus = 'active' | 'completed' | 'deleted';

export interface Task {
  id: number;
  title: string;
  description?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string | null;
  deadline?: string | null;
  priority: Priority;
  category?: string;
  status: TaskStatus;
  is_deleted: boolean;
  deleted_at?: string | null;
}

export interface Category {
  id: number;
  name: string;
  color?: string;
  created_at: string;
}

export interface TaskFilters {
  status?: TaskStatus | 'all';
  priority?: Priority | 'all';
  category?: string | 'all';
  search?: string;
}

export type SortOption = 
  | 'created_desc'
  | 'created_asc'
  | 'deadline_asc'
  | 'deadline_desc'
  | 'priority_desc'
  | 'priority_asc'
  | 'title_asc'
  | 'title_desc'
  | 'completed_desc'
  | 'completed_asc';

