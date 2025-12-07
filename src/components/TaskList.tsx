import { useState, useEffect } from 'react';
import { db } from '@/database/db';
import { taskService } from '@/services/TaskService';
import type { Task, TaskFilters, SortOption } from '@/types';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';
import Filters from './Filters';
import { Plus, Loader2 } from 'lucide-react';

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filters, setFilters] = useState<TaskFilters>({ status: 'active' });
  const [sortOption, setSortOption] = useState<SortOption>('created_desc');

  useEffect(() => {
    initializeApp();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [tasks, filters, sortOption]);

  const initializeApp = async () => {
    try {
      await db.init();
      await loadTasks();
    } catch (error) {
      console.error('Ошибка инициализации:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTasks = async () => {
    try {
      const allTasks = await taskService.getAllTasks();
      setTasks(allTasks);
    } catch (error) {
      console.error('Ошибка загрузки задач:', error);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = taskService.filterTasks(tasks, filters);
    filtered = taskService.sortTasks(filtered, sortOption);
    setFilteredTasks(filtered);
  };

  const handleCreateTask = async (taskData: Omit<Task, 'id'>) => {
    try {
      await taskService.createTask(
        taskData.title,
        taskData.description,
        taskData.deadline || undefined,
        taskData.priority,
        taskData.category
      );
      await loadTasks();
      setShowForm(false);
    } catch (error) {
      console.error('Ошибка создания задачи:', error);
    }
  };

  const handleUpdateTask = async (task: Task | Omit<Task, 'id'>) => {
    try {
      if ('id' in task) {
        await taskService.updateTask(task as Task);
        await loadTasks();
        setEditingTask(null);
      }
    } catch (error) {
      console.error('Ошибка обновления задачи:', error);
    }
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      await taskService.toggleComplete(task);
      await loadTasks();
    } catch (error) {
      console.error('Ошибка изменения статуса:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Вы уверены, что хотите удалить эту задачу?')) {
      try {
        await taskService.deleteTask(id);
        await loadTasks();
      } catch (error) {
        console.error('Ошибка удаления задачи:', error);
      }
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const statistics = taskService.getStatistics(tasks);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary-600" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Мои задачи
            </h1>
            <button
              onClick={() => {
                setEditingTask(null);
                setShowForm(true);
              }}
              className="btn btn-primary flex items-center gap-2"
            >
              <Plus size={20} />
              Новая задача
            </button>
          </div>
          <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span>Всего: <strong>{statistics.all}</strong></span>
            <span>Активных: <strong>{statistics.active}</strong></span>
            <span>Выполнено: <strong>{statistics.completed}</strong></span>
            {statistics.deleted > 0 && (
              <span>Удалено: <strong>{statistics.deleted}</strong></span>
            )}
          </div>
        </div>

        <div className="mb-6">
          <Filters
            filters={filters}
            onFiltersChange={setFilters}
            sortOption={sortOption}
            onSortChange={setSortOption}
          />
        </div>

        {showForm && (
          <div className="mb-6">
            <TaskForm
              task={editingTask}
              onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
              onCancel={() => {
                setShowForm(false);
                setEditingTask(null);
              }}
            />
          </div>
        )}

        <div>
          {filteredTasks.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                {tasks.length === 0
                  ? 'У вас пока нет задач. Создайте первую задачу!'
                  : 'Задачи не найдены по заданным фильтрам.'}
              </p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleComplete={handleToggleComplete}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

