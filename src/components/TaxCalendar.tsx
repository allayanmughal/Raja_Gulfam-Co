import React from 'react';
import { taxDeadlinesData } from '../data/testimonialsData';
import { Calendar, AlertCircle, Download, FileText } from 'lucide-react';
import { LiveCountdownTimer } from './LiveCountdownTimer';

export const TaxCalendar: React.FC = () => {
  const handleDownloadCheatSheet = () => {
    alert("Downloading RGC Accountants 2026/2027 Tax Rate & Compliance Cheat Sheet PDF...");
  };

  return (
    <section className="py-20 relative z-20 border-t border-black/5 dark:border-white/5 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column Text & Countdown */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-semibold uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5" />
              <span>Statutory Compliance Radar</span>
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight">
              Never Miss Critical <span className="text-amber-500">Tax Deadlines</span>.
            </h2>

            <p className="text-sm opacity-80 leading-relaxed">
              FBR, SECP, and HMRC enforce strict late-filing fines. Stay compliant with Raja Gulfam & Co.
            </p>

            {/* Live Interactive Countdown Timer */}
            <LiveCountdownTimer />

            {/* Downloadable PDF Box */}
            <div className="p-5 rounded-2xl bg-black/5 dark:bg-navy-900 border border-black/5 dark:border-white/10 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs">2026/2027 Tax Slabs Guide</h4>
                  <p className="text-[11px] opacity-70">Complete FBR, SECP & HMRC cheat sheet PDF</p>
                </div>
              </div>

              <button
                onClick={handleDownloadCheatSheet}
                className="w-full py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Tax Slabs PDF</span>
              </button>
            </div>

          </div>

          {/* Right Column Deadlines Radar Grid */}
          <div className="lg:col-span-7 space-y-4">
            {taxDeadlinesData.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-black/5 dark:bg-navy-900 border border-black/5 dark:border-white/10 hover:border-amber-500/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-500 text-[10px] font-bold uppercase">
                      {item.jurisdiction}
                    </span>
                    {item.urgent && (
                      <span className="px-2.5 py-0.5 rounded bg-rose-500/20 text-rose-500 text-[10px] font-bold flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Priority Filing
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm">{item.title}</h4>
                  <p className="text-xs opacity-75">{item.description}</p>
                </div>

                <div className="sm:text-right shrink-0">
                  <span className="font-heading text-lg font-extrabold text-amber-500">
                    {item.date}
                  </span>
                  <p className="text-[10px] opacity-60">Statutory Date</p>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
