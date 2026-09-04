import React, { useEffect, useState } from 'react';
import type { EventItem } from '../../types/event';
import { EventCard } from './EventCard';
import { Newspaper, Search, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const EventsGallery: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/events');
      if (!res.ok) throw new Error('Failed to load events');
      const data = await res.json();
      if (data.success) {
        setEvents(data.events || []);
      } else {
        throw new Error(data.error || 'Could not fetch events');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Unable to connect to events API');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const filteredEvents = events.filter((evt) => {
    const q = searchQuery.toLowerCase();
    return (
      evt.title.toLowerCase().includes(q) ||
      evt.priorityDetail.toLowerCase().includes(q) ||
      evt.description.toLowerCase().includes(q) ||
      evt.date.includes(q)
    );
  });

  return (
    <section className="py-20 relative z-20 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Title Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 dark:border-slate-800/80 pb-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
              <Newspaper className="w-3.5 h-3.5" />
              <span>Live Updates & Statutory Alerts</span>
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Official News, Events & <span className="text-blue-600 dark:text-blue-400">Compliance Radar</span>.
            </h2>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Stay ahead of FBR, SECP, and HMRC statutory deadlines, financial advisory bulletins, and executive events published directly by Raja Gulfam & Co.
            </p>
          </div>

          {/* Search bar & Refresh */}
          <div className="flex items-center gap-3">
            <div className="relative min-w-[240px] sm:min-w-[280px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search news & events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-all shadow-xs"
              />
            </div>

            <button
              onClick={fetchEvents}
              className="p-2.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500 transition-all shadow-xs"
              title="Refresh events"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-16 text-center space-y-4">
            <div className="w-12 h-12 rounded-full border-4 border-blue-500/20 border-t-blue-600 animate-spin mx-auto" />
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              Fetching live news & event gallery...
            </p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="p-6 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-rose-600 dark:text-rose-400 mx-auto" />
            <p className="text-sm font-bold text-rose-800 dark:text-rose-200">{error}</p>
            <button
              onClick={fetchEvents}
              className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-500 transition-colors shadow-sm"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredEvents.length === 0 && (
          <div className="py-16 text-center space-y-3 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
            <Sparkles className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="font-heading text-lg font-bold text-slate-800 dark:text-slate-200">
              No matching events found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              {searchQuery ? `No updates found matching "${searchQuery}". Try clearing your search term.` : 'No published events currently available. Check back soon!'}
            </p>
          </div>
        )}

        {/* Dynamic Responsive Events Grid */}
        {!loading && !error && filteredEvents.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((evt, index) => (
              <motion.div
                key={evt.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={evt.template === 'template1' || evt.template === 'template5' ? 'md:col-span-2 lg:col-span-2' : ''}
              >
                <EventCard event={evt} />
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
