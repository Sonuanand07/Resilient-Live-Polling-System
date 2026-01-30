# 🚀 Complete Setup Guide

## ✅ What We've Fixed

1. ✅ MongoDB Atlas Connection String configured
2. ✅ TypeScript @types/uuid installed in frontend
3. ✅ Environment variables set up
4. ✅ All dependencies installed

---

## 🎯 Quick Start (3 Steps)

### Step 1: Start the Backend Server

```powershell
# Open PowerShell Terminal 1
cd "D:\Intervue.io Project\live-polling-system\backend"
npm run dev
```

**Expected Output:**
```
🚀 Server running on http://localhost:5000
📡 Socket.io listening on ws://localhost:5000
✅ MongoDB connected to live-polling-system
```

**If you see MongoDB error**, go to [MongoDB Atlas Network Access Fix](#mongodb-network-access-fix)

---

### Step 2: Start the Frontend Server

```powershell
# Open PowerShell Terminal 2
cd "D:\Intervue.io Project\live-polling-system\frontend"
npm start
```

**Expected Output:**
```
webpack compiled successfully
On Your Network: http://your-ip:3000
Local: http://localhost:3000
```

The browser should automatically open to `http://localhost:3000`

---

### Step 3: Test the Application

1. **Homepage** should show:
   - Title: "Welcome to the Live Polling System"
   - Two buttons: "I'm a Student" and "I'm a Teacher"

2. **Click "I'm a Student"**:
   - Enter your name
   - Enter teacher ID (any number)
   - Wait for a poll to be created by teacher

3. **Open another browser tab/window** and test as Teacher:
   - Click "I'm a Teacher"
   - Create a poll with question and options
   - See real-time votes coming in

---

## 📋 Detailed Troubleshooting

### Issue 1: UUID TypeScript Error ✅ FIXED

**Problem:**
```
TS7016: Could not find a declaration file for module 'uuid'
```

**Solution Applied:**
- Added `@types/uuid` to frontend dependencies
- Run: `npm install` in frontend directory

**Verify:**
```powershell
cd "D:\Intervue.io Project\live-polling-system\frontend"
npm list @types/uuid
# Should show: @types/uuid@9.0.0
```

---

### Issue 2: MongoDB Connection Failed

**Problem:**
```
✗ MongoDB connection failed: MongooseServerSelectionError
connect ECONNREFUSED 127.0.0.1:27017
```

**Cause:**
- IP address not whitelisted in MongoDB Atlas Network Access

**Solution:**
1. Go to: https://cloud.mongodb.com
2. Login to your account
3. Click your cluster "cluster0"
4. Go to: **Security** → **Network Access**
5. Click: **Add IP Address**
6. Choose one:
   - **Easy**: Click "Allow Access from Anywhere" → `0.0.0.0/0` → **Confirm**
   - **Secure**: Add your current IP from ipchicken.com
7. Wait 1-2 minutes for changes to apply
8. Try again: `npm run dev`

---

### Issue 3: Backend Build Errors

**Problem:**
```
error TS1234: Some TypeScript error
```

**Solutions:**
```powershell
# Clear and rebuild
cd "D:\Intervue.io Project\live-polling-system\backend"
rm -r dist/
npm run build
# Check for errors
npm run dev
```

---

### Issue 4: Frontend Not Compiling

**Problem:**
```
Compiled with problems
ERROR in src/...
```

**Solutions:**
```powershell
cd "D:\Intervue.io Project\live-polling-system\frontend"
# Clear cache
rm -r node_modules
npm install
# Restart
npm start
```

---

### Issue 5: Port Already in Use

**Problem:**
```
PORT 5000 already in use
```

**Solution:**
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F

# Or use different port
$env:PORT=5001
npm run dev
```

---

## 🔍 Verification Checklist

Before testing the app, verify:

```powershell
# ✅ Check Node.js
node --version
npm --version

# ✅ Check backend folder
cd "D:\Intervue.io Project\live-polling-system\backend"
ls -la node_modules | grep -E "(express|mongoose|socket)" | wc -l
# Should show: 3 or more

# ✅ Check frontend folder
cd "D:\Intervue.io Project\live-polling-system\frontend"
ls -la node_modules | grep -E "(react|react-router|socket)" | wc -l
# Should show: 3 or more

# ✅ Check .env file
cat .env
# Should show MONGODB_URI with your connection string

# ✅ Check MongoDB connection string
$mongoUri = (Get-Content "..\backend\.env" | Select-String "MONGODB_URI").Line
Write-Host $mongoUri
# Should show: mongodb+srv://sonuanand148_db_user:...@cluster0.l4ogxhm.mongodb.net
```

---

## 🎯 Features to Test

Once the app is running on `http://localhost:3000`:

### As a Teacher:
- [ ] Click "I'm a Teacher"
- [ ] Create a poll with:
  - Question: "What's your favorite color?"
  - Options: Red, Blue, Green
  - Duration: 30 seconds
- [ ] See the live dashboard
- [ ] See votes coming in real-time
- [ ] See timer counting down
- [ ] See student count increasing
- [ ] Click "End Poll" button
- [ ] See poll history

### As a Student:
- [ ] Click "I'm a Student"
- [ ] Enter your name
- [ ] Enter teacher ID (from teacher's URL or any number)
- [ ] See the poll question
- [ ] See the timer
- [ ] Select an option
- [ ] Click "Vote"
- [ ] See the results
- [ ] Verify vote was counted on teacher dashboard

### Connection Features:
- [ ] Open multiple student tabs
- [ ] Vote from each - see count increase on teacher dashboard
- [ ] Refresh a student tab - should rejoin the poll
- [ ] Refresh teacher tab - should restore the poll state

---

## 📊 Expected File Structure

```
D:\Intervue.io Project\live-polling-system\
├── backend/
│   ├── src/
│   │   ├── server.ts
│   │   ├── models/
│   │   │   ├── Poll.ts
│   │   │   └── Student.ts
│   │   ├── services/
│   │   │   ├── PollService.ts
│   │   │   └── StudentService.ts
│   │   ├── controllers/
│   │   │   └── PollController.ts
│   │   ├── sockets/
│   │   │   └── PollSocketHandler.ts
│   │   └── utils/
│   │       └── database.ts
│   ├── .env
│   ├── package.json
│   └── node_modules/
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── index.tsx
│   │   ├── components/
│   │   │   ├── RoleSelection.tsx
│   │   │   ├── TeacherView.tsx
│   │   │   └── StudentView.tsx
│   │   ├── hooks/
│   │   │   ├── useSocket.ts
│   │   │   ├── usePollTimer.ts
│   │   │   └── usePoll.ts
│   │   └── components/ (CSS files)
│   ├── .env.local
│   ├── package.json
│   └── node_modules/
│
├── .env.example
├── README.md
└── QUICKSTART.md
```

---

## 🚀 Next Steps After Testing

1. **✅ Test locally** - Verify all features work
2. **📦 Deploy Backend** - Use Render.com or Heroku
3. **🌐 Deploy Frontend** - Use Vercel or Netlify
4. **📧 Submit** - Email links to pallavi@intervue.info

---

## 💬 Need Help?

If you get stuck, check:

1. **MongoDB Connection**: Whitelist IP in Atlas Network Access
2. **TypeScript Errors**: Run `npm install` in that directory
3. **Port Issues**: Check `netstat -ano | findstr :5000`
4. **Module Errors**: Delete `node_modules` and `npm install` again

---

## ✨ You're All Set!

Run the 3 quick start steps above and let me know what you see in the terminal! 🎉
