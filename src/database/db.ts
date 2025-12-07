import type { Task, Category } from '@/types';

const DB_NAME = 'TodoAppDB';
const DB_VERSION = 1;
const TASKS_STORE = 'tasks';
const CATEGORIES_STORE = 'categories';

export class Database {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Создание хранилища задач
        if (!db.objectStoreNames.contains(TASKS_STORE)) {
          const taskStore = db.createObjectStore(TASKS_STORE, {
            keyPath: 'id',
            autoIncrement: true,
          });
          taskStore.createIndex('status', 'status', { unique: false });
          taskStore.createIndex('priority', 'priority', { unique: false });
          taskStore.createIndex('category', 'category', { unique: false });
          taskStore.createIndex('deadline', 'deadline', { unique: false });
          taskStore.createIndex('created_at', 'created_at', { unique: false });
          taskStore.createIndex('is_deleted', 'is_deleted', { unique: false });
        }

        // Создание хранилища категорий
        if (!db.objectStoreNames.contains(CATEGORIES_STORE)) {
          const categoryStore = db.createObjectStore(CATEGORIES_STORE, {
            keyPath: 'id',
            autoIncrement: true,
          });
          categoryStore.createIndex('name', 'name', { unique: true });
        }
      };
    });
  }

  private getStore(storeName: string, mode: IDBTransactionMode = 'readonly'): IDBObjectStore {
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    const transaction = this.db.transaction([storeName], mode);
    return transaction.objectStore(storeName);
  }

  // Tasks methods
  async getAllTasks(): Promise<Task[]> {
    return new Promise((resolve, reject) => {
      const store = this.getStore(TASKS_STORE);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getTask(id: number): Promise<Task | undefined> {
    return new Promise((resolve, reject) => {
      const store = this.getStore(TASKS_STORE);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async addTask(task: Omit<Task, 'id'>): Promise<number> {
    return new Promise((resolve, reject) => {
      const store = this.getStore(TASKS_STORE, 'readwrite');
      const request = store.add(task);

      request.onsuccess = () => resolve(request.result as number);
      request.onerror = () => reject(request.error);
    });
  }

  async updateTask(task: Task): Promise<void> {
    return new Promise((resolve, reject) => {
      const store = this.getStore(TASKS_STORE, 'readwrite');
      const request = store.put(task);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async deleteTask(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const store = this.getStore(TASKS_STORE, 'readwrite');
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Categories methods
  async getAllCategories(): Promise<Category[]> {
    return new Promise((resolve, reject) => {
      const store = this.getStore(CATEGORIES_STORE);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async addCategory(category: Omit<Category, 'id'>): Promise<number> {
    return new Promise((resolve, reject) => {
      const store = this.getStore(CATEGORIES_STORE, 'readwrite');
      const request = store.add(category);

      request.onsuccess = () => resolve(request.result as number);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteCategory(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const store = this.getStore(CATEGORIES_STORE, 'readwrite');
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

export const db = new Database();

