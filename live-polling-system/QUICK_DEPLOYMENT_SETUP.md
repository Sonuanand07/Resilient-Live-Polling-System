# Quick Deployment Guide - Render & Vercel Setup

## 📋 Quick Overview

- **Backend:** Deploy to Render (https://resilient-live-polling-system-lujm.onrender.com)
- **Frontend:** Deploy to Vercel (https://resilient-live-polling-system-nine.vercel.app)
- **Database:** MongoDB Atlas (shared connection string)
- **Time Estimate:** 10-15 minutes

---

## 🔧 Step 1: Deploy Backend to Render

### What Render Does:
- Builds the backend Node.js code
- Installs dependencies
- Compiles TypeScript to JavaScript
- Runs the server on a provided port
- Keeps it running 24/7

### Action Items:

1. **Go to Render Dashboard:**
   - Visit: https://dashboard.render.com

2. **Find Your Service:**
   - Look for: "live-polling-system-backend" or similar
   - Click to open the service

3. **Update Environment Variables:**
   - Click: **Settings** (in left menu)
   - Scroll to: **Environment**
   - You should see existing variables
   - **Update or Add these 4 variables:**

| Key | Value | Explanation |
|-----|-------|-----------|
| `NODE_ENV` | `production` | Tell backend we're in production |
| `MONGODB_URI` | `mongodb+srv://sonuanand148_db_user:4Tz1D4pstBXAS3T3@cluster0.l4ogxhm.mongodb.net/live-polling-system?retryWrites=true&w=majority` | Connect to MongoDB database |
| `CORS_ORIGIN` | `https://resilient-live-polling-system-nine.vercel.app` | Allow requests from Vercel frontend |
| `PORT` | `5000` | Server port (Render may override this) |

4. **Save Changes:**
   - Click **Save** button
   - Render will auto-deploy (this takes 2-3 minutes)

5. **Verify:**
   - Wait for green "Live" indicator
   - Open service URL to check if running
   - You should see backend is working

---

## 🎨 Step 2: Deploy Frontend to Vercel

### What Vercel Does:
- Builds React code using `npm run build`
- Optimizes JavaScript and CSS
- Hosts as static files (very fast)
- Provides global CDN distribution
- Free HTTPS certificate

### Action Items:

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/dashboard

2. **Find Your Project:**
   - Look for: "resilient-live-polling-system" or similar
   - Click to open

3. **Update Environment Variables:**
   - Click: **Settings** (in top menu)
   - Click: **Environment Variables** (left menu)
   - **Add this variable:**

| Name | Value | Explanation |
|------|-------|-----------|
| `REACT_APP_SOCKET_URL` | `https://resilient-live-polling-system-lujm.onrender.com` | Tell frontend where backend is |

4. **Save & Redeploy:**
   - Click **Save**
   - Scroll to **Deployments** section
   - You should see a new deployment starting
   - Or manually trigger: Click **Redeploy** button
   - Wait for blue "Ready" indicator (1-2 minutes)

5. **Verify:**
   - Click deployment URL
   - Should open your app
   - Check browser console (F12) - should say "Socket connected"

---

## ✅ Step 3: Test Everything Works

### Test 1: Check Backend is Running

**In browser:**
1. Go to: https://resilient-live-polling-system-lujm.onrender.com
2. Should show plain text response or JSON (not a 404 error)
3. This means backend is running ✓

### Test 2: Check Frontend Connects

**In browser:**
1. Go to: https://resilient-live-polling-system-nine.vercel.app
2. Open Developer Console: Press F12
3. Look for message: `"Socket connected"` (in Console tab)
4. This means frontend is connected to backend ✓

### Test 3: Full Teacher Flow

**In same browser:**
1. Click: "I'm a Teacher"
2. Copy the **Teacher ID**
3. Enter a question: "What is 2+2?"
4. Add options: "3", "4", "5"
5. Set time: "1" minute
6. Click: "Create Poll"
7. Should see poll on dashboard ✓

### Test 4: Full Student Flow

**In NEW browser tab (or private/incognito):**
1. Go to: https://resilient-live-polling-system-nine.vercel.app
2. Click: "I'm a Student"
3. Enter name: "Test Student"
4. Paste the **Teacher ID** from Test 3
5. Click: "Join Poll"
6. Should say "Waiting for Poll..."
7. You should get a notification that a poll appeared
8. See the teacher's question ✓
9. Select answer "4"
10. Click "Submit Answer"
11. Should see results ✓

### Test 5: Multi-Student Test

**Open 2 more student tabs and repeat Test 4**
- Both students should see the poll
- Both votes should count on teacher dashboard
- Results should update in real-time ✓

---

## 🔧 Troubleshooting During Deployment

### Issue: "Connection Error" on Frontend

**Check 1: Browser Console Error**
- Open F12 → Console tab
- Look for error message
- Most common: "Failed to connect to server"

**Check 2: Environment Variable Set?**
- Go to Vercel Dashboard
- Check Settings → Environment Variables
- Should see: `REACT_APP_SOCKET_URL=https://resilient-live-polling-system-lujm.onrender.com`
- If missing, add it
- Redeploy after adding

**Check 3: Backend Running?**
- Try opening backend URL directly in browser
- Go to: https://resilient-live-polling-system-lujm.onrender.com
- Should see some response (not timeout)
- If times out, check Render dashboard - backend might be building

### Issue: Students Don't Receive Polls

**Check 1: CORS Configuration**
- Go to Render Dashboard
- Check environment variable: `CORS_ORIGIN`
- Should be: `https://resilient-live-polling-system-nine.vercel.app`
- If wrong, update it and save

**Check 2: Socket Connection**
- Open browser console (F12)
- Should see: "Socket connected"
- If not, check backend logs in Render

### Issue: Database Connection Error

**Check 1: MongoDB URI**
- Go to Render Dashboard
- Check: `MONGODB_URI` environment variable
- Should start with: `mongodb+srv://`
- Should end with: `?retryWrites=true&w=majority`

**Check 2: MongoDB Atlas Access**
- Go to MongoDB Atlas: https://cloud.mongodb.com
- Check your cluster
- Go to **Security** → **Network Access**
- Make sure Render IP is whitelisted (use 0.0.0.0/0 for anywhere)

---

## 📊 How to Check Deployment Status

### Check Backend (Render)

1. Go to: https://dashboard.render.com
2. Click your backend service
3. Look for:
   - ✅ Green "Live" badge = Running
   - 🔴 Red badge = Error (check build logs)
   - 🟡 Yellow = Building (wait a few minutes)

4. Check Build Logs:
   - Scroll down to "Build Logs"
   - Shows what happened during deployment
   - Errors will be listed here

### Check Frontend (Vercel)

1. Go to: https://vercel.com/dashboard
2. Click your frontend project
3. Look for:
   - ✅ Blue "Ready" badge = Deployed
   - 🔴 Red = Error (check build logs)
   - 🟡 Yellow = Building

4. Check Build Logs:
   - Scroll to "Deployments" section
   - Click the deployment
   - Click "Build Logs" or "Runtime Logs"

---

## 🚀 Final Checklist

Before submitting, verify:

- [ ] Backend URL loads: https://resilient-live-polling-system-lujm.onrender.com
- [ ] Frontend URL loads: https://resilient-live-polling-system-nine.vercel.app
- [ ] Browser console shows "Socket connected"
- [ ] Teacher can create a poll
- [ ] Student gets poll notification instantly
- [ ] Student can vote
- [ ] Teacher sees votes in real-time
- [ ] Timer works (MM:SS format)
- [ ] Multi-student voting works correctly

---

## 📞 If Something Goes Wrong

1. **Check Build Logs First:**
   - Render: Dashboard → Service → Build Logs
   - Vercel: Dashboard → Project → Deployments → Build Logs

2. **Common Issues:**
   - Missing environment variable? → Add it and redeploy
   - Old code? → Git push to main and redeploy
   - Port conflict? → Render handles this automatically
   - Timeout? → Backend taking too long to start (wait longer, free tier is slower)

3. **Reset & Redeploy:**
   - Render: Click "Manual Deploy" → "Deploy latest"
   - Vercel: Go to Deployments → Click "..." → "Redeploy"

---

## ⏱️ Typical Deployment Timeline

| Step | Time | Status |
|------|------|--------|
| Push code to git | 1 min | Instant |
| Backend build on Render | 2-3 min | Watch for "Live" badge |
| Frontend build on Vercel | 1-2 min | Watch for "Ready" badge |
| Test connection | 1 min | Open in browser |
| Verify functionality | 5 min | Full flow test |
| **Total** | **10-15 min** | **Ready!** |

---

## 🎉 Success Indicators

When everything works:

✅ Backend service shows "Live" on Render  
✅ Frontend deployment shows "Ready" on Vercel  
✅ Browser console shows "Socket connected"  
✅ Teacher can create polls  
✅ Students receive polls instantly  
✅ Voting works in real-time  
✅ No errors in browser console  
✅ No errors in Render/Vercel logs  

**Your app is ready for submission!**

---

## 📝 Next Steps

1. Test thoroughly using the checklist above
2. Take screenshots of working demo (teacher + student polls)
3. Prepare submission email with:
   - Your full name
   - GitHub repository URL
   - Frontend URL: https://resilient-live-polling-system-nine.vercel.app
   - Backend URL: https://resilient-live-polling-system-lujm.onrender.com
4. Send to: **pallavi@intervue.info**
5. Subject: **SDE INTERN ASSIGNMENT SUBMISSION**

Good luck! 🚀
