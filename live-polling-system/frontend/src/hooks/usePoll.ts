import { useEffect, useState } from 'react';
import { useSocket } from './useSocket';

interface Poll {
  _id: string;
  question: string;
  options: {
    id: string;
    text: string;
    votes: number;
  }[];
  duration: number;
  isActive: boolean;
}

export const usePoll = (pollId: string | null) => {
  const { socket, emit, on, off } = useSocket();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!pollId) return;

    const handlePollUpdate = (data: any) => {
      setPoll(data.poll);
    };

    const handleError = (data: any) => {
      setError(data.message);
    };

    on('poll-updated', handlePollUpdate);
    on('error', handleError);

    return () => {
      off('poll-updated', handlePollUpdate);
      off('error', handleError);
    };
  }, [pollId, on, off]);

  const submitVote = (studentId: string, optionId: string, sessionId: string, teacherId: string) => {
    emit('submit-vote', {
      pollId,
      studentId,
      optionId,
      sessionId,
      teacherId
    });
  };

  return { poll, loading, error, submitVote };
};
