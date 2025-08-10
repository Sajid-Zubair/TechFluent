import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaBook, FaUser, FaBriefcase } from 'react-icons/fa';


function Sidenav() {
  const location = useLocation();

  const navLinks = [
    { to: "/dashboard", label: "Home", icon: <FaHome /> },
    { to: "/custom_interview", label: "Job Search", icon: <FaBriefcase /> },
    { to: "/resources", label: "Resource Corner", icon: <FaBook /> },
    { to: "/profile", label: "Profile", icon: <FaUser /> },
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-blue-700 to-blue-800 text-white fixed h-full flex flex-col px-6 py-8 shadow-lg">
      <div className="mb-10 flex items-center gap-3">
        <div className="text-4xl font-extrabold tracking-wide">🚀</div>
        <h2 className="text-3xl font-extrabold select-none">TechFluent</h2>
      </div>

      <nav className="flex flex-col gap-4 text-lg font-semibold">
        {navLinks.map(({ to, label, icon }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition
                ${isActive ? "bg-white text-blue-800 font-bold shadow-md" : "hover:bg-white/20"}
              `}
            >
              <span className="text-xl">{icon}</span>
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidenav;


