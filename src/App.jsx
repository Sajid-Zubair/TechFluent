import  {Navbar,Footer,LandingPage, Signup, Login, Dashboard, Profile, Resources} from './components/index.js'
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

      </Routes> 
    </div>
  )
}

export default App
