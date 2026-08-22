import React from 'react';
import { ArrowUp } from 'lucide-react';

interface FooterProps {
  onOpenBooking: () => void;
  onNavigate: (page: 'home' | 'faqs' | 'team') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-12 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('home')}
            className="w-8 h-8 rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-600 dark:from-white dark:via-slate-100 dark:to-blue-500 flex items-center justify-center font-heading font-extrabold text-white dark:text-slate-950 text-xs shadow-xs"
          >
            CG
          </button>
          <div>
            <span className="font-heading font-bold text-sm text-slate-900 dark:text-white">RGC Accountants</span>
            <p className="text-[11px] text-slate-500 dark:text-slate-500">© {new Date().getFullYear()} Raja Gulfam & Co. All Rights Reserved.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-slate-700 dark:text-slate-300">
          <button onClick={() => onNavigate('home')} className="hover:text-blue-600 dark:hover:text-blue-400">Home</button>
          <button onClick={() => onNavigate('faqs')} className="hover:text-blue-600 dark:hover:text-blue-400 text-blue-600 dark:text-blue-400 font-semibold">FAQs</button>
          <button onClick={() => onNavigate('team')} className="hover:text-blue-600 dark:hover:text-blue-400 text-blue-600 dark:text-blue-400 font-semibold">Team Members</button>
          <button onClick={() => onNavigate('home')} className="hover:text-blue-600 dark:hover:text-blue-400">Services</button>
          <button onClick={() => onNavigate('home')} className="hover:text-blue-600 dark:hover:text-blue-400">Tax Estimator</button>
          
          <button
            onClick={scrollToTop}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

      </div>
    </footer>
  );
};
