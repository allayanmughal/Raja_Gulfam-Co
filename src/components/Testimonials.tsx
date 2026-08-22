import React from 'react';
import { testimonialsData } from '../data/testimonialsData';
import { Star, Quote, MapPin } from 'lucide-react';

export const Testimonials: React.FC = () => {
  return (
    <section className="py-20 relative z-20 border-t border-black/5 dark:border-white/5 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-semibold uppercase tracking-wider">
            <Quote className="w-3.5 h-3.5" />
            <span>Client Endorsements</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight">
            Client <span className="text-amber-500">Testimonials</span>
          </h2>

          <p className="text-sm opacity-80">
            Read feedback from corporate clients across Pakistan, UK, and Dubai.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonialsData.map((t) => (
            <div
              key={t.id}
              className="p-6 rounded-3xl bg-black/5 dark:bg-navy-900 border border-black/5 dark:border-white/10 space-y-4 flex flex-col justify-between hover:border-amber-500/40 transition-all duration-300 shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-500" />
                    ))}
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-bold uppercase tracking-wider">
                    {t.tag}
                  </span>
                </div>

                <p className="text-xs italic opacity-85 leading-relaxed">
                  "{t.content}"
                </p>
              </div>

              <div className="pt-3 border-t border-black/5 dark:border-white/5 flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-amber-500"
                />
                <div>
                  <h4 className="font-bold text-xs">{t.name}</h4>
                  <p className="text-[11px] text-amber-500 font-semibold">{t.role} — {t.company}</p>
                  <p className="text-[10px] opacity-60 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-500" />
                    <span>{t.location}</span>
                  </p>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
