import HealthVital from '../models/HealthVital.js';
import { validationResult } from 'express-validator';

// @desc    Get all health vitals
// @route   GET /api/health-vitals
// @access  Private
export const getHealthVitals = async (req, res) => {
  try {
    const { patient, isCritical, page = 1, limit = 10 } = req.query;
    const query = {};

    // Role-based filtering
    if (req.user.role === 'patient') {
      query.patient = req.user.id;
    } else if (patient) {
      query.patient = patient;
    }

    if (isCritical === 'true') {
      query.isCritical = true;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const vitals = await HealthVital.find(query)
      .populate('patient', 'name email phone')
      .populate('recordedBy', 'name email role')
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await HealthVital.countDocuments(query);

    res.json({
      success: true,
      count: vitals.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: vitals
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get single health vital
// @route   GET /api/health-vitals/:id
// @access  Private
export const getHealthVital = async (req, res) => {
  try {
    const vital = await HealthVital.findById(req.params.id)
      .populate('patient', 'name email phone address')
      .populate('recordedBy', 'name email role specialization');

    if (!vital) {
      return res.status(404).json({
        success: false,
        message: 'Health vital not found'
      });
    }

    // Check authorization
    if (req.user.role === 'patient' && vital.patient._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this record'
      });
    }

    res.json({
      success: true,
      data: vital
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Create health vital
// @route   POST /api/health-vitals
// @access  Private (Doctor, Patient)
export const createHealthVital = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const patientId = req.user.role === 'patient' ? req.user.id : req.body.patient;

    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: 'Patient ID is required'
      });
    }

    const vital = await HealthVital.create({
      ...req.body,
      patient: patientId,
      recordedBy: req.user.id
    });

    const populatedVital = await HealthVital.findById(vital._id)
      .populate('patient', 'name email phone')
      .populate('recordedBy', 'name email role');

    res.status(201).json({
      success: true,
      data: populatedVital
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Update health vital
// @route   PUT /api/health-vitals/:id
// @access  Private (Doctor)
export const updateHealthVital = async (req, res) => {
  try {
    const vital = await HealthVital.findById(req.params.id);

    if (!vital) {
      return res.status(404).json({
        success: false,
        message: 'Health vital not found'
      });
    }

    // Only doctor can update
    if (req.user.role !== 'doctor') {
      return res.status(403).json({
        success: false,
        message: 'Only doctors can update health vitals'
      });
    }

    const updatedVital = await HealthVital.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('patient', 'name email phone')
     .populate('recordedBy', 'name email role');

    res.json({
      success: true,
      data: updatedVital
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get critical health vitals
// @route   GET /api/health-vitals/alerts/critical
// @access  Private (Doctor, Admin)
export const getCriticalVitals = async (req, res) => {
  try {
    const vitals = await HealthVital.find({ isCritical: true })
      .populate('patient', 'name email phone')
      .populate('recordedBy', 'name email')
      .sort({ date: -1 })
      .limit(50);

    res.json({
      success: true,
      count: vitals.length,
      data: vitals
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};
