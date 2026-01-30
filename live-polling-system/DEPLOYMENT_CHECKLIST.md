# Production Deployment Checklist

## Pre-Deployment Tasks

### Backend (Render)

- [ ] Verify `render.yaml` is in the backend directory
- [ ] Check backend `.env.production` has correct values:
  - [ ] `NODE_ENV=production`
  - [ ] `CORS_ORIGIN=https://resilient-live-polling-system-nine.vercel.app`
  - [ ] `MONGODB_URI` is set correctly
- [ ] Build backend locally: `cd backend && npm run build`
- [ ] No TypeScript errors in build
- [ ] Git push latest code to main branch

### Frontend (Vercel)

- [ ] Verify `vercel.json` is in the frontend directory
- [ ] Check frontend `.env.production` has:
  - [ ] `REACT_APP_SOCKET_URL=https://resilient-live-polling-system-lujm.onrender.com`
- [ ] Build frontend locally: `cd frontend && npm run build`
- [ ] No build warnings/errors
- [ ] Git push latest code to main branch

---

## Deployment Steps

### Step 1: Deploy Backend to Render

1. [ ] Go to https://render.com dashboard
2. [ ] Select your backend service
3. [ ] Click **Settings** → **Environment**
4. [ ] Update environment variables:
   ```
   NODE_ENV = production
   CORS_ORIGIN = https://resilient-live-polling-system-nine.vercel.app
   MONGODB_URI = [your MongoDB URI]
   PORT = 5000
   ```
5. [ ] Save changes
6. [ ] Wait for auto-deployment to complete
7. [ ] Verify backend is running: https://resilient-live-polling-system-lujm.onrender.com/health

### Step 2: Deploy Frontend to Vercel

1. [ ] Go to https://vercel.com dashboard
2. [ ] Select your frontend project
3. [ ] Click **Settings** → **Environment Variables**
4. [ ] Update/Add:
   ```
   REACT_APP_SOCKET_URL = https://resilient-live-polling-system-lujm.onrender.com
   ```
5. [ ] Save and trigger redeploy
6. [ ] Wait for deployment to complete
7. [ ] Visit https://resilient-live-polling-system-nine.vercel.app

---

## Post-Deployment Verification

### Connectivity Test

- [ ] Open frontend URL in browser: https://resilient-live-polling-system-nine.vercel.app
- [ ] Check browser console (F12) - no connection errors
- [ ] Check Network tab - Socket.io connection should be to Render URL

### Teacher Flow Test

- [ ] Click "I'm a Teacher"
- [ ] Copy Teacher ID
- [ ] Fill in question and 2-4 options
- [ ] Select time duration (seconds/minutes/hours)
- [ ] Click "Create Poll"
- [ ] Verify poll appears with timer countdown
- [ ] Verify student count updates

### Student Flow Test

- [ ] Open frontend in another incognito/private tab
- [ ] Click "I'm a Student"
- [ ] Enter name (e.g., "Test Student")
- [ ] Enter the Teacher ID copied earlier
- [ ] Click "Join Poll"
- [ ] Verify "Waiting for Poll..." message appears
- [ ] Verify poll appears when teacher creates it
- [ ] Verify notification shows up
- [ ] Select an answer and submit
- [ ] Verify results display

### Multi-Student Test

- [ ] Open 2-3 more student tabs
- [ ] All join with teacher ID
- [ ] All vote on the same poll
- [ ] Verify all votes are counted correctly
- [ ] Verify teacher sees all responses in real-time

### Edge Cases

- [ ] Refresh page as student during active poll
  - [ ] Should recover poll state
- [ ] End poll manually from teacher dashboard
  - [ ] All students should see results
- [ ] Create new poll immediately after ending
  - [ ] Should work without errors
- [ ] Test with different time durations:
  - [ ] 10 seconds
  - [ ] 2 minutes
  - [ ] 1 hour

---

## Troubleshooting

### Frontend shows "Connection Error"

1. [ ] Check browser console for specific error message
2. [ ] Verify `REACT_APP_SOCKET_URL` is correct in Vercel:
   - Should be: `https://resilient-live-polling-system-lujm.onrender.com`
3. [ ] Verify backend URL is accessible in browser
4. [ ] Check Render backend logs for CORS errors
5. [ ] Force refresh frontend (Ctrl+Shift+R or Cmd+Shift+R)

### Students not receiving polls

1. [ ] Verify CORS_ORIGIN in backend is: `https://resilient-live-polling-system-nine.vercel.app`
2. [ ] Check backend logs in Render dashboard
3. [ ] Verify Socket.io connection is established (look for "Socket connected" in console)
4. [ ] Test with browser console open to see socket events

### MongoDB Connection Issues

1. [ ] Verify `MONGODB_URI` in Render environment variables
2. [ ] Check MongoDB Atlas cluster:
   - [ ] Database access users are created
   - [ ] IP whitelist includes Render (use 0.0.0.0/0 for "anywhere")
   - [ ] Database exists: `live-polling-system`
3. [ ] Test connection string locally first

### Vercel Build Failures

1. [ ] Check Vercel deployment logs
2. [ ] Ensure `npm run build` works locally: `cd frontend && npm run build`
3. [ ] Verify all dependencies are installed: `npm install`
4. [ ] Check for TypeScript errors: `npx tsc --noEmit`

### Render Build Failures

1. [ ] Check Render build logs in dashboard
2. [ ] Ensure backend builds locally: `cd backend && npm run build`
3. [ ] Verify TypeScript compilation works
4. [ ] Check that `node_modules` is not committed to git (use .gitignore)

---

## Performance Monitoring

- [ ] Monitor backend logs in Render dashboard for errors
- [ ] Check Vercel analytics for frontend performance
- [ ] Monitor Socket.io connection count in backend
- [ ] Check MongoDB Atlas metrics for database usage

---

## Final Sign-Off

- [ ] All verification tests passed ✓
- [ ] Frontend and backend communicating correctly ✓
- [ ] Teacher and student flows working ✓
- [ ] No console errors ✓
- [ ] Ready for submission ✓

---

## Important Reminders

1. **Keep credentials secure:** Never commit `.env.production` with real credentials
2. **CORS must match:** Backend CORS_ORIGIN must exactly match frontend domain
3. **Socket URL must be correct:** Frontend Socket URL must point to backend
4. **MongoDB accessible:** Database must be accessible from Render servers
5. **Ports:** Backend runs on port assigned by Render (usually 10000+)

