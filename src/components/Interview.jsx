import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';
function Interview() {
    const { state } = useLocation();
    const { type, subject } = state || {};  // Destructure the type and subject from state
    const navigate = useNavigate();
    const [recording, setRecording] = useState(false);
    const [status, setStatus] = useState('');
    const [transcription, setTranscription] = useState('');
    const [feedback, setFeedback] = useState('');
    const [question, setQuestion] = useState('');
    const [rating, setRating] = useState('');
    const [prevRating, SetPrevRating] = useState(null);
    const [statusColor, setStatusColor] = useState(null)
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);

    const fetchQuestion = async () => {
    setStatus('Fetching question...');
    setStatusColor('black');
    try {
        let url = `http://localhost:8000/api/get_question?type=${type}`;
        if (type === 'Technical') {
            url += `&subject=${subject}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
            console.error(`Server error: ${response.status}`);
            setStatus(`Failed to fetch question. Server error: ${response.status}`);
            return;
        }

        const data = await response.json();
        console.log('Fetched Question:', data);

        if (data.question) {
            setQuestion(data.question);
            setStatus('');
        } else {
            setStatus('No question received from server');
        }
    } catch (err) {
        console.error('Error fetching question:', err);
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
                setStatusColor('green')
            } else if (currAvg < prevAvg) {
                setStatus('You did slightly worse. Try again!');
                setStatusColor('red')
            } else {
                setStatus('Consistent performance! Lets push for better.');
                setStatusColor('blue')
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
    }
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
                setStatusColor('black')
                try {
                    const res = await fetch('http://localhost:8000/api/process_audio/', {
                        method: 'POST',
                        body: formData
                    });
            
                    const text = await res.text();
            
                    if (!res.ok) {
                        console.error('Server error:', res.status, text);
                        setStatus(`Error ${res.status}: ${text}`);
                        return;
                    }
            
                    const data = JSON.parse(text);
                    setTranscription(data.transcription || '');
                    setFeedback(data.feedback || '');
                    setRating(data.rating || '');
                    setStatus('Done!');
                } catch (err) {
                    console.error('Failed to parse JSON:', err);
                    setStatus('Error parsing server response.');
                }
            };

            mediaRecorder.start();
            setRecording(true);
            setStatus('Recording...');
            setStatusColor('black')
        } else {
            mediaRecorderRef.current.stop();
            setRecording(false);
            setStatus('Stopped.');
            setStatus('black')
        }
    };

   const normalizeRatings = (currentRating, prevRating, alpha = 0.4) => {
  const normalized = {};
  const maxScore = 10;  // max rating value before normalization

  ['fluency', 'content_structure', 'accuracy', 'grammar', 'vocabulary', 'coherence'].forEach(metric => {
    const curr = parseFloat(currentRating[metric]) || 0;
    const prev = prevRating ? (parseFloat(prevRating[metric]) || 0) : 0;

    const norm = ((curr + alpha * prev) / (1 + alpha));
    normalized[metric] = Math.round(norm * 100) / 100; // round to 2 decimals
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

    console.log('Payload to save:', payload);

    try {
      const token = localStorage.getItem('access_token'); // Assuming you store JWT in localStorage
      console.log('JWT Token:', token);
      if (!token) {
        setStatus('You must be logged in to save ratings.');
        return;
    }
      const res = await fetch('http://localhost:8000/api/save_rating/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // if you use token auth
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server error: ${res.status} - ${text}`);
      }

      const responseData = await res.json();
      console.log('Backend response:', responseData);

    } catch (err) {
      console.error('Failed to save rating:', err);
    }
  }

  if (action === 'next') {
    setPrevRating(rating);
    setTranscription('');
    setFeedback('');
    setRating('');
    setStatus('');
    setRecording(false);
    chunksRef.current = [];
    fetchQuestion();
  } else if (action === 'done') {
    navigate('/dashboard');
  }
};


    

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
            <h1 className="text-3xl font-bold mb-4">Interview Type: {type}</h1>
            {type === 'Technical' && subject && (
                <p className="mb-2 text-lg text-gray-700">Subject: {subject}</p>
            )}
            {question && (
                <div className="mt-4 bg-white shadow-md rounded-xl p-4 w-full max-w-2xl">
                    <p className="font-semibold">Random Question:</p>
                    <p className="text-gray-800">{question}</p>
                </div>
            )}
            {!transcription && !feedback && (
                <>
                    {!recording && (
                        <button
                            onClick={handleRecord}
                            className="mt-10 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition cursor-pointer"
                        >
                            🎙️ Start Recording
                        </button>
                    )}
                    {recording && (
                        <button
                            onClick={handleRecord}
                            className="mt-10 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition cursor-pointer"
                        >
                            ⏹️ Stop Recording
                        </button>
                    )}
                </>
            )}

            <p style={{color : statusColor}} className="mt-4 text-gray-600">{status}</p>

            <div className="mt-6 bg-white shadow-md rounded-xl p-4 w-full max-w-2xl">
                <p className="font-semibold">Transcription:</p>
                <p className="text-gray-800">{transcription}</p>
                <p className="font-semibold mt-4">Feedback:</p>
                <div className="my-markdown-wrapper text-gray-800">
                <ReactMarkdown>{feedback}</ReactMarkdown>
                </div>

                <p className="font-semibold mt-4">Ratings:</p>
                <p className="text-gray-800">
                <ul>
                    {Object.entries(rating).map(([key, value]) => (
                        <li key={key}>
                        <strong>{key}:</strong> {value}
                        </li>
                    ))}
                </ul>
                </p>
            </div>

            {transcription && feedback && (
                <div className='flex flex-row justify-between items-center gap-6'>
                    
                        <button onClick={handleRetry} className='mt-8 bg-blue-600 text-white rounded-2xl px-6 py-3 hover:bg-blue-700 transition hover:shadow-lg shadow-blue-900/50 hover:translate-y-[-2px] duration-200 ease-in-out cursor-pointer'>Retry</button>
                        {/* <Link onClick={handleSaveAndProceed} to={'/dashboard'} className='mt-8 bg-blue-600 text-white rounded-2xl px-6 py-3 hover:bg-blue-700 transition hover:shadow-lg shadow-blue-900/50 hover:translate-y-[-2px] duration-200 ease-in-out cursor-pointer'>Done</Link>   */}
                        <button
                        onClick={() => handleSaveAndProceed('done')}
                        className="mt-8 bg-blue-600 text-white rounded-2xl px-6 py-3 hover:bg-blue-700 transition hover:shadow-lg shadow-blue-900/50 hover:translate-y-[-2px] duration-200 ease-in-out cursor-pointer"
                        >
                        Done
                        </button>
                        <button onClick={handleNext} className='mt-8 bg-blue-600 text-white rounded-2xl px-6 py-3 hover:bg-blue-700 transition hover:shadow-lg shadow-blue-900/50 hover:translate-y-[-2px] duration-200 ease-in-out cursor-pointer'>Next</button>
                </div>
            )}


        </div>
    );
}

export default Interview;
