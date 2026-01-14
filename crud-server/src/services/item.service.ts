import db from "../database/db";
import { Item, ItemFilters } from "../models/item.model";

export class ItemService {
  // Create a new item
  async createItem(itemData: Partial<Item>): Promise<{ id: number }> {
    const { name, description, category, price, quantity } = itemData;

    if (!name) {
      throw new Error("Name is required");
    }

    const query = `
      INSERT INTO items (name, description, category, price, quantity)
      VALUES (?, ?, ?, ?, ?)
    `;

    return new Promise((resolve, reject) => {
      db.run(
        query,
        [
          name,
          description || null,
          category || null,
          price || null,
          quantity || 0,
        ],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID });
          }
        }
      );
    });
  }

  // List items with filters
  async listItems(filters: ItemFilters): Promise<{
    items: Item[];
    pagination: {
      page: number;
      total: number;
      limit: number;
    };
  }> {
    const {
      category,
      minPrice,
      maxPrice,
      search,
      limit = 10,
      offset = 0,
    } = filters;

    let countQuery = "SELECT COUNT(*) as total FROM items WHERE 1=1";
    let query = "SELECT * FROM items WHERE 1=1";
    const params: any[] = [];

    if (category) {
      const categoryFilter = " AND category = ?";
      query += categoryFilter;
      countQuery += categoryFilter;
      params.push(category);
    }

    if (minPrice !== undefined) {
      const minPriceFilter = " AND price >= ?";
      query += minPriceFilter;
      countQuery += minPriceFilter;
      params.push(minPrice);
    }

    if (maxPrice !== undefined) {
      const maxPriceFilter = " AND price <= ?";
      query += maxPriceFilter;
      countQuery += maxPriceFilter;
      params.push(maxPrice);
    }

    if (search) {
      const searchFilter = " AND (name LIKE ? OR description LIKE ?)";
      query += searchFilter;
      countQuery += searchFilter;
      params.push(`%${search}%`, `%${search}%`);
    }

    const countParams = [...params];

    query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
    params.push(limit, offset);

    return new Promise((resolve, reject) => {
      db.get(countQuery, countParams, (err, countResult: any) => {
        if (err) {
          reject(err);
          return;
        }

        db.all(query, params, (err, rows: Item[]) => {
          if (err) {
            reject(err);
            return;
          }

          const currentPage = Math.floor(offset / limit) + 1;

          resolve({
            items: rows,
            pagination: {
              page: currentPage,
              total: countResult.total,
              limit,
            },
          });
        });
      });
    });
  }

  // Get item by ID
  async getItemById(id: string): Promise<Item> {
    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM items WHERE id = ?", [id], (err, row: Item) => {
        if (err) {
          reject(err);
          return;
        }
        if (!row) {
          reject(new Error("Item not found"));
          return;
        }
        resolve(row);
      });
    });
  }

  // Update item
  async updateItem(id: string, itemData: Partial<Item>): Promise<void> {
    const { name, description, category, price, quantity } = itemData;

    const updates: string[] = [];
    const params: any[] = [];

    if (name !== undefined) {
      updates.push("name = ?");
      params.push(name);
    }
    if (description !== undefined) {
      updates.push("description = ?");
      params.push(description);
    }
    if (category !== undefined) {
      updates.push("category = ?");
      params.push(category);
    }
    if (price !== undefined) {
      updates.push("price = ?");
      params.push(price);
    }
    if (quantity !== undefined) {
      updates.push("quantity = ?");
      params.push(quantity);
    }

    if (updates.length === 0) {
      throw new Error("No fields to update");
    }

    updates.push("updated_at = CURRENT_TIMESTAMP");
    params.push(id);

    const query = `UPDATE items SET ${updates.join(", ")} WHERE id = ?`;

    return new Promise((resolve, reject) => {
      db.run(query, params, function (err) {
        if (err) {
          reject(err);
          return;
        }
        if (this.changes === 0) {
          reject(new Error("Item not found"));
          return;
        }
        resolve();
      });
    });
  }

  // Delete item
  async deleteItem(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      db.run("DELETE FROM items WHERE id = ?", [id], function (err) {
        if (err) {
          reject(err);
          return;
        }
        if (this.changes === 0) {
          reject(new Error("Item not found"));
          return;
        }
        resolve();
      });
    });
  }
}
