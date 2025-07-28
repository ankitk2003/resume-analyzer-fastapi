import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import logo from '../../utils/logo.png';
import Footer from './Footer';

function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-white shadow p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="h-8 w-8" />
          <span className="font-bold text-xl text-blue-600">ProfileFit</span>
        </div>
        <ul className="flex gap-6 text-gray-700 font-medium">
          <li><Link to="/" className="hover:text-blue-600">Home</Link></li>
          <li><Link to="/about" className="hover:text-blue-600">About</Link></li>
          <li><Link to="/candidate-profile" className="hover:text-blue-600">Profile</Link></li>
        </ul>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer/>
    </div>
  );
}

export default Layout;
