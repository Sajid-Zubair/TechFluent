import { Link as ScrollLink } from 'react-scroll';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react'; // optional: for hamburger and close icons

function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className='flex justify-between items-center bg-blue-100 rounded-lg p-4 m-4 shadow-md relative'>
        <div>
          <h3 className='text-3xl font-bold text-blue-500 cursor-pointer'>TechFluent</h3>
        </div>

        {/* Desktop Menu */}
        <ul className='hidden md:flex flex-grow justify-center space-x-8 text-gray-700'>
          <Link to='/' className='hover:text-blue-500 transition duration-200 font-semibold'>Home</Link>

          <ScrollLink
          to='aboutSection'
          smooth={true}
          duration={500}
          offset={-70} // optional: offset for fixed nav height
          className='hover:text-blue-500 transition duration-200 font-semibold cursor-pointer'
        >
          About
        </ScrollLink>

          <ScrollLink
          to='resourcesSection'
          smooth={true}
          duration={500}
          offset={-70} // optional: offset for fixed nav height
          className='hover:text-blue-500 transition duration-200 font-semibold cursor-pointer'
        >
          Resources
        </ScrollLink>

        </ul>

        {/* Login Button (visible always) */}
        <button onClick={() => navigate('/login')} className='hidden md:block px-6 py-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition-all'>
          Login
        </button>

        {/* Hamburger Icon */}
        <div className='md:hidden'>
          <button onClick={() => setIsOpen(!isOpen)} className='text-blue-500'>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className='absolute top-full left-0 w-full bg-blue-100 rounded-b-lg flex flex-col items-center py-4 space-y-4 md:hidden z-10 shadow-md'>
            <Link to='/' onClick={() => setIsOpen(false)} className='text-gray-700 hover:text-blue-500 font-semibold'>Home</Link>

            <ScrollLink
            to='aboutSection'
            onClick={() => setIsOpen(false)}
            smooth={true}
            duration={500}
            offset={-70} // optional: offset for fixed nav height
            className='hover:text-blue-500 transition duration-200 font-semibold cursor-pointer'
          >
            About
          </ScrollLink>

            <ScrollLink
            to='resourcesSection'
            onClick={() => setIsOpen(false)}
            smooth={true}
            duration={500}
            offset={-70} // optional: offset for fixed nav height
            className='hover:text-blue-500 transition duration-200 font-semibold cursor-pointer'
          >
            Resources
          </ScrollLink>

            
            <button onClick={() => { setIsOpen(false); navigate('/login'); }} className='px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600'>
              Login
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default Navbar;
