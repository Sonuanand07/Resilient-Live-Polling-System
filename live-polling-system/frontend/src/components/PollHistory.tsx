import React, { useState } from 'react';
import './PollHistory.css';

interface PollResult {
  _id: string;
  question: string;
  options: {
    id: string;
    text: string;
    votes: number;
  }[];
  duration: number;
  endedAt?: string;
  totalResponses?: number;
}

interface PollHistoryProps {
  polls: PollResult[];
  isLoading?: boolean;
  onClose?: () => void;
}

const PollHistory: React.FC<PollHistoryProps> = ({
  polls = [],
  isLoading = false,
  onClose
}) => {
  const [selectedPoll, setSelectedPoll] = useState<PollResult | null>(null);

  const calculatePercentage = (votes: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((votes / total) * 100);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (selectedPoll) {
    const totalVotes = selectedPoll.options.reduce((sum, opt) => sum + opt.votes, 0);

    return (
      <div className="poll-history-detail">
        <div className="history-detail-header">
          <button className="back-btn" onClick={() => setSelectedPoll(null)}>
            ← Back
          </button>
          <h3>Poll Details</h3>
          <div style={{ width: '40px' }} />
        </div>

        <div className="history-detail-content">
          <h4 className="detail-question">{selectedPoll.question}</h4>

          <div className="detail-stats">
            <div className="stat">
              <span className="stat-label">Total Responses:</span>
              <span className="stat-value">{totalVotes}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Duration:</span>
              <span className="stat-value">{selectedPoll.duration}s</span>
            </div>
          </div>

          <div className="detail-results">
            {selectedPoll.options.map((option) => {
              const percentage = calculatePercentage(option.votes, totalVotes);
              return (
                <div key={option.id} className="result-item">
                  <div className="result-option">{option.text}</div>
                  <div className="result-bar-container">
                    <div
                      className="result-bar"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="result-stats">
                    <span className="result-votes">{option.votes} votes</span>
                    <span className="result-percentage">{percentage}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="poll-history">
      <div className="history-header">
        <h3>Poll History</h3>
        {onClose && (
          <button className="history-close" onClick={onClose}>
            ✕
          </button>
        )}
      </div>

      <div className="history-content">
        {isLoading ? (
          <div className="history-loading">
            <p>Loading polls...</p>
          </div>
        ) : polls.length === 0 ? (
          <div className="history-empty">
            <p>📊 No polls yet</p>
            <p className="history-empty-hint">
              Past poll results will appear here
            </p>
          </div>
        ) : (
          <div className="history-list">
            {polls.map((poll) => {
              const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
              const topOption = poll.options.reduce((max, opt) =>
                opt.votes > max.votes ? opt : max
              );

              return (
                <div
                  key={poll._id}
                  className="history-item"
                  onClick={() => setSelectedPoll(poll)}
                >
                  <div className="item-header">
                    <h4 className="item-question">{poll.question}</h4>
                    <span className="item-date">
                      {formatDate(poll.endedAt)}
                    </span>
                  </div>

                  <div className="item-preview">
                    <div className="preview-top">
                      <span className="preview-label">Top Answer:</span>
                      <span className="preview-answer">{topOption.text}</span>
                    </div>
                    <div className="preview-stats">
                      <span className="preview-votes">{totalVotes} responses</span>
                    </div>
                  </div>

                  <div className="item-arrow">→</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PollHistory;
