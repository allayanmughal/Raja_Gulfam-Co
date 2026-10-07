import React from 'react';
import { X, CheckCircle2, ArrowRight, ShieldCheck, FileText, Sparkles, Globe } from 'lucide-react';
import type { ServiceItem } from '../types';

interface ServiceModalProps {
  service: ServiceItem | null;
  onClose: () => void;
  onSelectServiceForBooking: (serviceName: string) => void;
}

export const ServiceModal: React.FC<ServiceModalProps> = ({
  service,
  onClose,
  onSelectServiceForBooking,
}) => {
  if (!service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-2xl space-y-6 text-slate-900 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Category Pill */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider">
            {service.category} Division
          </span>
          <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Supported: {service.jurisdictions.join(', ')}</span>
          </span>
        </div>

        {/* Header Title */}
        <div>
          <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
            {service.title}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
            {service.fullDesc}
          </p>
        </div>

        {/* Grid Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          
          {/* Technical Scope */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 space-y-3">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Key Technical Scope</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              {service.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Business Value */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 space-y-3">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Business Value & Savings</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              {service.benefits.map((ben, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <span>{ben}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Deliverables List */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-slate-50 dark:from-slate-800/80 dark:to-slate-950 border border-blue-200 dark:border-blue-500/20 space-y-2">
          <h4 className="font-bold text-blue-700 dark:text-blue-300 text-xs uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Formal Deliverables & Reports Provided</span>
          </h4>
          <div className="flex flex-wrap gap-2 pt-1">
            {service.deliverables.map((deliv, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs text-slate-700 dark:text-slate-200 font-medium shadow-xs"
              >
                {deliv}
              </span>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 dark:border-white/10">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Guaranteed compliance under Raja Gulfam Kayani supervision.
          </span>
          
          <button
            onClick={() => {
              onClose();
              onSelectServiceForBooking(service.title);
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>Request Quote for {service.title}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
