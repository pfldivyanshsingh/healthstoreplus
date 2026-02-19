import express from 'express';
import {
  getAdminDashboard,
  getStoreDashboard,
  getDoctorDashboard,
  getPatientDashboard
} from '../controllers/dashboardController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/admin', protect, authorize('admin'), getAdminDashboard);
router.get('/store', protect, authorize('admin', 'store_manager'), getStoreDashboard);
router.get('/doctor', protect, authorize('doctor'), getDoctorDashboard);
router.get('/patient', protect, authorize('patient'), getPatientDashboard);

export default router;
