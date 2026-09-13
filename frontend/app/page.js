'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const wsRef = useRef(null);

  useEffect(() => {
    // Connect to WebSocket
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host.replace(':3000', ':3001')}`;
    
    wsRef.current = new WebSocket(wsUrl);

    wsRef.current.onopen = () => {
      console.log('Connected to AI');
    };

    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.message, id: Date.now() },
      ]);
      setIsLoading(false);
    };

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input, id: Date.now() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ message: input }));
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>🤖 Browser AI Asszisztens</h1>
        <p>Gmail • Google Drive • Böngészés • Python • Hangalapú</p>
      </header>

      <main className={styles.chatArea}>
        <div className={styles.messages}>
          {messages.length === 0 ? (
            <div className={styles.welcome}>
              <h2>Üdvözöllek! 👋</h2>
              <p>Mit szeretnél, hogy tegyek?</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`${styles.message} ${styles[msg.role]}`}
              >
                <span className={styles.role}>
                  {msg.role === 'user' ? '👤' : '🤖'}
                </span>
                <div className={styles.content}>{msg.content}</div>
              </div>
            ))
          )}
          {isLoading && (
            <div className={`${styles.message} ${styles.assistant}`}>
              <span className={styles.role}>🤖</span>
              <div className={styles.content}>Gondolkozom...</div>
            </div>
          )}
        </div>
      </main>

      <footer className={styles.footer}>
        <form onSubmit={handleSendMessage}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Írj valamit..."
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading}>
            Küldés
          </button>
        </form>
      </footer>
    </div>
  );
}
