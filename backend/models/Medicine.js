import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide medicine name'],
    trim: true,
    index: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Please provide category'],
    trim: true,
    enum: ['prescription', 'over-the-counter', 'supplements', 'medical-equipment', 'other']
  },
  manufacturer: {
    type: String,
    trim: true
  },
  batchNumber: {
    type: String,
    trim: true
  },
  expiryDate: {
    type: Date,
    required: [true, 'Please provide expiry date']
  },
  price: {
    type: Number,
    required: [true, 'Please provide price'],
    min: 0
  },
  stock: {
    type: Number,
    required: [true, 'Please provide stock quantity'],
    min: 0,
    default: 0
  },
  minStockLevel: {
    type: Number,
    required: [true, 'Please provide minimum stock level'],
    min: 0,
    default: 10
  },
  unit: {
    type: String,
    default: 'units',
    trim: true
  },
  prescriptionRequired: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for search
medicineSchema.index({ name: 'text', description: 'text', category: 'text' });

// Check if stock is low
medicineSchema.methods.isLowStock = function() {
  return this.stock <= this.minStockLevel;
};

// Check if expired
medicineSchema.methods.isExpired = function() {
  return new Date() > this.expiryDate;
};

medicineSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Medicine', medicineSchema);
