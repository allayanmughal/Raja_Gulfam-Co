import React, { useState } from 'react';
import type { EventItem } from '../../types/event';
import { Calendar, AlertTriangle, Images, ArrowRight, Maximize2 } from 'lucide-react';
import { EventDetailModal } from './EventDetailModal';

interface Props {
  event: EventItem;
}

export const GenericEventCard: React.FC<Props> = ({ event }) => {
  const [detailOpen, setDetailOpen] = useState(false);
  const images = Array.isArray(event.images) ? event.images.filter(Boolean) : [];
  const mainImage = images[0];

  return (
    <>
      <article
        onClick={() => setDetailOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setDetailOpen(true);
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={`View full details for ${event.title}`}
        className="group cursor-pointer overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/70 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60"
      >
        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* LEFT — image */}
          <div className="md:col-span-5 relative overflow-hidden bg-slate-900 min-h-[220px] md:min-h-[300px]">
            {mainImage ? (
              <img
                src={mainImage}
                alt={event.title}
                className="w-full h-full absolute inset-0 object-cover group-hover:scale-110 transition-transform duration-700"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-blue-600 via-blue-700 to-slate-900">
                <Calendar className="w-10 h-10 text-white/40" />
                <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/50">
                  RGC Accountants
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent md:bg-gradient-to-r md:from-transparent md:to-slate-950/30" />

            <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/85 backdrop-blur-md text-white text-[11px] font-bold border border-white/15">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              {event.date}
            </div>

            <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-slate-900/85 backdrop-blur-md text-white text-[10px] font-extrabold uppercase tracking-wider border border-white/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Maximize2 className="w-3 h-3 text-blue-400" />
              Expand
            </div>

            {images.length > 1 && (
              <div className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900/85 backdrop-blur-md text-white text-[10px] font-bold border border-white/15">
                <Images className="w-3 h-3 text-blue-400" />
                {images.length} photos
              </div>
            )}
          </div>

          {/* RIGHT — description */}
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col gap-4">
            <div className="inline-flex items-start gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-[11px] font-extrabold uppercase tracking-wide self-start">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{event.priorityDetail}</span>
            </div>

            <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {event.title}
            </h3>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-4">
              {event.description}
            </p>

            <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400">
                Read Full Details
              </span>
              <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </div>
        </div>
      </article>

      <EventDetailModal event={event} isOpen={detailOpen} onClose={() => setDetailOpen(false)} />
    </>
  );
};
