# Quick Start Guide

## Prerequisites
- Node.js v16+
- npm or yarn
- MongoDB (local or Atlas)

## Installation (1 Command)

```bash
# From root directory
npm run install-all
```

This will install dependencies for both backend and frontend.

## Running Locally

### Option 1: Separate Terminals (Recommended for Development)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### Option 2: Single Command (Quick Start)

```bash
npm run dev
```

This runs both in parallel.

## Configuration

### Backend Setup

1. Copy `.env.example` to `.env`:
```bash
cp backend/.env.example backend/.env
```

2. Update `MONGODB_URI` in `backend/.env`:
```
MONGODB_URI=mongodb://localhost:27017/live-polling-system
```

3. For MongoDB Atlas:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/live-polling-system
```

### Frontend Setup

1. Create `frontend/.env.local`:
```
REACT_APP_SOCKET_URL=http://localhost:5000
```

## Testing the App

1. Open `http://localhost:3000` in browser
2. Select role (Teacher or Student)
3. Teacher: Create a poll
4. Students: Join and answer

## Common Commands

```bash
# Backend
cd backend
npm run build      # Build TypeScript
npm start          # Run production build
npm run dev        # Run development server

# Frontend
cd frontend
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests

# Root
npm run dev        # Run both backend and frontend
npm run build      # Build both
```

## Troubleshooting

**Port Already in Use:**
```bash
# Kill process on port 5000 (Backend)
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:5000 | xargs kill -9
```

**MongoDB Connection Error:**
- Ensure MongoDB is running
- Check `MONGODB_URI` is correct
- For Atlas: Whitelist your IP address

**Socket Connection Error:**
- Ensure backend is running on port 5000
- Check `REACT_APP_SOCKET_URL` in frontend `.env.local`
- Clear browser cache and hard refresh

## Documentation

- `README.md` - Full documentation
- `ARCHITECTURE.md` - System architecture
- `DEPLOYMENT.md` - Production deployment

---

**Ready to code!** 🚀
