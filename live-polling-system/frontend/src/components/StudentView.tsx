import React, { useState, useEffect } from 'react';
import { useSocket } from '../hooks/useSocket';
import { v4 as uuidv4 } from 'uuid';
import PollNotification from './PollNotification';
import Chat from './Chat';
import './StudentView.css';

interface Poll {
  _id: string;
  question: string;
  options: {
    id: string;
    text: string;
    votes: number;
  }[];
  duration: number;
  startedAt: string;
  isActive: boolean;
}

interface StudentData {
  sessionId: string;
  name: string;
}

const StudentView: React.FC = () => {
  const { emit, on, off, isConnected, error } = useSocket();
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [showNameInput, setShowNameInput] = useState(true);
  const [name, setName] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [poll, setPoll] = useState<Poll | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [pollResults, setPollResults] = useState<Poll | null>(null);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Helper function to format time as MM:SS or HH:MM:SS
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${minutes}:${String(secs).padStart(2, '0')}`;
  };

  // Timer countdown
  useEffect(() => {
    if (!poll || !poll.isActive || hasAnswered) return;

    const startTime = new Date(poll.startedAt).getTime();
    const endTime = startTime + poll.duration * 1000;

    const updateTimer = () => {
      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((endTime - now) / 1000));
      setTimeRemaining(remaining);

      if (remaining === 0) {
        setHasAnswered(true);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [poll, hasAnswered]);


  // Socket listeners
  useEffect(() => {
    if (!isConnected) return;

    on('active-poll', (data: any) => {
      console.log('Student received active-poll:', data);
      if (!data.poll) return;

      // Show notification
      setNotificationMessage(`New poll: ${data.poll.question}`);
      setNotificationVisible(true);

      // Register student and join the poll
      emit('student-join', {
        studentName: name || 'Anonymous',
        sessionId: studentData?.sessionId || uuidv4(),
        pollId: data.poll._id,
        teacherId
      });

      // Set the active poll
      setPoll(data.poll);
      setHasAnswered(false);
      setSelectedOption(null);
      setSubmitted(false);
      setPollResults(null);
    });

    on('new-poll', (data: any) => {
      console.log('Student received new-poll:', data);
      
      // Show notification
      setNotificationMessage(`New poll: ${data.poll.question}`);
      setNotificationVisible(true);

      setPoll(data.poll);
      setHasAnswered(false);
      setSelectedOption(null);
      setSubmitted(false);
      setPollResults(null);
    });

    on('poll-updated', (data: any) => {
      setPoll(data.poll);
      setPollResults(data.poll);
    });

    on('poll-ended', (data: any) => {
      setPoll(null);
      setPollResults(data.poll);
      setHasAnswered(true);
    });

    on('poll-ended-auto', (data: any) => {
      setPoll(null);
      setPollResults(data.poll);
      setHasAnswered(true);
    });

    on('removed-from-poll', (data: any) => {
      alert(data.message);
      setStudentData(null);
      setShowNameInput(true);
    });

    on('error', (data: any) => {
      alert(`Error: ${data.message}`);
    });

    on('no-active-poll', (data: any) => {
      console.log('No active poll message:', data);
      // Teacher may not have created a poll yet, just wait
    });

    return () => {
      off('active-poll', () => {});
      off('new-poll', () => {});
      off('poll-updated', () => {});
      off('poll-ended', () => {});
      off('poll-ended-auto', () => {});
      off('removed-from-poll', () => {});
      off('error', () => {});
      off('no-active-poll', () => {});
    };
  }, [isConnected, on, off, studentData, teacherId, emit, name]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter your name');
      return;
    }
    if (!teacherId.trim()) {
      alert('Please enter the teacher ID');
      return;
    }

    const sessionId = uuidv4();
    const newStudentData = { sessionId, name };
    setStudentData(newStudentData);
    setShowNameInput(false);

    // Request active poll from server
    setTimeout(() => {
      emit('request-active-poll', {
        teacherId: teacherId,
        studentName: name,
        sessionId: sessionId
      });
    }, 100);
  };

  const handleVoteSubmit = () => {
    if (!selectedOption || !studentData || !poll) return;

    emit('submit-vote', {
      pollId: poll._id,
      studentId: studentData.sessionId,
      optionId: selectedOption,
      sessionId: studentData.sessionId,
      teacherId
    });

    setHasAnswered(true);
    setSubmitted(true);
  };

  if (!isConnected) {
    return (
      <div className="student-view">
        <div className="connection-error">
          <h2>Connection Error</h2>
          <p>Unable to connect to server. Please check your connection and try again.</p>
          {error && <p className="error-message">{error}</p>}
        </div>
      </div>
    );
  }

  if (showNameInput) {
    return (
      <div className="student-view">
        <div className="logo-section">
          <div className="logo-badge">
            <span className="logo-icon">📊</span>
            <span className="logo-text">Intervue Poll</span>
          </div>
        </div>

        <div className="name-input-section">
          <h1>Join the Poll</h1>
          <form onSubmit={handleFormSubmit}>
            <div className="form-group">
              <label htmlFor="student-name">Your Name</label>
              <input
                id="student-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                autoFocus
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="teacher-id">Teacher ID</label>
              <input
                id="teacher-id"
                type="text"
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
                placeholder="Enter teacher ID"
                required
              />
            </div>

            <button type="submit" className="submit-button">Join Poll</button>
          </form>

          <div className="help-section">
            <h3>How it works:</h3>
            <ul>
              <li>Enter your name and the teacher ID</li>
              <li>Wait for the teacher to start a poll</li>
              <li>You'll be notified when a new question is asked</li>
              <li>Answer before time runs out</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (pollResults && hasAnswered) {
    const totalVotes = pollResults.options.reduce((sum, opt) => sum + opt.votes, 0);

    return (
      <div className="student-view">
        <div className="logo-section">
          <div className="logo-badge">
            <span className="logo-icon">📊</span>
            <span className="logo-text">Intervue Poll</span>
          </div>
        </div>

        <div className="results-section">
          <h2>Poll Results</h2>
          <p className="poll-question">{pollResults.question}</p>

          <div className="results-container">
            {pollResults.options.map((option) => {
              const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
              return (
                <div key={option.id} className="result-item">
                  <div className="result-header">
                    <span className="option-text">{option.text}</span>
                    <span className="vote-count">{option.votes} votes</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="percentage">{percentage.toFixed(1)}%</span>
                </div>
              );
            })}
          </div>

          <button
            className="new-poll-button"
            onClick={() => {
              setShowNameInput(true);
              setPollResults(null);
              setPoll(null);
            }}
          >
            Join Another Poll
          </button>
        </div>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="student-view">
        <div className="logo-section">
          <div className="logo-badge">
            <span className="logo-icon">📊</span>
            <span className="logo-text">Intervue Poll</span>
          </div>
        </div>

        <div className="waiting-section">
          <h2>Waiting for Poll...</h2>
          <p>Your name: <strong>{studentData?.name}</strong></p>
          <p>The teacher will start the poll soon. Please wait...</p>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="student-view">
      <div className="logo-section">
        <div className="logo-badge">
          <span className="logo-icon">📊</span>
          <span className="logo-text">Intervue Poll</span>
        </div>
      </div>

      <div className="poll-section">
        <div className="poll-header">
          <h2>{poll.question}</h2>
          <div className="timer" style={{ color: timeRemaining < 10 ? '#ff6b6b' : '#000' }}>
            {formatTime(timeRemaining)}
          </div>
        </div>

        {!hasAnswered ? (
          <div className="options-container">
            {poll.options.map((option) => (
              <button
                key={option.id}
                className={`option-button ${selectedOption === option.id ? 'selected' : ''}`}
                onClick={() => setSelectedOption(option.id)}
              >
                {option.text}
              </button>
            ))}

            <button
              className="vote-button"
              onClick={handleVoteSubmit}
              disabled={!selectedOption || submitted}
            >
              {submitted ? 'Submitted' : 'Submit Answer'}
            </button>
          </div>
        ) : (
          <div className="submitted-message">
            <p>✓ Your answer has been submitted</p>
            <p>Waiting for results...</p>
          </div>
        )}

        {/* Chat Button */}
        {studentData && (
          <button
            className="chat-toggle-btn"
            onClick={() => setIsChatOpen(true)}
            title="Open chat with teacher"
          >
            💬
          </button>
        )}

        {/* Notification */}
        <PollNotification
          isVisible={notificationVisible}
          message={notificationMessage}
          onClose={() => setNotificationVisible(false)}
        />

        {/* Chat Component */}
        <Chat
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          userRole="student"
          userName={name}
          teacherId={teacherId}
        />
      </div>
    </div>
  );
};

export default StudentView;
