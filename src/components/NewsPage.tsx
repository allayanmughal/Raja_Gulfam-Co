import React from 'react';
import { ArrowLeft, Newspaper } from 'lucide-react';
import { EventsGallery } from './events/EventsGallery';

interface NewsPageProps {
  onNavigateHome: () => void;
}

export const NewsPage: React.FC<NewsPageProps> = ({ onNavigateHome }) => {
  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pt-24 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/10 rounded-full filter blur-[120px] pointer-events-none" />

      {/* Page intro bar */}
      <div className="max-w-7xl mx-auto mb-10 flex items-center justify-between gap-4 relative z-10">
        <button
          onClick={onNavigateHome}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors bg-white dark:bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Main Site</span>
        </button>
      </div>

      {/* Full news & events listing — identical card format to the homepage */}
      <div className="relative z-10">
        <EventsGallery
          showToolbar
          title={
            <>
              All News, Events &amp;{' '}
              <span className="text-blue-600 dark:text-blue-400">Compliance Alerts</span>
            </>
          }
          subtitle="The complete archive of statutory deadlines, regulatory bulletins, advisory announcements, and executive events published by Raja Gulfam & Co."
        />
      </div>

      <div className="max-w-7xl mx-auto mt-10 flex justify-center relative z-10">
        <span className="inline-flex items-center gap-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-full">
          <Newspaper className="w-3.5 h-3.5" />
          <span>Showing every published update</span>
        </span>
      </div>
    </div>
  );
};