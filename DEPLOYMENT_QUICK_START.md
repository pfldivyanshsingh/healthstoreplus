# Quick Start: Deploy HealthStore+ to Vercel

## 🚀 Fastest Deployment Method (Recommended)

### Step 1: Set Up MongoDB Atlas (5 minutes)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up (free account)
3. Create a cluster (choose FREE tier M0)
4. Create database user:
   - Username: `healthstoreplus`
   - Password: (save this password!)
5. Network Access → Add IP Address → Allow Access from Anywhere (`0.0.0.0/0`)
6. Get connection string:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password
   - Example: `mongodb+srv://healthstoreplus:yourpassword@cluster0.xxxxx.mongodb.net/healthstoreplus?retryWrites=true&w=majority`

### Step 2: Push Code to GitHub

```bash
cd "c:\Users\divya\OneDrive\Documents\Vercel Trial\HealthStorePlus"
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### Step 3: Deploy Backend to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "Add New Project"
3. Import your GitHub repository
4. **Configure Project**:
   - **Root Directory**: Click "Edit" → Set to `backend`
   - **Framework Preset**: Other
   - **Build Command**: Leave empty
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`
5. Click "Deploy"

6. **Add Environment Variables** (after first deploy):
   - Go to Project Settings → Environment Variables
   - Add these variables:
     ```
     MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/healthstoreplus
     JWT_SECRET = your_random_secret_key_here_make_it_long_and_random
     JWT_EXPIRE = 7d
     NODE_ENV = production
     ```
   - Click "Save"
   - Go to "Deployments" → Click "..." on latest deployment → "Redeploy"

7. **Copy your backend URL** (e.g., `https://healthstoreplus-backend.vercel.app`)

### Step 4: Deploy Frontend to Vercel

1. In Vercel dashboard, click "Add New Project"
2. Import the same GitHub repository
3. **Configure Project**:
   - **Root Directory**: Click "Edit" → Set to `frontend`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
   - **Install Command**: `npm install`
4. **Add Environment Variables**:
   - `VITE_API_URL` = `https://your-backend-url.vercel.app/api`
   - Replace `your-backend-url` with your actual backend URL from Step 3
5. Click "Deploy"

### Step 5: Test Your Deployment

1. Visit your frontend URL
2. Try signing up or logging in
3. Test the application

### Step 6: Seed Database (Optional)

Run locally pointing to MongoDB Atlas:

```bash
cd backend
# Update .env with MongoDB Atlas connection string
npm run seed
```

Or create admin via API:
```bash
curl -X POST https://your-backend-url.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@healthstore.com",
    "password": "admin123",
    "role": "admin"
  }'
```

## 📝 Environment Variables Checklist

### Backend (Vercel Dashboard)
- ✅ `MONGODB_URI` - MongoDB Atlas connection string
- ✅ `JWT_SECRET` - Random secret (use: `openssl rand -base64 32`)
- ✅ `JWT_EXPIRE` - `7d`
- ✅ `NODE_ENV` - `production`

### Frontend (Vercel Dashboard)
- ✅ `VITE_API_URL` - `https://your-backend-url.vercel.app/api`

## 🔧 Troubleshooting

### Backend not working?
- Check MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Verify connection string format
- Check Vercel deployment logs

### Frontend can't connect to backend?
- Verify `VITE_API_URL` is correct
- Check CORS settings
- Look at browser console for errors

### Build fails?
- Check Vercel build logs
- Ensure all dependencies are in package.json
- Verify Node.js version (Vercel uses Node 18 by default)

## 🎉 You're Done!

Your HealthStore+ app is now live on Vercel!

- Frontend: `https://your-frontend-name.vercel.app`
- Backend: `https://your-backend-name.vercel.app`

## 📚 Next Steps

- Set up custom domain (optional)
- Enable automatic deployments from GitHub
- Monitor usage in Vercel dashboard
- Set up MongoDB Atlas alerts
