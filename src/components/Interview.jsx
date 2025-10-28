import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';


const BASE_URL = import.meta.env.MODE === "development"
  ? "http://localhost:8000"   // your local backend
  : "https://techfluent.onrender.com";  // deployed backend


function Interview() {
  const { state } = useLocation();
  const { type, subject } = state || {};
  const navigate = useNavigate();

  const [recording, setRecording] = useState(false);
  const [status, setStatus] = useState('');
  const [transcription, setTranscription] = useState('');
  const [feedback, setFeedback] = useState('');
  const [question, setQuestion] = useState('');
  const [rating, setRating] = useState('');
  const [prevRating, SetPrevRating] = useState(null);
  const [statusColor, setStatusColor] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const fetchQuestion = async () => {
    setStatus('Fetching question...');
    setStatusColor('black');
    try {
      let url = `${BASE_URL}/api/get_question?type=${type}`;
      if (type === 'Technical') url += `&subject=${subject}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.question) {
        setQuestion(data.question);
        setStatus('');
      } else {
        setStatus('No question received from server');
      }
    } catch (err) {
      setStatus(`Error: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, [type, subject]);

  useEffect(() => {
    if (prevRating && rating) {
      const prevAvg = averageRating(prevRating);
      const currAvg = averageRating(rating);
      if (currAvg > prevAvg) {
        setStatus('Great! You improved 👏');
        setStatusColor('green');
      } else if (currAvg < prevAvg) {
        setStatus('You did slightly worse. Try again!');
        setStatusColor('red');
      } else {
        setStatus('Consistent performance! Let’s push for better.');
        setStatusColor('blue');
      }
    }
  }, [rating]);

  const averageRating = (ratingObj) => {
    const values = Object.values(ratingObj).map(val => parseFloat(val));
    const validValues = values.filter(val => !isNaN(val));
    return validValues.reduce((a, b) => a + b, 0) / validValues.length;
  };

  const handleRetry = () => {
    SetPrevRating(rating);
    setTranscription('');
    setFeedback('');
    setRating('');
    setStatus('');
    setRecording(false);
    chunksRef.current = [];
  };

  const handleNext = () => {
    SetPrevRating(rating);
    setTranscription('');
    setFeedback('');
    setRating('');
    setStatus('');
    setRecording(false);
    chunksRef.current = [];
    fetchQuestion();
  };

  const handleRecord = async () => {
    if (!recording) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      mediaRecorder.ondataavailable = e => chunksRef.current.push(e.data);
      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const formData = new FormData();
        formData.append('audio', blob, 'recording.webm');
        formData.append('interview_type', type);
        formData.append('subject', subject || '');
        setStatus('Transcribing...');
        setStatusColor('black');
        try {
          const res = await fetch(`${BASE_URL}/api/process_audio/`, {
            method: 'POST',
            body: formData
          });
          const text = await res.text();
          if (!res.ok) {
            setStatus(`Error ${res.status}: ${text}`);
            return;
          }
          const data = JSON.parse(text);
          setTranscription(data.transcription || '');
          setFeedback(data.feedback || '');
          setRating(data.rating || '');
          setStatus('Done!');
        } catch (err) {
          setStatus('Error parsing server response.');
        }
      };
      mediaRecorder.start();
      setRecording(true);
      setStatus('Recording...');
    } else {
      mediaRecorderRef.current.stop();
      setRecording(false);
      setStatus('Stopped.');
    }
  };

  const normalizeRatings = (currentRating, prevRating, alpha = 0.4) => {
    const normalized = {};
    const maxScore = 10;
    ['fluency', 'content_structure', 'accuracy', 'grammar', 'vocabulary', 'coherence'].forEach(metric => {
      const curr = parseFloat(currentRating[metric]) || 0;
      const prev = prevRating ? (parseFloat(prevRating[metric]) || 0) : 0;
      const norm = ((curr + alpha * prev) / (1 + alpha));
      normalized[metric] = Math.round(norm * 100) / 100;
    });
    const overall = Object.values(normalized).reduce((a, b) => a + b, 0) / Object.values(normalized).length;
    return { normalized, overall: Math.round(overall * 100) / 100 };
  };

  const handleSaveAndProceed = async (action) => {
    if (rating) {
      const { normalized, overall } = normalizeRatings(rating, prevRating);
      const payload = {
        interview_type: type,
        normalized_ratings: normalized,
        overall_rating: overall,
      };
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          setStatus('You must be logged in to save ratings.');
          return;
        }
        const res = await fetch(`${BASE_URL}/api/save_rating/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Server error: ${res.status} - ${text}`);
        }
      } catch (err) {
        console.error('Failed to save rating:', err);
      }
    }
    if (action === 'next') handleNext();
    else if (action === 'done') navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-2 text-center">Interview Type: {type}</h1>
      {type === 'Technical' && subject && (
        <p className="text-lg text-gray-700 mb-4">Subject: {subject}</p>
      )}
      {question && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 bg-white shadow-md rounded-xl p-4 w-full max-w-2xl"
        >
          <p className="font-semibold">Random Question:</p>
          <p className="text-gray-800">{question}</p>
        </motion.div>
      )}

      {!transcription && !feedback && (
        <button
          onClick={handleRecord}
          className={`mt-10 px-6 py-3 ${
            recording ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
          } text-white rounded-xl transition`}
        >
          {recording ? '⏹️ Stop Recording' : '🎙️ Start Recording'}
        </button>
      )}

      <p style={{ color: statusColor }} className="mt-4 text-gray-600">{status}</p>

      {transcription && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 bg-gradient-to-r from-indigo-50 via-white to-indigo-50 border-l-4 border-indigo-500 shadow-md rounded-xl p-6 w-full max-w-2xl"
        >
          <h2 className="text-2xl font-bold text-indigo-700 mb-3 flex items-center gap-2">
            🗣️ <span>What You Said</span>
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed">{transcription}</p>
        </motion.div>
      )}

      {feedback && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 bg-gradient-to-r from-green-50 via-white to-green-50 border-l-4 border-green-500 shadow-md rounded-xl p-6 w-full max-w-2xl"
        >
          <h2 className="text-2xl font-bold text-green-700 mb-3 flex items-center gap-2">
            📋 <span>Your AI Coach Says</span>
          </h2>
          <div className="prose prose-green prose-sm max-w-none text-gray-800">
            <ReactMarkdown>{feedback}</ReactMarkdown>
          </div>
        </motion.div>
      )}

      {rating && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 bg-white shadow-lg rounded-xl p-6 w-full max-w-2xl"
        >
          <h2 className="text-xl font-semibold text-purple-700 mb-4">📊 Ratings</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            {Object.entries(rating).map(([key, value]) => {
              const score = parseFloat(value);
              const getBadgeColor = () => {
                if (score >= 8) return 'bg-green-100 text-green-800';
                if (score >= 5) return 'bg-yellow-100 text-yellow-800';
                return 'bg-red-100 text-red-800';
              };
              return (
                <div
                  key={key}
                  className={`flex justify-between px-4 py-2 rounded-md ${getBadgeColor()} shadow-sm`}
                >
                  <span className="capitalize font-medium">{key.replace('_', ' ')}</span>
                  <span className="font-bold">{value}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {transcription && feedback && (
        <div className="flex flex-row gap-4 mt-8">
          <button onClick={handleRetry} className="bg-blue-600 text-white rounded-xl px-6 py-3 hover:bg-blue-700 transition">
            Retry
          </button>
          <button onClick={() => handleSaveAndProceed('done')} className="bg-green-600 text-white rounded-xl px-6 py-3 hover:bg-green-700 transition">
            Done
          </button>
          <button onClick={() => handleSaveAndProceed('next')} className="bg-indigo-600 text-white rounded-xl px-6 py-3 hover:bg-indigo-700 transition">
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default Interview;
