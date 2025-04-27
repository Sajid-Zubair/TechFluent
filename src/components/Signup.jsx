import React from 'react'
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
      const response = await axios.post('http://localhost:8000/api/register/', payload)
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
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col border-2 border-black max-w-2xl p-8 shadow-2xl rounded-2xl bg-white">
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}
      {success && <div className="text-green-500 text-center mb-4">{success}</div>}
        <h1 className="text-3xl font-bold text-center mb-6">Sign-Up</h1>
        <p className="text-gray-500 text-center mb-6">Create an account to join your college leaderboard!</p>

        <form onSubmit={handleSubmit} action="">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex flex-col w-full">
              <label className="mb-1 font-medium text-grey-700">Username</label>
              <input name='username' value={formData.username} onChange={handleChange} type="text" placeholder="Enter your username" className="mb-4 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200" />
            </div>

            <div className="flex flex-col w-full">
              <label className="mb-1 font-medium text-gray-700">Email</label>
              <input name='email' value={formData.email} onChange={handleChange} type="email" placeholder="Enter your email" className="mb-4 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200" />
            </div>
          </div>

          <label className="mb-1 font-medium text-gray-700">College</label>
          <input name='college_name' value={formData.college_name} onChange={handleChange} type="text" placeholder="Enter college name" className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200" />

          <label className="block mb-1 font-medium">Year of Joining</label>
          <select name='year_of_joining' value={formData.year_of_joining} onChange={handleChange} id='' className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200">
            <option value="">Select year</option>
            <option value="2021">2021</option>
            <option value="2022">2022</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
          </select>


          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex flex-col w-full">
              <label className="mb-1 font-medium text-gray-700">Password</label>
              <input name='password' value={formData.password} onChange={handleChange} type="password" placeholder="Enter Password" className="mb-4 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200" />
            </div>

            <div className="flex flex-col w-full">
              <label className="mb-1 font-medium text-gray-700">Re-Enter Password</label>
              <input name='re_password' value={formData.re_password} onChange={handleChange} type="password" placeholder="Re-Enter your Password" className="mb-4 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200" />
            </div>
          </div>

          <button onClick={handleSubmit} disabled={isLoading} type='submit' className='mt-2 bg-blue-500 text-white rounded-2xl px-6 py-3 hover:bg-blue-600 transition hover:shadow-lg shadow-blue-900/50 hover:translate-y-[-2px] duration-200 ease-in-out cursor-pointer'>Sign Up</button>

        </form>
        <p className="mt-4 text-center text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500 transition-all duration-200 hover:text-blue-700">
              Login
            </a>
        </p>
      </div>
    </div>
  )
}


export default Signup
