import React, { useState, useEffect } from 'react';
import { Clock, Bell, CheckCircle } from 'lucide-react';

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
    <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30 space-y-4 text-center">
      <div className="flex items-center justify-center gap-2 text-xs font-bold text-amber-500 uppercase tracking-wider">
        <Clock className="w-4 h-4 animate-spin" />
        <span>Next FBR Statutory Tax Deadline Countdown</span>
      </div>

      {/* Countdown Grid */}
      <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto">
        <div className="p-3 rounded-2xl bg-black/10 dark:bg-navy-900 border border-black/5 dark:border-white/10">
          <span className="font-heading text-2xl font-extrabold text-amber-500">{timeLeft.days}</span>
          <p className="text-[10px] opacity-70 uppercase font-medium">Days</p>
        </div>
        <div className="p-3 rounded-2xl bg-black/10 dark:bg-navy-900 border border-black/5 dark:border-white/10">
          <span className="font-heading text-2xl font-extrabold text-amber-500">{timeLeft.hours}</span>
          <p className="text-[10px] opacity-70 uppercase font-medium">Hours</p>
        </div>
        <div className="p-3 rounded-2xl bg-black/10 dark:bg-navy-900 border border-black/5 dark:border-white/10">
          <span className="font-heading text-2xl font-extrabold text-amber-500">{timeLeft.minutes}</span>
          <p className="text-[10px] opacity-70 uppercase font-medium">Mins</p>
        </div>
        <div className="p-3 rounded-2xl bg-black/10 dark:bg-navy-900 border border-black/5 dark:border-white/10">
          <span className="font-heading text-2xl font-extrabold font-mono text-emerald-500">{timeLeft.seconds}</span>
          <p className="text-[10px] opacity-70 uppercase font-medium">Secs</p>
        </div>
      </div>

      <button
        onClick={() => setReminderSet(true)}
        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all flex items-center justify-center gap-2 mx-auto"
      >
        {reminderSet ? (
          <>
            <CheckCircle className="w-4 h-4 text-slate-950" />
            <span>Reminder Set for Sept 30 Deadline</span>
          </>
        ) : (
          <>
            <Bell className="w-4 h-4" />
            <span>Set Filing Reminder Notification</span>
          </>
        )}
      </button>
    </div>
  );
};
