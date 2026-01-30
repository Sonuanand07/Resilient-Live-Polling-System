# Live Polling System - Architecture Documentation

## System Overview

The Live Polling System is built using a microservices-inspired architecture with clear separation of concerns across frontend and backend layers.

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Layer                              │
│  ┌─────────────────┐         ┌──────────────────────────────┐  │
│  │  Role Selection │         │  Teacher / Student Views      │  │
│  │   Component     │──────→  │  (React Components)           │  │
│  └─────────────────┘         └──────────────────────────────┘  │
│         ▲                              ▲                        │
│         │                              │                        │
│         └──────────────────────────────┘                        │
│                      │                                           │
│              Socket.io (WebSocket)                              │
│                      │                                           │
│         ┌────────────▼──────────────────┐                      │
│         │   useSocket Custom Hook       │                      │
│         │   usePollTimer Custom Hook    │                      │
│         │   usePoll Custom Hook         │                      │
│         └──────────────────────────────┘                       │
└──────────────────────────────────────────────────────────────────┘
                         │
                ┌────────▼────────┐
                │  Socket.io      │
                │  Multiplexing   │
                └────────┬────────┘
                         │
┌──────────────────────────▼──────────────────────────────────────┐
│                      Server Layer                                │
│                   (Node.js + Express)                            │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                 Socket.io Handler                          │ │
│  │  PollSocketHandler.ts (Handles real-time events)          │ │
│  └────────────────────────────────────────────────────────────┘ │
│         ▲                                                        │
│         │ Routes                                                 │
│  ┌──────┴──────────────────────────────────────────────────────┐│
│  │              REST API Controller Layer                      ││
│  │  PollController (Handles HTTP requests)                    ││
│  └───────────┬────────────────────────────────────────────────┘│
│         ▲    │                                                  │
│         │    │ Uses                                             │
│  ┌──────┴────▼────────────────────────────────────────────────┐│
│  │            Service Layer (Business Logic)                  ││
│  │  ┌─────────────────────┐    ┌──────────────────────────┐  ││
│  │  │  PollService        │    │  StudentService         │  ││
│  │  │  - createPoll()     │    │  - registerStudent()    │  ││
│  │  │  - submitVote()     │    │  - getStudent()         │  ││
│  │  │  - endPoll()        │    │  - markAsAnswered()     │  ││
│  │  │  - getPollHistory() │    │  - removeStudent()      │  ││
│  │  └─────────────────────┘    └──────────────────────────┘  ││
│  └────────────────────────────────────────────────────────────┘│
│         ▲                                                        │
│         │ Queries/Updates                                       │
│  ┌──────┴──────────────────────────────────────────────────────┐│
│  │            Data Access Layer (Mongoose Models)             ││
│  │  ┌──────────────────────┐    ┌────────────────────────┐   ││
│  │  │  Poll Schema         │    │  Student Schema        │   ││
│  │  │  - question          │    │  - sessionId           │   ││
│  │  │  - options           │    │  - name                │   ││
│  │  │  - studentResponses  │    │  - hasAnswered         │   ││
│  │  │  - votes             │    │  - selectedOption      │   ││
│  │  └──────────────────────┘    └────────────────────────┘   ││
│  └────────────────────────────────────────────────────────────┘│
│         ▲                                                        │
│         │ Read/Write                                            │
└──────────┼─────────────────────────────────────────────────────┘
           │
      ┌────▼──────────┐
      │   MongoDB     │
      │   Database    │
      └───────────────┘
```

---

## Component Interactions

### Teacher Creates Poll

```
Teacher UI (TeacherView)
    │
    ├─→ emit('create-poll', {question, options, duration})
    │
    ▼
PollSocketHandler
    │
    ├─→ emit('create-poll') event received
    │
    ├─→ Call PollService.createPoll()
    │
    ├─→ Generate unique IDs for options
    │
    ├─→ Save to MongoDB
    │
    ├─→ Setup poll timer
    │
    └─→ io.to('poll-{teacherId}').emit('new-poll')
         │
         ├─→ Teacher UI: setActivePoll(newPoll)
         │
         └─→ All Students: receive new-poll event
              │
              └─→ Student UI: setPoll(newPoll)
```

### Student Submits Vote

```
Student UI (StudentView)
    │
    ├─→ emit('submit-vote', {pollId, studentId, optionId})
    │
    ▼
PollSocketHandler
    │
    ├─→ emit('submit-vote') event received
    │
    ├─→ Call PollService.submitVote()
    │
    ├─→ Check if student already voted
    │
    ├─→ Increment option.votes
    │
    ├─→ Record in studentResponses Map
    │
    ├─→ Save to MongoDB
    │
    └─→ io.to('poll-{teacherId}').emit('poll-updated')
         │
         ├─→ Teacher UI: setActivePoll(updatedPoll)
         │
         └─→ All Students: setActivePoll(updatedPoll)
              │
              └─→ UI shows updated vote counts
```

### State Recovery on Refresh

```
Student Refresh
    │
    ├─→ React App mounts
    │
    ├─→ useSocket hook initializes
    │
    ├─→ Socket connects
    │
    ├─→ emit('student-join', {sessionId, name, pollId})
    │
    ▼
PollSocketHandler
    │
    ├─→ emit('student-join') event received
    │
    ├─→ Call StudentService.registerStudent()
    │
    ├─→ Fetch current poll state
    │
    ├─→ Fetch student's answer status
    │
    ├─→ Calculate timer sync
    │
    └─→ emit('student-registered') with current state
         │
         └─→ Student UI resumes from exact state
              - Shows correct poll
              - Timer synchronized to server time
              - Shows previous answer if already voted
```

---

## Data Flow Patterns

### Real-time Updates

```
Student 1 Votes
    │
    └─→ emit('submit-vote')
         │
         └─→ Server updates MongoDB
              │
              └─→ Broadcast 'poll-updated' to all connected users
                   │
                   ├─→ Teacher sees vote count +1
                   │
                   ├─→ Student 1 sees "Vote Submitted"
                   │
                   └─→ Student 2-N see results update in real-time
```

### Error Handling Flow

```
Vote Submission Error
    │
    ├─→ Server rejects (student already voted)
    │
    ├─→ emit('error', {message: 'Already answered'})
    │
    ├─→ Student UI catches error event
    │
    ├─→ Show toast/alert to user
    │
    └─→ UI state rollback (optimistic UI revert)
```

---

## Database Transaction Flow

### Atomic Operations

```
submitVote():
    │
    ├─→ START TRANSACTION
    │
    ├─→ Check: studentResponses.has(studentId) ?
    │
    ├─→ If yes: THROW ERROR → ROLLBACK
    │
    ├─→ If no: Continue
    │
    ├─→ SET poll.studentResponses[studentId] = optionId
    │
    ├─→ INCREMENT options[optionIndex].votes
    │
    ├─→ SAVE poll document
    │
    ├─→ COMMIT TRANSACTION
    │
    └─→ Broadcast 'poll-updated'
```

---

## Timer Synchronization Algorithm

```
Server Time: 10:00:00
Poll Duration: 60 seconds
Poll Start Time: 10:00:00
Poll End Time: 10:01:00

Student A joins at 10:00:05 (5 seconds late):
    Calculation: 60 - 5 = 55 seconds remaining
    
Student B joins at 10:00:35 (35 seconds late):
    Calculation: 60 - 35 = 25 seconds remaining
    
Student C refreshes at 10:00:50 (50 seconds late):
    Calculation: 60 - 50 = 10 seconds remaining
    (Timer resynchronizes to server time)

Code:
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const remaining = Math.max(0, duration - elapsed);
```

---

## Authentication & Security

### Session Management

```
Student Session:
    │
    ├─→ UUID generated (sessionId)
    │
    ├─→ Stored in browser memory
    │
    ├─→ Sent with every socket event
    │
    └─→ Server validates against database

Race Condition Prevention:
    │
    ├─→ studentResponses is a Map (in-memory fast lookup)
    │
    ├─→ Check: already voted? → REJECT
    │
    ├─→ MongoDB atomic update ensures no duplicates
    │
    └─→ Multiple votes physically impossible
```

---

## Performance Considerations

### Scalability

```
Current Architecture:
    Single Server
        │
        ├─→ Handles ~100 concurrent connections
        │
        └─→ Multiple polls via Redis namespace
        
Optimization Opportunity:
    Load Balancer
        │
        ├─→ Multiple Backend Servers
        │
        ├─→ Redis Adapter for Socket.io
        │
        └─→ Database Replication
```

### Memory Management

```
Active Poll Storage:
    - Stored in MongoDB (persistent)
    - Cached in-memory for fast access
    - Removed from cache after 24 hours
    
Student Sessions:
    - Tracked in database
    - Session storage: ~1KB per student
    - Auto-cleanup of inactive students
```

---

## Error Recovery Strategies

### Connection Loss

```
Socket Disconnect
    │
    ├─→ Socket.io auto-reconnect (5 attempts)
    │
    ├─→ On reconnect: Re-emit join event
    │
    ├─→ Server sends current state
    │
    └─→ UI resumes operation
```

### Database Failure

```
MongoDB Down
    │
    ├─→ Service throws error
    │
    ├─→ Caught in try-catch block
    │
    ├─→ emit('error') to client
    │
    ├─→ UI shows user-friendly message
    │
    └─→ Graceful degradation (no crash)
```

---

## Testing Strategy

### Unit Testing

- Individual service methods
- Validation logic
- Timer calculations

### Integration Testing

- Poll creation → Student joining → Voting → Results
- State recovery on refresh
- Multiple concurrent students

### Load Testing

- 100+ concurrent students
- 10+ simultaneous polls
- 1000 votes/second

---

## Future Architecture Enhancements

1. **Redis Caching**
   - Cache active polls
   - Fast session lookup
   
2. **Horizontal Scaling**
   - Redis Adapter for Socket.io
   - Load balancer
   - Multi-server deployment

3. **Microservices**
   - Poll Service (separate)
   - Student Service (separate)
   - Real-time Service (separate)

4. **Event Sourcing**
   - Event log for all operations
   - Complete audit trail
   - Better debugging

5. **Advanced Features**
   - Question categories
   - Student analytics
   - Leaderboards
   - Chat integration

---

**Last Updated**: 2024
