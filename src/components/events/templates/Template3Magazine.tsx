import React, { useState } from 'react';
import type { EventItem } from '../../../types/event';
import { Newspaper, Calendar, AlertOctagon, Images } from 'lucide-react';
import { ImageModal } from '../ImageModal';

interface Props {
  event: EventItem;
}

export const Template3Magazine: React.FC<Props> = ({ event }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);

  const mainImage = event.images && event.images.length > 0 ? event.images[0] : 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1200';

  const handleOpenModal = (idx: number) => {
    setSelectedImgIdx(idx);
    setModalOpen(true);
  };

  return (
    <div className="clean-card overflow-hidden group hover:shadow-2xl transition-all duration-300 flex flex-col h-full border-t-4 border-t-blue-600 dark:border-t-blue-500">
      
      {/* Magazine Editorial Top Header Bar */}
      <div className="p-4 bg-slate-100 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest">
          <Newspaper className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>RGC News Bulletin</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400">
          <Calendar className="w-3.5 h-3.5" />
          <span>{event.date}</span>
        </div>
      </div>

      {/* Main Magazine Image */}
      <div 
        className="relative h-56 w-full overflow-hidden bg-slate-900 cursor-pointer"
        onClick={() => handleOpenModal(0)}
      >
        <img 
          src={mainImage} 
          alt={event.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-slate-950/20" />

        {event.images && event.images.length > 1 && (
          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-slate-900/90 backdrop-blur-md text-white text-[10px] font-extrabold flex items-center gap-1">
            <Images className="w-3 h-3 text-blue-400" />
            <span>{event.images.length} Photos</span>
          </div>
        )}
      </div>

      {/* Body Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          
          {/* HIGH PRIORITY DETAIL (STRICTLY IN RED) */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-extrabold uppercase tracking-wide">
            <AlertOctagon className="w-3.5 h-3.5 shrink-0" />
            <span>{event.priorityDetail}</span>
          </div>

          {/* Heading */}
          <h3 className="font-heading text-xl font-black text-slate-900 dark:text-white leading-tight hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            {event.title}
          </h3>

          {/* Description */}
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans border-l-2 border-slate-300 dark:border-slate-700 pl-3">
            {event.description}
          </p>
        </div>

        {/* Multi-image thumbnails */}
        {event.images && event.images.length > 1 && (
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto">
            {event.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => handleOpenModal(idx)}
                className="w-12 h-10 rounded overflow-hidden border border-slate-300 dark:border-slate-700 hover:border-blue-500 transition-all shrink-0"
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
