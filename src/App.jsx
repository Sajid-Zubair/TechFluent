import  {Navbar,Footer,LandingPage, Signup} from './components/index.js'
import './index.css'
import { useState, useEffect } from 'react';
import { BrowserRouter, createBrowserRouter, Routes } from 'react-router-dom'
import { Route } from 'react-router-dom'; 

// const routes = createBrowserRouter([
//   {
//     path : '/',
//     element : <App/>
//   },
//   {
//     path : '/signup',
//     element : <Signup/>
//   },
// ])
function App() {

  return (
    <div className='overflow-x-hidden bg-gradient-to-br from-48cae4 to-90e0ef'> 
      <Routes>

        <Route path="/" element={
          <div>
            <Navbar/>
            <LandingPage/>
            <Footer/>
          </div>
        }>
        </Route>

        <Route path="/signup" element={<Signup/>}>

        </Route>

      </Routes> 
    </div>
  )
}

export default App
