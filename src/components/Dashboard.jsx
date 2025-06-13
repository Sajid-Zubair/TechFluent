// import React, { use } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { useState, useEffect } from 'react'
// import Sidenav from './Sidenav'
// import Popup from './Popup'
// import ErrorPop from './ErrorPop'
// import axios from 'axios'



// function Dashboard() {
//     const navigate = useNavigate()
//     const [showPopup, setShowPopup] = useState(false);
//     const [isTechnicalSelected, setIsTechnicalSelected] = useState(false);
//     const [technicalSubject, setTechnicalSubject] = useState('');
//     const [interviewType, setInterviewType] = useState(null);
//     const [showDropdown, setShowDropdown] = useState(false);
//     const [showError, setshowError] = useState(false);
//     const [username, setUsername] = useState('');
//     const [isLoggedIn, setIsLoggedIn] = useState(false);
//     const [technicalCount, setTechnicalCount] = useState(0);
//     const [behaviouralCount, setBehaviouralCount] = useState(0);

//     useEffect(() => {
//         const checkLogin = async () => {
//             try {
//                 const token = localStorage.getItem('access_token');
//                 console.log("Retrieved token:", token); 
//                 if(token){
//                     const config = {
//                         headers: {
//                             Authorization: `Bearer ${token}`,
//                             "Content-Type": "application/json"
//                         },
//                     }
//                     const response = await axios.get('http://localhost:8000/api/user/', config);
//                     setIsLoggedIn(true);
//                     setUsername(response.data.username);

//                     setTechnicalCount(response.data.technical_count || 0);
//                     setBehaviouralCount(response.data.behavioural_count || 0);
//                 }
//                 else{
//                     console.log("No token found")
//                     setIsLoggedIn(false);
//                     setUsername("")
//                 }
//             } catch (error) {
//                 console.error("API Error:", error.response?.data);  // 🚨 Enhanced logging
//                 setIsLoggedIn(false);
//                 setUsername("");
//             }
//         };
//         checkLogin();
    
//     }, [])

//     const handleLogout = async () => {
//         try {
//           const refreshToken = localStorage.getItem("refresh_token");
//           console.log("Refresh token:", refreshToken);  
//           if (!refreshToken || refreshToken === "undefined" || refreshToken === "null") {
//             console.log("Invalid refresh token detected");
//             return; // Skip the API call if token is invalid
//           }
//           if (refreshToken) {
//             const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]')?.value;
//             await axios.post(
//                 'http://localhost:8000/api/logout/',
//                 { refresh: refreshToken }, // Try explicitly stringifying
//                 { 
//                   headers: { 
//                     "Content-Type": "application/json",
//                     "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
//                     "X-CSRFToken": csrfToken,
//                   } 
//                 }
//               );
//           }
//         } catch (error) {
//           console.error("Failed to logout:", error.response?.data || error.message);
//         } finally {
//           // Always run this part, whether logout API success or fail
//           localStorage.removeItem("access_token");
//           localStorage.removeItem("refresh_token");
//           setIsLoggedIn(false);
//           setUsername("");
//           console.log("Log out successful!");
//           navigate('/');
//         }
//       };

    

    
//     const handleStart = () => {
//         if(!interviewType) {
//             // alert('Please select an interview type first!');
//             setshowError(true)
//             return;
//         }
//         if (interviewType === 'Technical' && !technicalSubject) {
//             alert('Please select a technical subject first!');
//             return;
//         }
//         navigate('/interview', {
//             state: { 
//                 type: interviewType,
//                 subject: interviewType === 'Technical' ? technicalSubject : undefined  // Only pass subject if it's technical
//             }
//         });
//     };
//     const handleOutsideClick = (e) => {
//         if(!e.target.closest('.button-container') && !e.target.closest('.dropdown-menu')  && !e.target.closest('.start-btn')) {
//             setShowDropdown(false);
//             setInterviewType(null);
//             setShowPopup(false)
//         }
//     }
//     const handleTech = () => {
//         setShowPopup(true)
//         setInterviewType('Technical'); 
//         setIsTechnicalSelected(!isTechnicalSelected)
//     }
//     const onclose = () =>{
//         setShowPopup(false)
//     }
//     const handleDoneClick = (selectedInterviewType) => {
//         setShowPopup(false);
//         setTechnicalSubject(selectedInterviewType)
//         setIsTechnicalSelected(true)
//     };

//   return (
//     <div onClick={handleOutsideClick}>
//         <Sidenav/>

//         <div className='ml-64 p-6'>
//             <div className='flex justify-between items-center'>
//                 <h1 className='text-3xl font-bold p-4'>Welcome {username}!</h1>
//                 <button onClick={handleLogout} className='mt-2 bg-blue-600 text-white rounded-2xl px-6 py-3 hover:bg-blue-700 transition hover:shadow-lg shadow-blue-900/50 hover:translate-y-[-2px] duration-200 ease-in-out cursor-pointer'>Logout</button>
//             </div>


            
//             <div className='mt-10'>
//                 <div className='mt-4 p-4 flex flex-row md:flex-row justify-between items-center bg-gray-100 rounded-lg'>
//                     <h2 className='text-lg font-semibold'>Current Streak : </h2>
//                     <span className='text-3xl font-bold text-blue-600'>3 Days !</span>
//                 </div>
//                 <div className='mt-4 p-4 flex flex-col md:flex-row justify-between items-center bg-gray-100 rounded-lg'>
//                     <div className='flex flex-row md:flex-row justify-between items-center gap-6'>
//                         <h2 className='text-lg font-semibold'>Number of Technical Interviews Completed : </h2>
//                         <span className='text-3xl font-bold text-blue-600'>{technicalCount}</span>
//                     </div>
//                     <hr />
//                     <div className='flex flex-row md:flex-row justify-between items-center gap-6'>
//                         <h2 className='text-lg font-semibold'>Number of Behavioural Interviews Completed : </h2>
//                         <span className='text-3xl font-bold text-blue-600'>{behaviouralCount}</span>
//                     </div>
//                 </div>
//             </div>

//             <div className='mt-10 flex flex-row justify-between p-4 items-center'>

//                 <h2 className='text-3xl font-bold'>Choose Interview Type :</h2>


//                 <div className='flex flex-row items-center gap-6'>
//                     <div className='button-container flex flex-row gap-4'>
//                         <button onClick={handleTech} 
//                         className={`py-4 px-2 bg-blue-600 rounded-2xl text-white  cursor-pointer ${interviewType === 'Technical' ? 'bg-green-700' : ''}`}
//                         >Technical Interview</button>
//                         <button onClick={() => { 
//                             setInterviewType('Behavioural') 
//                             setTechnicalSubject('');
//                             setIsTechnicalSelected(false);
//                             } } className={`py-4 px-2 bg-blue-600 rounded-2xl text-white  cursor-pointer ${interviewType === 'Behavioural' ? 'bg-green-700' : ''}`}>Behavioural Interview</button>
//                     </div>
                        
//                 </div> 

//             </div>


//             <div className='mt-20 flex justify-center'>
//                 <button onClick={handleStart} className='mt-2 bg-blue-600 text-white rounded-2xl px-6 py-3 hover:bg-blue-700 transition hover:shadow-lg shadow-blue-900/50 hover:translate-y-[-2px] duration-200 ease-in-out cursor-pointer'>Start Interview</button>
//             </div>


//             {showPopup && <Popup setShowPopup={setShowPopup} onclose={onclose} handleDoneClick={handleDoneClick}/>}
                            
//             {showError && <ErrorPop />}
//         </div>

//     </div>
//   )
// }

// export default Dashboard



import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidenav from './Sidenav'
import Popup from './Popup'
import ErrorPop from './ErrorPop'
import axios from 'axios'
import { FaBars } from 'react-icons/fa'

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

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const token = localStorage.getItem('access_token')
        if (token) {
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            },
          }
          const response = await axios.get('http://localhost:8000/api/user/', config)
          setIsLoggedIn(true)
          setUsername(response.data.username)
          setTechnicalCount(response.data.technical_count || 0)
          setBehaviouralCount(response.data.behavioural_count || 0)
        } else {
          setIsLoggedIn(false)
          setUsername("")
        }
      } catch (error) {
        console.error("API Error:", error.response?.data)
        setIsLoggedIn(false)
        setUsername("")
      }
    }
    checkLogin()
  }, [])

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token")
      if (refreshToken && refreshToken !== "undefined" && refreshToken !== "null") {
        const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]')?.value
        await axios.post('http://localhost:8000/api/logout/', { refresh: refreshToken }, {
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
                className='mt-4 sm:mt-0 bg-blue-600 text-white rounded-2xl px-6 py-3 hover:bg-blue-700 transition shadow-lg shadow-blue-900/50 hover:translate-y-[-2px] duration-200 ease-in-out'
            >
                Logout
            </button>
            </div>

          <div className='space-y-6'>
            <div className='p-4 bg-gray-100 rounded-lg flex justify-between items-center'>
              <h2 className='text-lg font-semibold'>Current Streak:</h2>
              <span className='text-3xl font-bold text-blue-600'>3 Days!</span>
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
                className='bg-blue-600 text-white rounded-2xl px-6 py-3 hover:bg-blue-700 transition shadow-lg shadow-blue-900/50 hover:translate-y-[-2px] duration-200 ease-in-out mt-4'
              >
                Start Interview
              </button>
            </div>
          </div>

          {showPopup && <Popup setShowPopup={setShowPopup} onclose={onclose} handleDoneClick={handleDoneClick} />}
          {showError && <ErrorPop />}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
