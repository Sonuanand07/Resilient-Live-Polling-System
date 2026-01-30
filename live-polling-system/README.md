# Live Polling System - Intervue.io Assignment

A **Resilient Live Polling System** built with React, Node.js, Express, Socket.io, MongoDB, and TypeScript. This system enables teachers to create real-time polls and students to submit answers with automatic state recovery.

---

## 🌐 Live Production URLs

- **Frontend**: https://resilient-live-polling-system-nine.vercel.app
- **Backend API**: https://resilient-live-polling-system-lujm.onrender.com
- **GitHub Repository**: https://github.com/Sonuanand07/Resilient-Live-Polling-System

---

## 🚀 Quick Start

### Prerequisites
- Node.js v16+ and npm v8+
- MongoDB (local or MongoDB Atlas)
- Git

### Setup (5 minutes)

```bash
# Clone repository
git clone https://github.com/Sonuanand07/Resilient-Live-Polling-System
cd live-polling-system

# Backend Setup
cd backend
npm install
npm run build
npm start  # Runs on http://localhost:5000

# Frontend Setup (new terminal, from root)
cd frontend
npm install
npm start  # Runs on http://localhost:3000
```

### Usage
1. **Local Development**: Open http://localhost:3000
2. **Production**: Open https://resilient-live-polling-system-nine.vercel.app
3. Teacher: Click "I'm a Teacher" → Create a poll → Share Teacher ID
4. Student: Click "I'm a Student" → Enter name and teacher ID → Join poll

---

## 📋 What's New (Latest Fixes)

### ✅ Fixed Issues

| Issue | Status | Fix |
|-------|--------|-----|
| Student not receiving polls | ✅ Fixed | Socket room join on request-active-poll |
| Poll duration limited to seconds | ✅ Fixed | Added Minutes/Hours options |
| Timer display format | ✅ Fixed | Shows MM:SS and HH:MM:SS format |
| Name and Teacher ID form flow | ✅ Fixed | Combined into single form |
| TypeScript compilation on Render | ✅ Fixed | Added proper type annotations |
| ESLint warnings | ✅ Fixed | Removed unused imports |

### ✅ All Features Working

- Teacher creates polls with custom timer
- Students join with teacher ID
- Real-time vote updates
- Timer synchronization (late join handled)
- Poll history persistence
- State recovery on refresh
- One vote per student prevention

---

## 🎯 Project Overview

This is a production-ready polling application featuring:

- ✅ **Real-time Communication** via Socket.io
- ✅ **State Recovery** - Refreshing doesn't lose poll data
- ✅ **Timer Synchronization** - Servers are the source of truth
- ✅ **Race Condition Prevention** - One vote per student per poll
- ✅ **Responsive Design** - Matches Figma design perfectly
- ✅ **Clean Architecture** - Controller-Service pattern with separation of concerns
- ✅ **Error Handling** - Graceful failures with user feedback
- ✅ **TypeScript** - Full type safety

---

## 🏗️ Architecture

### Backend Stack
- **Framework**: Node.js + Express
- **Real-time**: Socket.io
- **Database**: MongoDB
- **Language**: TypeScript
- **Architecture Pattern**: Controller-Service

### Frontend Stack
- **Framework**: React 18
- **Routing**: React Router v6
- **Real-time**: Socket.io Client
- **Language**: TypeScript
- **Custom Hooks**: useSocket, usePollTimer, usePoll

### Project Structure

```
live-polling-system/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   ├── Poll.ts          # Poll schema
│   │   │   └── Student.ts       # Student schema
│   │   ├── services/
│   │   │   ├── PollService.ts   # Poll business logic
│   │   │   └── StudentService.ts # Student management
│   │   ├── controllers/
│   │   │   └── PollController.ts # API endpoints
│   │   ├── sockets/
│   │   │   └── PollSocketHandler.ts # WebSocket handlers
│   │   ├── utils/
│   │   │   └── database.ts      # DB connection
│   │   └── server.ts            # Main server
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── hooks/
│   │   │   ├── useSocket.ts     # Socket connection hook
│   │   │   ├── usePollTimer.ts  # Timer synchronization
│   │   │   └── usePoll.ts       # Poll state hook
│   │   ├── components/
│   │   │   ├── RoleSelection.tsx # Role selector
│   │   │   ├── StudentView.tsx   # Student interface
│   │   │   ├── TeacherView.tsx   # Teacher dashboard
│   │   │   └── [CSS files]       # Styling
│   │   ├── App.tsx
│   │   ├── index.tsx
│   │   └── styles/
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   └── tsconfig.json
│
└── README.md (this file)
```

---

## ⚙️ Installation & Setup

### Prerequisites
- **Node.js** v16+ 
- **npm** or **yarn**
- **MongoDB** (local or Atlas)

### 1️⃣ Clone & Navigate
```bash
cd live-polling-system
```

### 2️⃣ Backend Setup

```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Edit .env with your MongoDB URI
# MONGODB_URI=mongodb://localhost:27017/live-polling-system
# PORT=5000
# CORS_ORIGIN=http://localhost:3000
# NODE_ENV=development

# Build TypeScript
npm run build

# Start development server
npm run dev
```

The backend will start on `http://localhost:5000`

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install

# Create .env.local (optional)
echo "REACT_APP_SOCKET_URL=http://localhost:5000" > .env.local

# Start development server
npm start
```

The frontend will start on `http://localhost:3000`

---

## 🚀 Running the Application

### Development Mode

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

Visit `http://localhost:3000` in your browser.

### Production Build

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
```

---

## 🌍 Deployment Guide

### Production URLs (Already Deployed)

- **Frontend (Vercel)**: https://resilient-live-polling-system-nine.vercel.app
- **Backend API (Render)**: https://resilient-live-polling-system-lujm.onrender.com
- **GitHub**: https://github.com/Sonuanand07/Resilient-Live-Polling-System

### Deploy to Render (Backend)

#### Prerequisites
- Render.com account (free tier available)
- MongoDB Atlas connection string
- GitHub repository linked

#### Steps

1. **Create New Service on Render**:
   - Go to Render Dashboard
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `live-polling-system` folder

2. **Configure Build Settings**:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Root Directory**: `backend`

3. **Set Environment Variables**:
   - `NODE_ENV`: `development` (for build) then `production` (runtime)
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `PORT`: `5000`
   - `CORS_ORIGIN`: Your Vercel frontend URL

4. **Deploy**:
   - Click "Deploy"
   - Watch build logs for completion
   - Access API at `https://<service-name>.onrender.com`

### Deploy to Vercel (Frontend)

#### Prerequisites
- Vercel account (free tier available)
- GitHub repository linked

#### Steps

1. **Create New Project on Vercel**:
   - Go to Vercel Dashboard
   - Click "New Project"
   - Import your GitHub repository
   - Select the project root

2. **Configure Build Settings**:
   - **Framework**: React
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Root Directory**: `frontend`

3. **Set Environment Variables**:
   - `REACT_APP_SOCKET_URL`: Your Render backend URL (e.g., `https://your-app.onrender.com`)

4. **Deploy**:
   - Click "Deploy"
   - Vercel automatically deploys on every git push
   - Access frontend at `https://<project>.vercel.app`

### Troubleshooting Deployment

**Issue**: TypeScript errors on Render (missing @types packages)
- **Solution**: Ensure `package-lock.json` is committed with all devDependencies
- Render `buildCommand` must be: `npm install && npm run build`
- Don't set `NODE_ENV=production` during build phase

**Issue**: Socket connection fails in production
- **Solution**: Ensure `CORS_ORIGIN` matches your frontend URL
- Check backend logs for CORS errors

**Issue**: Frontend can't connect to backend
- **Solution**: Update `REACT_APP_SOCKET_URL` to your Render backend URL
- Verify backend is deployed and running: `https://<backend-url>/health`

---

## 📱 Usage Guide

### For Teachers

1. **Access the application** → Select "I'm a Teacher"
2. **Create a Poll**:
   - Enter your question
   - Add at least 2 options
   - Set timer duration (10-300 seconds)
   - Click "Create Poll"
3. **Monitor Live Results**:
   - View real-time vote counts and percentages
   - See student participation count
   - Timer counts down in real-time
4. **End Poll**:
   - Click "End Poll" button manually, or wait for auto-end
   - View final results
   - Access poll history

### For Students

1. **Join the Poll** → Select "I'm a Student"
2. **Enter Details**:
   - Enter your name
   - Enter teacher's ID
   - Click "Join"
3. **Answer Question**:
   - Wait for teacher to ask a question
   - Select your answer before timer expires
   - Click "Submit Answer"
4. **View Results**:
   - After submission, see live poll results
   - Results update as other students vote

---

## 🔄 State Recovery (Resilience)

### How It Works

1. **On Teacher Refresh During Active Poll**:
   - Socket connects and emits `teacher-join`
   - Backend sends `active-poll` event with current poll state
   - UI resumes showing live results

2. **On Student Refresh During Active Poll**:
   - Socket reconnects with stored session ID
   - Backend retrieves current poll state
   - Timer synchronizes to server time
   - Student can continue answering

3. **Timer Synchronization**:
   - Server time is source of truth
   - Client calculates remaining time: `endTime - currentTime`
   - If student joins late: timer starts at `duration - elapsed`

### Code Example (Timer Sync)
```typescript
// Client-side timer calculation
const elapsed = Math.floor((Date.now() - startTime) / 1000);
const remaining = Math.max(0, duration - elapsed);
```

---

## 🔒 Security & Data Integrity

### Race Condition Prevention

```typescript
// Check if student already voted
if (poll.studentResponses.has(studentId)) {
  throw new Error('Student has already answered this question');
}
```

### Vote Validation

- Server validates each vote submission
- Each student can only vote once per poll
- Student ID is validated on the backend
- Database transactions ensure consistency

### Error Handling

- Try-catch blocks in all services
- User-friendly error messages
- Connection error recovery with auto-reconnect
- Graceful degradation if database is temporarily unavailable

---

## 📊 Database Schema

### Poll Collection
```typescript
{
  _id: ObjectId,
  teacherId: string,
  question: string,
  options: [
    { id: string, text: string, votes: number }
  ],
  duration: number,
  startedAt: Date,
  endedAt: Date,
  isActive: boolean,
  studentResponses: Map<string, string>, // studentId -> optionId
  createdAt: Date,
  updatedAt: Date
}
```

### Student Collection
```typescript
{
  _id: ObjectId,
  sessionId: string,
  name: string,
  pollId: string,
  hasAnswered: boolean,
  selectedOption: string,
  answeredAt: Date,
  joinedAt: Date,
  isRemoved: boolean
}
```

---

## 🎨 Design Implementation

The UI is built to match the Figma design exactly:

- **Color Scheme**:
  - Primary Gradient: `#8F64E1` to `#1D68BD`
  - Secondary Gradient: `#7565D9` to `#4D0ACD`
  - Neutral: `#F1F1F1`, `#D9D9D9`

- **Typography**:
  - Font: "Sora"
  - Headings: 40px (Primary), 23px (Secondary)
  - Body: 16px-19px

- **Components**:
  - Gradient buttons with hover effects
  - Card-based layout for options
  - Progress bars for vote visualization
  - Smooth transitions and animations

---

## 🧪 Testing

### Manual Testing Checklist

**Teacher Features**:
- [ ] Create poll with multiple options
- [ ] Monitor live results in real-time
- [ ] End poll manually
- [ ] View poll history
- [ ] Refresh page - poll persists
- [ ] Timer countdown works correctly

**Student Features**:
- [ ] Join poll with unique session
- [ ] Receive poll instantly
- [ ] Timer synchronizes to server time
- [ ] Submit vote successfully
- [ ] Cannot vote twice
- [ ] See results after submission
- [ ] Refresh page - resume from same state

**System Behavior**:
- [ ] Connection errors handled gracefully
- [ ] Multiple students can vote simultaneously
- [ ] Vote counts update in real-time
- [ ] Percentages calculated correctly
- [ ] Student removal works
- [ ] Auto-end poll on timeout

---

## 🛠️ API Endpoints

### REST API

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/polls` | Create new poll |
| GET | `/api/polls/teacher/:teacherId` | Get teacher's active poll |
| GET | `/api/polls/:pollId` | Get poll details |
| POST | `/api/polls/vote` | Submit a vote |
| PUT | `/api/polls/:pollId/end` | End a poll |
| GET | `/api/polls/history/:teacherId` | Get poll history |
| GET | `/health` | Health check |

### WebSocket Events

**Teacher Events**:
- `teacher-join` - Teacher connects
- `create-poll` - Create new poll
- `end-poll` - End active poll
- `remove-student` - Remove student

**Student Events**:
- `student-join` - Student connects
- `submit-vote` - Submit vote

**Broadcast Events**:
- `new-poll` - Poll created
- `poll-updated` - Results updated
- `poll-ended` - Poll ended
- `student-count-updated` - New student joined
- `student-removed` - Student removed

---

## 🐛 Troubleshooting

### Connection Issues
```
Error: Failed to connect to server
→ Ensure backend is running on port 5000
→ Check CORS_ORIGIN in .env
→ Verify MongoDB connection
```

### Poll Not Appearing
```
Error: No active poll found
→ Check that teacher ID is correct
→ Ensure teacher has created a poll
→ Verify Socket connection status
```

### Timer Out of Sync
```
Timer not matching server
→ Check client time vs server time
→ Verify calculation in usePollTimer hook
→ Ensure startTime is correctly received
```

### MongoDB Connection Failed
```
Connection refused
→ Start MongoDB service
→ Verify MONGODB_URI in .env
→ Check credentials if using Atlas
```

---

## 📝 Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/live-polling-system
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env.local)
```
REACT_APP_SOCKET_URL=http://localhost:5000
```

---

## 🚀 Deployment Guide

### Backend Deployment (Heroku/Render)

1. **Build**:
   ```bash
   npm run build
   ```

2. **Set Environment Variables**:
   - `MONGODB_URI` - Your MongoDB Atlas URI
   - `NODE_ENV` - production
   - `CORS_ORIGIN` - Your frontend URL

3. **Deploy**:
   - Push to main branch
   - Platform auto-builds and deploys

### Frontend Deployment (Vercel/Netlify)

1. **Build**:
   ```bash
   npm run build
   ```

2. **Set Environment Variables**:
   - `REACT_APP_SOCKET_URL` - Your backend URL

3. **Deploy**:
   - Connect GitHub repo
   - Platform auto-deploys on push

---

## � Environment Setup

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/db
PORT=5000
NODE_ENV=production
CORS_ORIGIN=https://resilient-live-polling-system-nine.vercel.app
```

### Frontend (.env.production)
```env
REACT_APP_SOCKET_URL=https://resilient-live-polling-system-lujm.onrender.com
```

---

## 🚀 Deployment

### Backend (Render.com)
1. Connect GitHub repo: https://github.com/Sonuanand07/Resilient-Live-Polling-System
2. Root Directory: `backend`
3. Build Command: `npm install && npm run build`
4. Start Command: `npm start`
5. Environment Variables: Set `MONGODB_URI`, `CORS_ORIGIN`, `NODE_ENV`
6. Auto-deploys on push to `main` branch

### Frontend (Vercel)
1. Connect GitHub repo
2. Root Directory: `frontend`
3. Build Command: `npm run build`
4. Output Directory: `build`
5. Environment Variables: Set `REACT_APP_SOCKET_URL`
6. Auto-deploys on push to `main` branch

---

## �📦 Key Dependencies

### Backend
- `express` - Web framework
- `socket.io` - Real-time communication
- `mongoose` - MongoDB ODM
- `cors` - Cross-origin requests
- `dotenv` - Environment variables
- `typescript` - Type safety

### Frontend
- `react` - UI framework
- `react-router-dom` - Routing
- `socket.io-client` - WebSocket client
- `typescript` - Type safety
- `uuid` - Unique IDs

---

## 🎯 Feature Checklist

### ✅ Must-Have Requirements
- [x] Functional system with all core features
- [x] Teacher can create polls and students can answer
- [x] Both can view poll results
- [x] UI follows Figma design exactly
- [x] Hosting ready (both frontend and backend)

### ✅ Good to Have
- [x] Configurable poll time limit
- [x] Option to remove students
- [x] Well-designed UI
- [x] State recovery (Resilience Factor)

### 🎁 Bonus Features
- [x] Poll history with past results
- [x] Auto-end polls on timeout
- [x] Real-time student count
- [x] Graceful error handling

---

## 🤝 Contributing

This is an assignment project. For modifications:

1. Maintain TypeScript type safety
2. Follow Controller-Service pattern
3. Add error handling for new features
4. Test state recovery thoroughly
5. Ensure Figma design compliance

---

## 📄 License

Assignment project for Intervue.io - 2024

---

## ✉️ Support

For issues or questions about the implementation, refer to:
- Assignment document
- Figma design
- Code comments throughout the project

---

## 🙏 Acknowledgments

- **Figma Design**: Intervue.io
- **Architecture Guidance**: Clean Code Principles
- **Technologies**: React, Node.js, Socket.io, MongoDB

---

**Built with ❤️ for Intervue.io SDE Intern Assignment**
