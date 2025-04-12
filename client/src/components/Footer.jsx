import React from 'react';
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white pt-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Project Section */}
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-4">CodeTogether</h3>
            <p className="text-gray-300">
              A collaborative coding platform that enables real-time code sharing and pair programming.
            </p>
          </div>

          {/* Quick Links */}
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 p-0">
              <li><a href="/" className="text-gray-300 hover:text-white transition">Home</a></li>
              <li><a href="/features" className="text-gray-300 hover:text-white transition">Features</a></li>
              <li><a href="/about" className="text-gray-300 hover:text-white transition">About</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-white transition">Contact</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-4">Resources</h3>
            <ul className="space-y-2 p-0">
              <li><a href="/docs" className="text-gray-300 hover:text-white transition">Documentation</a></li>
              <li><a href="/tutorials" className="text-gray-300 hover:text-white transition">Tutorials</a></li>
              <li><a href="/blog" className="text-gray-300 hover:text-white transition">Blog</a></li>
              <li><a href="/faq" className="text-gray-300 hover:text-white transition">FAQ</a></li>
            </ul>
          </div>

          {/* Social Media Links */}
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-4">Connects</h3>
            <div className="flex space-x-4">
              <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" 
                 className="text-gray-300 hover:text-white transition">
                <FaGithub size={24} />
              </a>
              <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer"
                 className="text-gray-300 hover:text-white transition">
                <FaLinkedin size={24} />
              </a>
              <a href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer"
                 className="text-gray-300 hover:text-white transition">
                <FaTwitter size={24} />
              </a>
              <a href="https://instagram.com/yourusername" target="_blank" rel="noopener noreferrer"
                 className="text-gray-300 hover:text-white transition">
                <FaInstagram size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-4 text-center">
          <p className="text-gray-500 m-0 pb-4 text-sm">
            © {currentYear} CodeTogether. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 