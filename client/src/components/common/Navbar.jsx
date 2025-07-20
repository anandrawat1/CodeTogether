import { Link, NavLink } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { IconButton, Menu, MenuItem, Avatar } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useState } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        await logout();
        handleClose();
    };

    return (
    <nav className="bg-[#232329] h-14 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-full px-4">
            {/* Logo */}
            <div className="flex items-center space-x-3 cursor-pointer"  onClick={() => window.scrollTo(0, 0)}>
                <div className="w-8 h-8 bg-[#bbb8ff] rounded-full flex items-center justify-center">
                    <span className="text-[#232329] font-bold text-lg">C</span>
                </div>
                <span className="text-xl font-semibold text-white">CodeTogether</span>
            </div>
            
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
                <NavLink 
                    to="/" 
                    className={({ isActive }) => 
                        `${isActive ? 'text-[#bbb8ff] font-medium' : 'text-gray-300'} hover:text-[#bbb8ff] transition-colors duration-200 decoration-transparent`
                    }
                >
                    Home
                </NavLink>
                <NavLink 
                    to="/my-room" 
                    className={({ isActive }) => 
                        `${isActive ? 'text-[#bbb8ff] font-medium' : 'text-gray-300'} hover:text-[#bbb8ff] transition-colors duration-200 decoration-transparent`
                    }
                >
                    My Rooms
                </NavLink>
                <NavLink 
                    to="/contact" 
                    className={({ isActive }) => 
                        `${isActive ? 'text-[#bbb8ff] font-medium' : 'text-gray-300'} hover:text-[#bbb8ff] transition-colors duration-200 decoration-transparent`
                    }
                >
                    Contact
                </NavLink>
                <NavLink 
                    to="/about" 
                    className={({ isActive }) => 
                        `${isActive ? 'text-[#bbb8ff] font-medium' : 'text-gray-300'} hover:text-[#bbb8ff] transition-colors duration-200 decoration-transparent`
                    }
                >
                    About
                </NavLink>
            </div>
            
            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
                {user ? (
                    <>
                            <IconButton
                                onClick={handleClick}
                                size="small"
                                aria-controls={open ? 'account-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                            >
                                <Avatar 
                                    src={user.image}
                                    alt={user.firstName}
                                    sx={{ 
                                        width: 32, 
                                        height: 32,
                                        border: '2px solid #bbb8ff'
                                    }}
                                />
                            </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            id="account-menu"
                            open={open}
                            onClose={handleClose}
                            onClick={handleClose}
                            PaperProps={{
                                sx: {
                                    backgroundColor: '#2A2A30',
                                    color: '#fff',
                                    width: 120,
                                    '& .MuiMenuItem-root': {
                                        '&:hover': {
                                            backgroundColor: '#3A3A40'
                                        }
                                    }
                                }
                            }}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                            <MenuItem onClick={handleLogout}>
                                <LogoutIcon sx={{ mr: 1 }} />
                                Logout
                            </MenuItem>
                        </Menu>
                        <Link to="/room" className="bg-[#bbb8ff] text-[#232329] px-4 py-1.5 rounded-full hover:bg-[#aaaaff] transition-all duration-200 flex items-center space-x-2 decoration-transparent">
                            <span>Get Started</span>
                            <FiArrowRight className="text-[#232329] text-lg" />
                        </Link>
                    </>
                ) : (
                    <>
                        <Link to="/auth" className="text-gray-300 hover:text-[#bbb8ff] transition-colors duration-200 decoration-transparent">
                            Login
                        </Link>
                        <Link to="/room" className="bg-[#bbb8ff] text-[#232329] px-4 py-1.5 rounded-full hover:bg-[#aaaaff] transition-all duration-200 flex items-center space-x-2 decoration-transparent">
                            <span>Get Started</span>
                            <FiArrowRight className="text-[#232329] text-lg" />
                        </Link>
                    </>
                )}
            </div>
        </div>
    </nav>
    );
};

export default Navbar;
