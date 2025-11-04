import React from 'react'
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BASE_URL = import.meta.env.MODE === "development"
  ? "http://localhost:8000"   // your local backend
  : "https://final-techfluent.onrender.com";  // deployed backend

function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    college_name: '',
    year_of_joining: '',
    password: '',
    re_password: '',
  })

  const[isLoading, setIsLoading] = useState(false)
  const[success, setSuccess] = useState(false)
  const [error,setError] = useState('')
  const navigate = useNavigate()


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
      const response = await axios.post(`${BASE_URL}/api/register/`, payload,{
        withCredentials: true,
      })
      console.log("success",response.data)
      setSuccess("Registration successful")
      navigate('/login')
    }catch (error) {
      console.log("Error response:", error.response?.data);
      if (error.response && error.response.data) {
        Object.keys(error.response.data).forEach((key) => {
           const errorMessages = error.response.data[key];
           if(errorMessages && errorMessages.length > 0){
            setError(errorMessages[0])
           }
        })
        //alert("Error: " + JSON.stringify(err.response.data, null, 2));

      }
    }
    finally{
      setIsLoading(false)
    }
  }
  return (
    <div className="flex justify-center items-center min-h-screen px-4 py-8 bg-gray-100">
      <div className="w-full max-w-md md:max-w-xl lg:max-w-2xl bg-white border-2  border-black p-8 rounded-2xl shadow-xl">
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        {success && <div className="text-green-500 text-center mb-4">{success}</div>}
        <h1 className="text-3xl font-bold text-center mb-2">Sign-Up</h1>
        <p className="text-gray-500 text-center mb-6">Create an account to join your college leaderboard!</p>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex flex-col w-full">
              <label className="mb-1 font-medium text-gray-700">Username</label>
              <input required name='username' value={formData.username} onChange={handleChange} type="text" placeholder="Enter your username" className="mb-4 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="flex flex-col w-full">
              <label className="mb-1 font-medium text-gray-700">Email</label>
              <input required name='email' value={formData.email} onChange={handleChange} type="email" placeholder="Enter your email" className="mb-4 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div className="flex flex-col mb-4">
            <label className="mb-1 font-medium text-gray-700">College</label>
            <select name='college_name' value={formData.college_name} onChange={handleChange} className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select College</option>
              <option value="Anurag University">Anurag University</option>
              <option value="Chaitanya Bharathi Institute of Technology">Chaitanya Bharathi Institute of Technology</option>
              <option value="Gokaraju Rangaraju Institute of Technology">Gokaraju Rangaraju Institute of Technology</option>
              <option value="Keshav Memorial Institute of Technology">Keshav Memorial Institute of Technology</option>
              <option value="Muffakham Jah College of Engineering & Technology">Muffakham Jah College of Engineering & Technology</option>
              <option value="Vallurupalli Nageswara Rao Vignana Jyothi Institute of Engineering & Technology">Vallurupalli Nageswara Rao Vignana Jyothi Institute of Engineering & Technology</option>
              <option value="Vasavi College of Engineering">Vasavi College of Engineering</option>
            </select>
          </div>

          <div className="flex flex-col mb-4">
            <label className="mb-1 font-medium text-gray-700">Year of Joining</label>
            <select name='year_of_joining' value={formData.year_of_joining} onChange={handleChange} className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select Year</option>
              <option value="2021">2021</option>
              <option value="2022">2022</option>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
              <option value="2024">2025</option>
              <option value="2024">2026</option>
              <option value="2024">2027</option>
              <option value="2024">2028</option>
              <option value="2024">2029</option>
              <option value="2024">2030</option>
              <option value="2024">2031</option>
            </select>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex flex-col w-full">
              <label className="mb-1 font-medium text-gray-700">Password</label>
              <input required name='password' value={formData.password} onChange={handleChange} type="password" placeholder="Enter Password" className="mb-4 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="flex flex-col w-full">
              <label className="mb-1 font-medium text-gray-700">Re-Enter Password</label>
              <input required name='re_password' value={formData.re_password} onChange={handleChange} type="password" placeholder="Re-Enter Password" className="mb-4 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div className="flex justify-center mt-4">
            <button disabled={isLoading} type='submit' className='w-full md:w-auto bg-blue-500 text-white rounded-2xl px-6 py-3 hover:bg-blue-600 transition hover:shadow-lg shadow-blue-900/50 hover:translate-y-[-2px] duration-200 ease-in-out'>
              {isLoading ? "Registering..." : "Sign Up"}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:text-blue-700 transition">Login</a>
        </p>
      </div>
    </div>
  );
}


export default Signup
