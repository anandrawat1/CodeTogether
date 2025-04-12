import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const Navbar = () => {
    return (
    <nav className="bg-[#232329] h-14 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-full px-4">
            {/* Logo */}
            <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-[#bbb8ff] rounded-full flex items-center justify-center">
                    <span className="text-[#232329] font-bold text-lg">C</span>
                </div>
                <span className="text-xl font-semibold text-white">CodeTogether</span>
            </div>
            
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
                <Link to="/home" className="text-gray-300 hover:text-[#bbb8ff] transition-colors duration-200 decoration-transparent">
                Home
                </Link>
                <Link to="/features" className="text-gray-300 hover:text-[#bbb8ff] transition-colors duration-200 decoration-transparent">
                Features
                </Link>
                <Link to="/auth" className="text-gray-300 hover:text-[#bbb8ff] transition-colors duration-200 decoration-transparent">
                My Rooms
                </Link>
                <Link to="/contact" className="text-gray-300 hover:text-[#bbb8ff] transition-colors duration-200 decoration-transparent">
                Contact
                </Link>
                <Link to="/about" className="text-gray-300 hover:text-[#bbb8ff] transition-colors duration-200 decoration-transparent">
                About
                </Link>
            </div>
            
            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
                <Link to="/auth" className="text-gray-300 hover:text-[#bbb8ff] transition-colors duration-200 decoration-transparent">
                Log in
                </Link>
                <Link to="/" className="bg-[#bbb8ff] text-[#232329] px-4 py-1.5 rounded-full hover:bg-[#aaaaff] transition-all duration-200 flex items-center space-x-2 decoration-transparent">
                <span>Get Started</span>
                <FiArrowRight className="text-[#232329] text-lg" />
                </Link>
            </div>
        </div>
    </nav>
    );
};

export default Navbar;
