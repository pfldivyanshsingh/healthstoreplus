import mongoose from 'mongoose';

const healthVitalSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  recordedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  heartRate: {
    value: {
      type: Number,
      min: 0
    },
    unit: {
      type: String,
      default: 'bpm'
    },
    status: {
      type: String,
      enum: ['normal', 'high', 'low', 'critical'],
      default: 'normal'
    }
  },
  bloodPressure: {
    systolic: {
      type: Number,
      min: 0
    },
    diastolic: {
      type: Number,
      min: 0
    },
    unit: {
      type: String,
      default: 'mmHg'
    },
    status: {
      type: String,
      enum: ['normal', 'high', 'low', 'critical'],
      default: 'normal'
    }
  },
  temperature: {
    value: {
      type: Number
    },
    unit: {
      type: String,
      default: '°F'
    },
    status: {
      type: String,
      enum: ['normal', 'high', 'low', 'critical'],
      default: 'normal'
    }
  },
  oxygenLevel: {
    value: {
      type: Number,
      min: 0,
      max: 100
    },
    unit: {
      type: String,
      default: '%'
    },
    status: {
      type: String,
      enum: ['normal', 'high', 'low', 'critical'],
      default: 'normal'
    }
  },
  weight: {
    value: {
      type: Number,
      min: 0
    },
    unit: {
      type: String,
      default: 'kg'
    }
  },
  height: {
    value: {
      type: Number,
      min: 0
    },
    unit: {
      type: String,
      default: 'cm'
    }
  },
  notes: {
    type: String,
    trim: true
  },
  isCritical: {
    type: Boolean,
    default: false
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

// Calculate status before saving
healthVitalSchema.pre('save', function(next) {
  let hasCritical = false;

  // Heart rate: normal 60-100 bpm
  if (this.heartRate?.value) {
    if (this.heartRate.value < 60) {
      this.heartRate.status = this.heartRate.value < 50 ? 'critical' : 'low';
    } else if (this.heartRate.value > 100) {
      this.heartRate.status = this.heartRate.value > 120 ? 'critical' : 'high';
    } else {
      this.heartRate.status = 'normal';
    }
    if (this.heartRate.status === 'critical') hasCritical = true;
  }

  // Blood pressure: normal <120/<80, high >140/>90
  if (this.bloodPressure?.systolic && this.bloodPressure?.diastolic) {
    if (this.bloodPressure.systolic >= 140 || this.bloodPressure.diastolic >= 90) {
      this.bloodPressure.status = (this.bloodPressure.systolic >= 180 || this.bloodPressure.diastolic >= 120) ? 'critical' : 'high';
    } else if (this.bloodPressure.systolic < 90 || this.bloodPressure.diastolic < 60) {
      this.bloodPressure.status = (this.bloodPressure.systolic < 70 || this.bloodPressure.diastolic < 50) ? 'critical' : 'low';
    } else {
      this.bloodPressure.status = 'normal';
    }
    if (this.bloodPressure.status === 'critical') hasCritical = true;
  }

  // Temperature: normal 97-99°F
  if (this.temperature?.value) {
    if (this.temperature.value < 97) {
      this.temperature.status = this.temperature.value < 95 ? 'critical' : 'low';
    } else if (this.temperature.value > 99) {
      this.temperature.status = this.temperature.value > 103 ? 'critical' : 'high';
    } else {
      this.temperature.status = 'normal';
    }
    if (this.temperature.status === 'critical') hasCritical = true;
  }

  // Oxygen level: normal 95-100%
  if (this.oxygenLevel?.value) {
    if (this.oxygenLevel.value < 95) {
      this.oxygenLevel.status = this.oxygenLevel.value < 90 ? 'critical' : 'low';
    } else {
      this.oxygenLevel.status = 'normal';
    }
    if (this.oxygenLevel.status === 'critical') hasCritical = true;
  }

  this.isCritical = hasCritical;
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('HealthVital', healthVitalSchema);
