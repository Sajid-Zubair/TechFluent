import React from 'react'

function Login() {
  return (
    <div className="flex justify-center items-center h-screen">
    <div className="flex flex-col border-2 border-black max-w-2xl p-8 shadow-2xl rounded-2xl bg-white">
      <h1 className="text-3xl font-bold text-center mb-6">Login</h1>
      <p className="text-gray-500 text-center mb-6">Login to view your interview progress and leaderboard rank!</p>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex flex-col w-full">
          <label className="mb-1 font-medium text-grey-700">Username</label>
          <input type="text" placeholder="Enter your username" className="mb-4 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200" />
        </div>
      </div>


      


      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex flex-col w-full">
          <label className="mb-1 font-medium text-gray-700">Password</label>
          <input type="password" placeholder="Enter Password" className="mb-4 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200" />
        </div>
      </div>

      <button className='mt-2 bg-blue-500 text-white rounded-2xl px-6 py-3 hover:bg-blue-600 transition hover:shadow-lg shadow-blue-900/50 hover:translate-y-[-2px] duration-200 ease-in-out cursor-pointer'>Login</button>
      <p className="mt-4 text-center text-gray-600">
          Dont have an account?{" "}
          <a href="/signup" className="text-blue-500 transition-all duration-200 hover:text-blue-700">
            Signup
          </a>
      </p>
    </div>
  </div>
  )
}

export default Login
