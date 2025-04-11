import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const Navbar = () => {
    return (
    <nav className="bg-white py-3 px-6 shadow-md fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">S</span>
                </div>
                <span className="text-2xl font-semibold text-gray-800">SaaSify</span>
            </div>
            
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-10">
                <Link to="/home" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">
                Home
                </Link>
                <Link to="/features" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">
                Features
                </Link>
                <Link to="/contact" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">
                Contact
                </Link>
            </div>
            
            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">
                Log in
                </Link>
                <Link to="/get-started" className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition-all duration-200 flex items-center space-x-2">
                <span>Get Started</span>
                <FiArrowRight className="text-white text-lg" />
                </Link>
            </div>
        </div>
    </nav>
    );
};

export default Navbar;
