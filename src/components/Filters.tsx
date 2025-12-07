import { Search, Filter } from 'lucide-react';
import type { TaskFilters, SortOption } from '@/types';

interface FiltersProps {
  filters: TaskFilters;
  onFiltersChange: (filters: TaskFilters) => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export default function Filters({
  filters,
  onFiltersChange,
  sortOption,
  onSortChange,
}: FiltersProps) {
  const handleFilterChange = (key: keyof TaskFilters, value: string) => {
    if (key === 'search') {
      onFiltersChange({
        ...filters,
        [key]: value || undefined,
      });
    } else {
      onFiltersChange({
        ...filters,
        [key]: value === 'all' ? undefined : value,
      });
    }
  };

  return (
    <div className="card mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter size={20} />
        <h3 className="font-semibold">Фильтры и сортировка</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Поиск</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="input pl-10"
              placeholder="Поиск по заголовку и описанию..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Статус</label>
            <select
              value={filters.status || 'all'}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="input"
            >
              <option value="all">Все</option>
              <option value="active">Активные</option>
              <option value="completed">Выполненные</option>
              <option value="deleted">Удаленные</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Приоритет</label>
            <select
              value={filters.priority || 'all'}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              className="input"
            >
              <option value="all">Все</option>
              <option value="high">Высокий</option>
              <option value="medium">Средний</option>
              <option value="low">Низкий</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Сортировка</label>
            <select
              value={sortOption}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="input"
            >
              <option value="created_desc">Новые сначала</option>
              <option value="created_asc">Старые сначала</option>
              <option value="deadline_asc">Дедлайн (ближайшие)</option>
              <option value="deadline_desc">Дедлайн (дальние)</option>
              <option value="priority_desc">Приоритет (высокий)</option>
              <option value="priority_asc">Приоритет (низкий)</option>
              <option value="title_asc">По алфавиту (А-Я)</option>
              <option value="title_desc">По алфавиту (Я-А)</option>
            </select>
          </div>
        </div>

        {(filters.search || filters.status || filters.priority) && (
          <button
            onClick={() => onFiltersChange({})}
            className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
          >
            Сбросить фильтры
          </button>
        )}
      </div>
    </div>
  );
}

