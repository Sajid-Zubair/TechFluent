import  {Navbar,Footer,LandingPage} from './components/index.js'
import './index.css'
import { useState, useEffect } from 'react';
function App() {

  // 48cae4 90e0ef

  return (
    <div className='overflow-x-hidden bg-gradient-to-br from-48cae4 to-90e0ef'>  
      <Navbar/>
      <LandingPage/>
      <Footer/>
    </div>
  )
}

export default App
