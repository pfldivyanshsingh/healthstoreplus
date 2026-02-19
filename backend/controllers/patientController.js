import PatientRecord from '../models/PatientRecord.js';
import User from '../models/User.js';
import { validationResult } from 'express-validator';

// @desc    Get all patients
// @route   GET /api/patients
// @access  Private (Admin, Doctor)
export const getPatients = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const query = { role: 'patient', isActive: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const patients = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      count: patients.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: patients
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get single patient
// @route   GET /api/patients/:id
// @access  Private
export const getPatient = async (req, res) => {
  try {
    const patient = await User.findById(req.params.id).select('-password');

    if (!patient || patient.role !== 'patient') {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Check authorization
    if (req.user.role === 'patient' && patient._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this patient'
      });
    }

    res.json({
      success: true,
      data: patient
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get patient records
// @route   GET /api/patients/:id/records
// @access  Private
export const getPatientRecords = async (req, res) => {
  try {
    const patientId = req.user.role === 'patient' ? req.user.id : req.params.id;

    // Check authorization
    if (req.user.role === 'patient' && patientId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const records = await PatientRecord.find({ patient: patientId })
      .populate('doctor', 'name email specialization')
      .populate('patient', 'name email')
      .sort({ date: -1 });

    res.json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Create patient record
// @route   POST /api/patients/:id/records
// @access  Private (Doctor)
export const createPatientRecord = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const patient = await User.findById(req.params.id);
    if (!patient || patient.role !== 'patient') {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    const record = await PatientRecord.create({
      ...req.body,
      patient: req.params.id,
      doctor: req.user.id
    });

    const populatedRecord = await PatientRecord.findById(record._id)
      .populate('doctor', 'name email specialization')
      .populate('patient', 'name email');

    res.status(201).json({
      success: true,
      data: populatedRecord
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Update patient record
// @route   PUT /api/patients/records/:recordId
// @access  Private (Doctor)
export const updatePatientRecord = async (req, res) => {
  try {
    const record = await PatientRecord.findById(req.params.recordId);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Record not found'
      });
    }

    // Only the doctor who created it can update
    if (record.doctor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this record'
      });
    }

    const updatedRecord = await PatientRecord.findByIdAndUpdate(
      req.params.recordId,
      req.body,
      { new: true, runValidators: true }
    ).populate('doctor', 'name email specialization')
     .populate('patient', 'name email');

    res.json({
      success: true,
      data: updatedRecord
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get single patient record
// @route   GET /api/patients/records/:recordId
// @access  Private
export const getPatientRecord = async (req, res) => {
  try {
    const record = await PatientRecord.findById(req.params.recordId)
      .populate('doctor', 'name email specialization licenseNumber')
      .populate('patient', 'name email phone address');

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Record not found'
      });
    }

    // Check authorization
    if (req.user.role === 'patient' && record.patient._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    res.json({
      success: true,
      data: record
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};
