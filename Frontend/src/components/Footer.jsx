import { Mail, Twitter, Github, Linkedin, BookOpen, Users, Award, LifeBuoy, FileText, Lock, Shield } from 'lucide-react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-black text-gray-300 w-full mt-24">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Column 1: Logo and description */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-6">
              <img 
                src="/logoblack.png" 
                alt="Epadhai Logo" 
                className="h-10 w-auto invert"
              />
              <span className="text-white font-bold text-xl">Epadhai</span>
            </Link>
            <p className="text-sm text-gray-400 mb-6">
              Your gateway to transformative learning experiences. Empowering students and educators worldwide.
            </p>
            <div className="flex items-center gap-4">
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

          {/* Column 2: Learning Resources */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
              <BookOpen className="h-4 w-4" /> Learning
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  All Courses
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Learning Paths
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Certifications
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Skill Assessments
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Instructor-Led Training
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Community & Support */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
              <Users className="h-4 w-4" /> Community
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Discussion Forums
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Study Groups
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Events & Webinars
                </a>
              </li>

            </ul>
          </div>

          {/* Column 4: Legal & Institutional */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
              <FileText className="h-4 w-4" /> About
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Our Mission
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Courses
                </a>
              </li>
          
         
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Epadhai LMS. All rights reserved.
          </p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <a href="#" className="text-xs text-gray-500 hover:text-white transition-colors">
              About
            </a>
            <a href="#" className="text-xs text-gray-500 hover:text-white transition-colors">
              Home
            </a>
            <a href="#" className="text-xs text-gray-500 hover:text-white transition-colors">
              Courses
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer