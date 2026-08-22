import React, { useState } from 'react';
import { servicesData } from '../data/servicesData';
import type { ServiceItem, Region } from '../types';
import { ServiceModal } from './ServiceModal';
import { ArrowRight, ShieldCheck, Scale, Calculator, Building2, Search, Database } from 'lucide-react';
import { motion } from 'framer-motion';

interface ServicesGridProps {
  onOpenBookingWithService: (serviceTitle: string) => void;
  selectedRegion: Region;
}

const getImageForService = (category: string) => {
  switch (category) {
    case 'Legal':
      return {
        src: '/images/legal_practice.jpg',
        badge: 'LEGAL ADVISORY',
        icon: Scale,
        color: 'from-amber-600 to-yellow-500'
      };
    case 'Taxation':
      return {
        src: '/images/taxation_practice.jpg',
        badge: 'TAXATION & FBR',
        icon: Calculator,
        color: 'from-blue-600 to-cyan-500'
      };
    case 'Audit':
      return {
        src: '/images/audit_practice.jpg',
        badge: 'STATUTORY AUDIT',
        icon: ShieldCheck,
        color: 'from-emerald-600 to-teal-500'
      };
    case 'Forensic':
      return {
        src: '/images/legal_practice.jpg',
        badge: 'FORENSIC AUDIT',
        icon: Search,
        color: 'from-purple-600 to-indigo-500'
      };
    case 'Accounting':
      return {
        src: '/images/audit_practice.jpg',
        badge: 'CLOUD BOOKKEEPING',
        icon: Database,
        color: 'from-sky-600 to-blue-500'
      };
    default:
      return {
        src: '/images/corporate_practice.jpg',
        badge: 'SECP CORPORATE',
        icon: Building2,
        color: 'from-blue-600 to-indigo-600'
      };
  }
};

export const ServicesGrid: React.FC<ServicesGridProps> = ({
  onOpenBookingWithService,
  selectedRegion,
}) => {
  const [selectedServiceModal, setSelectedServiceModal] = useState<ServiceItem | null>(null);

  const featuredServices = servicesData.filter((s) =>
    selectedRegion === 'GLOBAL' || s.jurisdictions.includes(selectedRegion)
  );

  return (
    <section id="services" className="py-20 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-left space-y-3 max-w-2xl mb-14"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Practice Divisions
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Our Core Accounting & Legal Practice Areas
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Comprehensive financial management, statutory audit compliance, and corporate legal representation.
          </p>
        </motion.div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredServices.map((service, idx) => {
            const visual = getImageForService(service.category);
            const Icon = visual.icon;

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 40, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col justify-between hover:border-blue-500/50 hover:-translate-y-1.5 transition-all duration-300 shadow-sm hover:shadow-xl group"
              >
                <div>
                  {/* Top Graphic Card Banner with Badge inside Picture */}
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={visual.src}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                    
                    {/* Top Left Category Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/85 backdrop-blur-md border border-white/20 text-white shadow-md z-10">
                      <Icon className="w-3.5 h-3.5 text-blue-400" />
                      <span className="text-[10px] font-extrabold tracking-wider uppercase">
                        {visual.badge}
                      </span>
                    </div>

                    {/* Top Right Jurisdictions Tag */}
                    <div className="absolute top-3 right-3 text-[10px] font-mono font-bold text-white bg-blue-600/90 backdrop-blur-md px-2.5 py-1 rounded-full shadow-md border border-white/10 z-10">
                      {service.jurisdictions.join(' · ')}
                    </div>

                    {/* Title inside image bottom */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="font-heading text-lg font-bold text-white leading-tight drop-shadow-md">
                        {service.title}
                      </h3>
                    </div>
                  </div>

                  {/* Card Body Content */}
                  <div className="p-6 space-y-4">
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                      {service.fullDesc}
                    </p>

                    <ul className="space-y-2 pt-1 text-xs text-slate-600 dark:text-slate-400">
                      {service.features.slice(0, 3).map((feat, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 shrink-0" />
                          <span className="line-clamp-1">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="p-6 pt-0 flex items-center justify-between border-t border-slate-200/60 dark:border-slate-800/60">
                  <button
                    onClick={() => setSelectedServiceModal(service)}
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1.5"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onOpenBookingWithService(service.title)}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-sm"
                  >
                    Request Service
                  </button>
                </div>
              </motion.div>
            );
          })}
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
