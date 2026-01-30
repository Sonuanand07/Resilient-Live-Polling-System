# Complete Git Push & Submission Guide

## Table of Contents
1. [Initial Git Setup](#initial-git-setup)
2. [Committing Your Code](#committing-your-code)
3. [Creating Remote Repository](#creating-remote-repository)
4. [Pushing to GitHub](#pushing-to-github)
5. [Email Submission](#email-submission)
6. [Deployment](#deployment)

---

## Initial Git Setup

### Step 1: Initialize Git Repository

Open **PowerShell** in your project root and run:

```powershell
cd "d:\Intervue.io Project\live-polling-system"
git init
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

### Step 2: Verify .gitignore File

Check that `.gitignore` is set up correctly:

```powershell
# Should already exist but verify:
cat .gitignore
```

The file should contain:
```
node_modules/
.env
.env.local
dist/
build/
*.log
.DS_Store
.vscode/
.idea/
```

---

## Committing Your Code

### Step 1: Add All Files to Git

```powershell
# Go to project directory
cd "d:\Intervue.io Project\live-polling-system"

# Add all files
git add .

# Check status
git status
```

**Expected output:**
```
On branch master
Changes to be committed:
  new file: package.json
  new file: frontend/src/...
  new file: backend/src/...
  ... (all files)
```

### Step 2: Create Initial Commit

```powershell
git commit -m "Initial commit: Live Polling System - All core features and bonus features implemented

- Teacher functionality: Create polls, view real-time results, poll history
- Student functionality: Join polls by teacher ID, vote, view results, notifications
- Real-time communication: Socket.io for instant updates
- Database: MongoDB integration for persistence
- Bonus features: Chat popup and poll history
- UI: Responsive design with Figma alignment
- Architecture: Controller-Service pattern, Custom React hooks
- Code quality: TypeScript, ESLint compliant, zero warnings"
```

### Step 3: View Commit History

```powershell
git log --oneline -5
```

---

## Creating Remote Repository

### Option A: GitHub

1. **Create Repository**
   - Go to [https://github.com/new](https://github.com/new)
   - Repository name: `live-polling-system`
   - Description: "Live Polling System - Intervue.io SDE Intern Assignment"
   - Choose: Public (for easy sharing)
   - DO NOT initialize with README (we have one)
   - Click "Create repository"

2. **Add Remote Origin**

```powershell
git remote add origin https://github.com/YOUR_USERNAME/live-polling-system.git
```

3. **Verify Remote**

```powershell
git remote -v
```

Expected output:
```
origin  https://github.com/YOUR_USERNAME/live-polling-system.git (fetch)
origin  https://github.com/YOUR_USERNAME/live-polling-system.git (push)
```

---

## Pushing to GitHub

### Step 1: Push to GitHub

```powershell
# Push main branch
git branch -M main
git push -u origin main
```

**First time pushing?** You may need to authenticate:
- GitHub will prompt you or use a Personal Access Token
- Follow the authentication flow

### Step 2: Create Release Tag

```powershell
git tag -a v1.0.0 -m "Release v1.0.0 - Intervue.io Submission"
git push origin v1.0.0
```

### Step 3: Verify on GitHub

- Visit: `https://github.com/YOUR_USERNAME/live-polling-system`
- Should see all your files and commits
- Check "Code" tab to browse files

---

## Email Submission

### Email Details

**To:** pallavi@intervue.info

**Subject:** 
```
SDE INTERN ASSIGNMENT SUBMISSION
```

**Email Body:**

```
Dear Intervue.io Team,

Please find my submission for the SDE Intern Assignment - Live Polling System.

Name: [Your Full Name]
Phone Number: [Your Contact Number]
Email ID: [Your Email Address]
LinkedIn URL: [Your LinkedIn Profile Link]

Codebase Link: https://github.com/YOUR_USERNAME/live-polling-system
Assignment Link: https://your-deployed-frontend-url.com
(Or provide both URLs once deployed)

=== KEY FEATURES IMPLEMENTED ===

✅ Core Features:
- Teacher: Create polls, view real-time results, poll history (database stored)
- Student: Join by teacher ID, vote, view results
- Real-time: Socket.io for instant updates
- Database: MongoDB for persistence
- State Recovery: Page refresh maintains state

✅ Bonus Features:
- Chat popup: Real-time messaging between students and teachers
- Poll History: View all past poll results with statistics
- Teacher ID Sharing: Copy and share via WhatsApp, Email, etc.
- Notifications: Students notified when teacher creates polls

✅ Code Quality:
- TypeScript with strict type checking
- Controller-Service architecture pattern
- Custom React Hooks (useSocket, usePoll, usePollTimer)
- ESLint compliant, zero warnings
- Responsive UI matching Figma design
- Error handling and edge case management

=== TECHNICAL STACK ===
- Frontend: React 18, TypeScript, Socket.io Client
- Backend: Node.js, Express, Socket.io, MongoDB
- Deployment Ready: Can be deployed to Vercel, Render, etc.

Thank you for considering my submission!

Best regards,
[Your Name]
```

### Attachment

- **Attach:** Your CV (PDF format recommended)

---

## Deployment

### Frontend Deployment (Vercel)

1. **Go to Vercel**: [https://vercel.com](https://vercel.com)
2. **Login/Sign up** with GitHub
3. **Import Project**: Select your GitHub repo
4. **Configure**:
   - Framework: Create React App
   - Root Directory: `./frontend`
   - Build Command: `npm run build`
   - Install Command: `npm install`
5. **Environment Variables** (if needed):
   - `REACT_APP_SOCKET_URL`: Your backend Socket.io URL
6. **Deploy**: Click "Deploy"
7. **Get Frontend URL**: `https://your-app-name.vercel.app`

### Backend Deployment (Render)

1. **Go to Render**: [https://render.com](https://render.com)
2. **Create New Web Service**
3. **Connect to GitHub Repo**
4. **Configure**:
   - Name: `live-polling-backend`
   - Environment: Node
   - Build Command: `npm run build`
   - Start Command: `npm start`
   - Root Directory: `./backend`
5. **Add Environment Variables**:
   ```
   MONGODB_URI: your-mongodb-connection-string
   PORT: 5000
   CORS_ORIGIN: https://your-frontend-url.vercel.app
   ```
6. **Deploy**: Click "Create Web Service"
7. **Get Backend URL**: `https://your-backend.onrender.com`

---

## Complete Step-by-Step Workflow

```powershell
# 1. Navigate to project
cd "d:\Intervue.io Project\live-polling-system"

# 2. Initialize git (if not done)
git init
git config user.name "Your Name"
git config user.email "your@email.com"

# 3. Add all files
git add .

# 4. Verify files
git status

# 5. Create commit
git commit -m "Initial commit: Live Polling System implementation"

# 6. Create GitHub repo and get URL
# (From https://github.com/new)

# 7. Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/live-polling-system.git

# 8. Push to GitHub
git branch -M main
git push -u origin main

# 9. Create tag for release
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0

# 10. Verify
git log --oneline
git remote -v
```

---

## Important Notes

### Before Pushing

- [ ] .gitignore is in place
- [ ] `node_modules/` not included (should be in .gitignore)
- [ ] `.env` files not included
- [ ] Build passes: `npm run build`
- [ ] No sensitive data in code

### After Pushing

- [ ] Verify on GitHub
- [ ] Check all files are present
- [ ] Click on commits to see changes
- [ ] Deploy both frontend and backend
- [ ] Test deployed URLs

### Email Submission Checklist

- [ ] GitHub URL ready
- [ ] Frontend deployment URL ready
- [ ] Backend deployment URL ready
- [ ] CV attached
- [ ] Email format correct
- [ ] Send to pallavi@intervue.info

---

## Useful Git Commands for Future

```powershell
# See commit history
git log --oneline

# See all branches
git branch -a

# Create new branch
git checkout -b feature/feature-name

# Switch branch
git checkout main

# Merge branch
git merge feature/feature-name

# Undo last commit (keep changes)
git reset --soft HEAD~1

# See current changes
git status
git diff

# Stash changes
git stash
git stash pop
```

---

## Support

If you face any issues:

1. **Git not found**: Install from [https://git-scm.com](https://git-scm.com)
2. **Authentication failed**: Use Personal Access Token instead of password
3. **Build errors**: Run `npm install` again
4. **CORS issues**: Ensure CORS_ORIGIN env var is set correctly

---

## Summary

✅ Initialize git with `git init`  
✅ Commit with `git commit -m "message"`  
✅ Add remote with `git remote add origin URL`  
✅ Push with `git push -u origin main`  
✅ Deploy frontend to Vercel  
✅ Deploy backend to Render  
✅ Send email to pallavi@intervue.info  

**You're ready to submit! 🚀**
