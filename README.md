Live Polling System - Intervue.io Assignment
A Resilient Live Polling System built with React, Node.js, Express, Socket.io, MongoDB, and TypeScript. This system enables teachers to create real-time polls and students to submit answers with automatic state recovery.

🚀 Quick Start
Prerequisites
Node.js v16+ and npm v8+
MongoDB (local or MongoDB Atlas)
Git
Setup (5 minutes)
# Clone repository
git clone <your-repo-url>
cd live-polling-system

# Backend Setup
cd backend
npm install
npm run build
npm start  # Runs on http://localhost:5000

# Frontend Setup (new terminal)
cd frontend
npm install
npm start  # Runs on http://localhost:3000
Usage
Open http://localhost:3000
Teacher: Click "I'm a Teacher" → Create a poll
Student: Click "I'm a Student" → Enter name and teacher ID from teacher
📋 What's New (Latest Fixes)
✅ Fixed Issues
Issue	Status	Fix
CastError with ObjectId 'current'	✅ Fixed	Fetch active poll from server
Text alignment in role cards	✅ Fixed	Centered layout and proper descriptions
ESLint warnings	✅ Fixed	Removed unused imports
Missing dependencies	✅ Fixed	Added teacherId to dependency array
✅ All Features Working
Teacher creates polls with custom timer
Students join with teacher ID
Real-time vote updates
Timer synchronization (late join handled)
Poll history persistence
State recovery on refresh
One vote per student prevention
📚 Documentation
Guide	Purpose
SETUP_AND_DEPLOYMENT_GUIDE.md	Complete setup, environment, deployment
UPDATED_IMPLEMENTATION_GUIDE.md	All fixes and architectural details
GIT_COMMANDS_REFERENCE.md	Git workflow and commands
SUBMISSION_CHECKLIST.md	Pre-submission verification
🎯 Project Overview
This is a production-ready polling application featuring:

✅ Real-time Communication via Socket.io
✅ State Recovery - Refreshing doesn't lose poll data
✅ Timer Synchronization - Servers are the source of truth
✅ Race Condition Prevention - One vote per student per poll
✅ Responsive Design - Matches Figma design perfectly
✅ Clean Architecture - Controller-Service pattern with separation of concerns
✅ Error Handling - Graceful failures with user feedback
✅ TypeScript - Full type safety
🏗️ Architecture
Backend Stack
Framework: Node.js + Express
Real-time: Socket.io
Database: MongoDB
Language: TypeScript
Architecture Pattern: Controller-Service
Frontend Stack
Framework: React 18
Routing: React Router v6
Real-time: Socket.io Client
Language: TypeScript
Custom Hooks: useSocket, usePollTimer, usePoll
Project Structure
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
⚙️ Installation & Setup
Prerequisites
Node.js v16+
npm or yarn
MongoDB (local or Atlas)
1️⃣ Clone & Navigate
cd live-polling-system
2️⃣ Backend Setup
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
The backend will start on http://localhost:5000

3️⃣ Frontend Setup
cd frontend
npm install

# Create .env.local (optional)
echo "REACT_APP_SOCKET_URL=http://localhost:5000" > .env.local

# Start development server
npm start
The frontend will start on http://localhost:3000

🚀 Running the Application
Development Mode
Terminal 1 - Backend:

cd backend
npm run dev
Terminal 2 - Frontend:

cd frontend
npm start
Visit http://localhost:3000 in your browser.

Production Build
Backend:

cd backend
npm run build
npm start
Frontend:

cd frontend
npm run build
📱 Usage Guide
For Teachers
Access the application → Select "I'm a Teacher"
Create a Poll:
Enter your question
Add at least 2 options
Set timer duration (10-300 seconds)
Click "Create Poll"
Monitor Live Results:
View real-time vote counts and percentages
See student participation count
Timer counts down in real-time
End Poll:
Click "End Poll" button manually, or wait for auto-end
View final results
Access poll history
For Students
Join the Poll → Select "I'm a Student"
Enter Details:
Enter your name
Enter teacher's ID
Click "Join"
Answer Question:
Wait for teacher to ask a question
Select your answer before timer expires
Click "Submit Answer"
View Results:
After submission, see live poll results
Results update as other students vote
🔄 State Recovery (Resilience)
How It Works
On Teacher Refresh During Active Poll:

Socket connects and emits teacher-join
Backend sends active-poll event with current poll state
UI resumes showing live results
On Student Refresh During Active Poll:

Socket reconnects with stored session ID
Backend retrieves current poll state
Timer synchronizes to server time
Student can continue answering
Timer Synchronization:

Server time is source of truth
Client calculates remaining time: endTime - currentTime
If student joins late: timer starts at duration - elapsed
Code Example (Timer Sync)
// Client-side timer calculation
const elapsed = Math.floor((Date.now() - startTime) / 1000);
const remaining = Math.max(0, duration - elapsed);
🔒 Security & Data Integrity
Race Condition Prevention
// Check if student already voted
if (poll.studentResponses.has(studentId)) {
  throw new Error('Student has already answered this question');
}
Vote Validation
Server validates each vote submission
Each student can only vote once per poll
Student ID is validated on the backend
Database transactions ensure consistency
Error Handling
Try-catch blocks in all services
User-friendly error messages
Connection error recovery with auto-reconnect
Graceful degradation if database is temporarily unavailable
📊 Database Schema
Poll Collection
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
Student Collection
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
🎨 Design Implementation
The UI is built to match the Figma design exactly:

Color Scheme:

Primary Gradient: #8F64E1 to #1D68BD
Secondary Gradient: #7565D9 to #4D0ACD
Neutral: #F1F1F1, #D9D9D9
Typography:

Font: "Sora"
Headings: 40px (Primary), 23px (Secondary)
Body: 16px-19px
Components:

Gradient buttons with hover effects
Card-based layout for options
Progress bars for vote visualization
Smooth transitions and animations
🧪 Testing
Manual Testing Checklist
Teacher Features:

 Create poll with multiple options
 Monitor live results in real-time
 End poll manually
 View poll history
 Refresh page - poll persists
 Timer countdown works correctly
Student Features:

 Join poll with unique session
 Receive poll instantly
 Timer synchronizes to server time
 Submit vote successfully
 Cannot vote twice
 See results after submission
 Refresh page - resume from same state
System Behavior:

 Connection errors handled gracefully
 Multiple students can vote simultaneously
 Vote counts update in real-time
 Percentages calculated correctly
 Student removal works
 Auto-end poll on timeout
🛠️ API Endpoints
REST API
Method	Endpoint	Purpose
POST	/api/polls	Create new poll
GET	/api/polls/teacher/:teacherId	Get teacher's active poll
GET	/api/polls/:pollId	Get poll details
POST	/api/polls/vote	Submit a vote
PUT	/api/polls/:pollId/end	End a poll
GET	/api/polls/history/:teacherId	Get poll history
GET	/health	Health check
WebSocket Events
Teacher Events:

teacher-join - Teacher connects
create-poll - Create new poll
end-poll - End active poll
remove-student - Remove student
Student Events:

student-join - Student connects
submit-vote - Submit vote
Broadcast Events:

new-poll - Poll created
poll-updated - Results updated
poll-ended - Poll ended
student-count-updated - New student joined
student-removed - Student removed
🐛 Troubleshooting
Connection Issues
Error: Failed to connect to server
→ Ensure backend is running on port 5000
→ Check CORS_ORIGIN in .env
→ Verify MongoDB connection
Poll Not Appearing
Error: No active poll found
→ Check that teacher ID is correct
→ Ensure teacher has created a poll
→ Verify Socket connection status
Timer Out of Sync
Timer not matching server
→ Check client time vs server time
→ Verify calculation in usePollTimer hook
→ Ensure startTime is correctly received
MongoDB Connection Failed
Connection refused
→ Start MongoDB service
→ Verify MONGODB_URI in .env
→ Check credentials if using Atlas
📝 Environment Variables
Backend (.env)
MONGODB_URI=mongodb://localhost:27017/live-polling-system
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
Frontend (.env.local)
REACT_APP_SOCKET_URL=http://localhost:5000
🚀 Deployment Guide
Backend Deployment (Heroku/Render)
Build:

npm run build
Set Environment Variables:

MONGODB_URI - Your MongoDB Atlas URI
NODE_ENV - production
CORS_ORIGIN - Your frontend URL
Deploy:

Push to main branch
Platform auto-builds and deploys
Frontend Deployment (Vercel/Netlify)
Build:

npm run build
Set Environment Variables:

REACT_APP_SOCKET_URL - Your backend URL
Deploy:

Connect GitHub repo
Platform auto-deploys on push
📦 Key Dependencies
Backend
express - Web framework
socket.io - Real-time communication
mongoose - MongoDB ODM
cors - Cross-origin requests
dotenv - Environment variables
typescript - Type safety
Frontend
react - UI framework
react-router-dom - Routing
socket.io-client - WebSocket client
typescript - Type safety
uuid - Unique IDs
🎯 Feature Checklist
✅ Must-Have Requirements
 Functional system with all core features
 Teacher can create polls and students can answer
 Both can view poll results
 UI follows Figma design exactly
 Hosting ready (both frontend and backend)
✅ Good to Have
 Configurable poll time limit
 Option to remove students
 Well-designed UI
 State recovery (Resilience Factor)
🎁 Bonus Features
 Poll history with past results
 Auto-end polls on timeout
 Real-time student count
 Graceful error handling
🤝 Contributing
This is an assignment project. For modifications:

Maintain TypeScript type safety
Follow Controller-Service pattern
Add error handling for new features
Test state recovery thoroughly
Ensure Figma design compliance
📄 License
Assignment project for Intervue.io - 2024

✉️ Support
For issues or questions about the implementation, refer to:

Assignment document
Figma design
Code comments throughout the project
🙏 Acknowledgments
Figma Design: Intervue.io
Architecture Guidance: Clean Code Principles
Technologies: React, Node.js, Socket.io, MongoDB
