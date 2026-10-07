import React, { useEffect, useState } from 'react';
import type { EventItem } from '../../types/event';
import { X, ChevronLeft, ChevronRight, Images, Calendar, AlertTriangle, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  event: EventItem;
  isOpen: boolean;
  onClose: () => void;
}

export const EventDetailModal: React.FC<Props> = ({ event, isOpen, onClose }) => {
  const images = Array.isArray(event.images) ? event.images.filter(Boolean) : [];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (isOpen) setIndex(0);
  }, [isOpen, event.id]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (images.length === 0) return;
      if (e.key === 'ArrowLeft') setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
      if (e.key === 'ArrowRight') setIndex((i) => (i === images.length - 1 ? 0 : i + 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, images.length, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-6xl my-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 min-w-0">
                <Maximize2 className="w-4 h-4 text-blue-500 shrink-0" />
                <span className="truncate">Expanded View</span>
                {images.length > 1 && (
                  <span className="shrink-0 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">
                    {index + 1} of {images.length}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* LEFT — expanded image */}
              <div className="lg:col-span-7 relative bg-slate-950 flex items-center justify-center min-h-[260px] lg:min-h-[520px]">
                {images.length > 0 ? (
                  <img
                    src={images[index]}
                    alt={`${event.title} — image ${index + 1}`}
                    className="w-full h-full max-h-[60vh] object-contain"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-blue-600 via-blue-700 to-slate-900">
                    <Calendar className="w-12 h-12 text-white/40" />
                    <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/50">
                      RGC Accountants
                    </span>
                    <span className="text-[11px] text-white/40">No image attached</span>
                  </div>
                )}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setIndex((i) => (i === 0 ? images.length - 1 : i - 1))}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-900/80 hover:bg-blue-600 text-white transition-all"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setIndex((i) => (i === images.length - 1 ? 0 : i + 1))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-900/80 hover:bg-blue-600 text-white transition-all"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* RIGHT — expanded description + details */}
              <div className="lg:col-span-5 p-6 sm:p-8 space-y-5 flex flex-col">
                <div className="inline-flex items-start gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-extrabold uppercase tracking-wide self-start">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{event.priorityDetail}</span>
                </div>

                <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                  {event.title}
                </h2>

                <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 font-bold text-blue-700 dark:text-blue-400">
                    <Calendar className="w-3 h-3" />
                    {event.date}
                  </span>
                  {images.length > 1 && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold">
                      <Images className="w-3 h-3" />
                      {images.length} photos
                    </span>
                  )}
                  {event.published && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 font-bold text-blue-700 dark:text-blue-400">
                      Published
                    </span>
                  )}
                </div>

                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {event.description}
                </p>

                {images.length > 1 && (
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto">
                    {images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setIndex(i)}
                        className={`w-14 h-12 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                          i === index ? 'border-blue-500 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt={`thumb ${i + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
