// app/components/Navbar.js
"use client"; // Add this line

import Link from "next/link";

const Navbar = () => (
  <nav className="bg-gradient-to-r from-purple-600 via-blue-500 to-teal-400 p-4 shadow-lg">
    <div className="max-w-7xl mx-auto flex justify-between items-center">
      <Link href="/">
        <span className="text-white text-3xl font-extrabold cursor-pointer hover:text-gray-100 transition-colors">
          Job Tracker
        </span>
      </Link>
      <ul className="flex space-x-6">
        <li>
          <Link href="#home">
            <span
              className="text-white text-lg font-medium cursor-pointer hover:text-gray-200 transition-colors"
              aria-label="Home"
            >
              Home
            </span>
          </Link>
        </li>
        <li>
          <Link href="#jobs">
            <span
              className="text-white text-lg font-medium cursor-pointer hover:text-gray-200 transition-colors"
              aria-label="Jobs"
            >
              Jobs
            </span>
          </Link>
        </li>
      </ul>
    </div>
  </nav>
);

export default Navbar;
