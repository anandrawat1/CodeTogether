import React from 'react';
import { slide as Menu } from 'react-burger-menu';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LogoutIcon from '@mui/icons-material/Logout';

const SideMenuBar = ({ onLogout }) => {
  const { user } = useAuth();

  const burgerStyles = {
    bmBurgerButton: {
      position: 'fixed',
      width: '24px',
      height: '20px',
      right: '1rem',
      top: '1rem',
    },
    bmBurgerBars: {
      background: '#bbb8ff',
      borderRadius: '2px',
    },
    bmBurgerBarsHover: {
      background: '#aaaaff',
    },
    bmCrossButton: {
      height: '24px',
      width: '24px',
    },
    bmCross: {
      background: '#ffffff',
    },
    bmMenuWrap: {
      top: '0',
    },
    bmMenu: {
      background: '#232329',
      padding: '2.5rem 1.2rem 0',
      fontSize: '1rem',
    },
    bmItemList: {
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
    },
    bmOverlay: {
      background: 'rgba(0,0,0,0.3)',
    },
  };

  const navLinkClass = ({ isActive }) =>
    `no-underline block px-4 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
      isActive
        ? 'bg-[#353542] text-[#bbb8ff]'
        : 'text-[#bbb8ff] hover:text-white hover:bg-[#353542]'
    }`;

  return (
    <div className="md:hidden">
      <Menu right width={180} styles={burgerStyles}>
        <div className="flex flex-col h-full justify-between">
          <div>
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/my-room" className={navLinkClass}>
              My Rooms
            </NavLink>
            <NavLink to="/contact" className={navLinkClass}>
              Contact
            </NavLink>
            <NavLink to="/about" className={navLinkClass}>
              About
            </NavLink>
            <div className="border-b border-[#353542] my-5 mx-1"></div>
          </div>

          <div className="flex flex-col gap-2 pb-6">
            {user ? (
              <>
                <button
                  onClick={onLogout}
                  className="no-underline text-[#bbb8ff] hover:text-white transition-colors duration-200 text-left px-4 py-2 flex items-center gap-2"
                >
                  <LogoutIcon sx={{ fontSize: 20 }} /> Logout
                </button>
                <Link
                  to="/room"
                  className="no-underline bg-[#bbb8ff] text-[#232329] px-6 py-2 rounded-full hover:bg-[#aaaaff] transition-all duration-200 mt-1 mx-auto text-center text-base font-semibold"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/auth"
                  className="no-underline text-[#bbb8ff] hover:text-white transition-colors duration-200 px-4 py-2 text-base font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/room"
                  className="no-underline bg-[#bbb8ff] text-[#232329] px-6 py-2 rounded-full hover:bg-[#aaaaff] transition-all duration-200 mt-1 mx-auto text-center text-base font-semibold"
                >
                  Get Started
                </Link>
              </>
              
            )}
          </div>
        </div>
      </Menu>
    </div>
  );
};

export default SideMenuBar;
