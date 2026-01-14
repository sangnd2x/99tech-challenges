import { Request, Response } from "express";
import { ItemFilters } from "../models/item.model";
import { ResponseHandler } from "../utils/response";
import { ItemService } from "../services/item.service";

export class ItemController {
  constructor(private itemService: ItemService) {}

  // Create a new item
  async createItem(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.itemService.createItem(req.body);
      ResponseHandler.created(res, result, "Item created successfully");
    } catch (error) {
      if (error instanceof Error && error.message === "Name is required") {
        ResponseHandler.badRequest(res, error.message);
      } else {
        ResponseHandler.error(
          res,
          error instanceof Error ? error.message : "Unknown error",
          500
        );
      }
    }
  }

  // List items with filters
  async listItems(req: Request, res: Response): Promise<void> {
    try {
      const filters: ItemFilters = {
        category: req.query.category as string,
        minPrice: req.query.minPrice
          ? parseFloat(req.query.minPrice as string)
          : undefined,
        maxPrice: req.query.maxPrice
          ? parseFloat(req.query.maxPrice as string)
          : undefined,
        search: req.query.search as string,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
        offset: req.query.offset ? parseInt(req.query.offset as string) : 0,
      };

      const result = await this.itemService.listItems(filters);
      ResponseHandler.success(
        res,
        result.items,
        "Items retrieved successfully",
        200,
        result.pagination
      );
    } catch (error) {
      ResponseHandler.error(
        res,
        error instanceof Error ? error.message : "Unknown error",
        500
      );
    }
  }

  // Get item by ID
  async getItem(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const item = await this.itemService.getItemById(id);
      ResponseHandler.success(res, item, "Item retrieved successfully");
    } catch (error) {
      if (error instanceof Error && error.message === "Item not found") {
        ResponseHandler.notFound(res, error.message);
      } else {
        ResponseHandler.error(
          res,
          error instanceof Error ? error.message : "Unknown error",
          500
        );
      }
    }
  }

  // Update item
  async updateItem(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.itemService.updateItem(id, req.body);
      ResponseHandler.success(res, null, "Item updated successfully");
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Item not found") {
          ResponseHandler.notFound(res, error.message);
        } else if (error.message === "No fields to update") {
          ResponseHandler.badRequest(res, error.message);
        } else {
          ResponseHandler.error(res, error.message, 500);
        }
      } else {
        ResponseHandler.error(res, "Unknown error", 500);
      }
    }
  }

  // Delete item
  async deleteItem(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.itemService.deleteItem(id);
      ResponseHandler.success(res, null, "Item deleted successfully");
    } catch (error) {
      if (error instanceof Error && error.message === "Item not found") {
        ResponseHandler.notFound(res, error.message);
      } else {
        ResponseHandler.error(
          res,
          error instanceof Error ? error.message : "Unknown error",
          500
        );
      }
    }
  }
}
