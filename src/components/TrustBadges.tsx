import React from 'react';
import { ShieldCheck, Award, CheckCircle, Scale, Building2 } from 'lucide-react';
import { InteractiveGlobeCanvas } from './InteractiveGlobeCanvas';
import { motion } from 'framer-motion';

export const TrustBadges: React.FC = () => {
  const stats = [
    { label: 'Corporate Clients', value: '500+', sub: 'Local & International', icon: Building2 },
    { label: 'FBR & SECP Filings', value: '5,000+', sub: 'Clean Compliance Record', icon: ShieldCheck },
    { label: 'Tax Liabilities Saved', value: '$50M+', sub: 'Legitimate Savings', icon: Award },
    { label: 'Legal & Tax Disputes', value: '99.2%', sub: 'Success Rate in Appeals', icon: Scale },
  ];

  return (
    <section className="py-16 relative z-20 border-y border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-2 hover:border-blue-500/50 transition-all shadow-xs hover:shadow-md"
              >
                <div className="w-10 h-10 mx-auto rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Icon className="w-5 h-5" />
                </div>
                <p className="font-heading text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">{stat.value}</p>
                <div>
                  <p className="text-sm font-bold text-blue-600 dark:text-blue-400">{stat.label}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{stat.sub}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* 3D Globe + Accreditation Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-md">
          
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold uppercase tracking-wider text-slate-900 dark:text-white">Multi-Jurisdictional Accreditation</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Full authority filings with FBR, SECP, HMRC, and US IRS</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Supervised directly by <strong className="text-slate-900 dark:text-white">Raja Gulfam Kayani</strong> (Chartered Management Accountant & Advocate High Court).
            </p>
          </div>

          {/* Interactive 3D Globe */}
          <div className="lg:col-span-6">
            <InteractiveGlobeCanvas />
          </div>

        </div>

      </div>
    </section>
  );
};

