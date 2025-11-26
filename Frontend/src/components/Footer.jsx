import { Mail, Twitter, Github, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-black text-gray-300 w-full mt-24">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo & Description */}
          <div className="md:col-span-2 lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4 group">
              <img src="/logo2.png" alt="DigitalPadhai Logo" className="h-10 w-auto invert" />
            </Link>
            <p className="text-sm text-gray-400 max-w-md mt-3">
              Transformative learning experiences for students and educators worldwide.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="GitHub">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="mailto:contact@epadhai.com" className="text-gray-400 hover:text-white transition-colors" aria-label="Email">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white text-sm transition-colors block py-1">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/courses" className="text-gray-400 hover:text-white text-sm transition-colors block py-1">
                  All Courses
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white text-sm transition-colors block py-1">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase mb-4">
              Contact
            </h3>
            <div className="space-y-3 text-sm text-gray-400">
              <p>contact@digitalpadhai.com</p>
              <p>+1 (555) 123-4567</p>
              <p>Kathmandu, Nepal</p>
            </div>
          </div>
        </div>

        {/* Bold Text Section - Minimalist */}
        <div className="mt-16 py-12 text-center">
          <h2 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tight opacity-90 mask-b-from-orange-950">
            DIGITALPADHAI
          </h2>
        </div>

        {/* Bottom Footer */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} DIGITAL PADHAI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;