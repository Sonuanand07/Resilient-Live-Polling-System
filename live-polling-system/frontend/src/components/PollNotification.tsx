import React, { useState, useEffect } from 'react';
import './PollNotification.css';

interface PollNotificationProps {
  isVisible: boolean;
  message: string;
  pollQuestion?: string;
  onClose?: () => void;
}

const PollNotification: React.FC<PollNotificationProps> = ({
  isVisible,
  message,
  pollQuestion,
  onClose
}) => {
  const [show, setShow] = useState(isVisible);

  useEffect(() => {
    setShow(isVisible);
    if (isVisible) {
      const timer = setTimeout(() => {
        setShow(false);
        onClose?.();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!show) return null;

  return (
    <div className="poll-notification">
      <div className="notification-content">
        <div className="notification-icon">📢</div>
        <div className="notification-text">
          <p className="notification-message">{message}</p>
          {pollQuestion && (
            <p className="notification-question">
              <strong>Poll:</strong> {pollQuestion}
            </p>
          )}
        </div>
        <button
          className="notification-close"
          onClick={() => {
            setShow(false);
            onClose?.();
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default PollNotification;
