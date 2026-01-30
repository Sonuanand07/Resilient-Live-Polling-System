# Live Polling System - Complete Setup & Deployment Guide

## Project Structure Overview

```
live-polling-system/
├── frontend/          # React TypeScript application
│   ├── src/
│   │   ├── components/    # UI components (RoleSelection, TeacherView, StudentView)
│   │   ├── hooks/         # Custom React hooks (useSocket, usePoll, usePollTimer)
│   │   ├── App.tsx
│   │   └── index.tsx
│   └── package.json
├── backend/           # Node.js Express + Socket.io server
│   ├── src/
│   │   ├── controllers/   # HTTP request handlers
│   │   ├── services/      # Business logic
│   │   ├── models/        # MongoDB schemas
│   │   ├── sockets/       # Socket.io handlers
│   │   ├── utils/         # Utilities (database connection)
│   │   └── server.ts      # Main server file
│   ├── package.json
│   └── tsconfig.json
└── Documentation files
```

---

## Prerequisites

- **Node.js** v16 or higher
- **npm** v8 or higher
- **MongoDB** (local or cloud instance - MongoDB Atlas)
- **Git** (for version control)

---

## Step-by-Step Installation

### 1. Clone/Initialize the Project

If starting fresh with git:
```bash
git init
git add .
git commit -m "Initial commit: Live Polling System setup"
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Install additional packages if needed
npm install express cors socket.io mongoose dotenv uuid

# Build TypeScript
npm run build

# Start the server
npm start
```

**Expected output:**
```
✓ MongoDB connected successfully
🚀 Server running on http://localhost:5000
📡 Socket.io listening on ws://localhost:5000
```

### 3. Frontend Setup

In a new terminal:
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

**Expected output:**
```
Compiled successfully.
✓ Frontend running on http://localhost:3000
```

---

## Environment Variables

### Backend (.env file)

Create a `.env` file in the `backend/` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/live-polling-system
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/live-polling-system

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env file)

Create a `.env` file in the `frontend/` directory:

```env
REACT_APP_SOCKET_URL=http://localhost:5000
```

---

## Key Features Implemented

### ✅ Core Features

1. **Teacher Persona**
   - Create polls with custom questions and options
   - Set configurable timer duration (default: 60 seconds)
   - View real-time student vote results
   - See live student count
   - View complete poll history from database
   - Option to remove students from poll
   - Auto-end polls after timeout

2. **Student Persona**
   - Enter unique name per session
   - Enter teacher ID to join specific poll
   - Receive question in real-time
   - Timer syncs with server (handles late joins)
   - Submit vote within time limit
   - View final results

3. **Resilience Features**
   - State recovery on browser refresh
   - Timer synchronization with server
   - Duplicate vote prevention (server-side validation)
   - Connection error handling and recovery

### ✅ Bonus Features

- **Poll History**: Teacher can view all past polls with results
- **Student Management**: Teacher can remove students from active poll
- **Real-time Updates**: Socket.io for instant communication

---

## Socket.io Events Reference

### Teacher Events

**Join as teacher:**
```
emit('teacher-join', { teacherId: string })
```

**Create a poll:**
```
emit('create-poll', {
  teacherId: string,
  question: string,
  options: string[],
  duration: number  // in seconds
})
```

**End poll manually:**
```
emit('end-poll', {
  pollId: string,
  teacherId: string
})
```

**Remove student:**
```
emit('remove-student', {
  studentId: string,
  pollId: string,
  teacherId: string
})
```

### Student Events

**Request active poll:**
```
emit('request-active-poll', {
  teacherId: string
})
```

**Join as student:**
```
emit('student-join', {
  studentName: string,
  sessionId: string,
  pollId: string,
  teacherId: string
})
```

**Submit vote:**
```
emit('submit-vote', {
  pollId: string,
  studentId: string,
  optionId: string,
  sessionId: string,
  teacherId: string
})
```

---

## Git Workflow & Version Control

### Initial Setup (if starting fresh)

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Live Polling System - Full implementation

- Backend: Express + Socket.io with MongoDB
- Frontend: React with TypeScript
- Features: Real-time polling, state recovery, vote tracking"

# View commit log
git log --oneline
```

### Feature Development Workflow

For each new feature or fix:

```bash
# Create a feature branch
git checkout -b feature/chat-popup
# OR: git checkout -b fix/timer-sync

# Make changes to files
# ... edit files ...

# Stage changes
git add .

# Or stage specific files
git add frontend/src/components/ChatPopup.tsx
git add backend/src/services/ChatService.ts

# Commit with descriptive message
git commit -m "Add chat popup feature

- Implement ChatPopup component
- Add chat service for message handling
- Add socket.io events for real-time chat
- Update TeacherView and StudentView to include chat"

# Push to remote (when ready)
git push origin feature/chat-popup
```

### Viewing Changes

```bash
# See all changes (staged and unstaged)
git status

# See detailed changes
git diff

# See changes in specific file
git diff frontend/src/components/StudentView.tsx

# View commit history
git log --oneline -10

# View specific commit
git show <commit-hash>
```

### Merging & Cleanup

```bash
# Switch to main/master branch
git checkout main

# Merge feature branch
git merge feature/chat-popup

# Delete feature branch (after merge)
git branch -d feature/chat-popup

# Push merged changes to remote
git push origin main
```

---

## Deployment Guide

### Prerequisites for Deployment

1. **Frontend**: Hosted on Vercel, Netlify, or Azure Static Web Apps
2. **Backend**: Hosted on Heroku, Render, Railway, or Azure App Service
3. **Database**: MongoDB Atlas (Cloud) or self-hosted MongoDB

### Frontend Deployment (Vercel)

```bash
# Build for production
npm run build

# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
REACT_APP_SOCKET_URL=https://your-backend.com
```

### Backend Deployment (Render)

```bash
# Build project
npm run build

# Create Render account and connect GitHub
# Add environment variables:
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/db
CORS_ORIGIN=https://your-frontend.vercel.app
NODE_ENV=production
PORT=5000

# Render will automatically deploy on push
```

### Database Setup (MongoDB Atlas)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create database user
4. Get connection string
5. Update `MONGODB_URI` in backend `.env` file

---

## Testing the Application

### Manual Testing Checklist

**Teacher Flow:**
- [ ] Teacher joins with unique ID
- [ ] Can create poll with question and options
- [ ] Timer counts down correctly
- [ ] Can see real-time student responses
- [ ] Can view final results
- [ ] Can access poll history
- [ ] Can remove students

**Student Flow:**
- [ ] Student enters name and teacher ID
- [ ] Receives poll question when created
- [ ] Timer shows correct remaining time
- [ ] Can select option and submit
- [ ] Cannot submit after timer ends
- [ ] Cannot vote twice for same poll
- [ ] Can view poll results after voting

**Resilience Testing:**
- [ ] Refresh browser during active poll - state is recovered
- [ ] Refresh database - polls persist
- [ ] Late join student - timer starts correctly
- [ ] Network disconnect/reconnect - system recovers

---

## Troubleshooting

### Issue: "CastError: Cast to ObjectId failed for value 'current'"
**Solution**: Fixed in StudentView.tsx - now requests active poll from server instead of using string 'current'

### Issue: "Failed to connect to MongoDB"
**Solution**: 
- Verify MongoDB is running: `mongod`
- Check MONGODB_URI in .env file
- Verify connection string format

### Issue: "CORS error when connecting"
**Solution**: 
- Update CORS_ORIGIN in backend .env
- Should match frontend URL exactly

### Issue: "Socket connection timeout"
**Solution**:
- Verify backend server is running
- Check firewall settings
- Verify REACT_APP_SOCKET_URL in frontend

---

## Important Files Modified/Created

| File | Change | Reason |
|------|--------|--------|
| frontend/src/components/RoleSelection.tsx | Fixed text descriptions | Proper role descriptions aligned with design |
| frontend/src/components/StudentView.tsx | Fetch active poll from server | Fix ObjectId error |
| backend/src/sockets/PollSocketHandler.ts | Add request-active-poll handler | Enable student to discover active polls |
| .env files (backend & frontend) | Created | Environment configuration |

---

## API Endpoints (REST)

```
POST   /api/polls                    - Create poll
GET    /api/polls/teacher/:teacherId - Get active poll for teacher
GET    /api/polls/:pollId            - Get specific poll
POST   /api/polls/vote               - Submit vote
PUT    /api/polls/:pollId/end        - End poll
GET    /api/polls/history/:teacherId - Get teacher's poll history
GET    /health                       - Health check
```

---

## Next Steps - Bonus Features Implementation

### Chat Popup (Bonus Feature)

Files to create:
- `frontend/src/components/ChatPopup.tsx`
- `frontend/src/components/ChatPopup.css`
- `backend/src/services/ChatService.ts`

Git commands for implementation:
```bash
git checkout -b feature/chat-popup
# Implement chat feature
git add frontend/src/components/Chat*
git add backend/src/services/ChatService.ts
git commit -m "Implement chat popup feature for teacher-student interaction"
git push origin feature/chat-popup
```

---

## Submission Checklist

- [ ] All features implemented and tested
- [ ] Frontend and backend builds without errors
- [ ] ESLint warnings resolved
- [ ] Database persistence verified
- [ ] Deployed to production URLs
- [ ] Environment variables configured
- [ ] Git repository properly maintained with meaningful commits
- [ ] README.md updated with setup instructions
- [ ] Figma design alignment verified

---

## Contact & Support

For issues or clarifications:
- Email: pallavi@intervue.info
- Make sure to include:
  - Specific issue description
  - Steps to reproduce
  - Screenshots/logs if applicable

---

**Last Updated:** January 30, 2026
**Status:** ✅ Ready for Submission
