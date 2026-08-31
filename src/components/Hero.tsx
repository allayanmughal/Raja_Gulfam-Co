import React from 'react';
import { Calendar, ArrowRight, ShieldCheck, Award, Clock, Building2, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { ThreeCanvas } from './ThreeCanvas';
import type { Region } from '../types';

interface HeroProps {
  onOpenBooking: () => void;
  onOpenCalculator: () => void;
  selectedRegion: Region;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking, onOpenCalculator }) => {
  return (
    <section className="relative min-h-screen lg:h-screen lg:max-h-screen pt-20 pb-4 md:pt-20 md:pb-5 overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors flex flex-col justify-between">

      {/* Background 3D WebGL Canvas Layer */}
      <ThreeCanvas />

      {/* Ambient Neon Lighting Effects */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/10 dark:bg-blue-600/20 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-6 right-6 w-72 h-72 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex-1 flex flex-col justify-between">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center flex-1 my-auto py-2">

          {/* Left Hero Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.21, 1.11, 0.81, 0.99] }}
            className="lg:col-span-7 space-y-3.5 text-left"
          >
            {/* Dynamic Headline */}
            <h1 className="font-heading text-2xl sm:text-3xl lg:text-[40px] xl:text-[42px] font-extrabold tracking-tight leading-[1.16] text-slate-900 dark:text-white">
              Strategic Financial Precision.{' '}
              <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-600 dark:from-blue-400 dark:via-cyan-300 dark:to-emerald-400 bg-clip-text text-transparent">
                Bulletproof Legal Defense.
              </span>
            </h1>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl font-normal leading-relaxed">
              Led by <strong className="text-blue-600 dark:text-blue-400 font-bold">Raja Gulfam Kayani</strong> (Chartered Accountant & High Court Advocate). Integrating FBR & HMRC tax optimization, statutory financial audits, and SECP corporate litigation.
            </p>

            {/* Prominent Eye-Catching Urgent Deadline & Fine Warning Ticker */}
            <div className="w-full max-w-xl p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-rose-500/20 via-rose-500/10 to-amber-500/15 border-2 border-rose-500/60 shadow-[0_0_25px_rgba(244,63,94,0.25)] backdrop-blur-md flex items-center gap-3.5 my-2">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-500 flex items-center justify-center shrink-0 shadow-inner">
                <AlertTriangle className="w-5.5 h-5.5 text-rose-500 animate-bounce" />
              </div>
              <div className="space-y-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                  </span>
                  <span className="font-extrabold text-xs sm:text-sm text-rose-600 dark:text-rose-400 uppercase tracking-widest">
                    FBR Return Deadline Notice
                  </span>
                </div>
                <div className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white leading-tight">
                  Sept 30 Filing Deadline —{' '}
                  <span className="inline-block bg-rose-600 text-white font-black px-2 py-0.5 rounded-md text-xs sm:text-sm shadow-sm animate-pulse ml-0.5">
                    PKR 25,000 Late Fine Risk
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-1 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={onOpenBooking}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 hover:shadow-blue-600/35 transition-all flex items-center justify-center gap-2 group hover:scale-[1.02] active:scale-95"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Schedule 1-on-1 Consultation</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={onOpenCalculator}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs border border-slate-200 dark:border-slate-800 shadow-xs transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95"
              >
                <span>Calculate Tax Estimate</span>
              </button>
            </div>
          </motion.div>

          {/* Right Hero Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, type: 'spring', stiffness: 90 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 group">
              <img
                src="/images/portrait_light.jpg"
                alt="Raja Gulfam Kayani"
                className="w-full h-[320px] sm:h-[380px] lg:h-[420px] xl:h-[450px] object-cover object-top transition-transform duration-700 group-hover:scale-105 dark:hidden"
              />
              <img
                src="/images/portrait_dark.png"
                alt="Raja Gulfam Kayani"
                className="w-full h-[320px] sm:h-[380px] lg:h-[420px] xl:h-[450px] object-cover object-top transition-transform duration-700 group-hover:scale-105 hidden dark:block"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-85" />

              {/* Bottom Card Title & Badge */}
              <div className="absolute bottom-3 left-3 right-3 text-white space-y-0.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-blue-600/90 text-white font-bold text-[8px] uppercase tracking-wider">
                    Executive Partner
                  </span>
                </div>
                <h3 className="font-heading text-base font-bold text-white">Raja Gulfam Kayani</h3>
                <p className="text-[10px] text-blue-300 font-medium">Advocate High Court & Chartered Management Accountant</p>
              </div>
            </div>

          </motion.div>

        </div>

        {/* Bottom Hero Trust Indicators Strip */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-2 pt-2.5 lg:mt-3 lg:pt-3 border-t border-slate-200 dark:border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 shrink-0 pb-1"
        >
          <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="p-3 sm:p-3.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800/90 flex items-center gap-3 shadow-xs hover:shadow-md hover:border-blue-500/50 dark:hover:border-blue-400/50 transition-all duration-300 cursor-pointer group backdrop-blur-sm"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Award className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-left">
              <span className="block text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">18+ Years</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">Practice Experience</span>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="p-3 sm:p-3.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800/90 flex items-center gap-3 shadow-xs hover:shadow-md hover:border-emerald-500/50 dark:hover:border-emerald-400/50 transition-all duration-300 cursor-pointer group backdrop-blur-sm"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-left">
              <span className="block text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">PKR 50M+</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">Tax Savings Claimed</span>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="p-3 sm:p-3.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800/90 flex items-center gap-3 shadow-xs hover:shadow-md hover:border-blue-500/50 dark:hover:border-blue-400/50 transition-all duration-300 cursor-pointer group backdrop-blur-sm"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-left">
              <span className="block text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">350+ SECP</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">Companies Registered</span>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="p-3 sm:p-3.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800/90 flex items-center gap-3 shadow-xs hover:shadow-md hover:border-amber-500/50 dark:hover:border-amber-400/50 transition-all duration-300 cursor-pointer group backdrop-blur-sm"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4 text-amber-500 group-hover:rotate-45 transition-transform duration-300" />
            </div>
            <div className="text-left">
              <span className="block text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white leading-tight group-hover:text-amber-500 transition-colors">48-72h</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">Express SECP Setup</span>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};
