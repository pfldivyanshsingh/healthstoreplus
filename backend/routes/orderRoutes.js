import express from 'express';
import {
  getOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  cancelOrder
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/auth.js';
import { body } from 'express-validator';

const router = express.Router();

const orderValidation = [
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.medicine').notEmpty().withMessage('Medicine ID is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
];

router.get('/', protect, getOrders);
router.get('/:id', protect, getOrder);
router.post('/', protect, orderValidation, createOrder);
router.put('/:id/status', protect, authorize('admin', 'store_manager'), updateOrderStatus);
router.put('/:id/cancel', protect, cancelOrder);

export default router;
