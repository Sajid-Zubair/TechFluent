import React from 'react'
import Sidenav from './Sidenav'
import { FaSearch } from 'react-icons/fa';

function Resources() {
  return (
    <div>
      <Sidenav/>
      <div className='ml-64 p-6 flex flex-row justify-space-between items-center gap-6'>
        <h2 className='text-3xl font-bold'>Search For Resource Material</h2>
        <div className='flex items-center flex-row gap-6'>
          <input className='p-2 border-2 border-gray-500' type="text" placeholder='Search'/>
          <FaSearch size={24} className='text-gray-600' />
        </div>
      </div>
    </div>
  )
}

export default Resources
