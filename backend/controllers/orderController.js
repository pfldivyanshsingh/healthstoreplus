import Order from '../models/Order.js';
import Medicine from '../models/Medicine.js';
import { validationResult } from 'express-validator';

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private
export const getOrders = async (req, res) => {
  try {
    const { status, paymentStatus, patient, page = 1, limit = 10 } = req.query;
    const query = {};

    // Role-based filtering
    if (req.user.role === 'patient') {
      query.patient = req.user.id;
    } else if (patient) {
      query.patient = patient;
    }

    if (status) {
      query.status = status;
    }

    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const orders = await Order.find(query)
      .populate('patient', 'name email phone')
      .populate('processedBy', 'name email')
      .populate('items.medicine', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      count: orders.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('patient', 'name email phone address')
      .populate('processedBy', 'name email')
      .populate('items.medicine', 'name description price');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check authorization
    if (req.user.role === 'patient' && order.patient._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this order'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Create order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { items, paymentMethod, notes, prescriptionFile } = req.body;
    const patientId = req.user.role === 'patient' ? req.user.id : req.body.patient;

    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: 'Patient ID is required'
      });
    }

    // Validate items and calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const medicine = await Medicine.findById(item.medicine);
      if (!medicine || !medicine.isActive) {
        return res.status(400).json({
          success: false,
          message: `Medicine ${item.medicine} not found or inactive`
        });
      }

      if (medicine.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${medicine.name}. Available: ${medicine.stock}`
        });
      }

      const itemTotal = medicine.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        medicine: medicine._id,
        name: medicine.name,
        quantity: item.quantity,
        price: medicine.price,
        total: itemTotal
      });
    }

    const tax = subtotal * 0.1; // 10% tax
    const discount = 0; // Can be calculated based on rules
    const total = subtotal + tax - discount;

    // Check if prescription is required
    const prescriptionRequired = orderItems.some(item => {
      const medicine = items.find(i => i.medicine === item.medicine.toString());
      return medicine && medicine.prescriptionRequired;
    });

    const order = await Order.create({
      patient: patientId,
      items: orderItems,
      subtotal,
      tax,
      discount,
      total,
      paymentMethod: paymentMethod || 'cash',
      notes,
      prescriptionFile,
      prescriptionRequired
    });

    // Update stock
    for (const item of items) {
      await Medicine.findByIdAndUpdate(item.medicine, {
        $inc: { stock: -item.quantity }
      });
    }

    const populatedOrder = await Order.findById(order._id)
      .populate('patient', 'name email phone')
      .populate('items.medicine', 'name');

    res.status(201).json({
      success: true,
      data: populatedOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Admin, Store Manager)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const updateData = {};

    if (status) {
      updateData.status = status;
      if (status === 'completed' || status === 'processing') {
        updateData.processedBy = req.user.id;
      }
    }

    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus;
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('patient', 'name email')
     .populate('processedBy', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check authorization
    if (req.user.role === 'patient' && order.patient.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }

    if (order.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel a completed order'
      });
    }

    // Restore stock
    for (const item of order.items) {
      await Medicine.findByIdAndUpdate(item.medicine, {
        $inc: { stock: item.quantity }
      });
    }

    order.status = 'cancelled';
    await order.save();

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};
