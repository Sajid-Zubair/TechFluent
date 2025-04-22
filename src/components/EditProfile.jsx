import React from 'react'
import { MdClose } from 'react-icons/md';
import Signup from './Signup';

function EditProfile({setShowEditP}) {
    function handleEditClose(){
        setShowEditP(false);
    }
  return (
    <div className='fixed inset-0 z-50 bg-white-300 bg-opacity-30 backdrop-blur-sm flex flex-col justify-center items-center gap-6'>
        <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col border-2 border-black max-w-2xl p-8 shadow-2xl rounded-2xl bg-white">
        <div className='flex flex-row justify-between items-center w-full'>
            <h1 className="text-3xl font-bold text-center mb-12">Edit Profile</h1>
            <MdClose className='cursor-pointer mb-12' size={24} onClick={handleEditClose} />
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-col w-full">
            <label className="mb-1 font-medium text-grey-700">Username</label>
            <input type="text" placeholder="Enter your username" className="mb-4 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200" />
          </div>

          <div className="flex flex-col w-full">
            <label className="mb-1 font-medium text-gray-700">Email</label>
            <input type="email" placeholder="Enter your email" className="mb-4 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200" />
          </div>
        </div>

        <label className="mb-1 font-medium text-gray-700">College</label>
        <input type="text" placeholder="Enter college name" className="mb-4 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200" />

        <label className="block mb-1 font-medium">Year of Joining</label>
        <select className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200">
          <option value="">Select year</option>
          <option value="2021">2021</option>
          <option value="2022">2022</option>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
        </select>


        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-col w-full">
            <label className="mb-1 font-medium text-gray-700">Password</label>
            <input type="password" placeholder="Enter Password" className="mb-4 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200" />
          </div>
        </div>
        
        <button onClick={handleEditClose} className='px-6 py-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition-all cursor-pointer mt-4'>Done</button>
      </div>
    </div>
    </div>
  )
}

export default EditProfile