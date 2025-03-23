import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/ChatWithMentor.css';
const API_URL = process.env.REACT_APP_API_URL;

const ChatWithInterviewer = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatBoxRef = useRef(null);

  const fetchMessages = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/arya-chat-history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data.history || []);
    } catch (error) {
      console.error('Failed to fetch chat history:', error);
    }
  }, []);

    useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', message: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
         `${API_URL}/arya-chat`,
         { message: input },
         { headers: { Authorization: `Bearer ${token}` } }
        );
      const botMessage = { sender: 'arya', message: res.data.message };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = { sender: 'arya', message: 'Something went wrong. Please try again later.' };
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

  const handleReset = async () => {
    const confirmed = window.confirm("Are you sure you want to reset the chat? This will clear all history.");
    if (!confirmed) return;
  
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/arya-chat-reset`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      setMessages([]);
      setInput('');
    } catch (error) {
      console.error('Reset failed:', error);
      alert('Failed to reset chat. Please try again later.');
    }
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
        <h2>Mock Interview with Arya</h2>
        <Link to="/Dashboard">
          <button className="back-btn">⬅ Back</button>
        </Link>
        <button className="reset-btn" onClick={handleReset}>Reset chat</button>
      </div>

      <div className="chat-box" ref={chatBoxRef}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message-row ${msg.sender === 'user' ? 'user' : 'arya'}`}
          >
            <div className="avatar">{msg.sender === 'user' ? '🧑‍💼' : '🎤'}</div>
            <div className="bubble">
              <div className="message-content">{msg.message}</div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="message-row mentor">
            <div className="avatar">🎤</div>
            <div className="bubble">
              <div className="dot-flashing"></div>
            </div>
          </div>
        )}
      </div>

      <div className="input-section">
        <textarea
          className="message-input"
          placeholder="Type your message here..."
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

export default ChatWithInterviewer;