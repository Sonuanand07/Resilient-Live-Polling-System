import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';

interface ChatMessage {
  id: string;
  sender: string;
  senderType: 'teacher' | 'student';
  message: string;
  timestamp: number;
}

interface ChatProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: 'teacher' | 'student';
  userName: string;
  teacherId: string;
  onSendMessage?: (message: string) => void;
}

const Chat: React.FC<ChatProps> = ({
  isOpen,
  onClose,
  userRole,
  userName,
  teacherId,
  onSendMessage
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: userName,
      senderType: userRole,
      message: inputValue,
      timestamp: Date.now()
    };

    setMessages([...messages, newMessage]);
    onSendMessage?.(inputValue);
    setInputValue('');
  };

  if (!isOpen) return null;

  return (
    <div className="chat-overlay">
      <div className="chat-container">
        <div className="chat-header">
          <h3>Chat with {userRole === 'teacher' ? 'Students' : 'Teacher'}</h3>
          <button className="chat-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="chat-messages">
          {messages.length === 0 ? (
            <div className="chat-empty">
              <p>📬 No messages yet</p>
              <p className="chat-empty-hint">
                Start a conversation {userRole === 'teacher' ? 'with your students' : 'with your teacher'}
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`chat-message ${msg.senderType === userRole ? 'sent' : 'received'}`}
              >
                <div className="message-header">
                  <span className="message-sender">{msg.sender}</span>
                  <span className="message-time">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div className="message-content">{msg.message}</div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="chat-form">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="chat-input"
            autoFocus
          />
          <button type="submit" className="chat-send-btn" disabled={!inputValue.trim()}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
