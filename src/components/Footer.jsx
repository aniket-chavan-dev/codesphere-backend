
import { Github, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-dark text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-15">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-left">
          {/* Logo / Brand */}
          <div>
            <h2 className="text-2xl font-bold text-white">CodeSphere</h2>
            <p className="mt-2 text-sm text-gray-400">
              Practice coding, prepare for interviews, and level up your skills.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-white mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="hover:text-yellow-400">Home</a>
              </li>
              <li>
                <a href="/problems" className="hover:text-yellow-400">Problems</a>
              </li>
              <li>
                <a href="/about" className="hover:text-yellow-400">About</a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-semibold text-white mb-3">Follow Us</h3>
            <div className="flex justify-center md:justify-start space-x-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400">
                <Github size={22} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400">
                <Twitter size={22} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400">
                <Linkedin size={22} />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} CodeSphere. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

