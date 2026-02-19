# HealthStore+ - Health Store Management System

A comprehensive full-stack web application for managing a health store integrated with a patient monitoring system. Built with React, Node.js, Express, and MongoDB.

## Features

### 🔐 Authentication & Authorization
- Secure JWT-based authentication
- Role-based access control (Admin, Store Manager, Doctor, Patient)
- Protected routes and API endpoints
- User registration and login

### 🏥 Health Store Management
- **Medicine Management**: Add, update, delete, and view medicines
- **Inventory Tracking**: Real-time stock monitoring
- **Low Stock Alerts**: Automatic notifications for low inventory
- **Order Management**: Complete order processing workflow
- **Billing System**: Order billing with tax calculation
- **Purchase History**: Track all orders and transactions

### 👨‍⚕️ Patient Monitoring System
- **Patient Profiles**: Manage patient information
- **Health Records**: Store and manage patient medical records
- **Vital Signs Tracking**: Record heart rate, BP, temperature, oxygen levels
- **Doctor Dashboard**: Monitor all patients' health status
- **Health History**: Complete health tracking timeline
- **Critical Alerts**: Automatic alerts for abnormal readings

### 📊 Dashboards
- **Admin Dashboard**: User management, analytics, system overview
- **Store Dashboard**: Inventory management, sales analytics, low stock alerts
- **Doctor Dashboard**: Patient monitoring, critical vitals, records management
- **Patient Dashboard**: Personal health reports, order history, vital signs

## Tech Stack

### Frontend
- **React.js** (Vite)
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls
- **React Hot Toast** for notifications

### Backend
- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose**
- **JWT** for authentication
- **bcryptjs** for password hashing
- **express-validator** for input validation

## Project Structure

```
HealthStorePlus/
├── backend/
│   ├── controllers/     # Route controllers
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Auth & validation middleware
│   ├── utils/           # Utility functions
│   ├── scripts/         # Seed data script
│   └── server.js        # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── layouts/     # Layout components
│   │   ├── services/    # API services
│   │   ├── context/     # React context
│   │   ├── utils/       # Utility functions
│   │   └── App.jsx      # Main app component
│   └── package.json
└── README.md
```

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **MongoDB** (v4.4 or higher) - Make sure MongoDB is running locally or use MongoDB Atlas
- **npm** or **yarn** package manager

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd HealthStorePlus
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env file with your configuration
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/healthstoreplus
# JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
# JWT_EXPIRE=7d
# NODE_ENV=development
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Create .env file (optional, defaults are set)
# VITE_API_URL=http://localhost:5000/api
```

### 4. Database Setup

Make sure MongoDB is running:

```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas connection string in .env file
```

### 5. Seed Sample Data (Optional)

```bash
# From backend directory
npm run seed
```

This will create sample users, medicines, orders, patient records, and health vitals.

**Sample Login Credentials:**
- **Admin**: admin@healthstore.com / admin123
- **Store Manager**: manager@healthstore.com / manager123
- **Doctor**: sarah.johnson@healthstore.com / doctor123
- **Patient**: john.doe@example.com / patient123

## Running the Application

### Start Backend Server

```bash
cd backend

# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

Backend will run on `http://localhost:5000`

### Start Frontend Development Server

```bash
cd frontend

# Start development server
npm run dev
```

Frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Medicines
- `GET /api/medicines` - Get all medicines (Protected)
- `GET /api/medicines/:id` - Get single medicine (Protected)
- `POST /api/medicines` - Create medicine (Admin, Store Manager)
- `PUT /api/medicines/:id` - Update medicine (Admin, Store Manager)
- `DELETE /api/medicines/:id` - Delete medicine (Admin, Store Manager)
- `GET /api/medicines/alerts/low-stock` - Get low stock medicines (Admin, Store Manager)

### Orders
- `GET /api/orders` - Get all orders (Protected, filtered by role)
- `GET /api/orders/:id` - Get single order (Protected)
- `POST /api/orders` - Create order (Protected)
- `PUT /api/orders/:id/status` - Update order status (Admin, Store Manager)
- `PUT /api/orders/:id/cancel` - Cancel order (Protected)

### Patients
- `GET /api/patients` - Get all patients (Admin, Doctor)
- `GET /api/patients/:id` - Get single patient (Protected)
- `GET /api/patients/:id/records` - Get patient records (Protected)
- `POST /api/patients/:id/records` - Create patient record (Doctor)
- `GET /api/patients/records/:recordId` - Get single record (Protected)
- `PUT /api/patients/records/:recordId` - Update record (Doctor)

### Health Vitals
- `GET /api/health-vitals` - Get all vitals (Protected)
- `GET /api/health-vitals/:id` - Get single vital (Protected)
- `POST /api/health-vitals` - Create vital (Doctor, Patient)
- `PUT /api/health-vitals/:id` - Update vital (Doctor)
- `GET /api/health-vitals/alerts/critical` - Get critical vitals (Admin, Doctor)

### Users
- `GET /api/users` - Get all users (Admin)
- `GET /api/users/:id` - Get single user (Admin)
- `PUT /api/users/:id` - Update user (Admin)
- `DELETE /api/users/:id` - Deactivate user (Admin)

### Dashboards
- `GET /api/dashboard/admin` - Admin dashboard stats (Admin)
- `GET /api/dashboard/store` - Store dashboard stats (Admin, Store Manager)
- `GET /api/dashboard/doctor` - Doctor dashboard stats (Doctor)
- `GET /api/dashboard/patient` - Patient dashboard stats (Patient)

## User Roles & Permissions

### Admin
- Full system access
- User management
- View all dashboards
- Manage all resources

### Store Manager
- Medicine management (CRUD)
- Order processing
- Inventory management
- View store dashboard

### Doctor
- View patient list
- Create/update patient records
- Record health vitals
- View critical alerts
- View doctor dashboard

### Patient
- View own orders
- View own health records
- Record own health vitals
- View patient dashboard

## Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/healthstoreplus
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## Features Implementation

### Security
- Password hashing with bcryptjs
- JWT token-based authentication
- Role-based access control
- Input validation with express-validator
- Protected API routes

### Health Monitoring
- Automatic vital status calculation (normal/high/low/critical)
- Critical alerts for abnormal readings
- Health history tracking
- Doctor-patient record management

### Inventory Management
- Real-time stock tracking
- Low stock alerts
- Expiry date tracking
- Stock level management

### Order Management
- Order creation with stock validation
- Automatic stock deduction
- Order status tracking
- Payment status management
- Order cancellation with stock restoration

## Building for Production

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

The production build will be in the `frontend/dist` directory.

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env` file
- Verify MongoDB port (default: 27017)

### Port Already in Use
- Change PORT in backend `.env` file
- Update frontend proxy in `vite.config.js` if needed

### Authentication Issues
- Clear browser localStorage
- Check JWT_SECRET in backend `.env`
- Verify token expiration settings

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Support

For support, email support@healthstore.com or create an issue in the repository.

## Acknowledgments

- React.js community
- Express.js framework
- MongoDB documentation
- Tailwind CSS

---

**HealthStore+** - Managing health, one record at a time.
