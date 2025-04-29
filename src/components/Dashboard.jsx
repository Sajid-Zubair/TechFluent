import React, { use } from 'react'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Sidenav from './Sidenav'
import Popup from './Popup'
import ErrorPop from './ErrorPop'
import axios from 'axios'



function Dashboard() {
    const navigate = useNavigate()
    const [showPopup, setShowPopup] = useState(false);
    const [isTechnicalSelected, setIsTechnicalSelected] = useState(false);
    const [technicalSubject, setTechnicalSubject] = useState('');
    const [interviewType, setInterviewType] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showError, setshowError] = useState(false);
    const [username, setUsername] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

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

    const handleLogout = async () => {
        try {
          const refreshToken = localStorage.getItem("refresh_token");
          console.log("Refresh token:", refreshToken);  
          if (!refreshToken || refreshToken === "undefined" || refreshToken === "null") {
            console.log("Invalid refresh token detected");
            return; // Skip the API call if token is invalid
          }
          if (refreshToken) {
            const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]')?.value;
            await axios.post(
                'http://localhost:8000/api/logout/',
                { refresh: refreshToken }, // Try explicitly stringifying
                { 
                  headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
                    "X-CSRFToken": csrfToken,
                  } 
                }
              );
          }
        } catch (error) {
          console.error("Failed to logout:", error.response?.data || error.message);
        } finally {
          // Always run this part, whether logout API success or fail
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          setIsLoggedIn(false);
          setUsername("");
          console.log("Log out successful!");
          navigate('/');
        }
      };

    

    
    const handleStart = () => {
        if(!interviewType) {
            // alert('Please select an interview type first!');
            setshowError(true)
            return;
        }
        if (interviewType === 'Technical' && !technicalSubject) {
            alert('Please select a technical subject first!');
            return;
        }
        navigate('/interview', {
            state: { 
                type: interviewType,
                subject: interviewType === 'Technical' ? technicalSubject : undefined  // Only pass subject if it's technical
            }
        });
    };
    const handleOutsideClick = (e) => {
        if(!e.target.closest('.button-container') && !e.target.closest('.dropdown-menu')  && !e.target.closest('.start-btn')) {
            setShowDropdown(false);
            setInterviewType(null);
            setShowPopup(false)
        }
    }
    const handleTech = () => {
        setShowPopup(true)
        setInterviewType('Technical'); 
        setIsTechnicalSelected(!isTechnicalSelected)
    }
    const onclose = () =>{
        setShowPopup(false)
    }
    const handleDoneClick = (selectedInterviewType) => {
        setShowPopup(false);
        setTechnicalSubject(selectedInterviewType)
        setIsTechnicalSelected(true)
    };

  return (
    <div onClick={handleOutsideClick}>
        <Sidenav/>

        <div className='ml-64 p-6'>
            <div className='flex justify-between items-center'>
                <h1 className='text-3xl font-bold p-4'>Welcome {username}!</h1>
                <button onClick={handleLogout} className='mt-2 bg-blue-600 text-white rounded-2xl px-6 py-3 hover:bg-blue-700 transition hover:shadow-lg shadow-blue-900/50 hover:translate-y-[-2px] duration-200 ease-in-out cursor-pointer'>Logout</button>
            </div>


            
            <div className='mt-10'>
                <div className='mt-4 p-4 flex flex-row md:flex-row justify-between items-center bg-gray-100 rounded-lg'>
                    <h2 className='text-lg font-semibold'>Current Streak : </h2>
                    <span className='text-3xl font-bold text-blue-600'>3 Days !</span>
                </div>
                <div className='mt-4 p-4 flex flex-col md:flex-row justify-between items-center bg-gray-100 rounded-lg'>
                    <div className='flex flex-row md:flex-row justify-between items-center gap-6'>
                        <h2 className='text-lg font-semibold'>Number of Technical Interviews Completed : </h2>
                        <span className='text-3xl font-bold text-blue-600'>5</span>
                    </div>
                    <hr />
                    <div className='flex flex-row md:flex-row justify-between items-center gap-6'>
                        <h2 className='text-lg font-semibold'>Number of Behavioural Interviews Completed : </h2>
                        <span className='text-3xl font-bold text-blue-600'>2</span>
                    </div>
                </div>
            </div>

            <div className='mt-10 flex flex-row justify-between p-4 items-center'>

                <h2 className='text-3xl font-bold'>Choose Interview Type :</h2>


                <div className='flex flex-row items-center gap-6'>
                    <div className='button-container flex flex-row gap-4'>
                        <button onClick={handleTech} 
                        className={`py-4 px-2 bg-blue-600 rounded-2xl text-white  cursor-pointer ${interviewType === 'Technical' ? 'bg-green-700' : ''}`}
                        >Technical Interview</button>
                        <button onClick={() => { 
                            setInterviewType('Behavioural') 
                            setTechnicalSubject('');
                            setIsTechnicalSelected(false);
                            } } className={`py-4 px-2 bg-blue-600 rounded-2xl text-white  cursor-pointer ${interviewType === 'Behavioural' ? 'bg-green-700' : ''}`}>Behavioural Interview</button>
                    </div>
                        
                </div> 

            </div>


            <div className='mt-20 flex justify-center'>
                <button onClick={handleStart} className='mt-2 bg-blue-600 text-white rounded-2xl px-6 py-3 hover:bg-blue-700 transition hover:shadow-lg shadow-blue-900/50 hover:translate-y-[-2px] duration-200 ease-in-out cursor-pointer'>Start Interview</button>
            </div>


            {showPopup && <Popup setShowPopup={setShowPopup} onclose={onclose} handleDoneClick={handleDoneClick}/>}
                            
            {showError && <ErrorPop />}
        </div>

    </div>
  )
}

export default Dashboard
