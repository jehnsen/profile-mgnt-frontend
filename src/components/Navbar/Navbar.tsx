import React from 'react';
import { Link } from 'react-router-dom';
const NavBar = () => {
  return (
    <nav className="fixed w-full bg-gray-800 text-gray-100">
      <div className="container mx-auto px-5 py-5 flex justify-between items-center">
        <div className="text-md font-semibold cursor-pointer">
            <Link to="/">User Profile Management System</Link>
        </div>
        <div className="space-x-4">

          <Link to="/" className="text-gray-200 hover:text-gray-500xx hover:font-bold hover:text-gray-300">Profiles</Link>
          <Link to="/datatable" className="text-gray-200 hover:text-gray-500xx hover:font-bold hover:text-gray-300">Datatable</Link>
          
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
