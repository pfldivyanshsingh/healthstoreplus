import express from 'express';
import {
  getMedicines,
  getMedicine,
  createMedicine,
  updateMedicine,
  deleteMedicine,
  getLowStockMedicines
} from '../controllers/medicineController.js';
import { protect, authorize } from '../middleware/auth.js';
import { body } from 'express-validator';

const router = express.Router();

const medicineValidation = [
  body('name').trim().notEmpty().withMessage('Medicine name is required'),
  body('category').isIn(['prescription', 'over-the-counter', 'supplements', 'medical-equipment', 'other']).withMessage('Invalid category'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('minStockLevel').isInt({ min: 0 }).withMessage('Minimum stock level must be a non-negative integer'),
  body('expiryDate').isISO8601().withMessage('Please provide a valid expiry date')
];

router.get('/', protect, getMedicines);
router.get('/alerts/low-stock', protect, authorize('admin', 'store_manager'), getLowStockMedicines);
router.get('/:id', protect, getMedicine);
router.post('/', protect, authorize('admin', 'store_manager'), medicineValidation, createMedicine);
router.put('/:id', protect, authorize('admin', 'store_manager'), medicineValidation, updateMedicine);
router.delete('/:id', protect, authorize('admin', 'store_manager'), deleteMedicine);

export default router;
