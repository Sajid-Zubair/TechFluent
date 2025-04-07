import React from 'react'
import {Link} from 'react-router-dom'

function Navbar() {
  return (
    <>
        <div className='flex justify-between items-center bg-blue-100 rounded-lg p-2 m-4 shadow-md'>
            <div>
                <h3 className='text-3xl font-bold text-blue-500 font-serif cursor-pointer'>TechFluent</h3>
            </div>
            <ul className='flex flex-grow justify-center space-x-8 text-gray-700'>
                <Link className='hover:text-blue-500 cursor-pointer hover:translate-y-[-2px] transition duration-200 ease-in-out'>Home</Link>
                <Link className='hover:text-blue-500 cursor-pointer hover:translate-y-[-2px] transition duration-200 ease-in-out'>About</Link>
                <Link className='hover:text-blue-500 cursor-pointer hover:translate-y-[-2px] transition duration-200 ease-in-out'>Resources</Link>
            </ul>
            <button className='bg-blue-500 text-white rounded-2xl px-6 py-3 hover:bg-blue-600 transition hover:shadow-lg shadow-blue-900/50 hover:translate-y-[-2px] duration-200 ease-in-out cursor-pointer'>Login</button>
        </div>
    </>
  )
}

export default Navbar
