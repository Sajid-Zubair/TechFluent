import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

function Dashboard() {
    const navigate = useNavigate()
    const [showDropdown, setShowDropdown] = useState(false);
  return (
    <div>
        <div className='w-64 bg-blue-600 text-white fixed h-full flex flex-col justify-start px-6 py-8 shadow-lg'>
            <h2 className='text-3xl font-bold'>TechFluent</h2>

            <div className='mt-6'>
                <nav className="flex flex-col gap-6 text-lg font-medium">
                <a href="/dashboard" className="hover:text-blue-600 bg-white rounded-2xl transition text-black px-4 py-2">Home</a>
                <a href="/mock-interview" className="hover:text-blue-600 bg-white rounded-2xl transition text-black px-4 py-2">Mock Interview</a>
                <a href="/profile" className="hover:text-blue-600 bg-white rounded-2xl transition text-black px-4 py-2">Profile</a>
                </nav>
            </div>
        </div>

        <div className='ml-64 p-6'>
            <div className='flex justify-between items-center'>
                <h1 className='text-3xl font-bold p-4'>Welcome User!</h1>
                <button onClick={() => navigate('/')} className='mt-2 bg-blue-600 text-white rounded-2xl px-6 py-3 hover:bg-blue-700 transition hover:shadow-lg shadow-blue-900/50 hover:translate-y-[-2px] duration-200 ease-in-out cursor-pointer'>Logout</button>
            </div>


            
            <div className='mt-10'>
                <div className='mt-4 p-4 flex flex-row md:flex-row justify-between items-center bg-gray-100 rounded-lg'>
                    <h2 className='text-lg font-semibold'>Current Streak : </h2>
                    <span className='text-3xl font-bold text-blue-600'>3 Days !</span>
                </div>
                <div className='mt-4 p-4 flex flex-col md:flex-row justify-between items-center bg-gray-100 rounded-lg'>
                    <div className='flex flex-row md:flex-row justify-between items-center gap-6'>
                        <h2 className='text-lg font-semibold'>Number of Technical Interviews Completed : </h2>
                        <span className='text-3xl font-bold text-blue-600'>5</span>
                    </div>
                    <hr />
                    <div className='flex flex-row md:flex-row justify-between items-center gap-6'>
                        <h2 className='text-lg font-semibold'>Number of Behavioural Interviews Completed : </h2>
                        <span className='text-3xl font-bold text-blue-600'>2</span>
                    </div>
                </div>
            </div>

            <div className='mt-10 flex flex-row justify-between p-4 items-center'>

                <h2 className='text-3xl font-bold'>Choose Interview Type :</h2>


                <div className='flex flex-row items-center gap-6'>
                    <div className='flex flex-row gap-4'>
                        <button onClick={() => setShowDropdown((prev) => !prev)} className='py-4 px-2 bg-blue-600 rounded-2xl text-white hover:bg-blue-700 cursor-pointer'>Technical Interviwe</button>
                        <button onClick={() => setShowDropdown(false)} className='py-4 px-2 bg-blue-600 rounded-2xl text-white hover:bg-blue-700 cursor-pointer'>Behavioural Interview</button>

                    </div>
                        {showDropdown && (
                            <div className='mb-1 w-fit md:w-1/3'>
                                <label className='block text-lg font-medium text-gray-700 mb-2'>
                                    Select a Subject:
                                </label>
                                <select className='w-40 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400'>
                                    <option value="">-- Choose Subject --</option>
                                    <option value="dsa">Data Structures</option>
                                    <option value="os">Operating Systems</option>
                                    <option value="dbms">DBMS</option>
                                    <option value="networking">Computer Networks</option>
                                </select>
                            </div>
                        )}
                    </div>
            </div>


            <div className='mt-20 flex justify-center'>
                <button className='py-4 px-8 bg-blue-600 rounded-2xl text-white hover:bg-blue-700 cursor-pointer'>Start Interview</button>
            </div>


        </div>

    </div>
  )
}

export default Dashboard
