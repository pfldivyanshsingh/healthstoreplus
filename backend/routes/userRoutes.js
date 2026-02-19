import express from 'express';
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';
import { body } from 'express-validator';

const router = express.Router();

const userValidation = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().withMessage('Please provide a valid email'),
  body('role').optional().isIn(['admin', 'store_manager', 'doctor', 'patient']).withMessage('Invalid role'),
  body('phone').optional().trim(),
  body('address').optional().trim()
];

router.get('/', protect, authorize('admin'), getUsers);
router.get('/:id', protect, authorize('admin'), getUser);
router.put('/:id', protect, authorize('admin'), userValidation, updateUser);
router.delete('/:id', protect, authorize('admin'), deleteUser);

export default router;
