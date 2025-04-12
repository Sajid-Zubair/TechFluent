import React from 'react'
import Sidenav from './Sidenav'
import { FaSearch } from 'react-icons/fa';
import { fetchBookRecommendations } from '../utils/chatgpt';
import { useState } from 'react';


function Resources() {
  return (
    <div>
      <Sidenav />
      <div className='ml-64 flex flex-col items-center w-full'>
        <div className='p-6 flex flex-row justify-space-between items-center gap-6 w-full max-w-4xl'>
          <h2 className='text-3xl font-bold'>AI-Powered Book Suggestions</h2>
          <div className='flex items-center gap-2'>
            <input
              className='p-2 border-2 border-gray-500 rounded-lg'
              type="text"
              placeholder='What do you want to learn?'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={handleSearch}>
              <FaSearch size={24} className='text-gray-600 cursor-pointer' />
            </button>
          </div>
        </div>

        
      </div>
    </div>
  )
}

export default Resources
