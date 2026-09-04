import React, { useState } from 'react';
import { ChevronDown, Menu, X, HelpCircle, Users, Sun, Moon } from 'lucide-react';
import type { Region } from '../types';
import { useTheme } from '../context/ThemeContext';
import type { PageView } from '../types';

interface HeaderProps {
  onOpenBooking: () => void;
  selectedRegion?: Region;
  onSelectRegion?: (region: Region) => void;
  onNavigate: (page: PageView) => void;
  currentPage: PageView;
  onScrollToServices?: () => void;
  onScrollToNews?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenBooking,
  onNavigate,
  currentPage,
  onScrollToServices,
  onScrollToNews
}) => {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactDropdownOpen, setContactDropdownOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);

  const handleServicesClick = () => {
    if (onScrollToServices) {
      onScrollToServices();
    } else {
      if (currentPage !== 'home') {
        onNavigate('home');
        setTimeout(() => {
          const el = document.getElementById('services');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const el = document.getElementById('services');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleNewsClick = () => {
    if (onScrollToNews) {
      onScrollToNews();
    } else {
      if (currentPage !== 'home') {
        onNavigate('home');
        setTimeout(() => {
          const el = document.getElementById('news') || document.getElementById('insights') || document.getElementById('calculator');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const el = document.getElementById('news') || document.getElementById('insights') || document.getElementById('calculator');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 py-2.5 px-4 sm:px-8 transition-all duration-300">
      
      {/* Floating Centered Pill Navbar */}
      <div className="max-w-7xl mx-auto rounded-2xl md:rounded-full px-6 py-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800/80 shadow-xl dark:shadow-2xl flex items-center justify-between transition-colors">
        
        {/* CG Logo Icon */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 shrink-0 text-left focus:outline-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-600 dark:from-white dark:via-slate-100 dark:to-blue-500 flex items-center justify-center font-heading font-extrabold text-white dark:text-slate-950 text-base shadow-sm border border-slate-700 dark:border-white/20">
            <span className="text-white dark:text-slate-950">C</span>
            <span className="text-blue-400 dark:text-blue-600 -ml-0.5">G</span>
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="font-heading text-base font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              RGC <span className="text-blue-600 dark:text-blue-400">Accountants</span>
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              Raja Gulfam & Co.
            </span>
          </div>
        </button>

        {/* Center Nav Links */}
        <div className="hidden lg:flex items-center space-x-10 text-sm font-medium text-slate-700 dark:text-slate-200">
          <button
            onClick={() => onNavigate('home')}
            className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${currentPage === 'home' ? 'text-blue-600 dark:text-blue-400 font-bold' : ''}`}
          >
            Home
          </button>
          
          <button
            onClick={handleNewsClick}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            News And Insights
          </button>

          <button
            onClick={handleServicesClick}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Our Services
          </button>

          {/* Contact Us Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setContactDropdownOpen(true)}
            onMouseLeave={() => setContactDropdownOpen(false)}
          >
            <button className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1">
              <span>Contact Us</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${contactDropdownOpen ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''}`} />
            </button>

            {contactDropdownOpen && (
              <div className="absolute top-full left-0 w-64 pt-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 shadow-2xl space-y-1 text-xs text-slate-900 dark:text-white">
                  
                  {/* FAQs Dropdown Option */}
                  <button
                    onClick={() => {
                      setContactDropdownOpen(false);
                      onNavigate('faqs');
                    }}
                    className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-white transition-colors text-left group"
                  >
                    <HelpCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 group-hover:scale-110 transition-transform" />
                    <div>
                      <p className="font-bold text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300">FAQs</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">Questions & Knowledge Base</p>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* About Us Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setAboutDropdownOpen(true)}
            onMouseLeave={() => setAboutDropdownOpen(false)}
          >
            <button
              onClick={() => onNavigate('team')}
              className={`flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1 ${currentPage === 'team' ? 'text-blue-600 dark:text-blue-400 font-bold' : ''}`}
            >
              <span>About Us</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${aboutDropdownOpen ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''}`} />
            </button>

            {aboutDropdownOpen && (
              <div className="absolute top-full left-0 w-64 pt-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 shadow-2xl space-y-1 text-xs text-slate-900 dark:text-white">
                  
                  {/* Team Members Dropdown Option */}
                  <button
                    onClick={() => {
                      setAboutDropdownOpen(false);
                      onNavigate('team');
                    }}
                    className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-white transition-colors text-left group"
                  >
                    <Users className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 group-hover:scale-110 transition-transform" />
                    <div>
                      <p className="font-bold text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300">Team Members</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">Our Leadership & Experts</p>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Actions: Theme Toggle + Consultation CTA */}
        <div className="hidden sm:flex items-center space-x-4 shrink-0">
          
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Light and Dark Theme"
            className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700 shadow-xs"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Consultation CTA Button */}
          <button
            onClick={onOpenBooking}
            className="px-6 py-2.5 rounded-full bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-blue-600 font-bold text-xs shadow-md transition-all hover:scale-105 active:scale-95"
          >
            Get Consultation
          </button>
        </div>

        {/* Mobile Toggle & Theme Toggle */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          <button
            onClick={onOpenBooking}
            className="px-3.5 py-1.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-blue-600 font-bold text-xs"
          >
            Get Consultation
          </button>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-900 dark:text-white">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-2xl p-6 space-y-4 mt-3 max-w-7xl mx-auto shadow-2xl">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onNavigate('home');
            }}
            className="block w-full text-left text-sm font-semibold border-b border-slate-100 dark:border-white/5 pb-2 hover:text-blue-600 dark:hover:text-blue-400"
          >
            Home
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onNavigate('faqs');
            }}
            className="block w-full text-left text-sm font-semibold border-b border-slate-100 dark:border-white/5 pb-2 text-blue-600 dark:text-blue-400 flex items-center gap-2"
          >
            <HelpCircle className="w-4 h-4" />
            <span>FAQs</span>
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onNavigate('team');
            }}
            className="block w-full text-left text-sm font-semibold border-b border-slate-100 dark:border-white/5 pb-2 text-blue-600 dark:text-blue-400 flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            <span>Team Members</span>
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              handleNewsClick();
            }}
            className="block w-full text-left text-sm font-semibold border-b border-slate-100 dark:border-white/5 pb-2 hover:text-blue-600 dark:hover:text-blue-400"
          >
            News And Insights
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              handleServicesClick();
            }}
            className="block w-full text-left text-sm font-semibold border-b border-slate-100 dark:border-white/5 pb-2 hover:text-blue-600 dark:hover:text-blue-400"
          >
            Our Services
          </button>

          <div className="pt-2 flex justify-between items-center border-t border-slate-100 dark:border-white/10">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="px-5 py-2.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-blue-600 font-bold text-xs"
            >
              Get Consultation
            </button>
          </div>
        </div>
      )}

    </header>
  );
};
