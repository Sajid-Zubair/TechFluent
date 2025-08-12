import Custom_Interview from './components/Custom_Interview.jsx'
import {
  Navbar, Footer, LandingPage, Signup, Login,
  Dashboard, Profile, Resources, Interview,
  EditProfile, ErrorPop, StartCustomInterview, ResumeReview
} from './components/index.js'

import ProtectedRoute from './components/ProtectedRoute.jsx' // ✅ Import this

import './index.css'
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <div className='overflow-x-hidden'> 
      <Routes>
        <Route path="/" element={
          <div>
            <Navbar />
            <LandingPage />
            <Footer />
          </div>
        } />

        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* ✅ Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute><Profile /></ProtectedRoute>
        } />

        <Route path="/resources" element={
          <ProtectedRoute><Resources /></ProtectedRoute>
        } />

        <Route path="/interview" element={
          <ProtectedRoute><Interview /></ProtectedRoute>
        } />

        <Route path="/editprofile" element={
          <ProtectedRoute><EditProfile /></ProtectedRoute>
        } />

        <Route path="/custom_interview" element={
          <ProtectedRoute><Custom_Interview /></ProtectedRoute>
        } />

        
        <Route path="/start-custom-interview" element={
          <ProtectedRoute><StartCustomInterview /></ProtectedRoute>
        }/>
        <Route path="/resume" element={
          <ProtectedRoute><ResumeReview /></ProtectedRoute>
        }/>
      </Routes> 
    </div>
  )
}

export default App
