import React, { useState, useEffect } from 'react';
import { useSocket } from '../hooks/useSocket';
import { v4 as uuidv4 } from 'uuid';
import TeacherInfoCard from './TeacherInfoCard';
import Chat from './Chat';
import PollHistory from './PollHistory';
import './TeacherView.css';

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
  startedAt: string;
}

const TeacherView: React.FC = () => {
  const { emit, on, off, isConnected, error } = useSocket();
  const [teacherId] = useState(uuidv4());
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [duration, setDuration] = useState(1);
  const [durationUnit, setDurationUnit] = useState<'seconds' | 'minutes' | 'hours'>('minutes');
  const [activePoll, setActivePoll] = useState<Poll | null>(null);
  const [studentCount, setStudentCount] = useState(0);
  const [pollHistory, setPollHistory] = useState<Poll[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

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
    if (!activePoll || !activePoll.isActive) return;

    const startTime = new Date(activePoll.startedAt).getTime();
    const endTime = startTime + activePoll.duration * 1000;

    const updateTimer = () => {
      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((endTime - now) / 1000));
      setTimeRemaining(remaining);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [activePoll]);

  // Socket listeners
  useEffect(() => {
    if (!isConnected) return;

    emit('teacher-join', { teacherId });

    on('active-poll', (data: any) => {
      setActivePoll(data);
      setShowCreateForm(false);
    });

    on('new-poll', (data: any) => {
      setActivePoll(data.poll);
      setShowCreateForm(false);
    });

    on('poll-updated', (data: any) => {
      setActivePoll(data.poll);
    });

    on('poll-ended', (data: any) => {
      setActivePoll(null);
      setPollHistory([data.poll, ...pollHistory]);
      setShowCreateForm(true);
    });

    on('poll-ended-auto', (data: any) => {
      setActivePoll(null);
      setPollHistory([data.poll, ...pollHistory]);
      setShowCreateForm(true);
    });

    on('student-count-updated', (data: any) => {
      setStudentCount(data.count);
    });

    on('error', (data: any) => {
      alert(`Error: ${data.message}`);
    });

    return () => {
      off('active-poll', () => {});
      off('new-poll', () => {});
      off('poll-updated', () => {});
      off('poll-ended', () => {});
      off('poll-ended-auto', () => {});
      off('student-count-updated', () => {});
      off('error', () => {});
    };
  }, [isConnected, emit, on, off, pollHistory, teacherId]);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleCreatePoll = (e: React.FormEvent) => {
    e.preventDefault();

    if (!question.trim()) {
      alert('Please enter a question');
      return;
    }

    const validOptions = options.filter(opt => opt.trim());
    if (validOptions.length < 2) {
      alert('Please provide at least 2 options');
      return;
    }

    // Convert duration to seconds
    let durationInSeconds = duration;
    if (durationUnit === 'minutes') {
      durationInSeconds = duration * 60;
    } else if (durationUnit === 'hours') {
      durationInSeconds = duration * 3600;
    }

    if (durationInSeconds < 10 || durationInSeconds > 86400) {
      alert('Duration must be between 10 seconds and 24 hours');
      return;
    }

    setLoading(true);
    emit('create-poll', {
      teacherId,
      question,
      options: validOptions,
      duration: durationInSeconds
    });

    // Reset form
    setQuestion('');
    setOptions(['', '']);
    setDuration(1);
    setDurationUnit('minutes');
    setLoading(false);
  };

  const handleEndPoll = () => {
    if (activePoll && window.confirm('Are you sure you want to end this poll?')) {
      emit('end-poll', {
        pollId: activePoll._id,
        teacherId
      });
    }
  };

  if (!isConnected) {
    return (
      <div className="teacher-view">
        <div className="connection-error">
          <h2>Connection Error</h2>
          <p>Unable to connect to server. Please check your connection and try again.</p>
          {error && <p className="error-message">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="teacher-view">
      <div className="logo-section">
        <div className="logo-badge">
          <span className="logo-icon">📊</span>
          <span className="logo-text">Intervue Poll</span>
        </div>
      </div>

      <TeacherInfoCard
        teacherId={teacherId}
        studentCount={studentCount}
        activePollQuestion={activePoll?.question}
      />

      {showCreateForm ? (
        <div className="create-poll-section">
          <h1>Let's Get Started</h1>
          <p>you'll have the ability to create and manage polls, ask questions, and monitor your students' responses in real-time.</p>

          <form onSubmit={handleCreatePoll} className="poll-form">
            <div className="form-group">
              <label>Enter your question</label>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What is your question?"
                required
              />
            </div>

            <div className="duration-section">
              <label>Time Duration</label>
              <div className="duration-input">
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                  min="1"
                  required
                />
                <select
                  value={durationUnit}
                  onChange={(e) => setDurationUnit(e.target.value as 'seconds' | 'minutes' | 'hours')}
                  className="duration-unit-select"
                >
                  <option value="seconds">Seconds</option>
                  <option value="minutes">Minutes</option>
                  <option value="hours">Hours</option>
                </select>
              </div>
              <p className="duration-help">
                {durationUnit === 'seconds' && 'Max: 24 hours'}
                {durationUnit === 'minutes' && `Max: ${Math.floor(1440)} minutes (24 hours)`}
                {durationUnit === 'hours' && 'Max: 24 hours'}
              </p>
            </div>

            <div className="options-section">
              <label>Edit Options</label>
              {options.map((option, index) => (
                <div key={index} className="option-input-group">
                  <div className="option-number">{index + 1}</div>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                  />
                  {options.length > 2 && (
                    <button
                      type="button"
                      className="remove-option-btn"
                      onClick={() => handleRemoveOption(index)}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                className="add-option-btn"
                onClick={handleAddOption}
              >
                + Add More option
              </button>
            </div>

            <button
              type="submit"
              className="create-button"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Poll'}
            </button>
          </form>
        </div>
      ) : activePoll ? (
        <div className="active-poll-section">
          <div className="poll-header">
            <div className="poll-title-section">
              <h2>{activePoll.question}</h2>
              <div className="student-count">
                Students: <strong>{studentCount}</strong>
              </div>
            </div>
            <div className="timer-section">
              <div className="timer" style={{ color: timeRemaining < 10 ? '#ff6b6b' : '#000' }}>
                {formatTime(timeRemaining)}
              </div>
              <button className="end-poll-btn" onClick={handleEndPoll}>
                End Poll
              </button>
            </div>
          </div>

          <div className="live-results">
            <h3>Live Results</h3>
            {activePoll.options.map((option) => {
              const totalVotes = activePoll.options.reduce((sum, opt) => sum + opt.votes, 0);
              const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;

              return (
                <div key={option.id} className="result-item">
                  <div className="result-header">
                    <span className="option-text">{option.text}</span>
                    <span className="vote-info">
                      {option.votes} votes
                    </span>
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
        </div>
      ) : null}

      {pollHistory.length > 0 && (
        <div className="poll-history-section">
          <h3>Poll History</h3>
          <div className="history-list">
            {pollHistory.map((poll) => (
              <div key={poll._id} className="history-item">
                <div className="history-item-header">
                  <h4>{poll.question}</h4>
                  <span className="total-votes">
                    Total votes: {poll.options.reduce((sum, opt) => sum + opt.votes, 0)}
                  </span>
                </div>
                <div className="history-options">
                  {poll.options.map((option) => (
                    <div key={option.id} className="history-option">
                      <span>{option.text}</span>
                      <span className="votes">{option.votes}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="teacher-action-buttons">
        <button
          className="action-btn history-btn"
          onClick={() => setIsHistoryOpen(true)}
          title="View poll history"
        >
          📊 History ({pollHistory.length})
        </button>
        <button
          className="action-btn chat-btn"
          onClick={() => setIsChatOpen(true)}
          title="Chat with students"
        >
          💬 Chat
        </button>
      </div>

      {/* Chat Component */}
      <Chat
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        userRole="teacher"
        userName="Teacher"
        teacherId={teacherId}
      />

      {/* Poll History Modal */}
      {isHistoryOpen && (
        <div className="modal-overlay" onClick={() => setIsHistoryOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <PollHistory
              polls={pollHistory}
              onClose={() => setIsHistoryOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherView;
