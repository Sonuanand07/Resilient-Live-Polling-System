import { Student, IStudent } from '../models/Student';
import { v4 as uuidv4 } from 'uuid';

export class StudentService {
  // Register or get student
  async registerStudent(
    sessionId: string,
    name: string,
    pollId: string
  ): Promise<IStudent> {
    try {
      // Check if student already exists
      let student = await Student.findOne({ sessionId, pollId });

      if (student) {
        return student;
      }

      // Create new student
      student = new Student({
        sessionId,
        name,
        pollId,
        joinedAt: new Date()
      });

      await student.save();
      return student;
    } catch (error) {
      throw new Error(`Failed to register student: ${error}`);
    }
  }

  // Get student by session ID
  async getStudent(sessionId: string): Promise<IStudent | null> {
    try {
      return await Student.findOne({ sessionId });
    } catch (error) {
      throw new Error(`Failed to fetch student: ${error}`);
    }
  }

  // Get students in a poll
  async getStudentsInPoll(pollId: string): Promise<IStudent[]> {
    try {
      return await Student.find({ pollId, isRemoved: false });
    } catch (error) {
      throw new Error(`Failed to fetch students: ${error}`);
    }
  }

  // Mark student as answered
  async markAsAnswered(
    sessionId: string,
    selectedOption: string
  ): Promise<IStudent | null> {
    try {
      return await Student.findOneAndUpdate(
        { sessionId },
        {
          hasAnswered: true,
          selectedOption,
          answeredAt: new Date()
        },
        { new: true }
      );
    } catch (error) {
      throw new Error(`Failed to mark student as answered: ${error}`);
    }
  }

  // Clean up old students
  async cleanupOldStudents(pollId: string): Promise<number> {
    try {
      const result = await Student.deleteMany({
        pollId,
        isRemoved: true,
        answeredAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      });

      return result.deletedCount;
    } catch (error) {
      throw new Error(`Failed to cleanup students: ${error}`);
    }
  }
}
