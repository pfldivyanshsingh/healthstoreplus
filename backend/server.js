import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

// Routes
import authRoutes from './routes/authRoutes.js';
import medicineRoutes from './routes/medicineRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import healthVitalRoutes from './routes/healthVitalRoutes.js';
import userRoutes from './routes/userRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

dotenv.config();

const app = express();

/* ===============================
   Middleware
=================================*/

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.FRONTEND_URL,
  process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : null,
  process.env.RENDER_EXTERNAL_URL
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (
        process.env.NODE_ENV === 'development' ||
        allowedOrigins.includes(origin)
      ) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true
  })
);

/* ===============================
   Database Connection
=================================*/

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb://127.0.0.1:27017/healthstoreplus';

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => {
    console.error('❌ MongoDB Error:', err);
    process.exit(1);
  });

/* ===============================
   Base Routes
=================================*/

// API Test
app.get('/api', (req, res) => {
  res.json({
    status: 'OK',
    message: 'HealthStore+ API Working'
  });
});

// Health Check (Render / Deployment)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Server Healthy'
  });
});

/* ===============================
   Application Routes
=================================*/

app.use('/api/auth', authRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/health-vitals', healthVitalRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);

/* ===============================
   Error Handler
=================================*/

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack
    })
  });
});

/* ===============================
   404 Handler (ALWAYS LAST)
=================================*/

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`
  });
});

/* ===============================
   Start Server
=================================*/

const PORT = process.env.PORT || 5000;

if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

export default app;