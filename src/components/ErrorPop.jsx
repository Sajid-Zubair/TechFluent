
import React from 'react'
import { Link } from 'react-router-dom'

function ErrorPop({ setshowError }) {
  return (
    <div className="fixed inset-0 z-50 bg-white-300 bg-opacity-40 backdrop-blur-sm flex justify-center items-center">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full mx-4 px-6 py-8 flex flex-col items-center space-y-6 animate-fade-in">
        <div className="text-red-600 text-2xl font-semibold text-center">
          ⚠️ Please select an Interview Type
        </div>

        <Link
          onClick={() => setshowError(false)}
          className="px-6 py-3 bg-emerald-600 text-white rounded-full shadow hover:bg-emerald-700 transition-all duration-200"
        >
          Ok
        </Link>
      </div>
    </div>
  )
}

export default ErrorPop

