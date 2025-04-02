import React from 'react'

function Navbar() {
  return (
    <>
        <div className='flex justify-between items-center bg-blue-100 rounded-2xl p-2 m-2 shadow-md'>
            <div>
                <h3>TechFluent</h3>
            </div>
            <ul className='flex flex-grow justify-center space-x-8 text-gray-700'>
                <li className='hover:text-blue-500 cursor-pointer'>Home</li>
                <li className='hover:text-blue-500 cursor-pointer'>About</li>
                <li className='hover:text-blue-500 cursor-pointer'>Resources</li>
            </ul>
                <button className='bg-blue-500 text-white rounded-2xl px-4 py-2 hover:bg-blue-600 transition'>Login</button>
        </div>
    </>
  )
}

export default Navbar
