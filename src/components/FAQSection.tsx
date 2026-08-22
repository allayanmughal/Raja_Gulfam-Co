import React, { useState } from 'react';
import { faqsData } from '../data/testimonialsData';
import { HelpCircle, ChevronDown, ChevronUp, Search, Calendar, Phone } from 'lucide-react';

interface FAQSectionProps {
  onOpenBooking: () => void;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ onOpenBooking }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFaqs = faqsData.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section id="faqs" className="py-20 relative z-20 border-t border-black/5 dark:border-white/5 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-semibold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Knowledge Base</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight">
            Frequently Asked <span className="text-amber-500">Questions</span>
          </h2>

          {/* Search Input */}
          <div className="relative max-w-md mx-auto pt-2">
            <Search className="w-4 h-4 opacity-50 absolute left-4 top-4.5" />
            <input
              type="text"
              placeholder="Search tax, audit, or SECP questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-black/5 dark:bg-navy-900 border border-black/10 dark:border-white/10 text-current placeholder-current opacity-70 focus:opacity-100 text-xs focus:outline-none focus:border-amber-500 transition-all"
            />
          </div>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl bg-black/5 dark:bg-navy-900 border border-black/5 dark:border-white/10 overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-heading font-bold text-sm hover:text-amber-500 transition-colors"
                >
                  <span>{faq.question}</span>
                  <div className="w-7 h-7 rounded-full bg-black/5 dark:bg-navy-800 flex items-center justify-center shrink-0 text-amber-500">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs opacity-80 leading-relaxed border-t border-black/5 dark:border-white/5 animate-in fade-in duration-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Prompt */}
        <div className="mt-12 p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-center space-y-3">
          <h3 className="font-heading text-lg font-bold">Have a specific legal or tax question?</h3>
          <p className="text-xs opacity-80 max-w-xl mx-auto">
            Consult directly with **Raja Gulfam Kayani** (Chartered Management Accountant & Advocate).
          </p>

          <div className="flex flex-wrap justify-center gap-3 pt-1">
            <button
              onClick={onOpenBooking}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Schedule 1-on-1 Consultation</span>
            </button>

            <a
              href="tel:+923121850063"
              className="px-5 py-2.5 rounded-xl bg-black/5 dark:bg-white/10 font-bold text-xs border border-black/10 dark:border-white/10 flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-amber-500" />
              <span>Call +92 312 1850063</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
