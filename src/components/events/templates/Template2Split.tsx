import React, { useState } from 'react';
import type { EventItem } from '../../../types/event';
import { Calendar, AlertCircle, Images, ArrowUpRight } from 'lucide-react';
import { ImageModal } from '../ImageModal';

interface Props {
  event: EventItem;
}

export const Template2Split: React.FC<Props> = ({ event }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);

  const mainImage = event.images && event.images.length > 0 ? event.images[0] : 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200';

  const handleOpenModal = (idx: number) => {
    setSelectedImgIdx(idx);
    setModalOpen(true);
  };

  return (
    <div className="clean-card overflow-hidden group hover:shadow-2xl transition-all duration-300">
      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[280px]">
        
        {/* Left Column Image (5 columns) */}
        <div 
          className="md:col-span-5 relative min-h-[220px] md:min-h-full bg-slate-900 overflow-hidden cursor-pointer"
          onClick={() => handleOpenModal(0)}
        >
          <img 
            src={mainImage} 
            alt={event.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-950/40 md:to-transparent" />
          
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold border border-white/10 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-blue-400" />
            <span>{event.date}</span>
          </div>

          {event.images && event.images.length > 1 && (
            <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-slate-900/90 text-white text-[10px] font-bold flex items-center gap-1 border border-white/10">
              <Images className="w-3 h-3 text-blue-400" />
              <span>+{event.images.length - 1} More</span>
            </div>
          )}
        </div>

        {/* Right Column Content (7 columns) */}
        <div className="md:col-span-7 p-6 sm:p-7 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            
            {/* HIGH PRIORITY DETAIL (STRICTLY IN RED) */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wide">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{event.priorityDetail}</span>
            </div>

            {/* Heading */}
            <h3 className="font-heading text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {event.title}
            </h3>

            {/* Full Description */}
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Footer & Gallery Thumbnails */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
            {event.images && event.images.length > 1 ? (
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {event.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleOpenModal(idx)}
                    className="w-10 h-10 rounded-md overflow-hidden border border-slate-300 dark:border-slate-700 hover:border-blue-500 transition-all shrink-0"
                  >
                    <img src={img} alt={`thumb ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            ) : (
              <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                Statutory Update
              </span>
            )}

            <button 
              onClick={() => handleOpenModal(0)}
              className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline shrink-0"
            >
              <span>View Details</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

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
