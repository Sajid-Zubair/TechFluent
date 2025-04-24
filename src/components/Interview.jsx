import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
function Interview() {
    const { state } = useLocation();
    const { type, subject } = state || {};  // Destructure the type and subject from state
    
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



    useEffect(() => {
        const fetchQuestion = async () => {
            setStatus('Fetching question...');
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
    
        if (type === 'Technical' && subject) {
            fetchQuestion();
        } else if (type === 'Behavioural') {
            fetchQuestion();
        }
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
                <button
                    onClick={handleRecord}
                    className="mt-10 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition cursor-pointer"
                >
                    {recording ? '⏹️ Stop Recording' : '🎙️ Start Recording'}
                </button>
            )}

            <p style={{color : statusColor}} className="mt-4 text-gray-600">{status}</p>

            <div className="mt-6 bg-white shadow-md rounded-xl p-4 w-full max-w-2xl">
                <p className="font-semibold">Transcription:</p>
                <p className="text-gray-800">{transcription}</p>
                <p className="font-semibold mt-4">Feedback:</p>
                <p className="text-gray-800">{feedback}</p>
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
                        <Link to={'/dashboard'} className='mt-8 bg-blue-600 text-white rounded-2xl px-6 py-3 hover:bg-blue-700 transition hover:shadow-lg shadow-blue-900/50 hover:translate-y-[-2px] duration-200 ease-in-out cursor-pointer'>Done</Link>
                    
                </div>
            )}


        </div>
    );
}

export default Interview;
