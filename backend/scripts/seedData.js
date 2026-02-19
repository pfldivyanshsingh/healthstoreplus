import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Medicine from '../models/Medicine.js';
import Order from '../models/Order.js';
import PatientRecord from '../models/PatientRecord.js';
import HealthVital from '../models/HealthVital.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/healthstoreplus';

const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@healthstore.com',
    password: 'admin123',
    role: 'admin',
    phone: '+1234567890',
    address: '123 Admin Street'
  },
  {
    name: 'Store Manager',
    email: 'manager@healthstore.com',
    password: 'manager123',
    role: 'store_manager',
    phone: '+1234567891',
    address: '456 Manager Avenue'
  },
  {
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@healthstore.com',
    password: 'doctor123',
    role: 'doctor',
    phone: '+1234567892',
    specialization: 'Cardiology',
    licenseNumber: 'DOC-12345'
  },
  {
    name: 'Dr. Michael Chen',
    email: 'michael.chen@healthstore.com',
    password: 'doctor123',
    role: 'doctor',
    phone: '+1234567893',
    specialization: 'General Medicine',
    licenseNumber: 'DOC-12346'
  },
  {
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'patient123',
    role: 'patient',
    phone: '+1234567894',
    address: '789 Patient Lane'
  },
  {
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    password: 'patient123',
    role: 'patient',
    phone: '+1234567895',
    address: '321 Smith Road'
  },
  {
    name: 'Robert Wilson',
    email: 'robert.wilson@example.com',
    password: 'patient123',
    role: 'patient',
    phone: '+1234567896',
    address: '654 Wilson Drive'
  }
];

const sampleMedicines = [
  {
    name: 'Paracetamol 500mg',
    description: 'Pain reliever and fever reducer',
    category: 'over-the-counter',
    manufacturer: 'PharmaCorp',
    batchNumber: 'BATCH-001',
    expiryDate: new Date('2026-12-31'),
    price: 5.99,
    stock: 150,
    minStockLevel: 20,
    unit: 'tablets',
    prescriptionRequired: false
  },
  {
    name: 'Amoxicillin 250mg',
    description: 'Antibiotic for bacterial infections',
    category: 'prescription',
    manufacturer: 'MediPharm',
    batchNumber: 'BATCH-002',
    expiryDate: new Date('2026-06-30'),
    price: 12.50,
    stock: 8,
    minStockLevel: 15,
    unit: 'capsules',
    prescriptionRequired: true
  },
  {
    name: 'Ibuprofen 400mg',
    description: 'Anti-inflammatory and pain reliever',
    category: 'over-the-counter',
    manufacturer: 'HealthMed',
    batchNumber: 'BATCH-003',
    expiryDate: new Date('2027-03-15'),
    price: 7.99,
    stock: 200,
    minStockLevel: 30,
    unit: 'tablets',
    prescriptionRequired: false
  },
  {
    name: 'Vitamin D3 1000IU',
    description: 'Vitamin D supplement',
    category: 'supplements',
    manufacturer: 'NutriHealth',
    batchNumber: 'BATCH-004',
    expiryDate: new Date('2027-08-20'),
    price: 9.99,
    stock: 5,
    minStockLevel: 10,
    unit: 'tablets',
    prescriptionRequired: false
  },
  {
    name: 'Blood Pressure Monitor',
    description: 'Digital blood pressure monitoring device',
    category: 'medical-equipment',
    manufacturer: 'MedTech Inc',
    batchNumber: 'BATCH-005',
    expiryDate: new Date('2030-01-01'),
    price: 45.99,
    stock: 12,
    minStockLevel: 5,
    unit: 'units',
    prescriptionRequired: false
  },
  {
    name: 'Insulin Glargine',
    description: 'Long-acting insulin',
    category: 'prescription',
    manufacturer: 'BioPharm',
    batchNumber: 'BATCH-006',
    expiryDate: new Date('2026-09-30'),
    price: 89.99,
    stock: 25,
    minStockLevel: 10,
    unit: 'vials',
    prescriptionRequired: true
  },
  {
    name: 'Metformin 500mg',
    description: 'Diabetes medication',
    category: 'prescription',
    manufacturer: 'PharmaCorp',
    batchNumber: 'BATCH-007',
    expiryDate: new Date('2026-11-30'),
    price: 15.99,
    stock: 18,
    minStockLevel: 15,
    unit: 'tablets',
    prescriptionRequired: true
  },
  {
    name: 'Calcium Carbonate',
    description: 'Calcium supplement for bone health',
    category: 'supplements',
    manufacturer: 'NutriHealth',
    batchNumber: 'BATCH-008',
    expiryDate: new Date('2027-05-15'),
    price: 6.99,
    stock: 100,
    minStockLevel: 20,
    unit: 'tablets',
    prescriptionRequired: false
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Medicine.deleteMany({});
    await Order.deleteMany({});
    await PatientRecord.deleteMany({});
    await HealthVital.deleteMany({});

    // Create users
    console.log('Creating users...');
    const createdUsers = await User.insertMany(sampleUsers);
    const admin = createdUsers.find(u => u.role === 'admin');
    const manager = createdUsers.find(u => u.role === 'store_manager');
    const doctors = createdUsers.filter(u => u.role === 'doctor');
    const patients = createdUsers.filter(u => u.role === 'patient');

    // Create medicines
    console.log('Creating medicines...');
    const medicines = await Medicine.insertMany(
      sampleMedicines.map(med => ({ ...med, addedBy: manager._id }))
    );

    // Create orders
    console.log('Creating orders...');
    const orders = [];
    for (let i = 0; i < 10; i++) {
      const patient = patients[Math.floor(Math.random() * patients.length)];
      const itemCount = Math.floor(Math.random() * 3) + 1;
      const orderItems = [];
      let subtotal = 0;

      for (let j = 0; j < itemCount; j++) {
        const medicine = medicines[Math.floor(Math.random() * medicines.length)];
        const quantity = Math.floor(Math.random() * 3) + 1;
        const itemTotal = medicine.price * quantity;
        subtotal += itemTotal;

        orderItems.push({
          medicine: medicine._id,
          name: medicine.name,
          quantity,
          price: medicine.price,
          total: itemTotal
        });
      }

      const tax = subtotal * 0.1;
      const total = subtotal + tax;

      orders.push({
        patient: patient._id,
        items: orderItems,
        subtotal,
        tax,
        total,
        status: ['pending', 'processing', 'completed'][Math.floor(Math.random() * 3)],
        paymentStatus: ['pending', 'paid'][Math.floor(Math.random() * 2)],
        paymentMethod: ['cash', 'card', 'online'][Math.floor(Math.random() * 3)],
        processedBy: manager._id
      });
    }
    await Order.insertMany(orders);

    // Create patient records
    console.log('Creating patient records...');
    const records = [];
    for (let i = 0; i < 15; i++) {
      const patient = patients[Math.floor(Math.random() * patients.length)];
      const doctor = doctors[Math.floor(Math.random() * doctors.length)];

      records.push({
        patient: patient._id,
        doctor: doctor._id,
        date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
        diagnosis: ['Hypertension', 'Diabetes', 'Common Cold', 'Fever', 'Headache'][Math.floor(Math.random() * 5)],
        symptoms: 'Patient reported symptoms',
        treatment: 'Prescribed medication and rest',
        prescription: [{
          medicine: medicines[Math.floor(Math.random() * medicines.length)].name,
          dosage: '500mg',
          frequency: 'Twice daily',
          duration: '7 days'
        }],
        notes: 'Follow up in 2 weeks'
      });
    }
    await PatientRecord.insertMany(records);

    // Create health vitals
    console.log('Creating health vitals...');
    const vitals = [];
    for (let i = 0; i < 20; i++) {
      const patient = patients[Math.floor(Math.random() * patients.length)];
      const recordedBy = Math.random() > 0.5 
        ? doctors[Math.floor(Math.random() * doctors.length)]._id 
        : patient._id;

      vitals.push({
        patient: patient._id,
        recordedBy,
        date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        heartRate: {
          value: 60 + Math.floor(Math.random() * 60),
          unit: 'bpm'
        },
        bloodPressure: {
          systolic: 100 + Math.floor(Math.random() * 40),
          diastolic: 60 + Math.floor(Math.random() * 30),
          unit: 'mmHg'
        },
        temperature: {
          value: 97 + Math.random() * 3,
          unit: '°F'
        },
        oxygenLevel: {
          value: 95 + Math.random() * 5,
          unit: '%'
        },
        weight: {
          value: 50 + Math.random() * 50,
          unit: 'kg'
        },
        height: {
          value: 150 + Math.random() * 50,
          unit: 'cm'
        }
      });
    }
    await HealthVital.insertMany(vitals);

    console.log('Database seeded successfully!');
    console.log('\nSample Login Credentials:');
    console.log('Admin: admin@healthstore.com / admin123');
    console.log('Manager: manager@healthstore.com / manager123');
    console.log('Doctor: sarah.johnson@healthstore.com / doctor123');
    console.log('Patient: john.doe@example.com / patient123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
