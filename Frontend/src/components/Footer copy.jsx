import { Mail, Twitter, Github, Linkedin, BookOpen, Users, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-black text-gray-300 w-full mt-24">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo & Description */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img src="/logo2.png" alt="DigitalPadhai Logo" className="h-8 w-auto invert" />
            </Link>
            <p className="text-sm text-gray-400">
              Transformative learning experiences for students and educators worldwide.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="mailto:contact@epadhai.com" className="text-gray-400 hover:text-white transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Learning */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase mb-4 flex items-center gap-2">
              <BookOpen className="h-4 w-4" /> Learning
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/courses" className="text-gray-400 hover:text-white text-sm transition-colors">
                  All Courses
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Learning Paths
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Certifications
                </a>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase mb-4 flex items-center gap-2">
              <Users className="h-4 w-4" /> Community
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Forums
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Study Groups
                </a>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase mb-4 flex items-center gap-2">
              <FileText className="h-4 w-4" /> About
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Our Mission
                </Link>
              </li>
              <li>
                <Link to="/courses" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Courses
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-12 pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Digital Padhai. All rights reserved.</p>
          <div className="flex gap-4 mt-2 md:mt-0">
            <Link to="/about" className="hover:text-white transition-colors">About</Link>
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <Link to="/courses" className="hover:text-white transition-colors">Courses</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
