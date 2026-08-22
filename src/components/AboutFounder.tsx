import React from 'react';
import { Calendar, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

interface AboutFounderProps {
  onOpenBooking: () => void;
}

export const AboutFounder: React.FC<AboutFounderProps> = ({ onOpenBooking }) => {
  return (
    <section id="about" className="py-24 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Photo */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800">
              <img
                src="/images/portrait_light.jpg"
                alt="Raja Gulfam Kayani"
                className="w-full h-[420px] object-cover object-top dark:hidden"
              />
              <img
                src="/images/portrait_dark.png"
                alt="Raja Gulfam Kayani"
                className="w-full h-[420px] object-cover object-top hidden dark:block"
              />
            </div>
          </motion.div>

          {/* Right Copy */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-7 space-y-6"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Leadership Profile
            </span>

            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              About Raja Gulfam Kayani
            </h2>

            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong className="text-slate-900 dark:text-white">Raja Gulfam Kayani</strong> is an Executive Partner and High Court Advocate specializing in corporate tax structuring, statutory audits, SECP regulatory legal compliance, and cross-border financial advisory across Pakistan, the UK, US, and the Gulf.
            </p>

            <blockquote className="p-6 rounded-2xl bg-white dark:bg-slate-900 border-l-4 border-blue-600 text-sm italic text-slate-800 dark:text-slate-200 shadow-sm dark:shadow-none border border-slate-200 dark:border-slate-800/50">
              "Financial precision without legal protection leaves businesses exposed. We integrate bulletproof compliance with strategic legal defence."
              <footer className="text-xs font-bold text-blue-600 dark:text-blue-400 not-italic mt-3">
                — Raja Gulfam Kayani, Chartered Management Accountant & Advocate
              </footer>
            </blockquote>

            {/* CTA */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={onOpenBooking}
                className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Consult with Raja Gulfam</span>
              </button>

              <a
                href="tel:+923121850063"
                className="px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs border border-slate-200 dark:border-slate-800 transition-all flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Call +92 312 1850063</span>
              </a>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
