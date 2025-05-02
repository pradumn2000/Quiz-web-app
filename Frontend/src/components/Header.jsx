import React from 'react';


function Header() {
  return (
    <header className="flex justify-between items-center bg-[rgba(190,200,255,0.7)] shadow-lg p-3 top-0 sticky z-50">
      <div>
        <a href='/signin'>
        <img src="/logo.png" alt="Company Logo" className="w-42 h-24 rounded-xl " />
        </a>
      </div>
      <a href="/admin/login" className="text-white hover:text-gray-300 px-4 py-2 bg-gray-600 rounded">
  Login
</a>
      
    </header>
  );
}

export default Header; 