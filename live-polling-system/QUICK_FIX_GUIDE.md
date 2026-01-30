# 🔧 Quick Diagnostic & Fix Guide

## Run This First

```powershell
# Check all installations
npm --version
node --version

# Go to backend
cd "D:\Intervue.io Project\live-polling-system\backend"

# Check if dependencies are installed
dir node_modules | wc -l
# Should be 144+ packages

# Check if .env has MongoDB URI
Get-Content .env

# Build backend
npm run build

# If build succeeds, try running
npm run dev
```

---

## Common Errors & Fixes

### ❌ "mongosh not found"
**FIX:** You don't need mongosh. MongoDB Atlas is hosted.
- Just ensure backend can connect
- Run `npm run dev` to test

---

### ❌ "TS7016: Could not find declaration for 'uuid'"
**STATUS:** ✅ FIXED - We added @types/uuid
**FIX:** Already done in frontend/package.json

---

### ❌ "ECONNREFUSED 127.0.0.1:27017"
**CAUSE:** IP not whitelisted in MongoDB Atlas
**FIX:**
1. Go to: https://cloud.mongodb.com
2. Security → Network Access
3. Add IP Address → 0.0.0.0/0 → Confirm
4. Wait 2 minutes
5. Try again: npm run dev

---

### ❌ "Cannot find module 'express'"
**FIX:**
```powershell
cd backend
rm -r node_modules package-lock.json
npm install
npm run dev
```

---

### ❌ "Port 5000 already in use"
**FIX:**
```powershell
# Option 1: Kill existing process
netstat -ano | findstr :5000
taskkill /PID <number> /F

# Option 2: Use different port
$env:PORT=5001
npm run dev
```

---

### ❌ "Frontend won't start"
**FIX:**
```powershell
cd frontend
rm -r node_modules package-lock.json
npm install
npm start
```

---

## Complete Reset (Nuclear Option)

If everything is broken, do this:

```powershell
# Backend
cd "D:\Intervue.io Project\live-polling-system\backend"
rm -r node_modules dist package-lock.json
npm install
npm run build
npm run dev

# Frontend (in another terminal)
cd "D:\Intervue.io Project\live-polling-system\frontend"
rm -r node_modules build package-lock.json
npm install
npm start
```

---

## Verification Script

```powershell
# Test backend connectivity
$mongoUri = (Get-Content "D:\Intervue.io Project\live-polling-system\backend\.env" | Select-String "MONGODB_URI").Line
Write-Host "MongoDB URI: $mongoUri"

# Check if it has your credentials
if ($mongoUri -like "*sonuanand148_db_user*") {
    Write-Host "✅ Username correct"
} else {
    Write-Host "❌ Username missing"
}

if ($mongoUri -like "*4Tz1D4pstBXAS3T3*") {
    Write-Host "✅ Password configured"
} else {
    Write-Host "❌ Password missing"
}

if ($mongoUri -like "*cluster0.l4ogxhm.mongodb.net*") {
    Write-Host "✅ Cluster correct"
} else {
    Write-Host "❌ Cluster URL wrong"
}
```

---

## What to Share When Asking for Help

When reporting issues, run this and share output:

```powershell
# System info
node --version
npm --version
Get-ChildItem C:\Windows\System32\mongosh.exe -ErrorAction SilentlyContinue

# Backend status
cd "D:\Intervue.io Project\live-polling-system\backend"
npm list express mongoose socket.io
npm run build

# Error log (last 50 lines of error)
npm run dev 2>&1 | Select-Object -Last 50
```

---

## 🎯 Success Indicators

### Backend Running Successfully:
```
✅ Shows:
🚀 Server running on http://localhost:5000
📡 Socket.io listening on ws://localhost:5000
✅ MongoDB connected successfully
```

### Frontend Running Successfully:
```
✅ Shows:
webpack compiled
Compiled successfully!
Open http://localhost:3000 in browser
```

### Application Works:
```
✅ Can see home page with "I'm a Student" and "I'm a Teacher"
✅ Can click buttons without errors
✅ Can create/answer polls
✅ Real-time updates visible
```

---

## 📞 If Still Stuck

Share this information:

```powershell
# 1. What command did you run?
npm run dev

# 2. What's the exact error? (full error message)
[PASTE ERROR HERE]

# 3. Verify environment
node --version
npm --version

# 4. Check MongoDB connection file
cat "D:\Intervue.io Project\live-polling-system\backend\.env"

# 5. Check node_modules installed
ls "D:\Intervue.io Project\live-polling-system\backend\node_modules" | measure | select -expand count
```

---

**Remember: MongoDB Atlas is cloud-based, not local. No additional setup needed!**
