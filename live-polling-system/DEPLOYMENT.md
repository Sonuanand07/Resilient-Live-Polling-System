# Live Polling System - Deployment Guide

This document provides step-by-step instructions for deploying both frontend and backend to production.

---

## Deployment Options

### Option 1: Vercel (Frontend) + Render (Backend)

#### Backend Deployment on Render

1. **Create Render Account**: https://render.com

2. **Connect MongoDB**:
   - Use MongoDB Atlas (https://mongodb.com/atlas)
   - Create a cluster and get connection string

3. **Create New Web Service**:
   - Select "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Build Command**: `cd backend && npm run build`
     - **Start Command**: `cd backend && npm start`
     - **Environment Variables**:
       ```
       MONGODB_URI=<your-atlas-uri>
       NODE_ENV=production
       CORS_ORIGIN=<your-frontend-url>
       PORT=10000
       ```

#### Frontend Deployment on Vercel

1. **Create Vercel Account**: https://vercel.com

2. **Deploy**:
   - Click "Add New Project"
   - Select your GitHub repository
   - Configure:
     - **Root Directory**: `frontend`
     - **Build Command**: `npm run build`
     - **Output Directory**: `build`
     - **Environment Variables**:
       ```
       REACT_APP_SOCKET_URL=<your-backend-render-url>
       ```

3. **Deploy**: Click "Deploy" → Wait for build to complete

---

### Option 2: Heroku (Full Stack)

#### Using Heroku CLI

**Backend Setup**:
```bash
cd backend
heroku create your-app-backend
heroku config:set MONGODB_URI=<your-atlas-uri>
heroku config:set NODE_ENV=production
heroku config:set CORS_ORIGIN=https://your-app-frontend.vercel.app
git push heroku main
```

**Frontend Setup**:
```bash
cd frontend
heroku create your-app-frontend
heroku config:set REACT_APP_SOCKET_URL=https://your-app-backend.herokuapp.com
npm run build
git push heroku main
```

---

### Option 3: Railway.app (Full Stack)

1. **Create Account**: https://railway.app

2. **Backend**:
   - New Project → GitHub repo
   - Add MongoDB plugin
   - Configure environment variables
   - Deploy

3. **Frontend**:
   - New Project → GitHub repo
   - Configure environment variables
   - Deploy

---

## Production Checklist

### Before Deploying

- [ ] All environment variables are set
- [ ] MongoDB Atlas cluster is created
- [ ] Backend builds without errors: `npm run build`
- [ ] Frontend builds without errors: `npm run build`
- [ ] Test locally with production settings
- [ ] Review security settings

### After Deploying

- [ ] Test role selection page
- [ ] Create test poll as teacher
- [ ] Join poll as student (multiple devices)
- [ ] Verify real-time updates work
- [ ] Check timer synchronization
- [ ] Verify state recovery on refresh
- [ ] Check error handling

---

## Common Issues & Fixes

### CORS Errors

**Problem**: "Access to XMLHttpRequest blocked by CORS policy"

**Solution**:
1. Update `CORS_ORIGIN` env variable with frontend URL
2. Restart backend service
3. Hard refresh frontend (Ctrl+Shift+R)

### Socket Connection Timeout

**Problem**: "Failed to connect to server"

**Solution**:
1. Verify `REACT_APP_SOCKET_URL` is correct
2. Check backend service is running
3. Check firewall rules allow WebSocket
4. Verify no proxy blocking connections

### Database Connection Failed

**Problem**: "MongoDB connection refused"

**Solution**:
1. Verify MongoDB Atlas IP whitelist includes your server
2. Check connection string in `MONGODB_URI`
3. Verify MongoDB cluster is not paused
4. Check credentials are correct

### Build Failures

**Problem**: "Build failed - dependencies not found"

**Solution**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## Performance Optimization

### Frontend Optimizations

- Code splitting via React.lazy() is pre-configured
- CSS is minified in production build
- JavaScript is optimized and minified

### Backend Optimizations

- Enable GZIP compression
- Connection pooling for MongoDB
- Add rate limiting for API endpoints

---

## Monitoring & Logs

### Render/Heroku Logs

```bash
# View real-time logs
heroku logs --tail

# View specific app logs
render logs <service-name>
```

### Monitor from Dashboard

- Render: https://dashboard.render.com
- Heroku: https://dashboard.heroku.com
- Vercel: https://vercel.com/dashboard

---

## Scaling Considerations

For high traffic:

1. **Database**: Use MongoDB Atlas sharding
2. **Backend**: Use multiple dynos/containers
3. **Frontend**: CDN is handled by Vercel/Netlify
4. **WebSocket**: Consider sticky sessions for Socket.io

---

## Rollback Procedure

### If Something Goes Wrong

**Render**:
1. Go to service settings
2. Rollback to previous deploy

**Heroku**:
```bash
heroku releases
heroku rollback v<version>
```

**Vercel**:
1. Click "Deployments"
2. Select previous deployment
3. Click "Promote to Production"

---

**Deployment Support**: Check respective platform documentation for detailed guides.
