import mongoose from 'mongoose';

const patientRecordSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  diagnosis: {
    type: String,
    trim: true
  },
  symptoms: {
    type: String,
    trim: true
  },
  treatment: {
    type: String,
    trim: true
  },
  prescription: [{
    medicine: {
      type: String,
      required: true
    },
    dosage: {
      type: String,
      required: true
    },
    frequency: {
      type: String,
      required: true
    },
    duration: {
      type: String,
      required: true
    }
  }],
  notes: {
    type: String,
    trim: true
  },
  followUpDate: {
    type: Date,
    default: null
  },
  attachments: [{
    type: String,
    default: []
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

patientRecordSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('PatientRecord', patientRecordSchema);
