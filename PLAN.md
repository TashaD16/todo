# План приложения Todo

## Основной функционал

### 1. Управление задачами
- **Создание задачи**
  - Заголовок (обязательное поле)
  - Описание (опционально)
  - Дата создания (автоматически)
  - Дата дедлайна (опционально)
  - Приоритет (низкий, средний, высокий)
  - Категория/тег (опционально)

- **Редактирование задачи**
  - Изменение всех полей задачи
  - Сохранение истории изменений (опционально)

- **Удаление задачи**
  - Мягкое удаление (перемещение в корзину)
  - Полное удаление из корзины
  - Восстановление из корзины

- **Отметка выполнения**
  - Переключение статуса выполнения
  - Автоматическая дата завершения

### 2. Фильтрация и поиск
- Фильтр по статусу (все, активные, выполненные, удаленные)
- Фильтр по приоритету
- Фильтр по категории/тегу
- Фильтр по дате дедлайна
- Поиск по тексту (заголовок, описание)
- Комбинированные фильтры

### 3. Сортировка
- По дате создания (новые/старые)
- По дате дедлайна
- По приоритету
- По алфавиту (заголовок)
- По дате выполнения

### 4. Интерфейс
- Список задач с чекбоксами
- Детальный просмотр задачи
- Форма создания/редактирования
- Статистика (всего задач, выполненных, активных)
- Темная/светлая тема (опционально)

### 5. Дополнительные возможности
- Экспорт задач (JSON, CSV)
- Импорт задач
- Уведомления о приближающихся дедлайнах
- Группировка задач по категориям
- Подзадачи (опционально)

## Локальная база данных

### Вариант 1: SQLite (рекомендуется)

#### Таблица: `tasks`
```sql
CREATE TABLE tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    deadline DATETIME,
    priority TEXT NOT NULL DEFAULT 'medium' CHECK(priority IN ('low', 'medium', 'high')),
    category TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'completed', 'deleted')),
    is_deleted INTEGER NOT NULL DEFAULT 0,
    deleted_at DATETIME
);

CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_category ON tasks(category);
CREATE INDEX idx_tasks_deadline ON tasks(deadline);
CREATE INDEX idx_tasks_created_at ON tasks(created_at);
```

#### Таблица: `categories` (опционально, для нормализации)
```sql
CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    color TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### Вариант 2: JSON файл (для простых приложений)

Структура `tasks.json`:
```json
{
  "tasks": [
    {
      "id": 1,
      "title": "Пример задачи",
      "description": "Описание задачи",
      "created_at": "2024-01-01T10:00:00Z",
      "updated_at": "2024-01-01T10:00:00Z",
      "completed_at": null,
      "deadline": "2024-01-15T23:59:59Z",
      "priority": "high",
      "category": "Работа",
      "status": "active",
      "is_deleted": false
    }
  ],
  "categories": [
    {
      "id": 1,
      "name": "Работа",
      "color": "#FF5733"
    }
  ],
  "settings": {
    "theme": "light",
    "default_priority": "medium"
  }
}
```

### Вариант 3: IndexedDB (для веб-приложений)

Схема объектов:
- **Store: tasks**
  - id (keyPath, autoIncrement)
  - title, description, created_at, updated_at, completed_at, deadline
  - priority, category, status, is_deleted

- **Store: categories**
  - id (keyPath, autoIncrement)
  - name, color

- **Indexes:**
  - status, priority, category, deadline, created_at

## Рекомендуемая структура проекта

```
todo/
├── src/
│   ├── models/          # Модели данных
│   │   ├── Task.js
│   │   └── Category.js
│   ├── database/        # Работа с БД
│   │   ├── db.js        # Инициализация БД
│   │   └── migrations/  # Миграции
│   ├── services/        # Бизнес-логика
│   │   ├── TaskService.js
│   │   └── CategoryService.js
│   ├── components/      # UI компоненты
│   │   ├── TaskList.js
│   │   ├── TaskItem.js
│   │   ├── TaskForm.js
│   │   └── Filters.js
│   ├── utils/           # Утилиты
│   │   ├── dateUtils.js
│   │   └── storage.js
│   └── app.js           # Главный файл
├── styles/
│   └── main.css
├── package.json
└── README.md
```

## Технологический стек (рекомендации)

### Для десктопного приложения:
- **Electron** + **React/Vue** + **SQLite** (better-sqlite3)

### Для веб-приложения:
- **React/Vue/Vanilla JS** + **IndexedDB** или **localStorage**

### Для мобильного приложения:
- **React Native** + **SQLite** (react-native-sqlite-storage)
- **Flutter** + **SQLite** (sqflite)

## Приоритеты разработки

### MVP (Минимально жизнеспособный продукт):
1. ✅ Создание задачи
2. ✅ Просмотр списка задач
3. ✅ Отметка выполнения
4. ✅ Удаление задачи
5. ✅ Базовая фильтрация (активные/выполненные)

### Вторая итерация:
1. Редактирование задач
2. Приоритеты
3. Категории
4. Поиск
5. Сортировка

### Третья итерация:
1. Дедлайны
2. Экспорт/импорт
3. Уведомления
4. Статистика
5. Темная тема

