import React from 'react'

function Login() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col border-2 border-black max-w-2xl p-8 shadow-2xl rounded-2xl bg-white">
        <h1 className="text-3xl font-bold text-center mb-6">Sign-Up</h1>
        <p className="text-gray-500 text-center mb-6">Create an account to join your college leaderboard!</p>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-col w-full">
            <label className="mb-1 font-medium text-grey-700">Username</label>
            <input type="text" placeholder="Enter your username" className="mb-4 p-3 border-2 border-grey-100 rounded-xl" />
          </div>

          <div className="flex flex-col w-full">
            <label className="mb-1 font-medium text-gray-700">Email</label>
            <input type="email" placeholder="Enter your email" className="mb-4 p-3 border-2 border-grey-100 rounded-xl" />
          </div>
        </div>

        <label className="mb-1 font-medium text-gray-700">College</label>
        <input type="text" placeholder="Enter college name" className="mb-4 p-3 border-2 border-grey-100 rounded-xl" />

        <label className="block mb-1 font-medium">Year of Joining</label>
        <select className="mb-4 w-full p-3 border-2 border-grey-100 rounded">
          <option value="">Select year</option>
          <option value="2021">2021</option>
          <option value="2022">2022</option>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
        </select>


        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-col w-full">
            <label className="mb-1 font-medium text-gray-700">Password</label>
            <input type="password" placeholder="Enter Password" className="mb-4 p-3 border-2 border-grey-100 rounded-xl" />
          </div>

          <div className="flex flex-col w-full">
            <label className="mb-1 font-medium text-gray-700">Re-Enter Password</label>
            <input type="password" placeholder="Re-Enter your Password" className="mb-4 p-3 border-2 border-grey-100 rounded-xl" />
          </div>
        </div>

        <button className='mt-2 bg-blue-500 text-white rounded-2xl px-6 py-3 hover:bg-blue-600 transition hover:shadow-lg shadow-blue-900/50 hover:translate-y-[-2px] duration-200 ease-in-out cursor-pointer'>Sign Up</button>
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

export default Login
