import React, { useState } from 'react';
import { useSocket } from '../hooks/useSocket';
import { useNavigate } from 'react-router-dom';
import './RoleSelection.css';

const RoleSelection: React.FC = () => {
  const { isConnected } = useSocket();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher' | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = async (role: 'student' | 'teacher') => {
    if (!isConnected) {
      alert('Unable to connect to server. Please try again.');
      return;
    }

    setSelectedRole(role);
    setLoading(true);

    if (role === 'teacher') {
      navigate('/teacher');
    } else {
      navigate('/student');
    }
  };

  return (
    <div className="role-selection-container">
      <div className="logo-section">
        <div className="logo-badge">
          <span className="logo-icon">📊</span>
          <span className="logo-text">Intervue Poll</span>
        </div>
      </div>

      <div className="welcome-section">
        <h1 className="welcome-title">Welcome to the Live Polling System</h1>
        <p className="welcome-subtitle">
          Please select the role that best describes you to begin using the live polling system
        </p>
      </div>

      <div className="roles-container">
        <div
          className={`role-card student-card ${selectedRole === 'student' ? 'selected' : ''}`}
          onClick={() => handleRoleSelect('student')}
        >
          <div className="role-header">
            <h2>I'm a Student</h2>
          </div>
          <p className="role-description">
            Submit answers and view live poll results in real-time.
          </p>
        </div>

        <div
          className={`role-card teacher-card ${selectedRole === 'teacher' ? 'selected' : ''}`}
          onClick={() => handleRoleSelect('teacher')}
        >
          <div className="role-header">
            <h2>I'm a Teacher</h2>
          </div>
          <p className="role-description">
            Create polls, manage questions, and view detailed student responses.
          </p>
        </div>
      </div>

      <button
        className="continue-button"
        onClick={() => {
          if (selectedRole) handleRoleSelect(selectedRole);
        }}
        disabled={!selectedRole || loading}
      >
        {loading ? 'Loading...' : 'Continue'}
      </button>
    </div>
  );
};

export default RoleSelection;
