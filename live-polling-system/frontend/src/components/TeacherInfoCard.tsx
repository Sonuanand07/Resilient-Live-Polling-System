import React, { useState } from 'react';
import './TeacherInfoCard.css';

interface TeacherInfoCardProps {
  teacherId: string;
  studentCount: number;
  activePollQuestion?: string;
}

const TeacherInfoCard: React.FC<TeacherInfoCardProps> = ({
  teacherId,
  studentCount,
  activePollQuestion
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyTeacherId = () => {
    navigator.clipboard.writeText(teacherId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="teacher-info-card">
      <div className="teacher-info-header">
        <h2>Teacher ID (Share with Students)</h2>
      </div>

      <div className="teacher-id-display">
        <div className="teacher-id-box">
          <code>{teacherId}</code>
          <button
            className={`copy-btn ${copied ? 'copied' : ''}`}
            onClick={handleCopyTeacherId}
            title="Copy Teacher ID"
          >
            {copied ? '✓ Copied' : '📋 Copy'}
          </button>
        </div>
      </div>

      <div className="teacher-info-stats">
        <div className="stat-item">
          <span className="stat-label">Connected Students:</span>
          <span className="stat-value">{studentCount}</span>
        </div>
        {activePollQuestion && (
          <div className="stat-item">
            <span className="stat-label">Current Poll:</span>
            <span className="stat-value">{activePollQuestion}</span>
          </div>
        )}
      </div>

      <div className="teacher-info-instructions">
        <p className="instruction-title">How to share with students:</p>
        <ol className="instruction-list">
          <li>Click <strong>Copy</strong> button above</li>
          <li>Share the Teacher ID with students via:
            <ul>
              <li>WhatsApp, Email, or Messaging app</li>
              <li>Write it on a whiteboard</li>
              <li>Include in meeting link description</li>
            </ul>
          </li>
          <li>Students enter this ID in their student panel</li>
          <li>Students will see your active poll automatically</li>
        </ol>
      </div>

      <div className="teacher-info-sharing-buttons">
        <p>Share this ID with your students to let them join the poll</p>
      </div>

      <div className="teacher-info-note">
        <strong>⚠️ Important:</strong> Share your Teacher ID with students. They need it to join your polls and see live results.
      </div>
    </div>
  );
};

export default TeacherInfoCard;
