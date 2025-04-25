import React from 'react'
import { Link } from 'react-router-dom'

function ErrorPop({setshowError}) {
  return (
    <div className='fixed inset-0 z-50 bg-white-300 bg-opacity-30 backdrop-blur-sm flex flex-col justify-center items-center gap-6'>
        <div className='bg-red-300 m-4 p-6 rounded-lg flex flex-col justify-between items-center'>
            <p className='text-xl p-4 text-bold'>Please select an Interview Type</p>
            <Link onClick={() => setshowError(false)} className='px-6 py-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition-all cursor-pointer'>Ok</Link>
        </div>
            
    </div>
  )
}

export default ErrorPop
