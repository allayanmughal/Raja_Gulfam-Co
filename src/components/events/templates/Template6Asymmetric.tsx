import React, { useState } from 'react';
import type { EventItem } from '../../../types/event';
import { Calendar, AlertCircle, Sparkles, Images } from 'lucide-react';
import { ImageModal } from '../ImageModal';

interface Props {
  event: EventItem;
}

export const Template6Asymmetric: React.FC<Props> = ({ event }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);

  const mainImage = event.images && event.images.length > 0 ? event.images[0] : 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&q=80&w=1200';

  const handleOpenModal = (idx: number) => {
    setSelectedImgIdx(idx);
    setModalOpen(true);
  };

  return (
    <div className="clean-card overflow-hidden group hover:shadow-2xl transition-all duration-300 relative border-l-4 border-l-gold-500 flex flex-col h-full">
      
      {/* Asymmetric Header Layout */}
      <div className="p-6 sm:p-7 space-y-5 flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          
          {/* Top Metadata Row */}
          <div className="flex items-center justify-between gap-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gold-500/10 border border-gold-500/30 text-gold-600 dark:text-gold-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Special Advisory</span>
            </div>

            <div className="flex items-center gap-1 text-xs font-bold text-slate-500 dark:text-slate-400">
              <Calendar className="w-3.5 h-3.5 text-blue-500" />
              <span>{event.date}</span>
            </div>
          </div>

          {/* Asymmetric Image Box */}
          <div 
            className="relative h-52 w-full rounded-2xl overflow-hidden bg-slate-900 shadow-md cursor-pointer border border-slate-200 dark:border-slate-800"
            onClick={() => handleOpenModal(0)}
          >
            <img 
              src={mainImage} 
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            />
            <div className="absolute inset-0 bg-slate-950/20" />
            
            {event.images && event.images.length > 1 && (
              <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-slate-900/90 backdrop-blur-md text-white text-[10px] font-extrabold flex items-center gap-1">
                <Images className="w-3 h-3 text-gold-400" />
                <span>+{event.images.length - 1} photos</span>
              </div>
            )}
          </div>

          {/* HIGH PRIORITY DETAIL (STRICTLY IN RED) */}
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-black leading-snug flex items-start gap-2 shadow-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{event.priorityDetail}</span>
          </div>

          {/* Heading */}
          <h3 className="font-heading text-xl font-extrabold text-slate-900 dark:text-white leading-tight group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors">
            {event.title}
          </h3>

          {/* Description */}
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
            {event.description}
          </p>
        </div>

        {/* Thumbnail Strip */}
        {event.images && event.images.length > 1 && (
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto">
            {event.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => handleOpenModal(idx)}
                className="w-12 h-10 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700 hover:border-gold-500 transition-all shrink-0"
              >
                <img src={img} alt={`thumb ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
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
