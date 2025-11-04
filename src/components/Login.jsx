import React from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import {useState} from 'react'

const BASE_URL = import.meta.env.MODE === "development"
  ? "http://localhost:8000"   // your local backend
  : "https://final-techfluent.onrender.com";  // deployed backend


function Login() {
  const navigate = useNavigate()


  const[formData, setFormData] = useState({
    username: '',
    password: '',
  })

    const[isLoading, setIsLoading] = useState(false)
    const[success, setSuccess] = useState(false)
    const [error,setError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })

  }


  const handleSubmit = async (e) => {
    e.preventDefault()
    if(isLoading){
      return 
    }
    setIsLoading(true)

    try{
      const payload = {
        ...formData,
        year_of_joining: parseInt(formData.year_of_joining)
      };
      const response = await axios.post(`${BASE_URL}/api/login/`, payload,{
        withCredentials: true,
      })
      console.log("success",response.data)
      setSuccess("Login successful")
      localStorage.setItem('access_token',response.data.access_token)
      localStorage.setItem('refresh_token',response.data.refresh_token)
      navigate('/dashboard')
    }catch (error) {
      console.log("Full error:", error.response?.data);
      if(error.response && error.response.data){
        setError(error.response.data.message)
        //alert("Error: " + JSON.stringify(err.response.data, null, 2));
      }
  }
    finally{
      setIsLoading(false)
    }
}

  return (
    <div className="flex justify-center items-center h-screen">
    <div className="flex flex-col border-2 border-black max-w-2xl p-8 shadow-2xl rounded-2xl bg-white sm:p-12 m-4">
      <form onSubmit={handleSubmit}>
      {error && <p className='text-red-600 text-center mb-4 font-semibold'>{error}</p>}
      <h1 className="text-3xl font-bold text-center mb-6">Login</h1>
      <p className="text-gray-500 text-center mb-6">Login to view your interview progress and leaderboard rank!</p>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex flex-col w-full">
          <label className="mb-1 font-medium text-grey-700">Username</label>
          <input name='username' value={formData.username} onChange={handleChange} type="text" placeholder="Enter your username" className="mb-4 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200" />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex flex-col w-full">
          <label className="mb-1 font-medium text-gray-700">Password</label>
          <input name='password' value={formData.password} onChange={handleChange} type="password" placeholder="Enter Password" className="mb-4 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200" />
        </div>
      </div>

      <div className='flex justify-center items-center'>
        <button type="submit" className='mt-2 bg-blue-500 text-white rounded-2xl px-6 py-3 hover:bg-blue-600 transition hover:shadow-lg shadow-blue-900/50 hover:translate-y-[-2px] duration-200 ease-in-out cursor-pointer'>Login</button>
      </div>
      <p className="mt-4 text-center text-gray-600">
          Dont have an account?{" "}
          <a href="/signup" className="text-blue-500 transition-all duration-200 hover:text-blue-700">
            Signup
          </a>
      </p>
      </form>
    </div>
  </div>
  )
}

export default Login
