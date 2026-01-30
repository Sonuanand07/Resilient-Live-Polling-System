import { Poll, IPoll } from '../models/Poll';
import { Student, IStudent } from '../models/Student';
import { v4 as uuidv4 } from 'uuid';

export class PollService {
  // Create a new poll
  async createPoll(
    teacherId: string,
    question: string,
    options: string[],
    duration: number
  ): Promise<IPoll> {
    try {
      const pollOptions = options.map(opt => ({
        id: uuidv4(),
        text: opt,
        votes: 0
      }));

      const poll = new Poll({
        teacherId,
        question,
        options: pollOptions,
        duration,
        startedAt: new Date(),
        isActive: true,
        studentResponses: new Map()
      });

      await poll.save();
      return poll;
    } catch (error) {
      throw new Error(`Failed to create poll: ${error}`);
    }
  }

  // Get active poll for a teacher
  async getActivePoll(teacherId: string): Promise<IPoll | null> {
    try {
      const poll = await Poll.findOne({
        teacherId,
        isActive: true
      }).sort({ startedAt: -1 });

      return poll;
    } catch (error) {
      throw new Error(`Failed to fetch active poll: ${error}`);
    }
  }

  // Get poll by ID
  async getPollById(pollId: string): Promise<IPoll | null> {
    try {
      return await Poll.findById(pollId);
    } catch (error) {
      throw new Error(`Failed to fetch poll: ${error}`);
    }
  }

  // Submit a vote
  async submitVote(
    pollId: string,
    studentId: string,
    optionId: string
  ): Promise<boolean> {
    try {
      const poll = await Poll.findById(pollId);
      if (!poll) throw new Error('Poll not found');

      // Check if student already answered
      if (poll.studentResponses.has(studentId)) {
        throw new Error('Student has already answered this question');
      }

      // Record the response
      poll.studentResponses.set(studentId, optionId);

      // Update vote count
      const optionIndex = poll.options.findIndex(opt => opt.id === optionId);
      if (optionIndex !== -1) {
        poll.options[optionIndex].votes += 1;
      }

      await poll.save();
      return true;
    } catch (error) {
      throw new Error(`Failed to submit vote: ${error}`);
    }
  }

  // End a poll
  async endPoll(pollId: string): Promise<IPoll | null> {
    try {
      const poll = await Poll.findById(pollId);
      if (!poll) throw new Error('Poll not found');

      poll.isActive = false;
      poll.endedAt = new Date();
      await poll.save();

      return poll;
    } catch (error) {
      throw new Error(`Failed to end poll: ${error}`);
    }
  }

  // Get poll history
  async getPollHistory(teacherId: string, limit: number = 10): Promise<IPoll[]> {
    try {
      return await Poll.find({ teacherId })
        .sort({ createdAt: -1 })
        .limit(limit);
    } catch (error) {
      throw new Error(`Failed to fetch poll history: ${error}`);
    }
  }

  // Check if all students answered
  async checkAllStudentsAnswered(pollId: string): Promise<boolean> {
    try {
      const poll = await Poll.findById(pollId);
      if (!poll) throw new Error('Poll not found');

      const students = await Student.find({
        pollId,
        isRemoved: false
      });

      if (students.length === 0) return false;

      const answeredCount = poll.studentResponses.size;
      return answeredCount === students.length;
    } catch (error) {
      throw new Error(`Failed to check student answers: ${error}`);
    }
  }

  // Remove student from poll
  async removeStudent(studentId: string, pollId: string): Promise<boolean> {
    try {
      const student = await Student.findByIdAndUpdate(
        studentId,
        { isRemoved: true },
        { new: true }
      );

      // If student hasn't answered yet, their vote won't count
      return !!student;
    } catch (error) {
      throw new Error(`Failed to remove student: ${error}`);
    }
  }
}
