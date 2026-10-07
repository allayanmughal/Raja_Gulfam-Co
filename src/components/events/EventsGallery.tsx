import React, { useEffect, useMemo, useState } from 'react';
import type { EventItem } from '../../types/event';
import { EventCard } from './EventCard';
import { Search, RefreshCw, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface EventsGalleryProps {
  /** Cap the number of rendered items. Omit to render every published event. */
  limit?: number;
  /** Show the search + refresh toolbar. Useful when rendering the full list. */
  showToolbar?: boolean;
  /** When provided, renders a CTA that routes to the full news page. */
  onViewAll?: () => void;
  title?: React.ReactNode;
  subtitle?: string;
}

export const EventsGallery: React.FC<EventsGalleryProps> = ({
  limit,
  showToolbar = false,
  onViewAll,
  title = (
    <>
      Official News, Events &{' '}
      <span className="text-blue-600 dark:text-blue-400">Compliance Radar</span>.
    </>
  ),
  subtitle = 'Stay ahead of FBR, SECP, and HMRC statutory deadlines, financial advisory bulletins, and executive events published directly by Raja Gulfam & Co.'
}) => {
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

  // Newest first so the homepage preview always surfaces the latest updates.
  const sortedEvents = useMemo(
    () =>
      [...events].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    [events]
  );

  const filteredEvents = sortedEvents.filter((evt) => {
    const q = searchQuery.trim().toLowerCase();
    return (
      !q ||
      evt.title.toLowerCase().includes(q) ||
      (evt.priorityDetail || '').toLowerCase().includes(q) ||
      (evt.description || '').toLowerCase().includes(q) ||
      (evt.date || '').toLowerCase().includes(q)
    );
  });

  const visibleEvents = typeof limit === 'number' ? filteredEvents.slice(0, limit) : filteredEvents;
  const hiddenCount = filteredEvents.length - visibleEvents.length;
  const showViewAll = typeof onViewAll === 'function' && filteredEvents.length > 0;

  return (
    <section className="py-20 relative z-20 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Title Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 dark:border-slate-800/80 pb-8">
          <div className="space-y-3 max-w-2xl">
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {title}
            </h2>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* Search bar & Refresh */}
          {showToolbar && (
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
          )}
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

        {/* Dynamic Responsive Events Grid — single column: the card is a wide
            image-left / description-right layout. */}
        {!loading && !error && visibleEvents.length > 0 && (
          <div className="grid grid-cols-1 gap-6">
            {visibleEvents.map((evt, index) => (
              <motion.div
                key={evt.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <EventCard event={evt} />
              </motion.div>
            ))}
          </div>
        )}

        {/* View all news & events CTA */}
        {showViewAll && !loading && !error && (
          <div className="flex flex-col items-center gap-3 pt-2 text-center">
            <button
              onClick={onViewAll}
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-blue-600/25 transition-all hover:scale-105 active:scale-95"
            >
              <span>View All News &amp; Events</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              {hiddenCount > 0
                ? `Showing ${visibleEvents.length} of ${filteredEvents.length} published updates`
                : `${filteredEvents.length} published ${filteredEvents.length === 1 ? 'update' : 'updates'} in total`}
            </p>
          </div>
        )}

      </div>
    </section>
  );
};
