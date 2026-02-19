import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/healthstoreplus';

const adminData = {
  name: 'Admin User',
  email: 'admin@healthstore.com',
  password: 'admin123',
  role: 'admin',
  phone: '+1234567890',
  address: '123 Admin Street',
  isActive: true
};

async function createAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });

    if (existingAdmin) {
      // Update existing admin
      existingAdmin.name = adminData.name;
      existingAdmin.password = adminData.password; // Will be hashed by pre-save hook
      existingAdmin.role = adminData.role;
      existingAdmin.phone = adminData.phone;
      existingAdmin.address = adminData.address;
      existingAdmin.isActive = adminData.isActive;
      await existingAdmin.save();
      console.log('✅ Admin user updated successfully!');
    } else {
      // Create new admin
      const admin = await User.create(adminData);
      console.log('✅ Admin user created successfully!');
    }

    console.log('\n📋 Admin Credentials:');
    console.log('Email: admin@healthstore.com');
    console.log('Password: admin123');
    console.log('Role: admin');
    console.log('\nYou can now login with these credentials.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin();
