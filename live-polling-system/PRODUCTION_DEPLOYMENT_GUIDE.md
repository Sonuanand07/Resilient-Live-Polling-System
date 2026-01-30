# Production Deployment Guide

## Environment Configuration Summary

### Backend (.env configuration)

**Development (Local):**
```env
MONGODB_URI=mongodb+srv://sonuanand148_db_user:4Tz1D4pstBXAS3T3@cluster0.l4ogxhm.mongodb.net/live-polling-system?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

**Production (Render):**
```env
MONGODB_URI=mongodb+srv://sonuanand148_db_user:4Tz1D4pstBXAS3T3@cluster0.l4ogxhm.mongodb.net/live-polling-system?retryWrites=true&w=majority
PORT=5000
NODE_ENV=production
CORS_ORIGIN=https://resilient-live-polling-system-nine.vercel.app
```

### Frontend Environment Configuration

**Development (Local):**
```env
# .env.local
REACT_APP_SOCKET_URL=http://localhost:5000
```

**Production (Vercel):**
```env
# .env.production
REACT_APP_SOCKET_URL=https://resilient-live-polling-system-lujm.onrender.com
```

---

## Deployment URLs

- **Backend (Render):** https://resilient-live-polling-system-lujm.onrender.com
- **Frontend (Vercel):** https://resilient-live-polling-system-nine.vercel.app

---

## Deployment Steps

### Step 1: Update Backend Environment Variables on Render

1. Go to Render Dashboard → Your App
2. Click **Settings**
3. Scroll to **Environment**
4. Add/Update the following variables:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `MONGODB_URI` | Your MongoDB connection string |
| `CORS_ORIGIN` | `https://resilient-live-polling-system-nine.vercel.app` |
| `PORT` | `5000` |

5. Click **Save**
6. Render will auto-redeploy

### Step 2: Update Frontend Environment Variables on Vercel

1. Go to Vercel Dashboard → Your Project
2. Click **Settings** → **Environment Variables**
3. Add/Update:

| Name | Value |
|------|-------|
| `REACT_APP_SOCKET_URL` | `https://resilient-live-polling-system-lujm.onrender.com` |

4. Click **Save**
5. Vercel will trigger a new deployment

### Step 3: Verify Deployment

1. Open frontend: https://resilient-live-polling-system-nine.vercel.app
2. Test teacher flow:
   - Select "I'm a Teacher"
   - Create a poll
   - Verify it appears on teacher dashboard
3. Test student flow:
   - In another tab, select "I'm a Student"
   - Enter name and teacher ID
   - Join poll
   - Verify you receive the poll notification
   - Submit an answer
   - Verify results appear

---

## Files Included

- **backend/.env** - Development environment variables
- **backend/render.yaml** - Render deployment configuration
- **frontend/.env.local** - Development environment variables
- **frontend/.env.production** - Production environment variables
- **frontend/vercel.json** - Vercel deployment configuration

---

## Important Notes

1. **CORS Configuration:** Backend CORS is set to accept requests from the Vercel frontend URL only in production
2. **Socket.io Connection:** Frontend automatically connects to the Render backend in production
3. **MongoDB:** Uses shared MongoDB Atlas cluster (same database for all environments)
4. **Port:** Backend runs on port 5000 (handled by Render)
5. **Build Process:** Both platforms have build commands configured

---

## Troubleshooting

### Frontend shows "Connection Error"
- Check that `REACT_APP_SOCKET_URL` is set correctly in Vercel environment variables
- Verify backend is running and accessible
- Check browser console for detailed error messages

### Students not receiving polls
- Verify CORS_ORIGIN in backend matches the frontend URL
- Check network tab in browser for failed requests
- Ensure Socket.io connection is established

### MongoDB Connection Issues
- Verify `MONGODB_URI` is correct in backend environment variables
- Check MongoDB Atlas IP whitelist includes Render's IP (usually set to "Allow from anywhere")
- Test connection locally first with same URI

---

## Local Testing Before Deployment

1. Start local backend:
   ```bash
   cd backend
   npm run dev
   ```

2. Start local frontend (in another terminal):
   ```bash
   cd frontend
   npm start
   ```

3. Test at http://localhost:3000

4. Once verified, deploy to production

---

## Deployment Status

- ✅ Environment variables configured
- ✅ Render.yaml created for backend
- ✅ Vercel.json created for frontend
- ✅ Production URLs set up
- ✅ CORS configured for cross-origin requests

**Ready to deploy!**
