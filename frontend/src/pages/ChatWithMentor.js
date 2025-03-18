import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../styles/ChatWithMentor.css';

const ChatWithMentor = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatBoxRef = useRef(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/chat', {
        message: input,
      });

      const botMessage = { sender: 'mentor', text: response.data.response };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = { sender: 'mentor', text: 'Something went wrong. Please try again later.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReset = () => {
    setMessages([]);
    setInput('');
  };

  useEffect(() => {
    chatBoxRef.current?.scrollTo({
      top: chatBoxRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Chat with Mentor Tatva</h2>
        <button className="reset-btn" onClick={handleReset}>Reset</button>
      </div>

      <div className="chat-box" ref={chatBoxRef}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message-row ${msg.sender === 'user' ? 'user' : 'mentor'}`}
          >
            <div className="avatar">{msg.sender === 'user' ? '🧑‍💻' : '🧙‍♂️'}</div>
            <div className="bubble">
              <div className="message-content">{msg.text}</div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="message-row mentor">
            <div className="avatar">🧙‍♂️</div>
            <div className="bubble">
              <div className="dot-flashing"></div>
            </div>
          </div>
        )}
      </div>

      <div className="input-section">
        <textarea
          className="message-input"
          placeholder="Ask your mentor something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows="3"
        />
        <button className="send-button" onClick={handleSend} disabled={isLoading || !input.trim()}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWithMentor;