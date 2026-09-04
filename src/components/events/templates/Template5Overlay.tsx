import React, { useState } from 'react';
import type { EventItem } from '../../../types/event';
import { Calendar, AlertCircle, Images, Maximize2 } from 'lucide-react';
import { ImageModal } from '../ImageModal';

interface Props {
  event: EventItem;
}

export const Template5Overlay: React.FC<Props> = ({ event }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);

  const mainImage = event.images && event.images.length > 0 ? event.images[0] : 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200';

  const handleOpenModal = (idx: number) => {
    setSelectedImgIdx(idx);
    setModalOpen(true);
  };

  return (
    <div className="relative rounded-3xl overflow-hidden group hover:shadow-2xl transition-all duration-500 min-h-[380px] sm:min-h-[420px] flex flex-col justify-end border border-slate-700/50">
      
      {/* Cover Background Image */}
      <img 
        src={mainImage} 
        alt={event.title}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
      />
      
      {/* Dark Multi-layer Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/20 group-hover:via-slate-950/90 transition-colors duration-500" />

      {/* Top Header Controls */}
      <div className="relative z-10 p-5 flex items-center justify-between">
        <div className="px-3.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold border border-white/20 flex items-center gap-1.5 shadow-md">
          <Calendar className="w-3.5 h-3.5 text-blue-400" />
          <span>{event.date}</span>
        </div>

        <button
          onClick={() => handleOpenModal(0)}
          className="p-2 rounded-full bg-slate-900/70 hover:bg-blue-600 text-white backdrop-blur-md transition-colors border border-white/20"
          title="View full image"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Content Stack Over Overlay */}
      <div className="relative z-10 p-6 sm:p-8 space-y-4">
        
        {/* HIGH PRIORITY DETAIL (STRICTLY IN RED) */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600/90 backdrop-blur-md text-white text-xs font-black uppercase tracking-wider shadow-lg border border-rose-400/40">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{event.priorityDetail}</span>
        </div>

        {/* Heading */}
        <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-white leading-snug drop-shadow-md">
          {event.title}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans line-clamp-3">
          {event.description}
        </p>

        {/* Gallery thumbnails */}
        {event.images && event.images.length > 1 && (
          <div className="pt-3 border-t border-white/10 flex items-center gap-2 overflow-x-auto">
            <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider flex items-center gap-1">
              <Images className="w-3 h-3 text-blue-400" /> Gallery
            </span>
            {event.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => handleOpenModal(idx)}
                className="w-10 h-10 rounded-lg overflow-hidden border border-white/30 hover:border-blue-400 transition-all shrink-0"
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
