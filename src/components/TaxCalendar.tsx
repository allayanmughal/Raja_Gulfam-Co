import React from 'react';
import { taxDeadlinesData } from '../data/testimonialsData';
import { Calendar, AlertCircle, Download, FileText } from 'lucide-react';
import { LiveCountdownTimer } from './LiveCountdownTimer';
import { motion } from 'framer-motion';

export const TaxCalendar: React.FC = () => {
  const handleDownloadCheatSheet = () => {
    alert("Downloading RGC Accountants 2026/2027 Tax Rate & Compliance Cheat Sheet PDF...");
  };

  return (
    <section className="py-20 relative z-20 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column Text & Countdown */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5" />
              <span>Statutory Compliance Radar</span>
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Never Miss Critical <span className="text-rose-600 dark:text-rose-400">Tax Deadlines</span>.
            </h2>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              FBR, SECP, and HMRC enforce strict late-filing fines. Stay compliant with Raja Gulfam & Co.
            </p>

            {/* Live Interactive Countdown Timer */}
            <LiveCountdownTimer />

            {/* Downloadable PDF Box */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">2026/2027 Tax Slabs Guide</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Complete FBR, SECP & HMRC cheat sheet PDF</p>
                </div>
              </div>

              <button
                onClick={handleDownloadCheatSheet}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Download Tax Slabs PDF</span>
              </button>
            </div>

          </motion.div>

          {/* Right Column Deadlines Radar Grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-7 space-y-4"
          >
            {taxDeadlinesData.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs hover:shadow-md"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 text-[10px] font-bold uppercase">
                      {item.jurisdiction}
                    </span>
                    {item.urgent && (
                      <span className="px-2.5 py-0.5 rounded bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 text-[10px] font-bold flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Priority Filing
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{item.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300">{item.description}</p>
                </div>

                <div className="sm:text-right shrink-0">
                  <span className="font-heading text-lg font-extrabold text-blue-600 dark:text-blue-400">
                    {item.date}
                  </span>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Statutory Date</p>
                </div>
              </div>
            ))}
          </motion.div>

        </div>

      </div>
    </section>
  );
};

