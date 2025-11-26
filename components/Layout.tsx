import React, { useState } from 'react';
import { NAV_LINKS } from '../constants';
import { Button } from './UIComponents';

interface LayoutProps {
  children: React.ReactNode;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  onOpenAI: () => void;
  currentPath: string;
  navigate: (path: string) => void;
  userLevel: number;
}

export const Layout: React.FC<LayoutProps> = ({ children, theme, toggleTheme, onOpenAI, currentPath, navigate, userLevel }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-md border-b border-gray-200 dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center cursor-pointer" onClick={() => navigate('#/')}>
              <div className="h-8 w-8 bg-brand-600 rounded-lg flex items-center justify-center mr-2">
                <span className="text-white font-bold">B</span>
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                BrainQuest
              </span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              {NAV_LINKS.map(link => (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className={`text-sm font-medium transition-colors ${
                    currentPath === link.path.replace('#', '') 
                    ? 'text-brand-600 dark:text-brand-500' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
               <div className="hidden sm:flex flex-col items-end mr-2">
                 <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">LEVEL {userLevel}</span>
                 <div className="w-20 h-1 bg-gray-200 rounded-full overflow-hidden">
                   <div className="h-full bg-brand-500 w-3/4"></div>
                 </div>
               </div>
              <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-surface transition-colors">
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
              <Button onClick={onOpenAI} className="hidden sm:flex items-center gap-2 !px-4 !py-2">
                <span>🤖</span> AI Codey
              </Button>
               <button className="md:hidden p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                ☰
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-dark-surface border-b border-gray-200 dark:border-dark-border">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {NAV_LINKS.map(link => (
              <button
                key={link.path}
                onClick={() => { navigate(link.path); setIsMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-bg"
              >
                {link.label}
              </button>
            ))}
             <button onClick={() => { navigate('#/settings'); setIsMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-bg">Settings</button>
             <button onClick={onOpenAI} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-brand-600">
               Chat with Codey
             </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
           <div>
             <h4 className="font-bold mb-4 dark:text-white">BrainQuest</h4>
             <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
               <li><button onClick={() => navigate('#/about')}>About</button></li>
               <li><button onClick={() => navigate('#/agent')}>Meet Codey</button></li>
               <li><button onClick={() => navigate('#/gallery')}>Gallery</button></li>
             </ul>
           </div>
           <div>
             <h4 className="font-bold mb-4 dark:text-white">Support</h4>
             <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
               <li><button onClick={() => navigate('#/help')}>Help Center</button></li>
               <li><button onClick={() => navigate('#/contact')}>Contact Us</button></li>
               <li><button onClick={() => navigate('#/feedback')}>Feedback</button></li>
             </ul>
           </div>
           <div>
             <h4 className="font-bold mb-4 dark:text-white">Legal</h4>
             <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
               <li><button onClick={() => navigate('#/privacy')}>Privacy</button></li>
               <li><button onClick={() => navigate('#/terms')}>Terms</button></li>
             </ul>
           </div>
           <div>
              <h4 className="font-bold mb-4 dark:text-white">Connect</h4>
              <div className="flex space-x-4">
                 <span className="text-2xl cursor-pointer hover:opacity-80">🐦</span>
                 <span className="text-2xl cursor-pointer hover:opacity-80">📸</span>
                 <span className="text-2xl cursor-pointer hover:opacity-80">💬</span>
              </div>
           </div>
        </div>
        <div className="text-center text-sm text-gray-500 dark:text-gray-600 mt-12">
          <p>© 2024 BrainQuest Universe. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
