import { Server as SocketIOServer, Socket } from 'socket.io';
import { PollService } from '../services/PollService';
import { StudentService } from '../services/StudentService';

const pollService = new PollService();
const studentService = new StudentService();

let activePollTimers: Map<string, NodeJS.Timeout> = new Map();

export class PollSocketHandler {
  io: SocketIOServer;

  constructor(io: SocketIOServer) {
    this.io = io;
    this.setupListeners();
  }

  private setupListeners() {
    this.io.on('connection', (socket: Socket) => {
      console.log('User connected:', socket.id);

      // Teacher joins
      socket.on('teacher-join', async (data) => {
        try {
          const { teacherId } = data;
          socket.join(`teacher-${teacherId}`);
          socket.join(`poll-${teacherId}`);

          // Get active poll if any
          const activePoll = await pollService.getActivePoll(teacherId);
          if (activePoll) {
            socket.emit('active-poll', activePoll);
          }

          console.log('Teacher joined:', teacherId);
        } catch (error) {
          socket.emit('error', {
            message: error instanceof Error ? error.message : 'Failed to join'
          });
        }
      });

      // Student requests active poll
      socket.on('request-active-poll', async (data) => {
        try {
          const { teacherId } = data;

          // Join the poll room so student receives new-poll and poll-updated events
          socket.join(`poll-${teacherId}`);
          console.log('Student joined poll room:', `poll-${teacherId}`);

          // Get active poll if any
          const activePoll = await pollService.getActivePoll(teacherId);
          if (activePoll) {
            socket.emit('active-poll', { poll: activePoll });
            console.log('Sent active poll to student:', activePoll._id);
          } else {
            socket.emit('no-active-poll', {
              message: 'No active poll from this teacher'
            });
            console.log('No active poll found for teacher:', teacherId);
          }

          console.log('Student requested active poll for teacher:', teacherId);
        } catch (error) {
          socket.emit('error', {
            message: error instanceof Error ? error.message : 'Failed to fetch active poll'
          });
        }
      });

      // Student joins
      socket.on('student-join', async (data) => {
        try {
          const { studentName, sessionId, pollId, teacherId } = data;

          socket.join(`poll-${teacherId}`);
          socket.join(`student-${sessionId}`);

          // Register student
          const student = await studentService.registerStudent(
            sessionId,
            studentName,
            pollId
          );

          // Get poll details
          const poll = await pollService.getPollById(pollId);

          socket.emit('student-registered', {
            student,
            poll,
            currentTime: new Date().getTime()
          });

          // Broadcast updated student count
          const students = await studentService.getStudentsInPoll(pollId);
          this.io.to(`poll-${teacherId}`).emit('student-count-updated', {
            count: students.length
          });

          console.log('Student joined:', sessionId);
        } catch (error) {
          socket.emit('error', {
            message: error instanceof Error ? error.message : 'Failed to join'
          });
        }
      });

      // Teacher creates poll
      socket.on('create-poll', async (data) => {
        try {
          const { teacherId, question, options, duration } = data;

          // End any existing active poll
          const activePoll = await pollService.getActivePoll(teacherId);
          if (activePoll) {
            await pollService.endPoll(activePoll._id as string);
            if (activePollTimers.has(activePoll._id as string)) {
              clearTimeout(activePollTimers.get(activePoll._id as string));
              activePollTimers.delete(activePoll._id as string);
            }
          }

          // Create new poll
          const newPoll = await pollService.createPoll(
            teacherId,
            question,
            options,
            duration
          );

          // Broadcast to all users in this teacher's poll
          this.io.to(`poll-${teacherId}`).emit('new-poll', {
            poll: newPoll,
            startTime: new Date().getTime()
          });

          // Set timer to auto-end poll
          this.setupPollTimer(newPoll._id as string, duration * 1000, teacherId);

          console.log('Poll created:', newPoll._id);
        } catch (error) {
          socket.emit('error', {
            message: error instanceof Error ? error.message : 'Failed to create poll'
          });
        }
      });

      // Student submits vote
      socket.on('submit-vote', async (data) => {
        try {
          const { pollId, studentId, optionId, sessionId, teacherId } = data;

          const success = await pollService.submitVote(
            pollId,
            studentId,
            optionId
          );

          if (success) {
            // Mark student as answered
            await studentService.markAsAnswered(sessionId, optionId);

            // Get updated poll
            const poll = await pollService.getPollById(pollId);

            // Broadcast updated results
            this.io.to(`poll-${teacherId}`).emit('poll-updated', {
              poll,
              updatedAt: new Date().getTime()
            });

            // Confirm to student
            socket.emit('vote-submitted', { success: true });

            console.log('Vote submitted:', sessionId, '->', optionId);
          }
        } catch (error) {
          socket.emit('error', {
            message: error instanceof Error ? error.message : 'Failed to submit vote'
          });
        }
      });

      // Teacher ends poll manually
      socket.on('end-poll', async (data) => {
        try {
          const { pollId, teacherId } = data;

          const endedPoll = await pollService.endPoll(pollId);

          // Clear timer if exists
          if (activePollTimers.has(pollId)) {
            clearTimeout(activePollTimers.get(pollId));
            activePollTimers.delete(pollId);
          }

          this.io.to(`poll-${teacherId}`).emit('poll-ended', {
            poll: endedPoll
          });

          console.log('Poll ended:', pollId);
        } catch (error) {
          socket.emit('error', {
            message: error instanceof Error ? error.message : 'Failed to end poll'
          });
        }
      });

      // Teacher removes student
      socket.on('remove-student', async (data) => {
        try {
          const { studentId, pollId, teacherId } = data;

          await pollService.removeStudent(studentId, pollId);

          this.io.to(`poll-${teacherId}`).emit('student-removed', {
            studentId
          });

          // Send disconnection notice to student
          this.io.to(`student-${studentId}`).emit('removed-from-poll', {
            message: 'You have been removed from this poll'
          });

          console.log('Student removed:', studentId);
        } catch (error) {
          socket.emit('error', {
            message: error instanceof Error ? error.message : 'Failed to remove student'
          });
        }
      });

      // Disconnect handler
      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });
    });
  }

  private setupPollTimer(
    pollId: string,
    duration: number,
    teacherId: string
  ) {
    const timer = setTimeout(async () => {
      try {
        const poll = await pollService.endPoll(pollId);
        this.io.to(`poll-${teacherId}`).emit('poll-ended-auto', {
          poll,
          reason: 'Time limit reached'
        });

        activePollTimers.delete(pollId);
      } catch (error) {
        console.error('Error auto-ending poll:', error);
      }
    }, duration);

    activePollTimers.set(pollId, timer);
  }
}
