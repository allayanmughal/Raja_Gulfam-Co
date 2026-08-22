import React from 'react';
import { ShieldCheck, Award, CheckCircle, Scale, Building2 } from 'lucide-react';
import { InteractiveGlobeCanvas } from './InteractiveGlobeCanvas';

export const TrustBadges: React.FC = () => {
  const stats = [
    { label: 'Corporate Clients', value: '500+', sub: 'Local & International', icon: Building2 },
    { label: 'FBR & SECP Filings', value: '5,000+', sub: 'Clean Compliance Record', icon: ShieldCheck },
    { label: 'Tax Liabilities Saved', value: '$50M+', sub: 'Legitimate Savings', icon: Award },
    { label: 'Legal & Tax Disputes', value: '99.2%', sub: 'Success Rate in Appeals', icon: Scale },
  ];

  return (
    <section className="py-16 relative z-20 border-y border-black/5 dark:border-white/5 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-3xl bg-black/5 dark:bg-navy-900/80 border border-black/5 dark:border-white/10 text-center space-y-2 hover:border-amber-500/40 transition-all shadow-sm"
              >
                <div className="w-10 h-10 mx-auto rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                  <Icon className="w-5 h-5" />
                </div>
                <p className="font-heading text-3xl font-extrabold tracking-tight">{stat.value}</p>
                <div>
                  <p className="text-sm font-bold text-amber-500">{stat.label}</p>
                  <p className="text-xs opacity-75 font-medium">{stat.sub}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3D Globe + Accreditation Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-3xl bg-black/5 dark:bg-navy-900/90 border border-black/5 dark:border-white/10 p-6 md:p-8">
          
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold uppercase tracking-wider">Multi-Jurisdictional Accreditation</h4>
                <p className="text-xs opacity-80">Full authority filings with FBR, SECP, HMRC, and US IRS</p>
              </div>
            </div>

            <p className="text-xs opacity-75 leading-relaxed">
              Supervised directly by **Raja Gulfam Kayani** (Chartered Management Accountant & Advocate High Court).
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
