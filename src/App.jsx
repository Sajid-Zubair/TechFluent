import Custom_Interview from './components/Custom_Interview.jsx'
import  {Navbar,Footer,LandingPage, Signup, Login, Dashboard, Profile, Resources, Interview, EditProfile, ErrorPop} from './components/index.js'
import './index.css'
import { Routes, Route } from 'react-router-dom'

function App() {

  return (
    <div className='overflow-x-hidden'> 
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
        <Route path="/login" element={<Login/>}></Route>
        <Route path='/dashboard' element={<Dashboard/>}></Route>
        <Route path='/profile' element={<Profile/>}></Route>

        <Route path='/resources' element={<Resources/>}></Route>

        <Route path="/interview" element={<Interview />} />

        <Route path='/editprofile' element={<EditProfile/>}></Route>
        <Route path='/custom_interview' element={<Custom_Interview />} />
      </Routes> 
    </div>
  )
}

export default App
