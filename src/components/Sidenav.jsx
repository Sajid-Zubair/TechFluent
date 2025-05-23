import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'


function Sidenav() {
  return (
    <>
    <div className='w-64 bg-blue-600 text-white fixed h-full flex flex-col justify-start px-6 py-8 shadow-lg'>
            <h2 className='text-3xl font-bold'>TechFluent</h2>

            <div className='mt-6'>
                <nav className="flex flex-col gap-6 text-lg font-medium">
                <Link to={"/dashboard"} className="hover:text-blue-600 bg-white rounded-2xl transition text-black px-4 py-2">Home</Link>
                <Link to={"/resources"} className="hover:text-blue-600 bg-white rounded-2xl transition text-black px-4 py-2">Resource Corner</Link>
                <Link to={"/profile"} className="hover:text-blue-600 bg-white rounded-2xl transition text-black px-4 py-2">Profile</Link>
                </nav>
            </div>
    </div>
    </>
  )

}

export default Sidenav



