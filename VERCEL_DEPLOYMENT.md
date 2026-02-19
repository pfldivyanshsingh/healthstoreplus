# Vercel Deployment Guide for HealthStore+

This guide will help you deploy both the frontend and backend to Vercel.

## Prerequisites

1. **GitHub Account** - Your code should be pushed to GitHub
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **MongoDB Atlas** - Free cloud MongoDB database (recommended for production)

## Option 1: Deploy Frontend Only (Recommended for Start)

### Step 1: Set Up MongoDB Atlas (Free)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free account
3. Create a new cluster (Free tier: M0)
4. Create database user:
   - Username: `healthstoreplus`
   - Password: (create a strong password)
5. Whitelist IP: Click "Network Access" → "Add IP Address" → "Allow Access from Anywhere" (0.0.0.0/0)
6. Get connection string:
   - Click "Connect" → "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/healthstoreplus`)

### Step 2: Deploy Backend to Vercel

1. **Install Vercel CLI** (if not installed):
   ```bash
   npm install -g vercel
   ```

2. **Navigate to backend folder**:
   ```bash
   cd backend
   ```

3. **Login to Vercel**:
   ```bash
   vercel login
   ```

4. **Deploy backend**:
   ```bash
   vercel
   ```
   - Follow prompts:
     - Set up and deploy? **Yes**
     - Which scope? **Your account**
     - Link to existing project? **No**
     - Project name: **healthstoreplus-backend**
     - Directory: **./** (current directory)
     - Override settings? **No**

5. **Set Environment Variables**:
   ```bash
   vercel env add MONGODB_URI
   # Paste your MongoDB Atlas connection string
   
   vercel env add JWT_SECRET
   # Enter a random secret (e.g., use: openssl rand -base64 32)
   
   vercel env add JWT_EXPIRE
   # Enter: 7d
   
   vercel env add NODE_ENV
   # Enter: production
   ```

6. **Redeploy with environment variables**:
   ```bash
   vercel --prod
   ```

7. **Copy the backend URL** (e.g., `https://healthstoreplus-backend.vercel.app`)

### Step 3: Deploy Frontend to Vercel

1. **Navigate to frontend folder**:
   ```bash
   cd ../frontend
   ```

2. **Update API URL**:
   - Create `.env.production` file:
   ```env
   VITE_API_URL=https://your-backend-url.vercel.app/api
   ```
   Replace `your-backend-url` with your actual backend Vercel URL

3. **Deploy frontend**:
   ```bash
   vercel
   ```
   - Follow prompts similar to backend

4. **Set Environment Variables** (if needed):
   ```bash
   vercel env add VITE_API_URL production
   # Enter: https://your-backend-url.vercel.app/api
   ```

5. **Redeploy**:
   ```bash
   vercel --prod
   ```

## Option 2: Deploy via GitHub (Easier Method)

### Step 1: Push Code to GitHub

Make sure your code is pushed to GitHub (see GIT_SETUP.md)

### Step 2: Deploy Backend

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. **Root Directory**: Set to `backend`
5. **Framework Preset**: Other
6. **Build Command**: Leave empty (or `npm install`)
7. **Output Directory**: Leave empty
8. **Install Command**: `npm install`
9. Click "Deploy"

10. **Add Environment Variables** (after first deploy):
   - Go to Project Settings → Environment Variables
   - Add:
     - `MONGODB_URI`: Your MongoDB Atlas connection string
     - `JWT_SECRET`: Random secret string
     - `JWT_EXPIRE`: `7d`
     - `NODE_ENV`: `production`
   - Click "Redeploy"

11. **Copy the backend URL**

### Step 3: Deploy Frontend

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import the same GitHub repository
4. **Root Directory**: Set to `frontend`
5. **Framework Preset**: Vite
6. **Build Command**: `npm run build`
7. **Output Directory**: `dist`
8. **Install Command**: `npm install`

9. **Add Environment Variables**:
   - `VITE_API_URL`: `https://your-backend-url.vercel.app/api`
   - Replace `your-backend-url` with your actual backend URL

10. Click "Deploy"

## Option 3: Monorepo Deployment (Single Project)

If you want to deploy both frontend and backend as a single Vercel project:

1. **Create `vercel.json` in root** (already created)
2. **Update `package.json` in root** (create one):
   ```json
   {
     "name": "healthstoreplus",
     "version": "1.0.0",
     "scripts": {
       "build": "cd frontend && npm install && npm run build"
     }
   }
   ```

3. Deploy from root directory:
   ```bash
   vercel
   ```

## Environment Variables Summary

### Backend (.env)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/healthstoreplus
JWT_SECRET=your_random_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=production
PORT=5000 (optional, Vercel sets this automatically)
```

### Frontend (.env.production)
```
VITE_API_URL=https://your-backend-url.vercel.app/api
```

## Post-Deployment Steps

1. **Test the deployment**:
   - Visit your frontend URL
   - Try logging in
   - Test API endpoints

2. **Seed the database** (if needed):
   - You can run the seed script locally pointing to MongoDB Atlas
   - Or create admin via API: `POST /api/auth/register` with admin role

3. **Set up custom domains** (optional):
   - Go to Project Settings → Domains
   - Add your custom domain

## Troubleshooting

### Backend Issues

**Error: Cannot find module**
- Make sure all dependencies are in `package.json`
- Check that `node_modules` is not committed

**Error: MongoDB connection failed**
- Verify MongoDB Atlas IP whitelist includes Vercel IPs
- Check connection string format
- Ensure database user has correct permissions

**Error: Port already in use**
- Vercel handles ports automatically, remove PORT from env vars

### Frontend Issues

**Error: API calls failing**
- Check `VITE_API_URL` environment variable
- Verify CORS settings in backend
- Check browser console for errors

**Error: Build failed**
- Check build logs in Vercel dashboard
- Ensure all dependencies are installed
- Verify `dist` folder is generated

### CORS Issues

If you get CORS errors, update `backend/server.js`:

```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-frontend-url.vercel.app'
  ],
  credentials: true
}));
```

## Quick Deploy Commands

### Backend
```bash
cd backend
vercel
vercel env add MONGODB_URI
vercel env add JWT_SECRET
vercel env add JWT_EXPIRE
vercel env add NODE_ENV
vercel --prod
```

### Frontend
```bash
cd frontend
vercel
vercel env add VITE_API_URL production
vercel --prod
```

## Important Notes

1. **Free Tier Limits**:
   - Vercel free tier: 100GB bandwidth/month
   - MongoDB Atlas free tier: 512MB storage
   - Serverless functions: 100GB-hours/month

2. **Database Seeding**:
   - Run seed script locally pointing to MongoDB Atlas
   - Or use MongoDB Compass to import data
   - Or create admin via API after deployment

3. **Environment Variables**:
   - Never commit `.env` files
   - Always set environment variables in Vercel dashboard
   - Use different values for production

4. **Updates**:
   - Push to GitHub to trigger automatic deployments
   - Or use `vercel --prod` to deploy manually

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)
- Check deployment logs in Vercel dashboard for errors
