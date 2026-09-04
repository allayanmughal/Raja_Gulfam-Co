import React, { useState } from 'react';
import type { EventItem } from '../../../types/event';
import { Calendar, AlertTriangle, Images } from 'lucide-react';
import { ImageModal } from '../ImageModal';

interface Props {
  event: EventItem;
}

export const Template1Feature: React.FC<Props> = ({ event }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);

  const mainImage = event.images && event.images.length > 0 ? event.images[0] : 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=1200';

  const handleOpenModal = (idx: number) => {
    setSelectedImgIdx(idx);
    setModalOpen(true);
  };

  return (
    <div className="clean-card overflow-hidden group hover:shadow-2xl transition-all duration-300 flex flex-col h-full">
      {/* Large Featured Image */}
      <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-900 shrink-0 cursor-pointer" onClick={() => handleOpenModal(0)}>
        <img 
          src={mainImage} 
          alt={event.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
        
        {/* Date Badge Pill */}
        <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-slate-900/90 backdrop-blur-md text-white text-xs font-bold border border-white/10 flex items-center gap-1.5 shadow-md">
          <Calendar className="w-3.5 h-3.5 text-blue-400" />
          <span>{event.date}</span>
        </div>

        {/* Template Badge */}
        <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-blue-600/90 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
          Featured
        </div>

        {/* Multiple images indicator */}
        {event.images && event.images.length > 1 && (
          <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-slate-900/90 backdrop-blur-md text-slate-200 text-xs font-semibold border border-white/10 flex items-center gap-1.5">
            <Images className="w-3.5 h-3.5 text-blue-400" />
            <span>+{event.images.length - 1} photos</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-5">
        <div className="space-y-4">
          
          {/* HIGH PRIORITY DETAIL (STRICTLY IN RED) */}
          <div className="inline-flex items-start gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-extrabold leading-snug w-full">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="uppercase tracking-wide">{event.priorityDetail}</span>
          </div>

          {/* Heading */}
          <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            {event.title}
          </h3>

          {/* Full Description */}
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
            {event.description}
          </p>
        </div>

        {/* Multi-image thumbnail gallery strip */}
        {event.images && event.images.length > 1 && (
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto">
            {event.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => handleOpenModal(idx)}
                className="w-14 h-12 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700 hover:border-blue-500 transition-all shrink-0 hover:scale-105"
              >
                <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Modal for Images */}
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
