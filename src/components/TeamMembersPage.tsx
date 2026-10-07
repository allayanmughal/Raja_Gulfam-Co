import React from 'react';
import { Award, ShieldCheck, ArrowLeft, Calendar, Phone, CheckCircle2, Briefcase, GraduationCap } from 'lucide-react';

interface TeamMembersPageProps {
  onOpenBooking: () => void;
  onNavigateHome: () => void;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  credentials: string;
  image: string;
  experienceYears: string;
  specialties: string[];
  bio: string;
  isFounder?: boolean;
}

const teamData: TeamMember[] = [
  {
    id: 'founder',
    name: 'Raja Gulfam Kayani',
    role: 'Founder & Managing Executive Partner',
    credentials: 'FCMA, Advocate High Court, B.Com',
    image: '/images/portrait.png',
    experienceYears: '18+ Years',
    isFounder: true,
    specialties: [
      'Corporate Tax Strategy & Planning',
      'Appellate Tax Litigation (ATIR & High Court)',
      'SECP Corporate Compliance & Restructuring',
      'Cross-Border Financial Advisory (UK/US/Pakistan)'
    ],
    bio: 'Raja Gulfam Kayani is a distinguished Chartered Management Accountant and High Court Advocate. With nearly two decades of dual financial and legal experience, he has advised multinational groups, high-net-worth individuals, and emerging enterprises on complex corporate tax, statutory audits, and legal litigation.'
  },
  {
    id: '2',
    name: 'Muhammad Daniyal Kayani',
    role: 'Senior Partner - Tax & FBR Advisory',
    credentials: 'ACMA, Income Tax Practitioner (ITP)',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
    experienceYears: '12+ Years',
    specialties: [
      'FBR Corporate & Salary Tax Returns',
      'Withholding Tax (WHT) Audits',
      'Sales Tax (KPRA / PRA / FBR) Filings',
      'Notice Replies & Appeals'
    ],
    bio: 'Specializes in comprehensive FBR direct and indirect tax strategies. Has successfully represented over 500+ corporate Filers in achieving maximum tax savings and seamless audit clearances.'
  },
  {
    id: '3',
    name: 'Syed Shahzaib Ali',
    role: 'Head of Statutory Audit & Assurance',
    credentials: 'CA (Finalist), B.Sc Finance',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
    experienceYears: '10+ Years',
    specialties: [
      'Statutory Financial Audits',
      'IFRS & IAS Financial Reporting',
      'Banking Credit Line Financial Verification',
      'Internal Controls & Risk Management'
    ],
    bio: 'Leads our statutory audit division, ensuring total compliance with International Financial Reporting Standards (IFRS). Works directly with corporate boards and commercial banks.'
  },
  {
    id: '4',
    name: 'Amina Chaudhry',
    role: 'UK HMRC & Cross-Border Lead',
    credentials: 'ACCA (UK), Senior Tax Consultant',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    experienceYears: '9+ Years',
    specialties: [
      'UK Corporation Tax (CT600)',
      'HMRC Self-Assessment Returns',
      'MTD VAT Submissions & PAYE',
      'UK R&D Tax Relief Claims'
    ],
    bio: 'Expert in UK HMRC taxation and cross-border business setup. Manages quarterly and annual accounting for remote IT companies, e-commerce brands, and UK entity subsidiaries.'
  },
  {
    id: '5',
    name: 'Zahid Mahmood Khan',
    role: 'Corporate Secretarial & SECP Manager',
    credentials: 'LL.B, Corporate Law Specialist',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    experienceYears: '11+ Years',
    specialties: [
      'Express SECP Incorporation (Pvt Ltd / SMC)',
      'Form A / Form 29 Compliance',
      'Share Transfers & Capital Increases',
      'Board Meeting Resolutions & Minutes'
    ],
    bio: 'Heads our corporate legal secretarial practice. Has facilitated express incorporation for 350+ private companies and SMCs with zero regulatory delays.'
  },
  {
    id: '6',
    name: 'Hamza Farooq',
    role: 'Forensic Accounting & Valuation Specialist',
    credentials: 'CFA Charterholder, MS Accounting',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    experienceYears: '8+ Years',
    specialties: [
      'Partnership Dispute Asset Valuation',
      'Court-Admissible Bank Trail Audit',
      'Financial Fraud Investigation',
      'Mergers & Acquisitions Due Diligence'
    ],
    bio: 'Provides specialized forensic analysis and asset valuations for partnership disputes, court litigations, and strategic business sales.'
  }
];

export const TeamMembersPage: React.FC<TeamMembersPageProps> = ({ onOpenBooking, onNavigateHome }) => {
  const founder = teamData.find((m) => m.isFounder)!;
  const seniorTeam = teamData.filter((m) => !m.isFounder);

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

        {/* Header Hero Banner */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h1 className="font-heading text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Meet Our <span className="text-blue-600 dark:text-blue-400">Team Members</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            A seasoned team of Chartered Accountants, Tax Advocates, SECP Specialists, and Cross-Border Financial Consultants dedicated to securing your legal and financial success.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 max-w-2xl mx-auto">
            <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shadow-xs">
              <span className="block text-xl font-extrabold text-blue-600 dark:text-blue-400">18+</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Years Experience</span>
            </div>
            <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shadow-xs">
              <span className="block text-xl font-extrabold text-blue-600 dark:text-blue-400">1,500+</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Corporate Filers</span>
            </div>
            <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shadow-xs">
              <span className="block text-xl font-extrabold text-blue-600 dark:text-blue-400">350+</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">SECP Entities</span>
            </div>
            <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shadow-xs">
              <span className="block text-xl font-extrabold text-blue-600 dark:text-blue-400">100%</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Legal Compliance</span>
            </div>
          </div>
        </div>

        {/* Featured Founder Spotlight Card */}
        <div className="mb-16 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-white via-slate-50 to-blue-50 dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/70 border border-slate-200 dark:border-blue-500/30 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-4">
              <div className="relative rounded-2xl overflow-hidden border border-blue-200 dark:border-blue-500/40 shadow-xl group">
                <img
                  src="/images/portrait_light.jpg"
                  alt={founder.name}
                  className="w-full h-80 object-cover object-top group-hover:scale-105 transition-transform duration-500 dark:hidden"
                />
                <img
                  src="/images/portrait_dark.png"
                  alt={founder.name}
                  className="w-full h-80 object-cover object-top group-hover:scale-105 transition-transform duration-500 hidden dark:block"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="px-3 py-1 rounded-full bg-blue-600 text-white font-bold text-[11px] shadow-md inline-block">
                    Founder & High Court Advocate
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-bold text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/10 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-500/20">
                  Executive Partner
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  {founder.credentials}
                </span>
              </div>

              <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                {founder.name}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {founder.bio}
              </p>

              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Core Expertise:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {founder.specialties.map((spec, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-3">
                <button
                  onClick={onOpenBooking}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Consult with Raja Gulfam</span>
                </button>

                <a
                  href="tel:+923348972072"
                  className="px-6 py-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-2 shadow-xs"
                >
                  <Phone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Direct Desk (+92 334 8972072)</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Section Title */}
        <div className="text-center mb-10 space-y-2">
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Senior Partners & Specialized Consultants
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Expert professionals managing our Tax, SECP, UK HMRC, Statutory Audit, and Forensic practice groups.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {seniorTeam.map((member) => (
            <div
              key={member.id}
              className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-6 flex flex-col justify-between shadow-sm dark:shadow-xl hover:border-blue-500/40 transition-all duration-300 group"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-16 h-16 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div>
                    <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">{member.role}</p>
                    <span className="inline-block text-[10px] text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded mt-1">
                      {member.credentials}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3">
                  {member.bio}
                </p>

                <div className="space-y-1.5 pt-1">
                  <h5 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Key Practice Areas:</h5>
                  <div className="space-y-1">
                    {member.specialties.map((spec, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-700 dark:text-slate-300">
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-slate-800/60 mt-4 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  {member.experienceYears}
                </span>

                <button
                  onClick={onOpenBooking}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-600/20 hover:bg-blue-600 text-blue-600 hover:text-white dark:text-blue-400 dark:hover:text-white font-bold text-xs border border-blue-200 dark:border-blue-500/30 transition-all"
                >
                  Book Session
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Team Philosophy Callout */}
        <div className="mt-16 p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4 max-w-4xl mx-auto shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto border border-blue-200 dark:border-blue-500/20">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-heading text-xl font-bold text-slate-900 dark:text-white">Why Our Multi-Disciplinary Team Stands Out</h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            By unifying Chartered Management Accounting with High Court Advocacy, our team resolves tax audits, legal disputes, and regulatory compliance faster and more securely than standard individual firms.
          </p>

          <div className="pt-2">
            <button
              onClick={onOpenBooking}
              className="px-6 py-3 rounded-full bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-blue-600 font-bold text-xs shadow-md transition-all"
            >
              Schedule Appointment With Team
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
