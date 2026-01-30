import React, { useState } from 'react';
import './StudentTeacherIdInput.css';

interface StudentTeacherIdInputProps {
  onTeacherIdSubmit: (teacherId: string) => void;
  isLoading?: boolean;
  error?: string;
}

const StudentTeacherIdInput: React.FC<StudentTeacherIdInputProps> = ({
  onTeacherIdSubmit,
  isLoading = false,
  error = ''
}) => {
  const [teacherId, setTeacherId] = useState('');
  const [showHelp, setShowHelp] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (teacherId.trim()) {
      onTeacherIdSubmit(teacherId.trim());
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setTeacherId(text);
    } catch {
      alert('Please copy the Teacher ID from your teacher first');
    }
  };

  return (
    <div className="student-teacher-id-input-container">
      <div className="student-teacher-id-card">
        <div className="student-teacher-id-header">
          <h2>Join a Poll</h2>
          <p>Enter your teacher's ID to see their polls</p>
        </div>

        <form onSubmit={handleSubmit} className="teacher-id-form">
          <div className="form-group">
            <label htmlFor="teacherId" className="form-label">
              Teacher ID
            </label>
            <div className="input-wrapper">
              <input
                id="teacherId"
                type="text"
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
                placeholder="Paste teacher ID here (e.g., a1b2c3d4-e5f6...)"
                className="teacher-id-input"
                disabled={isLoading}
                autoFocus
              />
              <button
                type="button"
                className="paste-btn"
                onClick={handlePaste}
                disabled={isLoading}
                title="Paste from clipboard"
              >
                📋 Paste
              </button>
            </div>
            {error && <p className="error-message">{error}</p>}
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={!teacherId.trim() || isLoading}
          >
            {isLoading ? 'Connecting...' : 'Join Poll'}
          </button>
        </form>

        <button
          type="button"
          className="help-toggle"
          onClick={() => setShowHelp(!showHelp)}
        >
          {showHelp ? '▼' : '▶'} How to get Teacher ID?
        </button>

        {showHelp && (
          <div className="help-section">
            <h3>How to join a poll:</h3>
            <ol className="help-steps">
              <li>Ask your teacher to share their Teacher ID</li>
              <li>Your teacher will provide it via:
                <ul>
                  <li>Sharing the ID in WhatsApp/Email</li>
                  <li>Writing it on the whiteboard</li>
                  <li>Including in a meeting link message</li>
                  <li>Or directly telling you</li>
                </ul>
              </li>
              <li>Copy the Teacher ID (it looks like: a1b2c3d4-e5f6...)</li>
              <li>Paste it here using the <strong>Paste</strong> button or manually type it</li>
              <li>Click <strong>Join Poll</strong></li>
              <li>You'll see your teacher's polls automatically!</li>
            </ol>

            <div className="teacher-id-format">
              <strong>Teacher ID Format:</strong>
              <p>Teacher IDs are unique identifiers that look like:</p>
              <code>550e8400-e29b-41d4-a716-446655440000</code>
            </div>

            <div className="join-process">
              <strong>Join Process:</strong>
              <ol>
                <li>You enter Teacher ID</li>
                <li>System connects to teacher's poll</li>
                <li>You get automatically added to their class</li>
                <li>When teacher asks a question, you see it in real-time</li>
                <li>You submit answers and see live results!</li>
              </ol>
            </div>
          </div>
        )}

        <div className="student-info-note">
          <strong>💡 Tip:</strong> Keep the Teacher ID ready. As soon as you join, you'll be able to participate in live polls!
        </div>
      </div>
    </div>
  );
};

export default StudentTeacherIdInput;
