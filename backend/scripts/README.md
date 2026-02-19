# Database Scripts

## Available Scripts

### 1. Seed Complete Database
Creates all sample data including users, medicines, orders, patient records, and health vitals.

```bash
npm run seed
```

This will:
- Clear all existing data
- Create sample users (Admin, Store Manager, Doctors, Patients)
- Create sample medicines
- Create sample orders
- Create sample patient records
- Create sample health vitals

**Sample Credentials:**
- Admin: admin@healthstore.com / admin123
- Manager: manager@healthstore.com / manager123
- Doctor: sarah.johnson@healthstore.com / doctor123
- Patient: john.doe@example.com / patient123

### 2. Create Admin User Only
Creates or updates only the admin user without affecting other data.

```bash
npm run create-admin
```

This will:
- Check if admin exists
- Update existing admin or create new one
- Preserve all other data in the database

**Admin Credentials:**
- Email: admin@healthstore.com
- Password: admin123
- Role: admin

## Usage

### Create Admin Only (Recommended if you already have data)
```bash
cd backend
npm run create-admin
```

### Seed Complete Database (Use when starting fresh)
```bash
cd backend
npm run seed
```

## Notes

- Make sure MongoDB is running before executing scripts
- Ensure your `.env` file has the correct `MONGODB_URI`
- The admin password will be automatically hashed by bcrypt
- If admin already exists, it will be updated with the latest data
