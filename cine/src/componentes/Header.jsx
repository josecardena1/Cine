import React from 'react';
import { NavLink } from "react-router-dom";
import '../Header.css'; 

function Header() {
  const links = [
    { name: "Inicio", path: "/" },
    { name: "Peliculas", path: "/films" },
  ];

  const activeLinkClass = 'block py-2 px-3 text-primary-500 rounded md:p-0';
  const linkClass = 'block py-2 px-3 text-white rounded hover:text-primary-600 md:p-0';

  return (
    <div className='header'>
      <div className='logo'>
        <img src='../../public/img/tapaco.jpg' alt='Logo' />
      </div>
      <h1 className='title'>Tapaco film</h1> {/* Nuevo título */}
      <ul className='nav-links'>
        {
          links.map((link, index) => (
            <li key={index}>
              <NavLink key={index} to={link.path} className={({ isActive }) =>
                isActive ? activeLinkClass : linkClass
              }>
                {link.name}
              </NavLink>
            </li>
          ))
        }
      </ul>
    </div>
  );
}

export default Header;
