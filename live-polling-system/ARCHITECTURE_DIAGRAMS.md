# System Architecture & Data Flow Diagrams

## High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     LIVE POLLING SYSTEM                         │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┐                      ┌──────────────────┐
│   FRONTEND       │                      │    BACKEND       │
│   (React)        │◄────Socket.io───────►│   (Express)      │
│                  │                      │                  │
│ • RoleSelection  │                      │ • Controllers    │
│ • TeacherView    │                      │ • Services       │
│ • StudentView    │                      │ • Socket Handler │
│ • Custom Hooks   │                      │                  │
└──────────────────┘                      └─────────┬────────┘
                                                    │
                                                    ▼
                                          ┌──────────────────┐
                                          │   DATABASE       │
                                          │   (MongoDB)      │
                                          │                  │
                                          │ • Polls          │
                                          │ • Students       │
                                          │ • Votes          │
                                          └──────────────────┘
```

---

## Teacher Flow

```
START
  │
  ▼
┌─────────────────────┐
│ Teacher Opens App   │
│ Select: I'm Teacher │
└────────┬────────────┘
         │
         ▼
┌─────────────────────────┐
│ Generate Teacher UUID   │
│ Display: "Share this ID"│
└────────┬────────────────┘
         │
         ▼
┌─────────────────────┐
│ Emit: teacher-join  │
│ Parameters:         │
│  - teacherId        │
└────────┬────────────┘
         │
         ▼
┌──────────────────────────┐
│ Backend Handler:         │
│ Listen: teacher-join     │
│ Join Socket Room:        │
│  - teacher-${teacherId}  │
│  - poll-${teacherId}     │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────┐
│ Teacher Dashboard    │
│ Ready to Create Poll │
│                      │
│ [Question Field]     │
│ [Option Fields]      │
│ [Duration: 60s]      │
│ [Create Poll Button] │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ Emit: create-poll    │
│ Parameters:          │
│  - teacherId         │
│  - question          │
│  - options[]         │
│  - duration (sec)    │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────────┐
│ Backend Handler:         │
│ Listen: create-poll      │
│ Create Poll in MongoDB   │
│ Start Timer              │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────┐
│ Broadcast: new-poll  │
│ To: poll-${teacherId}│
│ All users receive    │
│ poll data            │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────────┐
│ Teacher Sees:            │
│ ✓ Poll Question          │
│ ✓ Timer (60s → 0s)       │
│ ✓ Vote Results (updating)│
│ ✓ Student Count          │
└────────┬─────────────────┘
         │
         ▼ (Timer ends or manually)
┌──────────────────────┐
│ Emit: poll-ended     │
│ or auto-end on timer │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ Save to Database     │
│ Final Results        │
│ Poll History         │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ Teacher Dashboard    │
│ ✓ Poll History View  │
│ ✓ Final Results      │
│ ✓ Ready for Next Poll│
└─────────────────────┘
```

---

## Student Flow

```
START
  │
  ▼
┌─────────────────────┐
│ Student Opens App   │
│ Select: I'm Student │
└────────┬────────────┘
         │
         ▼
┌──────────────────────────┐
│ Enter Your Details Form: │
│                          │
│ [Name Field]             │
│ [Teacher ID Field]       │
│ [Join Button]            │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ Emit: request-active-poll│
│ Parameters:              │
│  - teacherId             │
└────────┬─────────────────┘
         │
         ▼ (CRITICAL FIX: No "current" string!)
┌──────────────────────────┐
│ Backend Handler:         │
│ Listen: request-active-poll
│ Query: Poll.findOne({    │
│   teacherId,             │
│   isActive: true         │
│ })                       │
└────────┬─────────────────┘
         │
         ├─────────────────────┬──────────────────┐
         │                     │                  │
         ▼                     ▼                  ▼
  ┌─────────────┐      ┌────────────────┐  ┌──────────┐
  │Poll Found   │      │No Poll Active  │  │Error     │
  │Send: active-│      │Send: no-active-│  │Emit:     │
  │poll event   │      │poll event      │  │error     │
  └────────┬────┘      └────────┬───────┘  └────┬─────┘
           │                    │               │
           ▼                    ▼               ▼
  ┌──────────────┐      ┌────────────┐  ┌──────────┐
  │Listen: active│      │Show: "Wait"│  │Show Error│
  │poll event    │      │message     │  │message   │
  │Get poll ID   │      └────────────┘  └──────────┘
  │Get poll data │
  └────────┬─────┘
           │
           ▼
  ┌─────────────────────────┐
  │ Emit: student-join      │
  │ Parameters:             │
  │  - studentName          │
  │  - sessionId (UUID)     │
  │  - pollId (from server) │
  │  - teacherId            │
  └────────┬────────────────┘
           │
           ▼
  ┌──────────────────────────┐
  │ Backend Handler:         │
  │ Listen: student-join     │
  │ Join Socket Rooms:       │
  │  - poll-${teacherId}     │
  │  - student-${sessionId}  │
  │ Register in DB           │
  │ Increment student count  │
  └────────┬─────────────────┘
           │
           ▼
  ┌──────────────────┐
  │ Listening Events:│
  │ ✓ new-poll       │
  │ ✓ poll-updated   │
  │ ✓ poll-ended     │
  └────────┬─────────┘
           │
           ▼
  ┌──────────────────────────┐
  │ When Receive: new-poll   │
  │ or active-poll           │
  │                          │
  │ Display:                 │
  │ • Question               │
  │ • Timer (synced to server)
  │ • Options (buttons)      │
  │ • Submit button          │
  └────────┬─────────────────┘
           │
           ▼ (Student selects option)
  ┌──────────────────────────┐
  │ Student Clicks Option    │
  │ ✓ Highlight selected     │
  │ ✓ Enable Submit button   │
  └────────┬─────────────────┘
           │
           ▼
  ┌──────────────────────────┐
  │ Click: Submit Answer     │
  │ Emit: submit-vote        │
  │ Parameters:              │
  │  - pollId                │
  │  - studentId (sessionId) │
  │  - optionId (selected)   │
  │  - teacherId             │
  └────────┬─────────────────┘
           │
           ▼ (Server-side validation)
  ┌──────────────────────────┐
  │ Backend Handler:         │
  │ Listen: submit-vote      │
  │                          │
  │ VALIDATION:              │
  │ 1. Student exists?       │
  │ 2. Poll active?          │
  │ 3. Already voted?        │
  │    - If YES: REJECT      │
  │    - If NO: ACCEPT       │
  │ 4. Option valid?         │
  └────────┬─────────────────┘
           │
           ├─────────────┬──────────────┐
           │             │              │
           ▼             ▼              ▼
  ┌──────────────┐  ┌──────────┐  ┌─────────┐
  │Vote Accepted │  │Duplicate │  │Invalid  │
  │Update votes  │  │vote:     │  │Option   │
  │DB            │  │REJECT    │  │REJECT   │
  └────────┬─────┘  └────┬─────┘  └────┬────┘
           │             │            │
           ▼             ▼            ▼
  ┌──────────────────────────────────────┐
  │ Broadcast: poll-updated              │
  │ To: poll-${teacherId}                │
  │ Send: Updated vote counts & percentages
  └────────┬──────────────────────────────┘
           │
           ▼
  ┌──────────────────┐
  │ Student UI:      │
  │ Show message:    │
  │ "✓ Vote submitted│
  │  Waiting results"│
  │ Disable voting   │
  └────────┬─────────┘
           │
           ▼ (Timer ends or poll ends)
  ┌──────────────────────────┐
  │ Broadcast: poll-ended    │
  │ To: poll-${teacherId}    │
  │ Send: Final results      │
  └────────┬─────────────────┘
           │
           ▼
  ┌──────────────────────┐
  │ Student UI:          │
  │ Show Results:        │
  │ • Question           │
  │ • All Options %      │
  │ • Vote Counts        │
  │ [Join Another Poll]  │
  └─────────────────────┘
```

---

## Socket.io Event Flow

```
┌──────────────────────────────────────────────────────────┐
│              SOCKET.IO EVENT FLOW                        │
└──────────────────────────────────────────────────────────┘

TEACHER EMITS                     BACKEND LISTENS              BROADCASTS
─────────────────────────────────────────────────────────────────────────

teacher-join ──────────────────► on('teacher-join')
                                    ├─ Join room: teacher-${id}
                                    ├─ Join room: poll-${id}
                                    └─ Fetch active poll
                                         │
                                         ▼
                                    emit('active-poll') ──► Teacher
                                    [if exists]


create-poll ──────────────────► on('create-poll')
                                    ├─ Create Poll in MongoDB
                                    ├─ Set timer (auto-end)
                                    └─ Save to activePollTimers
                                         │
                                         ▼
                                    emit('new-poll') ────► All in poll room
                                                            (teacher + students)


end-poll ──────────────────────► on('end-poll')
                                    ├─ End poll in DB
                                    ├─ Clear timer
                                    └─ Save to history
                                         │
                                         ▼
                                    emit('poll-ended') ───► All in poll room


remove-student ────────────────► on('remove-student')
                                    ├─ Remove from DB
                                    └─ Notify student
                                         │
                                         ▼
                                    emit('removed-from-poll') ► Student


STUDENT EMITS                     BACKEND LISTENS              BROADCASTS
─────────────────────────────────────────────────────────────────────────

request-active-poll ───────────► on('request-active-poll')
                                    ├─ Query DB: findOne({
                                    │    teacherId,
                                    │    isActive: true
                                    │  })
                                    └─ Return active poll
                                         │
                                         ├─► emit('active-poll') ──► Student
                                         │
                                         └─► emit('no-active-poll') ──► Student


student-join ──────────────────► on('student-join')
                                    ├─ Register student in DB
                                    ├─ Join room: poll-${teacherId}
                                    ├─ Join room: student-${sessionId}
                                    ├─ Get student count
                                    │
                                    ▼
                                    emit('student-count-updated') ──► Teacher


submit-vote ──────────────────► on('submit-vote')
                                    ├─ Validate:
                                    │  • Student exists?
                                    │  • Poll active?
                                    │  • Already voted? ──► REJECT
                                    │  • Valid option?
                                    │
                                    ├─ ACCEPT: Update DB
                                    │  • Increment vote count
                                    │  • Mark student as answered
                                    │
                                    └─ Calculate percentages
                                         │
                                         ▼
                                    emit('poll-updated') ──► All in room


[Timer Auto-End]                Timer reaches 0
                                    │
                                    ├─ End poll in DB
                                    ├─ Clear timer
                                    ├─ Save to history
                                    │
                                    ▼
                                emit('poll-ended-auto') ──► All in room
                                [Final results]
```

---

## Database Schema

```
┌─────────────────────────────────────────┐
│         MongoDB Collections             │
└─────────────────────────────────────────┘

┌──────────────────────────────────────┐
│          POLLS Collection            │
├──────────────────────────────────────┤
│ _id: ObjectId (MongoDB generated)    │
│ teacherId: String (UUID)             │
│ question: String                     │
│ options: [                           │
│   {                                  │
│     id: String (UUID)                │
│     text: String                     │
│     votes: Number                    │
│   }                                  │
│ ]                                    │
│ duration: Number (seconds)           │
│ startedAt: Date                      │
│ endedAt: Date (null if active)       │
│ isActive: Boolean                    │
│ studentResponses: Map                │
│   {                                  │
│     sessionId → optionId             │
│   }                                  │
│ createdAt: Date                      │
│ updatedAt: Date                      │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│        STUDENTS Collection           │
├──────────────────────────────────────┤
│ _id: ObjectId (MongoDB generated)    │
│ sessionId: String (UUID)             │
│ name: String                         │
│ pollId: ObjectId (reference to Poll) │
│ hasAnswered: Boolean                 │
│ selectedOption: String (or null)     │
│ createdAt: Date                      │
│ updatedAt: Date                      │
└──────────────────────────────────────┘
```

---

## Room Management

```
Socket.io Rooms:

┌─────────────────────────────────────────┐
│        SOCKET.IO ROOM STRUCTURE         │
└─────────────────────────────────────────┘

teacher-${teacherId}
  └─ Teacher socket
     └─ Private messages for this teacher

poll-${teacherId}
  ├─ Teacher socket
  ├─ Student 1 socket
  ├─ Student 2 socket
  └─ Student N socket
  └─ All broadcast messages go here
     (new-poll, poll-updated, poll-ended)

student-${sessionId}
  └─ Individual student socket
     └─ Private messages to this student


EXAMPLE: Teacher ID = "abc123", Students join poll

teacher-abc123
  └─ Receives: private messages, admin events

poll-abc123
  ├─ teacher (ID: socket1)
  ├─ student1 (sessionId: sess1, socket: socket2)
  ├─ student2 (sessionId: sess2, socket: socket3)
  └─ Broadcast: new-poll, poll-updated, poll-ended

student-sess1
  └─ Receives: private student-specific messages

student-sess2
  └─ Receives: private student-specific messages
```

---

## Timer Synchronization

```
Server Time:    Client receives:     Client calculates:
────────────    ─────────────────    ──────────────────

Poll Created:
t=0s            {                    // Client has current time
                  startedAt: 2024...01-30T10:00:00Z,
                  duration: 60,
                  currentTime: 1706600400000
                }

t=10s           {                    const endTime = startedAt + (duration * 1000)
(Server)        poll-updated         const remaining = Math.max(0, 
                }                      Math.ceil((endTime - now) / 1000))
                                      → Shows: 50s (not 60s)

t=20s           // Student late join
                {
                  startedAt: 2024...01-30T10:00:00Z,  ← 20 seconds ago
                  duration: 60,
                  currentTime: 1706600420000
                }
                                      // Client calculates:
                                      const remaining = 60 - 20 = 40s
                                      → Shows: 40s ✓ CORRECT


SOLUTION: Server sends startedAt + duration
          Client calculates remaining = duration - elapsed
          Works for late joins!
```

---

## State Recovery Flow

```
User refreshes during active poll:

BEFORE REFRESH                    AFTER REFRESH
──────────────────                ────────────────

Student is voting                 Browser loads app
│                                 │
▼                                 ▼
Socket connected                  useSocket hook reconnects
│                                 │
▼                                 ▼
Listening to events               emit('request-active-poll', {teacherId})
│                                 │
▼                                 ▼
[Page Refresh]                    Backend fetches active poll
                                  │
                                  ▼
                                  emit('active-poll', {poll data})
                                  │
                                  ▼
                                  Frontend receives poll
                                  │
                                  ▼
                                  UI restores:
                                  • Question
                                  • Timer (recalculated)
                                  • Options
                                  • Vote status
                                  │
                                  ▼
                                  ✓ Student can continue voting!
```

---

**Last Updated:** January 30, 2026
