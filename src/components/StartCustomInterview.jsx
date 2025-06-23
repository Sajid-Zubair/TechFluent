import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Bot, 
  Mic, 
  MicOff, 
  PhoneOff, 
  Volume2, 
  VolumeX,
  Clock,
  User,
  Sparkles,
  MessageSquare,
  ArrowLeft
} from 'lucide-react';

const StartCustomInterview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state?.formData;

  // Interview states
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [isAISpeaking, setIsAISpeaking] = useState(false);

  // Sample questions based on interview type
  const sampleQuestions = {
    technical: [
      "Tell me about yourself and your technical background.",
      "Explain the difference between var, let, and const in JavaScript.",
      "How would you optimize a slow-performing database query?",
      "Walk me through how you would design a simple chat application."
    ],
    hr: [
      "Tell me about yourself.",
      "Why are you interested in this position?",
      "Describe a challenging situation you faced at work and how you handled it.",
      "Where do you see yourself in 5 years?"
    ],
    system_design: [
      "Design a URL shortening service like bit.ly.",
      "How would you design a chat application for millions of users?",
      "Explain how you would design a file storage system.",
      "Design a notification system for a social media platform."
    ]
  };

  // Timer effect
  useEffect(() => {
    let interval;
    if (interviewStarted) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [interviewStarted]);

  // Auto-start interview with first question
  useEffect(() => {
    if (formData && !interviewStarted) {
      setTimeout(() => {
        setInterviewStarted(true);
        const questionType = formData.interviewType;
        const questions = sampleQuestions[questionType] || sampleQuestions.hr;
        setCurrentQuestion(questions[0]);
        setIsAISpeaking(true);
        
        // Simulate AI speaking duration
        setTimeout(() => setIsAISpeaking(false), 3000);
      }, 2000);
    }
  }, [formData, interviewStarted]);

  // Redirect if no form data
  useEffect(() => {
    if (!formData) {
      navigate('/custom-interview');
    }
  }, [formData, navigate]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndInterview = () => {
    if (window.confirm('Are you sure you want to end the interview?')) {
      navigate('/dashboard', { state: { interviewCompleted: true, duration: timeElapsed } });
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const toggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
  };

  if (!formData) {
    return null; // This will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header - Responsive */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Back Button - Mobile */}
            <button
              onClick={() => navigate('/custom-interview')}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <Bot className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">Mock Interview</h1>
              <p className="text-xs sm:text-sm text-gray-500 capitalize hidden sm:block">
                {formData.interviewType.replace('_', ' ')} • {formData.experienceLevel} Level
              </p>
            </div>
          </div>
          
          {/* Timer - Responsive */}
          <div className="flex items-center space-x-1 sm:space-x-2 bg-gray-100 px-2 sm:px-4 py-2 rounded-lg">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
            <span className="font-mono text-sm sm:text-lg font-semibold text-gray-900">
              {formatTime(timeElapsed)}
            </span>
            <span className="text-xs sm:text-sm text-gray-500 hidden sm:inline">
              / {formData.interviewDuration}min
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* AI Interviewer Panel - Responsive */}
          <div className="lg:col-span-2 order-1 lg:order-1">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6">
              {/* AI Avatar - Responsive */}
              <div className="text-center mb-6 sm:mb-8">
                <div className="relative inline-block">
                  <div className={`w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center mx-auto mb-3 sm:mb-4 transition-all duration-300 ${
                    isAISpeaking ? 'scale-110 shadow-lg' : ''
                  }`}>
                    <Bot className="h-10 w-10 sm:h-14 sm:w-14 lg:h-16 lg:w-16 text-white" />
                  </div>
                  {isAISpeaking && (
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                      <div className="bg-green-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        <span>Speaking...</span>
                      </div>
                    </div>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Sarah AI</h2>
                <p className="text-sm sm:text-base text-gray-600">Your AI Interview Coach</p>
              </div>

              {/* Current Question - Responsive */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Current Question</h3>
                    <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                      {currentQuestion || "Welcome! I'm preparing your first question..."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Interview Status - Responsive */}
              <div className="flex items-center justify-center space-x-4 sm:space-x-6">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${interviewStarted ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className="text-xs sm:text-sm font-medium text-gray-700">
                    {interviewStarted ? 'Interview Active' : 'Preparing...'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
                  <span className="text-xs sm:text-sm font-medium text-gray-700">AI Powered</span>
                </div>
              </div>
            </div>

            {/* Control Panel - Responsive */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-center space-x-4 sm:space-x-6">
                {/* Mic Control - Responsive */}
                <button
                  onClick={toggleRecording}
                  className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105 ${
                    isRecording 
                      ? 'bg-red-500 hover:bg-red-600 shadow-lg' 
                      : 'bg-green-500 hover:bg-green-600 shadow-md'
                  }`}
                  title={isRecording ? 'Turn off microphone' : 'Turn on microphone'}
                >
                  {isRecording ? (
                    <Mic className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white" />
                  ) : (
                    <MicOff className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white" />
                  )}
                </button>

                {/* Speaker Control - Responsive */}
                <button
                  onClick={toggleSpeaker}
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isSpeakerOn 
                      ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                      : 'bg-gray-300 hover:bg-gray-400 text-gray-600'
                  }`}
                  title={isSpeakerOn ? 'Mute speaker' : 'Unmute speaker'}
                >
                  {isSpeakerOn ? (
                    <Volume2 className="h-5 w-5 sm:h-6 sm:w-6" />
                  ) : (
                    <VolumeX className="h-5 w-5 sm:h-6 sm:w-6" />
                  )}
                </button>

                {/* End Interview - Responsive */}
                <button
                  onClick={handleEndInterview}
                  className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-lg"
                  title="End interview"
                >
                  <PhoneOff className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white" />
                </button>
              </div>

              <div className="mt-4 sm:mt-6 flex items-center justify-center space-x-4 sm:space-x-8 text-xs sm:text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-300'}`}></div>
                  <span>{isRecording ? 'Recording' : 'Muted'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${isSpeakerOn ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                  <span>{isSpeakerOn ? 'Audio On' : 'Audio Off'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interview Details Sidebar - Responsive */}
          <div className="space-y-4 sm:space-y-6 order-2 lg:order-2">
            {/* Session Info - Responsive */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Session Details</h3>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <User className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-900">Experience Level</p>
                    <p className="text-xs sm:text-sm text-gray-600 capitalize">{formData.experienceLevel}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-900">Interview Type</p>
                    <p className="text-xs sm:text-sm text-gray-600 capitalize">
                      {formData.interviewType.replace('_', ' ')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-900">Duration</p>
                    <p className="text-xs sm:text-sm text-gray-600">{formData.interviewDuration} minutes</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-900">Style</p>
                    <p className="text-xs sm:text-sm text-gray-600 capitalize">{formData.interviewStyle}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips - Responsive */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Interview Tips</h3>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-700">
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-1 flex-shrink-0">•</span>
                  <span>Speak clearly and at a moderate pace</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-1 flex-shrink-0">•</span>
                  <span>Take your time to think before answering</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-1 flex-shrink-0">•</span>
                  <span>Ask for clarification if needed</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-1 flex-shrink-0">•</span>
                  <span>Be specific with examples</span>
                </li>
              </ul>
            </div>

            {/* Progress - Responsive */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Progress</h3>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Time Elapsed</span>
                  <span className="font-medium">{formatTime(timeElapsed)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((timeElapsed / (parseInt(formData.interviewDuration) * 60)) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs sm:text-sm text-gray-600">
                  <span>Started</span>
                  <span>{formData.interviewDuration} min total</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StartCustomInterview;
