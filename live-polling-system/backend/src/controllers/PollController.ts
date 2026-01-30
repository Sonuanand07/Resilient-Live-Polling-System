import { Request, Response } from 'express';
import { PollService } from '../services/PollService';

const pollService = new PollService();

export class PollController {
  // Create a new poll
  async createPoll(req: Request, res: Response) {
    try {
      const { teacherId, question, options, duration } = req.body;

      if (!question || !options || options.length < 2) {
        return res.status(400).json({
          error: 'Question and at least 2 options are required'
        });
      }

      const poll = await pollService.createPoll(
        teacherId,
        question,
        options,
        duration || 60
      );

      res.status(201).json(poll);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Internal server error'
      });
    }
  }

  // Get active poll
  async getActivePoll(req: Request, res: Response) {
    try {
      const { teacherId } = req.params;
      const poll = await pollService.getActivePoll(teacherId);

      if (!poll) {
        return res.status(404).json({ error: 'No active poll found' });
      }

      res.json(poll);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Internal server error'
      });
    }
  }

  // Get poll by ID
  async getPollById(req: Request, res: Response) {
    try {
      const { pollId } = req.params;
      const poll = await pollService.getPollById(pollId);

      if (!poll) {
        return res.status(404).json({ error: 'Poll not found' });
      }

      res.json(poll);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Internal server error'
      });
    }
  }

  // Submit vote
  async submitVote(req: Request, res: Response) {
    try {
      const { pollId, studentId, optionId } = req.body;

      const result = await pollService.submitVote(pollId, studentId, optionId);

      if (result) {
        res.json({ success: true, message: 'Vote submitted successfully' });
      }
    } catch (error) {
      res.status(400).json({
        error: error instanceof Error ? error.message : 'Failed to submit vote'
      });
    }
  }

  // End poll
  async endPoll(req: Request, res: Response) {
    try {
      const { pollId } = req.params;
      const poll = await pollService.endPoll(pollId);

      res.json(poll);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Failed to end poll'
      });
    }
  }

  // Get poll history
  async getPollHistory(req: Request, res: Response) {
    try {
      const { teacherId } = req.params;
      const { limit } = req.query;

      const polls = await pollService.getPollHistory(
        teacherId,
        parseInt(limit as string) || 10
      );

      res.json(polls);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Internal server error'
      });
    }
  }
}
