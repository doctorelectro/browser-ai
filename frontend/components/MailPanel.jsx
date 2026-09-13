'use client';

import { useEffect, useState } from 'react';
import styles from './MailPanel.module.css';

export default function MailPanel({ authToken }) {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmail, setSelectedEmail] = useState(null);

  const fetchEmails = async (query = '') => {
    if (!authToken) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/mail/emails?query=${encodeURIComponent(query)}&maxResults=10`,
        {
          headers: { 'Authorization': `Bearer ${authToken}` },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch emails');
      const data = await response.json();
      setEmails(data.emails || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching emails:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authToken) {
      fetchEmails();
    }
  }, [authToken]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEmails(searchQuery);
  };

  const handleSelectEmail = async (messageId) => {
    if (!authToken) return;

    try {
      const response = await fetch(`/api/mail/emails/${messageId}`, {
        headers: { 'Authorization': `Bearer ${authToken}` },
      });

      if (!response.ok) throw new Error('Failed to fetch email');
      const data = await response.json();
      setSelectedEmail(data);
    } catch (err) {
      console.error('Error fetching email:', err);
      setError(err.message);
    }
  };

  return (
    <div className={styles.mailPanel}>
      <div className={styles.header}>
        <h2>📧 Gmail</h2>
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <input
            type="text"
            placeholder="Emailek keresése..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Keresés...' : 'Keresés'}
          </button>
        </form>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.content}>
        {selectedEmail ? (
          <div className={styles.emailDetail}>
            <button
              className={styles.backButton}
              onClick={() => setSelectedEmail(null)}
            >
              ← Vissza
            </button>
            <div className={styles.emailContent}>
              <h3>{selectedEmail.payload?.headers?.find(h => h.name === 'Subject')?.value || 'No subject'}</h3>
              <p className={styles.emailMeta}>
                From: {selectedEmail.payload?.headers?.find(h => h.name === 'From')?.value}
              </p>
              <div className={styles.emailBody}>
                {selectedEmail.snippet}
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.emailList}>
            {emails.length === 0 ? (
              <p className={styles.empty}>Nincsenek emailek</p>
            ) : (
              emails.map((email) => (
                <div
                  key={email.id}
                  className={styles.emailItem}
                  onClick={() => handleSelectEmail(email.id)}
                >
                  <div className={styles.emailPreview}>{email.snippet}</div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
