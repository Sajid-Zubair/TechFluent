
import React, { useState, useEffect } from "react";
import Sidenav from "./Sidenav";
import { FaMedal, FaFire, FaStar, FaMicrophone, FaBars } from "react-icons/fa";
import RadarP from './RadarP';
import { useNavigate } from "react-router-dom";
import EditProfile from "./EditProfile";
import axios from "axios";
import ProgressChart from "./ProgressChart";

function Profile() {
  const [editP, setEditP] = useState(false);
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [ratings, setRatings] = useState(null);
  const [rankInfo, setRankInfo] = useState(0);
  const [collegeName, setCollegeName] = useState('');
  const [technicalCount, setTechnicalCount] = useState(0);
  const [behaviouralCount, setBehaviouralCount] = useState(0);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const initials = username ? username.charAt(0).toUpperCase() : "";
  const navigate = useNavigate();
  const [maxStreak, setMaxStreak] = useState(0);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (token) {
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            },
          };
          const response = await axios.get('http://localhost:8000/api/user/', config);
          setIsLoggedIn(true);
          setUsername(response.data.username);
          setCollegeName(response.data.college_name);
          setTechnicalCount(response.data.technical_count || 0);
          setBehaviouralCount(response.data.behavioural_count || 0);

          const attemptResponse = await axios.get('http://localhost:8000/api/latest_attempt/', config);
          setRatings(attemptResponse.data);

          const rankResponse = await axios.get('http://localhost:8000/api/user_rank/', config);
          setRankInfo(rankResponse.data);
          
          const streakResponse = await axios.get('http://localhost:8000/api/current_streak/', config);
          setMaxStreak(streakResponse.data.max_streak || 0);

        } else {
          setIsLoggedIn(false);
          setUsername("");
        }
      } catch (error) {
        console.error("API Error:", error.response?.data);
        setIsLoggedIn(false);
        setUsername("");
      }
    };
    checkLogin();
  }, []);

  function handlePrint() {
    window.print();
  }

  return (
    <div className="flex min-h-screen bg-gray-50 relative">
      
      {/* --- Mobile Toggle Button --- */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button onClick={() => setMobileNavOpen(!mobileNavOpen)} className="text-3xl text-blue-700 rounded-2xl">
          <FaBars />
        </button>
      </div>

      {/* --- Desktop Sidenav --- */}
      <div className="hidden md:block md:w-64">
        <Sidenav />
      </div>

      {/* --- Mobile Drawer --- */}
      {mobileNavOpen && (
        <div className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg z-40 p-4 overflow-auto">
          <Sidenav />
          <button
            onClick={() => setMobileNavOpen(false)}
            className="absolute top-2 right-2 text-2xl text-red-600 mt-4 ml-2"
            aria-label="Close navigation"
          >
            ❌
          </button>
        </div>
      )}

      {/* --- Main Content --- */}
      <main
        className={`
          flex-1 px-4 sm:px-6 md:px-8 py-6 transition-opacity duration-300
          w-full
          md:ml-64
          mr-22
          ${mobileNavOpen ? 'opacity-30 pointer-events-none' : ''}
          flex justify-center
        `}
      >
        <div className="max-w-screen-lg w-full space-y-10">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col md:flex-row items-center gap-6 justify-center md:justify-start text-center md:text-left w-full">
              <div className="w-20 h-20 rounded-full bg-gray-300 flex justify-center items-center text-gray-600 text-4xl mx-auto md:mx-0">
                {initials}
              </div>
              <div>
                <p className="text-xl text-gray-600">{username}</p>
                <h1 className="text-2xl font-bold">
                  {collegeName ? collegeName : "College Name Not Available"}
                </h1>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex items-center gap-2 whitespace-nowrap">
                <FaMedal size={28} className="text-yellow-500" />
                {rankInfo.rank ? (
                  <span className="text-xl font-bold">
                    Rank : {rankInfo.rank} / {rankInfo.total_users}
                  </span>
                ) : (
                  <span className="text-xl font-bold text-gray-500">Rank : Not Ranked Yet</span>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-center min-w-[300px]">
            <div className="p-4 rounded-lg bg-white shadow-md flex flex-col items-center">
              <span className="text-lg font-bold">Max Streak</span>
              <FaFire size={24} className="text-orange-500 my-2" />
              <span className="text-2xl font-bold">{maxStreak}</span>
            </div>
            <div className="p-4 rounded-lg bg-white shadow-md flex flex-col items-center">
              <span className="text-lg font-bold">Overall Rating</span>
              <FaStar size={24} className="text-yellow-500 my-2" />
              <span className="text-2xl font-bold">{ratings?.overall_rating || 'N/A'}</span>
            </div>
            <div className="p-4 rounded-lg bg-white shadow-md flex flex-col items-center">
              <span className="text-lg font-bold">Total Interviews</span>
              <FaMicrophone size={24} className="text-blue-500 my-2" />
              <span className="text-2xl font-bold">{technicalCount + behaviouralCount}</span>
            </div>
          </div>

          {/* Charts */}
          <ProgressChart />
          {ratings ? (
            <div style={{ minHeight: '350px' }}>
              {ratings ? <RadarP ratings={ratings} /> : <NoRatingsMessage />}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-600">
              <h2 className="text-xl font-bold">No Ratings Available</h2>
              <p>Please complete an interview to see your ratings.</p>
            </div>
          )}

          {/* Feedback */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-center">Interview Feedback</h1>
            <div className="p-4 bg-blue-100 rounded-lg">
              <h2 className="text-xl font-bold mb-2">Positives</h2>
              <p>Your speech was well-paced and easy to follow, showcasing good fluency throughout. The structure of your response showed clear organization. Great vocabulary usage and accuracy too.</p>
            </div>
            <div className="p-4 bg-blue-100 rounded-lg">
              <h2 className="text-xl font-bold mb-2">Areas for Improvement</h2>
              <p>Try to reduce filler words and incorporate more precise vocabulary. Also, strengthen your answers with concrete examples.</p>
            </div>
          </div>

          {/* Print Button */}
          <div className="flex justify-center">
            <button
              onClick={handlePrint}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              🖨️ Print
            </button>
          </div>
        </div>
      </main>

      {editP && <EditProfile setShowEditP={setEditP} />}
    </div>
  );
}

export default Profile;




