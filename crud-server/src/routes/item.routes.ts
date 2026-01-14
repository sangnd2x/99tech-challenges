import { Router } from 'express';
import { ItemController } from '../controllers/item.controller';
import { ItemService } from '../services/item.service';

const router = Router();

// Initialize service and controller
const itemService = new ItemService();
const itemController = new ItemController(itemService);

// Create a new item
router.post('/', (req, res) => itemController.createItem(req, res));

// List items with filters
router.get('/', (req, res) => itemController.listItems(req, res));

// Get item by ID
router.get('/:id', (req, res) => itemController.getItem(req, res));

// Update item
router.put('/:id', (req, res) => itemController.updateItem(req, res));

// Delete item
router.delete('/:id', (req, res) => itemController.deleteItem(req, res));

export default router;
