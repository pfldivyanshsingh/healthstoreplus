import express from 'express';
import {
  getPatients,
  getPatient,
  getPatientRecords,
  createPatientRecord,
  updatePatientRecord,
  getPatientRecord
} from '../controllers/patientController.js';
import { protect, authorize } from '../middleware/auth.js';
import { body } from 'express-validator';

const router = express.Router();

const recordValidation = [
  body('date').optional().isISO8601().withMessage('Please provide a valid date'),
  body('diagnosis').optional().trim(),
  body('symptoms').optional().trim(),
  body('treatment').optional().trim()
];

router.get('/', protect, authorize('admin', 'doctor'), getPatients);
router.get('/:id', protect, getPatient);
router.get('/:id/records', protect, getPatientRecords);
router.post('/:id/records', protect, authorize('doctor'), recordValidation, createPatientRecord);
router.get('/records/:recordId', protect, getPatientRecord);
router.put('/records/:recordId', protect, authorize('doctor'), recordValidation, updatePatientRecord);

export default router;
