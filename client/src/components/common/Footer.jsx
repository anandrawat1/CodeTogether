import { FaGithub, FaLinkedin } from "react-icons/fa"

export default function Footer() {
  return (
    <footer className="bg-[#1f2937] text-gray-400">
      <div className="mx-auto max-w-7xl px-8 pt-16 pb-8">
        {/* Brand */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-white hover:text-indigo-400 transition-colors">
            CodeTogether
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Real-time collaborative coding platform for pair programming and learning.
          </p>
        </div>

        {/* Socials */}
        <div className="mt-4 flex justify-center space-x-6">
          <a
            href="https://github.com/velocitykaran"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FaGithub size={20} />
          </a>
          <a
            href="https://www.linkedin.com/in/karan-raj-2b694b27a/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FaLinkedin size={20} />
          </a>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-gray-700 pt-4 text-center">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} CodeTogether by Karan Raj. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}


