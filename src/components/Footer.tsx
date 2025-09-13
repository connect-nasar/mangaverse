import React from 'react';
import { BookOpen, Mail, Github, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                MangaVerse
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Your ultimate destination for discovering and reading manga. Explore thousands of titles from various genres.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-600 dark:text-gray-400 hover:text-orange-500 text-sm">Home</a></li>
              <li><a href="/all-manga" className="text-gray-600 dark:text-gray-400 hover:text-orange-500 text-sm">All Manga</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-orange-500 text-sm">New Releases</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-orange-500 text-sm">Popular</a></li>
            </ul>
          </div>

          {/* Genres */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Popular Genres</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-orange-500 text-sm">Action</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-orange-500 text-sm">Romance</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-orange-500 text-sm">Fantasy</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-orange-500 text-sm">Slice of Life</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            © 2024 MangaVerse. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-orange-500 text-sm">Privacy Policy</a>
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-orange-500 text-sm">Terms of Service</a>
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-orange-500 text-sm">Contact Us</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;