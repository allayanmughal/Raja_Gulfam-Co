import React, { useState, useEffect, useRef } from 'react';
import { servicesData } from '../data/servicesData';
import type { ServiceItem, Region } from '../types';
import { ServiceModal } from './ServiceModal';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Scale,
  Calculator,
  Building2,
  Search,
  Database,
  CheckCircle2,
  Sparkles,
  FileCheck
} from 'lucide-react';
import { motion } from 'framer-motion';

interface ServicesGridProps {
  onOpenBookingWithService: (serviceTitle: string) => void;
  selectedRegion: Region;
}

interface CardDesignTheme {
  bgLight: string;
  bgDark: string;
  badgeBgLight: string;
  badgeTextLight: string;
  badgeBgDark: string;
  badgeTextDark: string;
  accentColor: string;
}

const getThemeForCategory = (category: string): CardDesignTheme => {
  switch (category) {
    case 'Audit':
      return {
        bgLight: 'bg-[#EBF3FC]',
        bgDark: 'dark:bg-slate-900/90 dark:border-blue-900/40',
        badgeBgLight: 'bg-blue-600/10 text-blue-700',
        badgeTextLight: 'text-blue-700',
        badgeBgDark: 'dark:bg-blue-950/60 dark:text-blue-400',
        badgeTextDark: 'dark:text-blue-400',
        accentColor: 'blue-600'
      };
    case 'Taxation':
      return {
        bgLight: 'bg-[#FFF8EB]',
        bgDark: 'dark:bg-slate-900/90 dark:border-amber-900/40',
        badgeBgLight: 'bg-amber-600/10 text-amber-700',
        badgeTextLight: 'text-amber-700',
        badgeBgDark: 'dark:bg-amber-950/60 dark:text-amber-400',
        badgeTextDark: 'dark:text-amber-400',
        accentColor: 'amber-600'
      };
    case 'Legal':
      return {
        bgLight: 'bg-[#FDF2F0]',
        bgDark: 'dark:bg-slate-900/90 dark:border-rose-900/40',
        badgeBgLight: 'bg-rose-600/10 text-rose-700',
        badgeTextLight: 'text-rose-700',
        badgeBgDark: 'dark:bg-rose-950/60 dark:text-rose-400',
        badgeTextDark: 'dark:text-rose-400',
        accentColor: 'rose-600'
      };
    case 'Forensic':
      return {
        bgLight: 'bg-[#F4EFFB]',
        bgDark: 'dark:bg-slate-900/90 dark:border-purple-900/40',
        badgeBgLight: 'bg-purple-600/10 text-purple-700',
        badgeTextLight: 'text-purple-700',
        badgeBgDark: 'dark:bg-purple-950/60 dark:text-purple-400',
        badgeTextDark: 'dark:text-purple-400',
        accentColor: 'purple-600'
      };
    case 'Accounting':
      return {
        bgLight: 'bg-[#ECF7F2]',
        bgDark: 'dark:bg-slate-900/90 dark:border-emerald-900/40',
        badgeBgLight: 'bg-emerald-600/10 text-emerald-700',
        badgeTextLight: 'text-emerald-700',
        badgeBgDark: 'dark:bg-emerald-950/60 dark:text-emerald-400',
        badgeTextDark: 'dark:text-emerald-400',
        accentColor: 'emerald-600'
      };
    default:
      return {
        bgLight: 'bg-[#FAF6EE]',
        bgDark: 'dark:bg-slate-900/90 dark:border-slate-800',
        badgeBgLight: 'bg-slate-900/10 text-slate-800',
        badgeTextLight: 'text-slate-800',
        badgeBgDark: 'dark:bg-slate-800 dark:text-slate-200',
        badgeTextDark: 'dark:text-slate-200',
        accentColor: 'slate-800'
      };
  }
};

export const ServicesGrid: React.FC<ServicesGridProps> = ({
  onOpenBookingWithService,
  selectedRegion,
}) => {
  const [selectedServiceModal, setSelectedServiceModal] = useState<ServiceItem | null>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const featuredServices = servicesData.filter((s) =>
    selectedRegion === 'GLOBAL' || s.jurisdictions.includes(selectedRegion)
  );

  // Duplicated list for infinite seamless loop scrolling
  const displayServices = [...featuredServices, ...featuredServices];

  // Continuous unidirectional auto-sliding logic (stops ONLY when click-and-holding)
  useEffect(() => {
    let animationFrameId: number;

    const animateScroll = () => {
      if (!isMouseDown && scrollRef.current) {
        scrollRef.current.scrollLeft += 1.2; // Continuous 1-direction movement

        // Infinite loop reset when reaching halfway
        if (scrollRef.current.scrollLeft >= scrollRef.current.scrollWidth / 2) {
          scrollRef.current.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(animateScroll);
    };

    animationFrameId = requestAnimationFrame(animateScroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isMouseDown]);

  const handlePrev = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -380, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 380, behavior: 'smooth' });
    }
  };

  return (
    <section id="services" className="py-24 relative z-20 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header with Navigation Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="text-left space-y-3 max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-extrabold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Practice Divisions</span>
            </div>
            
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
              Our Core Accounting & Legal Practice Areas
            </h2>
            
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              Comprehensive financial management, statutory audit compliance, and corporate legal representation across Pakistan, UK, US, and Gulf regulatory frameworks.
            </p>
          </motion.div>

          {/* Controls & Hold Notice */}
          <div className="flex items-center gap-4 shrink-0">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 hidden sm:inline-block">
              💡 Click & Hold slide bar to pause
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                aria-label="Previous service card"
                className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white hover:border-blue-600 dark:hover:bg-blue-600 dark:hover:text-white transition-all shadow-xs"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={handleNext}
                aria-label="Next service card"
                className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white hover:border-blue-600 dark:hover:bg-blue-600 dark:hover:text-white transition-all shadow-xs"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Unidirectional Auto-Sliding Container (Pauses ONLY on Click & Hold) */}
        <div
          onMouseDown={() => setIsMouseDown(true)}
          onMouseUp={() => setIsMouseDown(false)}
          onMouseLeave={() => setIsMouseDown(false)}
          onTouchStart={() => setIsMouseDown(true)}
          onTouchEnd={() => setIsMouseDown(false)}
          className="relative overflow-hidden pt-2 pb-4 cursor-grab active:cursor-grabbing select-none"
        >
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-none scroll-smooth pb-4 pt-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {displayServices.map((service, idx) => {
              const theme = getThemeForCategory(service.category);

              return (
                <div
                  key={`${service.id}-${idx}`}
                  className="w-[320px] sm:w-[360px] md:w-[380px] shrink-0"
                >
                  <div
                    className={`h-full p-6 sm:p-7 rounded-[32px] ${theme.bgLight} ${theme.bgDark} border border-black/5 dark:border-slate-800 flex flex-col justify-between hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 group relative overflow-hidden`}
                  >
                    <div className="space-y-5">

                      {/* Header Row: Category Badge & Jurisdictions Pill */}
                      <div className="flex items-center justify-between gap-2">
                        <span className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${theme.badgeBgLight} ${theme.badgeBgDark}`}>
                          {service.category === 'Audit' && 'STATUTORY AUDIT'}
                          {service.category === 'Taxation' && 'TAXATION & FBR'}
                          {service.category === 'Legal' && 'LEGAL ADVISORY'}
                          {service.category === 'Advisory' && 'SECP CORPORATE'}
                          {service.category === 'Forensic' && 'FORENSIC AUDIT'}
                          {service.category === 'Accounting' && 'CLOUD BOOKKEEPING'}
                        </span>

                        <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-white/80 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700 shadow-xs">
                          PK · UK · USA · GULF
                        </span>
                      </div>

                      {/* Title & Description */}
                      <div className="space-y-2 text-left">
                        <h3 className="font-heading text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                          {service.fullDesc}
                        </p>
                      </div>

                      {/* Onur Gür Style Mock Interactive UI Component Widget */}
                      <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 shadow-md space-y-3">
                        
                        {/* Widget Header */}
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800/80 pb-2">
                          <div className="flex items-center gap-1.5">
                            <FileCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                            <span>Key Deliverables & Scope</span>
                          </div>
                          <span className="text-[9px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                            ACTIVE
                          </span>
                        </div>

                        {/* Bullet Items */}
                        <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                          {service.features.slice(0, 3).map((feat, i) => (
                            <div key={i} className="flex items-start gap-2 text-left">
                              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                              <span className="line-clamp-1 text-[11px] font-medium">{feat}</span>
                            </div>
                          ))}
                        </div>

                      </div>

                    </div>

                    {/* Footer Action Buttons */}
                    <div className="pt-6 mt-6 border-t border-black/5 dark:border-slate-800/80 flex items-center justify-between gap-3">
                      <button
                        onClick={() => setSelectedServiceModal(service)}
                        className="text-xs font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1.5 transition-colors group/btn"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                      </button>

                      <button
                        onClick={() => onOpenBookingWithService(service.title)}
                        className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20 active:scale-95 flex items-center gap-1.5"
                      >
                        <span>Request Service</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      <ServiceModal
        service={selectedServiceModal}
        onClose={() => setSelectedServiceModal(null)}
        onSelectServiceForBooking={onOpenBookingWithService}
      />
    </section>
  );
};




