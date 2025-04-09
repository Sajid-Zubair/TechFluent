import React from 'react'

function Sidenav() {
  return (
    <div className='w-64 bg-blue-600 text-white fixed h-full flex flex-col justify-start px-6 py-8 shadow-lg'>
            <h2 className='text-3xl font-bold'>TechFluent</h2>

            <div className='mt-6'>
                <nav className="flex flex-col gap-6 text-lg font-medium">
                <a href="/dashboard" className="hover:text-blue-600 bg-white rounded-2xl transition text-black px-4 py-2">Home</a>
                <a href="/resources" className="hover:text-blue-600 bg-white rounded-2xl transition text-black px-4 py-2">Resources</a>
                <a href="/profile" className="hover:text-blue-600 bg-white rounded-2xl transition text-black px-4 py-2">Profile</a>
                </nav>
            </div>
    </div>
  )
}

export default Sidenav
