import React, { useState } from "react";
import Sidenav from "./Sidenav";
import { FaUser, FaMedal, FaFire, FaStar, FaMicrophone } from "react-icons/fa";
import RadarP from './RadarP'
import { useNavigate } from "react-router-dom";
import EditProfile from "./EditProfile";
import axios from "axios";
import { useEffect } from "react";
import { Radar } from "react-chartjs-2";
import ProgressChart from "./ProgressChart";


function Profile() {
  const [editP, setEditP] = useState(false);
  const navigate = useNavigate();
  // const username = "Zubair420";
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const initials = username ? username.charAt(0).toUpperCase() : "";
  const [ratings, setRatings] = useState(null)
  const [rankInfo, setRankInfo] = useState(0);
  const [collegeName, setCollegeName] = useState('');
  const [technicalCount, setTechnicalCount] = useState(0);
  const [behaviouralCount, setBehaviouralCount] = useState(0);
    useEffect(() => {
        const checkLogin = async () => {
            try {
                const token = localStorage.getItem('access_token');
                console.log("Retrieved token:", token); 
                if(token){
                    const config = {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        },
                    }
                    const response = await axios.get('http://localhost:8000/api/user/', config);
                    setIsLoggedIn(true);
                    setUsername(response.data.username);
                    setCollegeName(response.data.college_name);
                    setTechnicalCount(response.data.technical_count || 0);
                    setBehaviouralCount(response.data.behavioural_count || 0);
                    console.log("Fetched college name:", response.data.college_name);  // 🚨 Enhanced logging
                    console.log("Fetched username:", response.data.username);  // 🚨 Enhanced logging
                    const attemptResponse = await axios.get('http://localhost:8000/api/latest_attempt/', config);
                    setRatings({
                      fluency: attemptResponse.data.fluency,
                      content_structure: attemptResponse.data.content_structure,
                      accuracy: attemptResponse.data.accuracy,
                      grammar: attemptResponse.data.grammar,
                      vocabulary: attemptResponse.data.vocabulary,
                      coherence: attemptResponse.data.coherence,
                      overall_rating: attemptResponse.data.overall_rating
                    });

                    const rankResponse = await axios.get('http://localhost:8000/api/user_rank/', config);
                    setRankInfo(rankResponse.data);
                }
                else{
                    console.log("No token found")
                    setIsLoggedIn(false);
                    setUsername("")
                }
            } catch (error) {
                console.error("API Error:", error.response?.data);  // 🚨 Enhanced logging
                setIsLoggedIn(false);
                setUsername("");
            }
        };
        checkLogin();
    
    }, [])

  function handlePrint(){
    window.print();
  }
  function handleEdit() {
    setEditP(true);
  }
  return (
    <div>
      <Sidenav />

      <div className="ml-64 flex justify-center items-center p-4">
        <div className="flex flex-row justify-center items-center p-4 gap-16">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-gray-300 flex justify-center items-center text-gray-600 text-4xl">
              {initials}
            </div>
            <p className="text-xl text-gray-600 mt-2">{username}</p>
          </div>
          <div className="ml-4 flex flex-col mb-4">
            <h1 className="text-2xl font-bold">
              {collegeName ? collegeName : "College Name Not Available"}
            </h1>
            <div className="flex flex-row gap-4 mt-4 items-center">
              <FaMedal size={28} className="text-yellow-500" />
              {/* <h3 className="text-2xl font-bold">Rank : {rankInfo.rank || rankInfo.total_users} / {rankInfo.total_users}</h3> */}
              { rankInfo.rank && (
                <span className="text-2xl font-bold">Rank : {rankInfo.rank} / {rankInfo.total_users}</span>
              )}
              { !rankInfo.rank && (
                <span className="text-2xl font-bold text-gray-500">Rank : Not Ranked Yet</span>
              )}
            </div>
          </div>

          <div className="flex flex-row items-center">
            <button onClick={handleEdit} className="px-6 py-3 bg-blue-500 text-white text-sm whitespace-nowrap rounded-lg shadow-lg hover:bg-blue-600 transition-all cursor-pointer">
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      <hr className="border-t border-gray-300 ml-64" />
      <div className="ml-64 flex flex-row justify-between items-center p-4">
        <div className=" p-4 rounded-lg flex flex-row items-center">
          <div className="text-lg font-bold">Max Streak : 7</div>
          <FaFire size={24} className="ml-4 text-orange-500" />
        </div>
        <div className=" p-4 rounded-lg flex flex-row items-center">
          <div className="text-lg font-bold">Rating : {ratings && ratings.overall_rating}</div>
          <FaStar size={24} style={{ color: "FFD700" }} className="ml-4" />
        </div>
        <div className=" p-4 rounded-lg flex flex-row items-center">
          <div className="text-lg font-bold">
            Total Interviews Completed : {technicalCount + behaviouralCount}
          </div>
          <FaMicrophone
            style={{ color: "3498DB" }}
            size={24}
            className="ml-4"
          />
        </div>
      </div>
      <hr className="border-t border-gray-300 ml-64" />
      
      <ProgressChart className="mb-8" />

      <hr className="border-t border-gray-300 ml-64 mt-12" />

      {/* <RadarP/> */}
      { ratings && <RadarP ratings={ratings} /> }

      {!ratings && (
        <div className="ml-64 flex flex-col justify-center items-center p-4">
          <h1 className="text-2xl font-bold mb-4">No Ratings Available</h1>
          <p className="text-lg text-gray-600">Please complete an interview to see your ratings.</p>
        </div>
      )}

      <hr className="border-t border-gray-300 ml-64" />
      


      <div className="ml-64 p-4">
        <div className="p-4 flex flex-col justify-center items-center gap-8">
          <h1 className="text-3xl font-bold mb-8">Interview Feedback</h1>
          <div className="p-4 bg-blue-200 rounded-lg">
            <h2 className="text-2xl font-bold text-black-500 mb-6">Positives</h2>
            <p className="text-lg">Your speech was well-paced and easy to follow, showcasing good fluency throughout. The transitions between ideas felt natural, and you maintained a steady tone, which helped keep the listener engaged. The structure of your response showed clear organization, with a logical flow from introduction to conclusion. Your use of vocabulary was generally strong, with some effective word choices that conveyed your message precisely. Additionally, your response showed a solid understanding of the topic, indicating a good level of accuracy in the content you shared.
            </p>
          </div>
          <div className="p-4 bg-blue-200 rounded-lg">
            <h2 className="text-2xl font-bold text-black-500 mb-6">Areas for Improvement</h2>
            <p className="text-lg">While your fluency was good overall, there were a few instances where filler words such as "uh" or "like" were slightly overused, which could be minimized with more practice. In terms of structure, adding brief summaries or bullet-like cues within your response could make your arguments more impactful. Regarding vocabulary, though most word choices were appropriate, incorporating more domain-specific or expressive terms could elevate your answer. Finally, while your content was mostly accurate, there were a couple of points that lacked clarity or depth, so ensuring each statement is backed by reasoning or examples can further enhance your response.             
            </p>
          </div>
        </div>
      </div>

      {editP && <EditProfile setShowEditP={setEditP} />}

      <div />

      <div className="ml-64 p-4 flex flex-col justify-between items-center">
        <button onClick={handlePrint} className="px-6 py-3 bg-blue-500 text-white text-sm whitespace-nowrap rounded-lg shadow-lg hover:bg-blue-600 transition-all cursor-pointer">🖨️ Print</button>
      </div>
    </div>
  );
}

export default Profile;
