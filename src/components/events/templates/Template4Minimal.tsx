import React, { useState } from 'react';
import type { EventItem } from '../../../types/event';
import { Calendar, AlertCircle, Images } from 'lucide-react';
import { ImageModal } from '../ImageModal';

interface Props {
  event: EventItem;
}

export const Template4Minimal: React.FC<Props> = ({ event }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);

  const mainImage = event.images && event.images.length > 0 ? event.images[0] : 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200';

  const handleOpenModal = (idx: number) => {
    setSelectedImgIdx(idx);
    setModalOpen(true);
  };

  return (
    <div className="clean-card p-6 sm:p-7 group hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/90 rounded-3xl">
      <div className="space-y-4">
        
        {/* Top Header: Date & Small Image Thumbnail */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700">
            <Calendar className="w-3.5 h-3.5 text-blue-500" />
            <span>{event.date}</span>
          </div>

          <div 
            className="relative w-14 h-14 rounded-2xl overflow-hidden bg-slate-800 shrink-0 cursor-pointer border border-slate-200 dark:border-slate-700 group-hover:scale-105 transition-transform"
            onClick={() => handleOpenModal(0)}
          >
            <img src={mainImage} alt={event.title} className="w-full h-full object-cover" />
            {event.images && event.images.length > 1 && (
              <div className="absolute inset-0 bg-slate-950/50 flex items-center justify-center text-white text-[10px] font-bold">
                +{event.images.length - 1}
              </div>
            )}
          </div>
        </div>

        {/* HIGH PRIORITY DETAIL (STRICTLY IN RED) */}
        <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs font-black uppercase tracking-wide">
          <div className="w-2 h-2 rounded-full bg-rose-600 dark:bg-rose-400 animate-pulse" />
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{event.priorityDetail}</span>
        </div>

        {/* Title */}
        <h3 className="font-heading text-lg font-extrabold text-slate-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {event.title}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans line-clamp-3">
          {event.description}
        </p>
      </div>

      {/* Multi-image thumbnail bar */}
      {event.images && event.images.length > 1 && (
        <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <Images className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {event.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => handleOpenModal(idx)}
                className="w-8 h-8 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-all shrink-0"
              >
                <img src={img} alt={`thumb ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      <ImageModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        images={event.images}
        initialIndex={selectedImgIdx}
        title={event.title}
      />
    </div>
  );
};
