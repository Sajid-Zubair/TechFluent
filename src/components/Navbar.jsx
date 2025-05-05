import React from 'react'
import {Link, useNavigate} from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()
  return (
    <>
        <div className='flex justify-between items-center bg-blue-100 rounded-lg p-2 m-4 shadow-md'>
            <div>
                <h3 className='text-3xl font-bold text-blue-500 cursor-pointer'>TechFluent</h3>
            </div>
            <ul className='flex flex-grow justify-center space-x-8 text-gray-700'>
                <Link className='hover:text-blue-500 cursor-pointer hover:translate-y-[-2px] transition duration-200 ease-in-out font-semibold'>Home</Link>
                <Link className='hover:text-blue-500 cursor-pointer hover:translate-y-[-2px] transition duration-200 ease-in-out font-semibold'>About</Link>
                <Link className='hover:text-blue-500 cursor-pointer hover:translate-y-[-2px] transition duration-200 ease-in-out font-semibold'>Resources</Link>
            </ul>
            <button onClick={() => navigate('/login')} className=" px-6 py-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition-all cursor-pointer">
              Login
            </button>
        </div>
    </>
  )
}

export default Navbar
