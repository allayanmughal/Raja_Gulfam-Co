import React, { useState } from 'react';
import { HelpCircle, Search, ChevronDown, ChevronUp, Calendar, Phone, MessageSquare, ArrowLeft, ShieldCheck, FileText, Globe, Scale } from 'lucide-react';

interface FAQPageProps {
  onOpenBooking: () => void;
  onNavigateHome: () => void;
}

interface FAQItem {
  id: string;
  category: 'fbr' | 'secp' | 'uk_hmrc' | 'legal' | 'audit';
  categoryLabel: string;
  question: string;
  answer: string;
}

const detailedFaqs: FAQItem[] = [
  {
    id: '1',
    category: 'fbr',
    categoryLabel: 'FBR & Pakistan Tax',
    question: 'Why choose Raja Gulfam & Co. over conventional accounting firms in Pakistan?',
    answer: 'Raja Gulfam & Co. combines dual expertise in Chartered Management Accounting and Legal Advisory (Advocate High Court). Unlike standard accountants who only submit annual forms, Raja Gulfam Kayani and our senior legal team provide strategic tax optimization, FBR audit defense, penalty annulments, and court-admissible litigation under one roof.'
  },
  {
    id: '2',
    category: 'fbr',
    categoryLabel: 'FBR & Pakistan Tax',
    question: 'How does active FBR Filer status save money for individuals and businesses?',
    answer: 'Active FBR Filer status significantly reduces withholding tax (WHT) rates across banking transactions, property sales/purchases, motor vehicle registrations, dividend payouts, and commercial imports—saving up to 50% on WHT rates compared to Non-Filers. It also protects you from automatic FBR audit selection under Section 214C.'
  },
  {
    id: '3',
    category: 'fbr',
    categoryLabel: 'FBR & Pakistan Tax',
    question: 'What happens if I receive an FBR tax audit or show-cause notice under Section 177 / 122?',
    answer: 'Do not panic or reply without legal counsel. Raja Gulfam Kayani specializes in appellate tax litigation. We analyze your ledger entries, bank statements, and tax credit history to draft legally sound replies, file appeals before the Commissioner (Appeals) or Appellate Tribunal (ATIR), and obtain stay orders against illegal bank account attachments.'
  },
  {
    id: '4',
    category: 'secp',
    categoryLabel: 'SECP & Corporate',
    question: 'How quickly can you incorporate a Private Limited (Pvt Ltd) or SMC company with SECP?',
    answer: 'Under our express corporate advisory service, SECP incorporation for Single Member Companies (SMC-Pvt Ltd) or Private Limited companies is typically completed within 48 to 72 hours. We handle name reservation, digital signatures, Memorandum & Articles of Association, SECP Form 1, NTN registration, and bank account opening assistance.'
  },
  {
    id: '5',
    category: 'secp',
    categoryLabel: 'SECP & Corporate',
    question: 'What annual compliance filings are mandatory for SECP registered companies?',
    answer: 'SECP requires mandatory annual filings including Form A/B (Annual Return of Shareholders & Directors), Form 29 (Particulars of Directors), and annual audited financial accounts audited by a qualified Chartered Accountant within 120 days of the financial year end. Failure to file results in heavy daily penalties and company status being marked as inactive.'
  },
  {
    id: '6',
    category: 'uk_hmrc',
    categoryLabel: 'UK & Cross-Border',
    question: 'Do you handle UK HMRC Corporation Tax (CT600), VAT returns, and Self-Assessments?',
    answer: 'Yes! We manage UK HMRC accounting for remote founders, Amazon UK sellers, tech startups, and UK-registered businesses. Our services cover annual CT600 filing, quarterly MTD (Making Tax Digital) VAT submissions, PAYE payroll management, and UK Self-Assessment tax returns.'
  },
  {
    id: '7',
    category: 'uk_hmrc',
    categoryLabel: 'UK & Cross-Border',
    question: 'Can you assist UK companies with R&D Tax Relief and cross-border profit extraction?',
    answer: 'Absolutely. We help UK tech firms and innovative businesses claim legitimate HMRC R&D Tax Credits to reduce corporation tax liability or claim payable cash refunds. We also structure compliant double-taxation relief between the UK, US, UAE, and Pakistan.'
  },
  {
    id: '8',
    category: 'legal',
    categoryLabel: 'Legal Advisory',
    question: 'What legal corporate services do you offer alongside accounting?',
    answer: 'As High Court Advocates, we draft binding Partnership Deeds, Shareholder Agreements, NDAs, Commercial Contracts, Joint Venture agreements, and handle partnership dispute resolutions, asset recovery, and representation in corporate legal courts.'
  },
  {
    id: '9',
    category: 'audit',
    categoryLabel: 'Audit & Accounting',
    question: 'What documents are required for statutory financial audits or bank credit evaluation?',
    answer: 'To initiate an audit, we require bank account statements, trial balance, sales/purchase ledger summary, fixed asset register, payroll summary, and previous year tax returns. We provide independent, bank-accepted audited balance sheets and financial statements.'
  }
];

const categoryTabs = [
  { id: 'all', label: 'All FAQs', icon: HelpCircle },
  { id: 'fbr', label: 'FBR Tax', icon: FileText },
  { id: 'secp', label: 'SECP Corporate', icon: ShieldCheck },
  { id: 'uk_hmrc', label: 'UK & International', icon: Globe },
  { id: 'legal', label: 'Legal Advisory', icon: Scale },
  { id: 'audit', label: 'Audit & Accounts', icon: HelpCircle }
];

export const FAQPage: React.FC<FAQPageProps> = ({ onOpenBooking, onNavigateHome }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFaqs = detailedFaqs.filter((faq) => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.categoryLabel.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleWhatsApp = () => {
    const message = encodeURIComponent("Hello Raja Gulfam & Co., I have a specific tax/legal question and would like assistance.");
    window.open(`https://wa.me/923348972072?text=${message}`, '_blank');
  };

  return (
    <div className="pt-28 pb-20 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors bg-white dark:bg-slate-900/80 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800 shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <h1 className="font-heading text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Frequently Asked <span className="text-blue-600 dark:text-blue-400">Questions</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Clear, legal, and authoritative answers regarding FBR income tax, SECP corporate compliance, UK HMRC filings, statutory audits, and legal litigation.
          </p>

          {/* Search Box */}
          <div className="relative max-w-xl mx-auto pt-4">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-7" />
            <input
              type="text"
              placeholder="Search by topic, e.g. FBR audit, SECP registration, HMRC tax..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 shadow-sm dark:shadow-xl transition-all"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categoryTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setSelectedCategory(tab.id);
                  setOpenIndex(0);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25 scale-105'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-850'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Accordion FAQ Items */}
        <div className="max-w-4xl mx-auto space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={faq.id}
                  className="rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800/80 overflow-hidden shadow-sm dark:shadow-lg transition-all"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full p-6 text-left flex items-start justify-between gap-4 font-heading font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <div className="space-y-1">
                      <span className="inline-block text-[11px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2.5 py-0.5 rounded-md mb-1 border border-blue-200 dark:border-transparent">
                        {faq.categoryLabel}
                      </span>
                      <p>{faq.question}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 text-blue-600 dark:text-blue-400 mt-1">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 animate-in fade-in duration-200">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 space-y-3">
              <HelpCircle className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">No matching questions found</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Try adjusting your search terms or selecting another category.</p>
            </div>
          )}
        </div>

        {/* CTA Contact Card */}
        <div className="mt-16 max-w-4xl mx-auto p-8 rounded-3xl bg-gradient-to-br from-white via-slate-50 to-blue-50 dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/60 border border-blue-200 dark:border-blue-500/30 text-center space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center mx-auto">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Have a Specific Tax or Legal Case Question?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Get personalized assistance directly from <strong className="text-slate-900 dark:text-white">Raja Gulfam Kayani</strong> (Chartered Accountant & High Court Advocate) and our senior legal team.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <button
              onClick={onOpenBooking}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Direct Consultation</span>
            </button>

            <button
              onClick={handleWhatsApp}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Direct Desk</span>
            </button>

            <a
              href="tel:+923348972072"
              className="px-6 py-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-2 shadow-xs"
            >
              <Phone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Call +92 334 8972072</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
