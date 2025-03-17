import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import '../styles/ChatWithMentor.css';

function ChatWithMentor() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const chatBoxRef = useRef(null);

  const API_URL = process.env.REACT_APP_API_URL;

  const fetchMessages = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/tatva-chat-history`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (Array.isArray(res.data.history)) {
        const normalized = res.data.history.map((m) => ({
          role: m.sender === 'tatva' ? 'npc' : 'user',
          content: m.message,
          timestamp: new Date(m.timestamp).toLocaleString(),
        }));
        setMessages(normalized);
      } else {
        console.error("Unexpected API response:", res.data);
        setMessages([]);
      }
    } catch (err) {
      console.error("Error fetching chat history:", err);
      setMessages([]);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = {
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${API_URL}/tatva-chat`,
        { message: input },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const npcMsg = {
        role: 'npc',
        content: res.data.message,
        timestamp: new Date().toLocaleString(),
      };

      setTimeout(() => {
        setMessages((prev) => [...prev, npcMsg]);
        setTyping(false);
      }, 1000);
    } catch (err) {
      console.error("Error sending message:", err);
      setTyping(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-box" ref={chatBoxRef}>
        {Array.isArray(messages) &&
          messages.map((msg, index) => (
            <div key={index} className={`message ${msg.role === 'user' ? 'user' : 'npc'}`}>
              <div className="message-content">{msg.content}</div>
              <div className="timestamp">{msg.timestamp}</div>
            </div>
          ))}
        {typing && (
          <div className="message npc">
            <span className="dot-flashing"></span>
            Tatva is typing...
          </div>
        )}
      </div>
      <div className="input-section">
        <input
          type="text"
          placeholder="Ask Tatva anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default ChatWithMentor;
