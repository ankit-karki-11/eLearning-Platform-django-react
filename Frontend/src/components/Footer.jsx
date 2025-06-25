import { Button } from '@/components/ui/button'
import { ArrowUpRight, Mail, Twitter, Github, Linkedin } from 'lucide-react'

const Footer = () => {
  return (
    <footer className='relative pt-16 pb-8 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900  dark:border-gray-800'>

      {/* Links Section */}
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3 tracking-wide">PLATFORM</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Courses</a></li>
              <li><a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Instructors</a></li>
              <li><a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Features</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3 tracking-wide">COMPANY</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3 tracking-wide">SUPPORT</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Community</a></li>
              <li><a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Status</a></li>
              <li><a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">API</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3 tracking-wide">LEGAL</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Privacy</a></li>
              <li><a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Terms</a></li>
              <li><a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Cookies</a></li>
              <li><a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">License</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 font-mono tracking-wider">
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <a href="#" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
              <Twitter className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </a>
            <a href="#" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
              <Github className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </a>
            <a href="#" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
              <Linkedin className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer