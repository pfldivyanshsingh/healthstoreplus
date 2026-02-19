import User from '../models/User.js';
import Medicine from '../models/Medicine.js';
import Order from '../models/Order.js';
import PatientRecord from '../models/PatientRecord.js';
import HealthVital from '../models/HealthVital.js';

// @desc    Get admin dashboard stats
// @route   GET /api/dashboard/admin
// @access  Private (Admin)
export const getAdminDashboard = async (req, res) => {
  try {
    const [
      totalUsers,
      totalMedicines,
      totalOrders,
      lowStockMedicines,
      usersByRole,
      recentOrders,
      totalRevenue
    ] = await Promise.all([
      User.countDocuments({ isActive: true }),
      Medicine.countDocuments({ isActive: true }),
      Order.countDocuments(),
      Medicine.countDocuments({ isActive: true, $expr: { $lte: ['$stock', '$minStockLevel'] } }),
      User.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$role', count: { $sum: 1 } } }
      ]),
      Order.find().populate('patient', 'name').sort({ createdAt: -1 }).limit(10),
      Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ])
    ]);

    const revenue = totalRevenue[0]?.total || 0;

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalMedicines,
          totalOrders,
          lowStockCount: lowStockMedicines,
          totalRevenue: revenue
        },
        usersByRole: usersByRole.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        recentOrders: recentOrders.slice(0, 10)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get store manager dashboard stats
// @route   GET /api/dashboard/store
// @access  Private (Store Manager, Admin)
export const getStoreDashboard = async (req, res) => {
  try {
    const [
      totalMedicines,
      lowStockMedicines,
      totalOrders,
      pendingOrders,
      todayOrders,
      todayRevenue,
      monthlyRevenue,
      topMedicines
    ] = await Promise.all([
      Medicine.countDocuments({ isActive: true }),
      Medicine.find({ isActive: true, $expr: { $lte: ['$stock', '$minStockLevel'] } }).limit(10),
      Order.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
      Order.countDocuments({
        createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
      }),
      Order.aggregate([
        {
          $match: {
            paymentStatus: 'paid',
            createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
          }
        },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]),
      Order.aggregate([
        {
          $match: {
            paymentStatus: 'paid',
            createdAt: {
              $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            }
          }
        },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]),
      Order.aggregate([
        { $unwind: '$items' },
        {
          $group: {
            _id: '$items.medicine',
            name: { $first: '$items.name' },
            totalSold: { $sum: '$items.quantity' },
            revenue: { $sum: '$items.total' }
          }
        },
        { $sort: { totalSold: -1 } },
        { $limit: 10 }
      ])
    ]);

    const todayRev = todayRevenue[0]?.total || 0;
    const monthlyRev = monthlyRevenue[0]?.total || 0;

    res.json({
      success: true,
      data: {
        overview: {
          totalMedicines,
          lowStockCount: lowStockMedicines.length,
          totalOrders,
          pendingOrders,
          todayOrders,
          todayRevenue: todayRev,
          monthlyRevenue: monthlyRev
        },
        lowStockMedicines,
        topMedicines
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get doctor dashboard stats
// @route   GET /api/dashboard/doctor
// @access  Private (Doctor)
export const getDoctorDashboard = async (req, res) => {
  try {
    const [
      totalPatients,
      totalRecords,
      criticalVitals,
      recentRecords,
      recentVitals
    ] = await Promise.all([
      User.countDocuments({ role: 'patient', isActive: true }),
      PatientRecord.countDocuments({ doctor: req.user.id }),
      HealthVital.countDocuments({ isCritical: true }),
      PatientRecord.find({ doctor: req.user.id })
        .populate('patient', 'name email')
        .sort({ date: -1 })
        .limit(10),
      HealthVital.find({ isCritical: true })
        .populate('patient', 'name email phone')
        .sort({ date: -1 })
        .limit(10)
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalPatients,
          totalRecords,
          criticalVitalsCount: criticalVitals
        },
        recentRecords,
        criticalVitals: recentVitals
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get patient dashboard stats
// @route   GET /api/dashboard/patient
// @access  Private (Patient)
export const getPatientDashboard = async (req, res) => {
  try {
    const [
      totalOrders,
      recentOrders,
      totalRecords,
      recentRecordsList,
      recentVitals,
      criticalVitals
    ] = await Promise.all([
      Order.countDocuments({ patient: req.user.id }),
      Order.find({ patient: req.user.id })
        .populate('items.medicine', 'name')
        .sort({ createdAt: -1 })
        .limit(5),
      PatientRecord.countDocuments({ patient: req.user.id }),
      PatientRecord.find({ patient: req.user.id })
        .populate('doctor', 'name specialization')
        .sort({ date: -1 })
        .limit(5),
      HealthVital.find({ patient: req.user.id })
        .populate('recordedBy', 'name role')
        .sort({ date: -1 })
        .limit(5),
      HealthVital.countDocuments({ patient: req.user.id, isCritical: true })
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalOrders,
          totalRecords,
          criticalVitalsCount: criticalVitals
        },
        recentOrders,
        recentRecords: recentRecordsList,
        recentVitals
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};
