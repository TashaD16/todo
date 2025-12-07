import { db } from '@/database/db';
import type { Category } from '@/types';

export class CategoryService {
  async getAllCategories(): Promise<Category[]> {
    return await db.getAllCategories();
  }

  async createCategory(name: string, color?: string): Promise<Category> {
    const newCategory: Omit<Category, 'id'> = {
      name,
      color: color || this.generateColor(),
      created_at: new Date().toISOString(),
    };

    const id = await db.addCategory(newCategory);
    return { ...newCategory, id };
  }

  async deleteCategory(id: number): Promise<void> {
    await db.deleteCategory(id);
  }

  private generateColor(): string {
    const colors = [
      '#FF5733', '#33FF57', '#3357FF', '#FF33F5', '#F5FF33',
      '#33FFF5', '#FF8C33', '#8C33FF', '#33FF8C', '#FF338C',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}

export const categoryService = new CategoryService();

