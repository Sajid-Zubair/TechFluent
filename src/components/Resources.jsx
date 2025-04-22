import React from 'react'
import Sidenav from './Sidenav'
import { FaSearch } from 'react-icons/fa';

function Resources() {
  return (
    <div>
      <Sidenav />
      <div className='ml-64 flex flex-col items-center w-full'>
        <div className='p-6 flex flex-row justify-between items-center gap-6 w-full max-w-4xl'>
          <div className='flex flex-col justify-between items-center gap-3'>
            <h2 className='text-3xl font-bold'>Get Your Questions Answered in Seconds!</h2>
            <p className='text-gray-600 text-md'>Unlock Your Potential with Knowledge</p>
          </div>
        </div>
        <div className='flex flex-col items-center justify-center w-full'>
          <div className='flex flex-row items-center justify-center gap-2 w-2xl max-w-xl mr-64'>
            <input
              className='p-3 border-2 border-gray-500 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200 w-full'
              type="text"
              placeholder='What do you want to learn?'
            />
            <button className='p-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition-all cursor-pointer'>
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Resources
