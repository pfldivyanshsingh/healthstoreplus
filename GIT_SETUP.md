# Git Setup Instructions

Follow these steps to push your HealthStore+ project to GitHub:

## Step 1: Initialize Git Repository

Open a terminal in the project root directory and run:

```bash
cd "c:\Users\divya\OneDrive\Documents\Vercel Trial\HealthStorePlus"
git init
```

## Step 2: Add All Files

```bash
git add .
```

## Step 3: Create Initial Commit

```bash
git commit -m "Initial commit: HealthStore+ - Full Stack Health Store Management System"
```

## Step 4: Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Name it: `HealthStorePlus` (or any name you prefer)
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

## Step 5: Add Remote and Push

After creating the repository, GitHub will show you commands. Use these:

```bash
# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/HealthStorePlus.git

# Rename main branch (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

## Alternative: Using SSH

If you prefer SSH:

```bash
git remote add origin git@github.com:YOUR_USERNAME/HealthStorePlus.git
git branch -M main
git push -u origin main
```

## Troubleshooting

### If you get permission errors:
- Close any programs accessing the folder (VS Code, etc.)
- Wait for OneDrive to finish syncing
- Try running terminal as Administrator

### If .env files are tracked:
The .gitignore should prevent this, but if needed:
```bash
git rm --cached backend/.env
git rm --cached frontend/.env
git commit -m "Remove .env files from tracking"
```

## Files Already Ignored

The `.gitignore` file will automatically exclude:
- `node_modules/` folders
- `.env` files (your secrets)
- `dist/` build folders
- IDE configuration files
- Log files

## Next Steps After Pushing

1. Add a description to your GitHub repository
2. Consider adding topics: `react`, `nodejs`, `mongodb`, `healthcare`, `fullstack`
3. Update README.md if needed
4. Consider adding a LICENSE file

## Quick Command Summary

```bash
git init
git add .
git commit -m "Initial commit: HealthStore+ - Full Stack Health Store Management System"
git remote add origin https://github.com/YOUR_USERNAME/HealthStorePlus.git
git branch -M main
git push -u origin main
```
