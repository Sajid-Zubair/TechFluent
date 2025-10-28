import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidenav from './Sidenav'
import Popup from './Popup'
import ErrorPop from './ErrorPop'
import axios from 'axios'
import { FaBars } from 'react-icons/fa'

const BASE_URL = import.meta.env.MODE === "development"
  ? "http://localhost:8000"
  : "https://techfluent.onrender.com";

function Dashboard() {
  const navigate = useNavigate()
  const [showPopup, setShowPopup] = useState(false)
  const [isTechnicalSelected, setIsTechnicalSelected] = useState(false)
  const [technicalSubject, setTechnicalSubject] = useState('')
  const [interviewType, setInterviewType] = useState(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const [showError, setshowError] = useState(false)
  const [username, setUsername] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [technicalCount, setTechnicalCount] = useState(0)
  const [behaviouralCount, setBehaviouralCount] = useState(0)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [currentStreak, setCurrentStreak] = useState(0)

  useEffect(() => {
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
      navigate('/'); // Not logged in, redirect to home/login
      return;
    }
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const userRes = await axios.get(`${BASE_URL}/api/user/`, config);
      console.log('User API response:', userRes.data);
      setIsLoggedIn(true);
      setUsername(userRes.data.username);
      setTechnicalCount(userRes.data.technical_count || 0);
      setBehaviouralCount(userRes.data.behavioural_count || 0);

      const streakRes = await axios.get(`${BASE_URL}/api/current_streak/`, config);
      console.log('Streak API response:', streakRes.data);
      setCurrentStreak(streakRes.data.current_streak || 0);

    } catch (err) {
      console.error("Error fetching data:", err.response?.data || err.message);
      setIsLoggedIn(false);
      setUsername("");
    }
  };

  fetchUserData();
}, [navigate]);

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token")
      if (refreshToken && refreshToken !== "undefined" && refreshToken !== "null") {
        const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]')?.value
        await axios.post(`${BASE_URL}/api/logout/`, { refresh: refreshToken }, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
            "X-CSRFToken": csrfToken,
          }
        })
      }
    } catch (error) {
      console.error("Failed to logout:", error.response?.data || error.message)
    } finally {
      localStorage.removeItem("access_token")
      localStorage.removeItem("refresh_token")
      setIsLoggedIn(false)
      setUsername("")
      navigate('/')
    }
  }

  const handleStart = () => {
    if (!interviewType) {
      setshowError(true)
      return
    }
    if (interviewType === 'Technical' && !technicalSubject) {
      alert('Please select a technical subject first!')
      return
    }
    navigate('/interview', {
      state: {
        type: interviewType,
        subject: interviewType === 'Technical' ? technicalSubject : undefined
      }
    })
  }

  const handleOutsideClick = (e) => {
    if (!e.target.closest('.button-container') &&
        !e.target.closest('.dropdown-menu') &&
        !e.target.closest('.start-btn')) {
      setShowDropdown(false)
      setInterviewType(null)
      setShowPopup(false)
    }
  }

  const handleTech = () => {
    setShowPopup(true)
    setInterviewType('Technical')
    setIsTechnicalSelected(!isTechnicalSelected)
  }

  const onclose = () => setShowPopup(false)

  const handleDoneClick = (selectedInterviewType) => {
    setShowPopup(false)
    setTechnicalSubject(selectedInterviewType)
    setIsTechnicalSelected(true)
  }

  return (
    <div className="flex min-h-screen bg-gray-50" onClick={handleOutsideClick}>
      {/* --- Desktop Sidenav --- */}
      <div className="hidden md:block md:w-64">
        <Sidenav />
      </div>

      {/* --- Mobile Toggle Button --- */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button onClick={() => setMobileNavOpen(!mobileNavOpen)} className="text-3xl text-blue-700">
          <FaBars />
        </button>
      </div>

      {/* --- Mobile Drawer --- */}
      {mobileNavOpen && (
        <div className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg z-40 p-4">
          <Sidenav />
          <button
            name="close"
            onClick={() => setMobileNavOpen(false)}
            className="absolute top-2 right-2 text-2xl text-red-600 mt-4 ml-6"
          >
            ❌
          </button>
        </div>
      )}

      {/* --- Main Content --- */}
      <div className={`flex-1 transition-opacity duration-300 px-4 sm:px-6 md:px-8 py-6 ${mobileNavOpen ? 'opacity-30 pointer-events-none' : ''}`}>
        <div className="max-w-5xl mx-auto">
          <div className='flex flex-col sm:flex-row justify-between items-center mb-6 mt-12 sm:mt-0'>
            <h1 className='text-2xl sm:text-3xl font-bold text-center sm:text-left'>Welcome {username}!</h1>
            <button
                onClick={handleLogout}
                className='mt-4 sm:mt-0 bg-red-500 text-white rounded-2xl px-6 py-3 hover:bg-red-700 transition shadow-lg shadow-blue-900/50 hover:translate-y-[-2px] duration-200 ease-in-out'
            >
                Logout
            </button>
            </div>

          <div className='space-y-6'>
            <div className='p-4 bg-gray-100 rounded-lg flex justify-between items-center'>
              <h2 className='text-lg font-semibold'>Current Streak:</h2>
              <span className='text-3xl font-bold text-blue-600'>{currentStreak} {currentStreak === 1 ? 'Day' : 'Days'}!</span>
            </div>

            <div className='p-4 bg-gray-100 rounded-lg space-y-4 md:space-y-0 md:flex md:justify-between md:items-center'>
              <div className='flex justify-between items-center gap-4'>
                <h2 className='text-lg font-semibold'>Technical Interviews Completed:</h2>
                <span className='text-3xl font-bold text-blue-600'>{technicalCount}</span>
              </div>
              <div className='flex justify-between items-center gap-4'>
                <h2 className='text-lg font-semibold'>Behavioural Interviews Completed:</h2>
                <span className='text-3xl font-bold text-blue-600'>{behaviouralCount}</span>
              </div>
            </div>

            <div className='flex flex-col sm:flex-row justify-between items-center gap-6'>
              <h2 className='text-3xl sm:text-2xl font-bold'>Choose Interview Type:</h2>
              <div className='button-container flex flex-col sm:flex-row gap-4'>
                <button
                  onClick={handleTech}
                  className={`py-3 px-3 sm:py-4 sm:px-4 bg-blue-600 rounded-2xl text-white text-sm sm:text-base ${interviewType === 'Technical' ? 'bg-green-700' : ''}`}
                >
                  Technical Interview
                </button>
                <button
                  onClick={() => {
                    setInterviewType('Behavioural')
                    setTechnicalSubject('')
                    setIsTechnicalSelected(false)
                  }}
                  className={`py-3 px-3 sm:py-4 sm:px-4 bg-blue-600 rounded-2xl text-white text-sm sm:text-base ${interviewType === 'Behavioural' ? 'bg-green-700' : ''}`}
                >
                  Behavioural Interview
                </button>
              </div>
            </div>

            <div className='flex justify-center'>
              <button
                onClick={handleStart}
                className='bg-emerald-600 text-white rounded-2xl px-6 py-3 hover:bg-green-700 transition shadow-lg shadow-blue-900/50 hover:translate-y-[-2px] duration-200 ease-in-out mt-4'
              >
                Start Interview
              </button>
            </div>
          </div>

          {showPopup && <Popup setShowPopup={setShowPopup} onclose={onclose} handleDoneClick={handleDoneClick} />}
          {showError && <ErrorPop setshowError={setshowError} />}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
