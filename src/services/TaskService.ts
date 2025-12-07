import { db } from '@/database/db';
import type { Task, TaskFilters, SortOption, Priority } from '@/types';

export class TaskService {
  async getAllTasks(): Promise<Task[]> {
    return await db.getAllTasks();
  }

  async getTask(id: number): Promise<Task | undefined> {
    return await db.getTask(id);
  }

  async createTask(
    title: string,
    description?: string,
    deadline?: string,
    priority: Priority = 'medium',
    category?: string
  ): Promise<Task> {
    const now = new Date().toISOString();
    const newTask: Omit<Task, 'id'> = {
      title,
      description,
      created_at: now,
      updated_at: now,
      completed_at: null,
      deadline: deadline || null,
      priority,
      category,
      status: 'active',
      is_deleted: false,
      deleted_at: null,
    };

    const id = await db.addTask(newTask);
    return { ...newTask, id };
  }

  async updateTask(task: Task): Promise<Task> {
    const updatedTask: Task = {
      ...task,
      updated_at: new Date().toISOString(),
    };
    await db.updateTask(updatedTask);
    return updatedTask;
  }

  async toggleComplete(task: Task): Promise<Task> {
    const isCompleted = task.status === 'completed';
    const updatedTask: Task = {
      ...task,
      status: isCompleted ? 'active' : 'completed',
      completed_at: isCompleted ? null : new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    await db.updateTask(updatedTask);
    return updatedTask;
  }

  async deleteTask(id: number, permanent: boolean = false): Promise<void> {
    if (permanent) {
      await db.deleteTask(id);
    } else {
      const task = await db.getTask(id);
      if (task) {
        const updatedTask: Task = {
          ...task,
          status: 'deleted',
          is_deleted: true,
          deleted_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        await db.updateTask(updatedTask);
      }
    }
  }

  async restoreTask(id: number): Promise<Task | undefined> {
    const task = await db.getTask(id);
    if (task && task.is_deleted) {
      const updatedTask: Task = {
        ...task,
        status: 'active',
        is_deleted: false,
        deleted_at: null,
        updated_at: new Date().toISOString(),
      };
      await db.updateTask(updatedTask);
      return updatedTask;
    }
    return undefined;
  }

  filterTasks(tasks: Task[], filters: TaskFilters): Task[] {
    return tasks.filter((task) => {
      // Фильтр по статусу
      if (filters.status && filters.status !== 'all') {
        if (task.status !== filters.status) return false;
      } else if (!filters.status || filters.status === 'all') {
        // По умолчанию скрываем удаленные задачи
        if (task.is_deleted) return false;
      }

      // Фильтр по приоритету
      if (filters.priority && filters.priority !== 'all') {
        if (task.priority !== filters.priority) return false;
      }

      // Фильтр по категории
      if (filters.category && filters.category !== 'all') {
        if (task.category !== filters.category) return false;
      }

      // Поиск по тексту
      if (filters.search && filters.search.trim()) {
        const searchLower = filters.search.toLowerCase().trim();
        const matchesTitle = task.title.toLowerCase().includes(searchLower);
        const matchesDescription = task.description?.toLowerCase().includes(searchLower);
        if (!matchesTitle && !matchesDescription) return false;
      }

      return true;
    });
  }

  sortTasks(tasks: Task[], sortOption: SortOption): Task[] {
    const sorted = [...tasks];

    switch (sortOption) {
      case 'created_desc':
        return sorted.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      case 'created_asc':
        return sorted.sort((a, b) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      case 'deadline_asc':
        return sorted.sort((a, b) => {
          if (!a.deadline && !b.deadline) return 0;
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        });
      case 'deadline_desc':
        return sorted.sort((a, b) => {
          if (!a.deadline && !b.deadline) return 0;
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return new Date(b.deadline).getTime() - new Date(a.deadline).getTime();
        });
      case 'priority_desc':
        const priorityOrder: Record<Priority, number> = { high: 3, medium: 2, low: 1 };
        return sorted.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
      case 'priority_asc':
        const priorityOrderAsc: Record<Priority, number> = { high: 3, medium: 2, low: 1 };
        return sorted.sort((a, b) => priorityOrderAsc[a.priority] - priorityOrderAsc[b.priority]);
      case 'title_asc':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'title_desc':
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      case 'completed_desc':
        return sorted.sort((a, b) => {
          if (!a.completed_at && !b.completed_at) return 0;
          if (!a.completed_at) return 1;
          if (!b.completed_at) return -1;
          return new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime();
        });
      case 'completed_asc':
        return sorted.sort((a, b) => {
          if (!a.completed_at && !b.completed_at) return 0;
          if (!a.completed_at) return -1;
          if (!b.completed_at) return 1;
          return new Date(a.completed_at).getTime() - new Date(b.completed_at).getTime();
        });
      default:
        return sorted;
    }
  }

  getStatistics(tasks: Task[]) {
    const all = tasks.filter(t => !t.is_deleted).length;
    const active = tasks.filter(t => t.status === 'active' && !t.is_deleted).length;
    const completed = tasks.filter(t => t.status === 'completed' && !t.is_deleted).length;
    const deleted = tasks.filter(t => t.is_deleted).length;

    return { all, active, completed, deleted };
  }
}

export const taskService = new TaskService();

