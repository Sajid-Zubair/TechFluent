import React from 'react'
import Navbar from './Navbar'
import { useState, useEffect } from 'react'
function LandingPage() {
  return (
    <div>
      <div>
            <div className='h-screen flex flex-col justify-center items-center' id='home'>
                <h1>Home</h1>
            </div>
            <div className='h-screen flex flex-col justify-center items-center' id='about'>
                <h1>About</h1>
            </div>
            <div className='h-screen flex flex-col justify-center items-center' id='resources'>
                <h1>Resources</h1>
            </div>
      </div>
    </div>
  )
}

export default LandingPage
