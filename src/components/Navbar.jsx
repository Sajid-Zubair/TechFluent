import { Link as ScrollLink } from 'react-scroll';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className='bg-blue-100/70 backdrop-blur-md shadow-md rounded-lg p-4 m-4'>
      <div className='flex justify-between items-center relative'>

        {/* Logo */}
        <div>
          {/* <h1 className='text-3xl font-bold text-blue-500 cursor-pointer tracking-wide'>TechFluent</h1> */}
          <h1 className="text-3xl font-extrabold text-blue-500 tracking-tight">
            <span className="text-gray-800">Tech</span>
            <span className="text-blue-600">Fluent</span>
          </h1>
        </div>

        {/* Desktop Menu */}
        <ul className='hidden md:flex items-center space-x-10 text-gray-800 text-md font-medium'>
          <Link to='/' className='hover:text-blue-500 transition duration-200'>Home</Link>

          <ScrollLink
            to='aboutSection'
            smooth={true}
            duration={500}
            offset={-70}
            className='cursor-pointer hover:text-blue-500 transition duration-200'
            activeClass='text-blue-600 font-semibold'
            spy={true}
          >
            About
          </ScrollLink>

          <ScrollLink
            to='resourcesSection'
            smooth={true}
            duration={500}
            offset={-70}
            className='cursor-pointer hover:text-blue-500 transition duration-200'
            activeClass='text-blue-600 font-semibold'
            spy={true}
          >
            Resources
          </ScrollLink>
        </ul>

        {/* Login Button */}
        <button
          onClick={() => navigate('/login')}
          className='hidden md:block px-5 py-2 bg-blue-500 text-white rounded-xl font-medium shadow-md hover:bg-blue-600 transition duration-200'
        >
          Login
        </button>

        {/* Hamburger Icon */}
        <div className='md:hidden'>
          <button onClick={() => setIsOpen(!isOpen)} className='text-blue-500'>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {isOpen && (
          <div className='absolute top-full left-0 w-full z-50 bg-blue-100 rounded-b-lg py-5 shadow-xl flex flex-col items-center space-y-4 transition-all duration-300 ease-in-out md:hidden'>
            <Link to='/' onClick={() => setIsOpen(false)} className='text-gray-800 hover:text-blue-500 font-medium'>Home</Link>

            <ScrollLink
              to='aboutSection'
              smooth={true}
              duration={500}
              offset={-70}
              onClick={() => setIsOpen(false)}
              className='cursor-pointer hover:text-blue-500 font-medium'
            >
              About
            </ScrollLink>

            <ScrollLink
              to='resourcesSection'
              smooth={true}
              duration={500}
              offset={-70}
              onClick={() => setIsOpen(false)}
              className='cursor-pointer hover:text-blue-500 font-medium'
            >
              Resources
            </ScrollLink>

            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/login');
              }}
              className='px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600'
            >
              Login
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
