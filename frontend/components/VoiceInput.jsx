'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './VoiceInput.module.css';

export default function VoiceInput({ onTranscript, onPlayAudio }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);

  // Initialize Speech Recognition API
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'hu-HU'; // Hungarian
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setTranscript('');
      };

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            setTranscript((prev) => prev + ' ' + transcript);
            if (onTranscript) onTranscript(transcript);
          } else {
            interimTranscript += transcript;
          }
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }

    // Initialize Speech Synthesis API
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, [onTranscript]);

  const handleStartListening = () => {
    if (recognitionRef.current) {
      setTranscript('');
      recognitionRef.current.start();
    }
  };

  const handleStopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const handlePlayAudio = async (text) => {
    if (!synthRef.current) return;

    setIsSpeaking(true);

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hu-HU'; // Hungarian
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onend = () => {
        setIsSpeaking(false);
        if (onPlayAudio) onPlayAudio();
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error);
        setIsSpeaking(false);
      };

      synthRef.current.speak(utterance);
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsSpeaking(false);
    }
  };

  const handleClearTranscript = () => {
    setTranscript('');
  };

  return (
    <div className={styles.voiceInput}>
      <div className={styles.controls}>
        <button
          className={`${styles.button} ${isListening ? styles.listening : ''}`}
          onClick={handleStartListening}
          disabled={isListening}
          title="Beszéd felvételének indítása"
        >
          🎤 Figyelés
        </button>

        <button
          className={`${styles.button} ${isListening ? '' : styles.disabled}`}
          onClick={handleStopListening}
          disabled={!isListening}
          title="Beszéd felvételének leállítása"
        >
          ⏹️ Leállítás
        </button>

        <button
          className={`${styles.button} ${isSpeaking ? styles.speaking : ''}`}
          onClick={() => handlePlayAudio(transcript || 'Üdvözöllek!')}
          disabled={!transcript || isSpeaking}
          title="Felolvasás"
        >
          🔊 Felolvasás
        </button>

        <button
          className={styles.button}
          onClick={handleClearTranscript}
          disabled={!transcript}
          title="Szöveg törlése"
        >
          🗑️ Törlés
        </button>
      </div>

      {transcript && (
        <div className={styles.transcript}>
          <p className={styles.label}>Feldolgozás alatt:</p>
          <p className={styles.text}>{transcript}</p>
        </div>
      )}

      <div className={styles.status}>
        {isListening && <span className={styles.listening}>🔴 Figyelés...</span>}
        {isSpeaking && <span className={styles.speaking}>🔊 Felolvasás...</span>}
        {!isListening && !isSpeaking && transcript && (
          <span className={styles.ready}>✅ Kész</span>
        )}
      </div>
    </div>
  );
}
