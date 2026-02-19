import express from 'express';
import {
  getHealthVitals,
  getHealthVital,
  createHealthVital,
  updateHealthVital,
  getCriticalVitals
} from '../controllers/healthVitalController.js';
import { protect, authorize } from '../middleware/auth.js';
import { body } from 'express-validator';

const router = express.Router();

const vitalValidation = [
  body('heartRate.value').optional().isInt({ min: 0 }),
  body('bloodPressure.systolic').optional().isInt({ min: 0 }),
  body('bloodPressure.diastolic').optional().isInt({ min: 0 }),
  body('temperature.value').optional().isFloat(),
  body('oxygenLevel.value').optional().isFloat({ min: 0, max: 100 }),
  body('weight.value').optional().isFloat({ min: 0 }),
  body('height.value').optional().isFloat({ min: 0 })
];

router.get('/alerts/critical', protect, authorize('admin', 'doctor'), getCriticalVitals);
router.get('/', protect, getHealthVitals);
router.get('/:id', protect, getHealthVital);
router.post('/', protect, vitalValidation, createHealthVital);
router.put('/:id', protect, authorize('doctor'), vitalValidation, updateHealthVital);

export default router;
