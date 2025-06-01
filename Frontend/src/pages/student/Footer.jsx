import { Button } from '@/components/ui/button'
import { ArrowUpRight, Mail, Twitter, Github, Linkedin } from 'lucide-react'

const Footer = () => {
  return (
    <footer className='relative pt-16 pb-8 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800'>
      
      {/* Newsletter Section */}
      <div className='relative max-w-3xl mx-auto text-center mb-12'>
        <div className="inline-flex items-center px-3 py-1.5 mb-6 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-200 text-xs font-mono tracking-wider">
          <Mail className="mr-2 h-3 w-3" />
          STAY UPDATED
        </div>

        <h2 className='text-xl sm:text-2xl md:text-3xl font-medium tracking-tight text-gray-900 dark:text-white mb-4 leading-tight'>
          Get the latest in <br className="sm:hidden" />
          <span className="text-gray-600 dark:text-gray-400">AI education</span>
        </h2>

        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-lg mx-auto leading-relaxed mb-6">
          Weekly insights on adaptive learning and educational technology.
        </p>

        <div className='flex flex-col sm:flex-row justify-center gap-3 max-w-sm mx-auto'>
          <input 
            type="email" 
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-200"
          />
          <Button className="group px-4 py-3 text-sm font-medium rounded-lg bg-gray-900 hover:bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-white transition-all">
            <span>Subscribe</span>
            <ArrowUpRight className="ml-2 h-4 w-4 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Button>
        </div>
      </div>

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
              © 2025 AI EDUCATION PLATFORM
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