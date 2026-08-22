import React, { useState } from 'react';
import { caseStudiesData } from '../data/testimonialsData';
import { Award, TrendingUp, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface CaseStudiesProps {
  onOpenBooking: () => void;
}

export const CaseStudies: React.FC<CaseStudiesProps> = ({ onOpenBooking }) => {
  const [activeCaseId, setActiveCaseId] = useState(caseStudiesData[0].id);

  const activeCase = caseStudiesData.find((c) => c.id === activeCaseId) || caseStudiesData[0];

  return (
    <section id="cases" className="py-20 relative z-20 border-t border-black/5 dark:border-white/5 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-semibold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" />
            <span>Proven Results</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight">
            Client Success <span className="text-amber-500">Case Studies</span>
          </h2>

          <p className="text-sm opacity-80">
            Real outcomes achieved by Raja Gulfam Kayani and senior advisory team.
          </p>
        </div>

        {/* Case Studies Display Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Selector List */}
          <div className="lg:col-span-4 space-y-3">
            {caseStudiesData.map((item) => {
              const isSelected = item.id === activeCaseId;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveCaseId(item.id)}
                  className={`w-full p-5 rounded-2xl text-left transition-all duration-300 border flex flex-col justify-between ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500 text-amber-500 shadow-md'
                      : 'bg-black/5 dark:bg-navy-900 border-black/5 dark:border-white/5 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
                      {item.clientIndustry}
                    </span>
                    <span className="text-sm font-extrabold text-emerald-500">
                      {item.metric}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-current mt-2">
                    {item.challenge.slice(0, 60)}...
                  </h4>
                </button>
              );
            })}
          </div>

          {/* Right Featured Case Details Box */}
          <div className="lg:col-span-8 rounded-3xl bg-black/5 dark:bg-navy-900 border border-black/5 dark:border-white/10 p-6 md:p-8 space-y-6 shadow-xl flex flex-col justify-between">
            <div className="space-y-6">
              
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/5 dark:border-white/5 pb-4">
                <div>
                  <span className="text-xs font-bold opacity-60 uppercase tracking-widest">Industry Division:</span>
                  <h3 className="font-heading text-2xl font-extrabold mt-0.5">
                    {activeCase.clientIndustry}
                  </h3>
                </div>

                <div className="text-right">
                  <span className="text-3xl font-extrabold text-amber-500 font-heading">
                    {activeCase.metric}
                  </span>
                  <p className="text-xs opacity-75 font-medium">{activeCase.metricLabel}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-black/5 dark:bg-navy-950 border border-black/5 dark:border-white/5 space-y-2">
                  <span className="text-xs font-bold text-rose-500 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Regulatory Challenge</span>
                  </span>
                  <p className="text-xs opacity-80 leading-relaxed">
                    {activeCase.challenge}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-black/5 dark:bg-navy-950 border border-black/5 dark:border-white/5 space-y-2">
                  <span className="text-xs font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4" />
                    <span>Raja Gulfam Solution</span>
                  </span>
                  <p className="text-xs opacity-80 leading-relaxed">
                    {activeCase.solution}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider opacity-80">
                  Verified Financial Outcomes:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {activeCase.results.map((res, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-black/5 dark:bg-navy-950 border border-black/5 dark:border-white/5 text-xs opacity-80 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{res}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            <div className="pt-4 border-t border-black/5 dark:border-white/5 flex justify-end">
              <button
                onClick={onOpenBooking}
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-2"
              >
                <span>Discuss Similar Case Strategy</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
