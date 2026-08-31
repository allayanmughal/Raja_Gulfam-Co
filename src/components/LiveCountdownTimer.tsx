import React, { useState, useEffect } from 'react';
import { AlertTriangle, Flame, ShieldAlert, CheckCircle } from 'lucide-react';

export const LiveCountdownTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 44, hours: 8, minutes: 22, seconds: 15 });
  const [reminderSet, setReminderSet] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative p-6 sm:p-7 rounded-3xl bg-slate-950 border-2 border-rose-500/70 shadow-2xl shadow-rose-950/40 space-y-5 text-center transition-all overflow-hidden text-white">
      
      {/* Top Alarming Badge */}
      <div className="flex flex-col items-center gap-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/15 border border-rose-500/40 text-rose-400 text-[11px] font-extrabold uppercase tracking-widest">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          </span>
          <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
          <span>CRITICAL COMPLIANCE NOTICE</span>
        </div>

        <h3 className="font-heading text-sm sm:text-base font-black text-white uppercase tracking-wider">
          Next FBR Statutory Tax Deadline
        </h3>
      </div>

      {/* High-Contrast Digital Countdown Grid */}
      <div className="grid grid-cols-4 gap-2.5 sm:gap-3 max-w-md mx-auto relative z-10">
        
        <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center shadow-inner">
          <span className="font-heading text-2xl sm:text-3xl font-black text-amber-400 font-mono tracking-tight drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]">
            {String(timeLeft.days).padStart(2, '0')}
          </span>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Days</p>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center shadow-inner">
          <span className="font-heading text-2xl sm:text-3xl font-black text-amber-400 font-mono tracking-tight drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]">
            {String(timeLeft.hours).padStart(2, '0')}
          </span>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Hours</p>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center shadow-inner">
          <span className="font-heading text-2xl sm:text-3xl font-black text-amber-400 font-mono tracking-tight drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]">
            {String(timeLeft.minutes).padStart(2, '0')}
          </span>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Mins</p>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-rose-950/40 border border-rose-900/80 flex flex-col items-center justify-center shadow-inner">
          <span className="font-heading text-2xl sm:text-3xl font-black text-rose-500 font-mono tracking-tight animate-pulse drop-shadow-[0_0_10px_rgba(244,63,94,0.7)]">
            {String(timeLeft.seconds).padStart(2, '0')}
          </span>
          <p className="text-[10px] text-rose-400 font-bold uppercase tracking-widest mt-0.5">Secs</p>
        </div>

      </div>

      {/* Warning Notice Banner */}
      <div className="p-2.5 px-3.5 rounded-xl bg-rose-950/50 border border-rose-900/60 text-rose-300 text-[11px] font-semibold flex items-center justify-center gap-2">
        <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
        <span>Late filings face PKR 40,000 penalty & Active Filer revocation</span>
      </div>

      {/* High Urgency CTA Button */}
      <button
        onClick={() => setReminderSet(true)}
        className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2.5 mx-auto active:scale-95"
      >
        {reminderSet ? (
          <>
            <CheckCircle className="w-4 h-4 text-emerald-300" />
            <span>Priority Filing Reminder Activated</span>
          </>
        ) : (
          <>
            <Flame className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>Set Urgent Filing Reminder</span>
          </>
        )}
      </button>

    </div>
  );
};



