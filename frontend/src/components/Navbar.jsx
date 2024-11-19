import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Navbar = () => {
  const { token, setToken } = useContext(AppContext);

  const navigate = useNavigate();



  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(false);
    console.log('Logged out');
    navigate('/');
  }

  return (
    <nav className="w-full bg-[#333] p-6 px-5 md:px-20 flex items-center justify-between fixed z-10">
      {/* Left side: Logo */}
      <div className="text-2xl font-bold text-white hover:cursor-pointer">
        <Link to='/' > <span className="text-blue-500">Car</span>Manager </Link>
        </div>

     

      {/* Right side: Buttons */}
      <div className="flex items-center space-x-4">
        {token && (
          <Link
            to="/add-car"
            className="bg-white text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
          >
            Add Car
          </Link>
        )}
        {token && (
          <Link
            to="/my-car"
            className="bg-white text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
          >
            My Car
          </Link>
        )}
        {!token && (
          <Link
            to="/signup"
            className="bg-white text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
          >
            Create Account
          </Link>
        )}
        {token && (
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
