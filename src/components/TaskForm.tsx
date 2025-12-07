import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Task, Priority } from '@/types';

interface TaskFormProps {
  task?: Task | null;
  onSubmit: (task: Task | Omit<Task, 'id'>) => void;
  onCancel: () => void;
}

export default function TaskForm({ task, onSubmit, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setDeadline(task.deadline ? task.deadline.split('T')[0] : '');
      setPriority(task.priority);
      setCategory(task.category || '');
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const deadlineISO = deadline ? new Date(deadline).toISOString() : undefined;

    if (task) {
      onSubmit({
        ...task,
        title: title.trim(),
        description: description.trim() || undefined,
        deadline: deadlineISO || null,
        priority,
        category: category.trim() || undefined,
      });
    } else {
      onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        deadline: deadlineISO || null,
        priority,
        category: category.trim() || undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        completed_at: null,
        status: 'active',
        is_deleted: false,
        deleted_at: null,
      });
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">
          {task ? 'Редактировать задачу' : 'Новая задача'}
        </h2>
        <button
          onClick={onCancel}
          className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Заголовок <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input"
            placeholder="Введите заголовок задачи"
            required
            autoFocus
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Описание</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input min-h-[100px] resize-none"
            placeholder="Введите описание задачи (необязательно)"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Дедлайн</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="input"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Приоритет</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="input"
            >
              <option value="low">Низкий</option>
              <option value="medium">Средний</option>
              <option value="high">Высокий</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Категория</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input"
            placeholder="Введите категорию (необязательно)"
          />
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
          >
            Отмена
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!title.trim()}
          >
            {task ? 'Сохранить' : 'Создать'}
          </button>
        </div>
      </form>
    </div>
  );
}

