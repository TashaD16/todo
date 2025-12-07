import { Check, Edit2, Trash2, Clock } from 'lucide-react';
import type { Task, Priority } from '@/types';
import { formatDate, getDeadlineStatus } from '@/utils/dateUtils';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

const priorityColors: Record<Priority, string> = {
  high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
};

const priorityIcons: Record<Priority, string> = {
  high: '🔴',
  medium: '🟡',
  low: '🟢',
};

export default function TaskItem({ task, onToggleComplete, onEdit, onDelete }: TaskItemProps) {
  const deadlineStatus = getDeadlineStatus(task.deadline);
  const isCompleted = task.status === 'completed';

  const deadlineStatusClasses = {
    overdue: 'text-red-600 dark:text-red-400',
    today: 'text-orange-600 dark:text-orange-400',
    tomorrow: 'text-yellow-600 dark:text-yellow-400',
    upcoming: 'text-gray-600 dark:text-gray-400',
  };

  return (
    <div
      className={`card mb-3 transition-all duration-200 ${
        isCompleted ? 'opacity-60' : ''
      } ${task.is_deleted ? 'border-l-4 border-red-500' : ''}`}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={() => onToggleComplete(task)}
          className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
            isCompleted
              ? 'bg-primary-600 border-primary-600 text-white'
              : 'border-gray-300 hover:border-primary-500'
          }`}
        >
          {isCompleted && <Check size={16} />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3
              className={`font-semibold text-lg ${
                isCompleted ? 'line-through text-gray-500' : ''
              }`}
            >
              {task.title}
            </h3>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${priorityColors[task.priority]}`}
                title={`Приоритет: ${task.priority}`}
              >
                {priorityIcons[task.priority]}
              </span>
            </div>
          </div>

          {task.description && (
            <p className={`mt-2 text-gray-600 dark:text-gray-400 ${isCompleted ? 'line-through' : ''}`}>
              {task.description}
            </p>
          )}

          <div className="mt-3 flex items-center gap-4 flex-wrap text-sm text-gray-500 dark:text-gray-400">
            {task.category && (
              <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">
                {task.category}
              </span>
            )}
            {task.deadline && (
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span className={deadlineStatus ? deadlineStatusClasses[deadlineStatus] : ''}>
                  {formatDate(task.deadline)}
                  {deadlineStatus === 'overdue' && !isCompleted && ' (просрочено)'}
                  {deadlineStatus === 'today' && ' (сегодня)'}
                  {deadlineStatus === 'tomorrow' && ' (завтра)'}
                </span>
              </div>
            )}
            {task.completed_at && (
              <span className="text-green-600 dark:text-green-400">
                Выполнено: {formatDate(task.completed_at)}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {!task.is_deleted && (
            <>
              <button
                onClick={() => onEdit(task)}
                className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900 rounded transition-colors"
                title="Редактировать"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded transition-colors"
                title="Удалить"
              >
                <Trash2 size={18} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

