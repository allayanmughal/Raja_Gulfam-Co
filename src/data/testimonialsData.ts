import type { Testimonial, CaseStudy, TaxDeadline } from '../types';

export const testimonialsData: Testimonial[] = [
  {
    id: '1',
    name: 'Muhammad Tariq',
    role: 'Managing Director',
    company: 'Northern Traders Pvt Ltd',
    location: 'Abbottabad, Pakistan',
    content: 'Raja Gulfam & Co. transformed our corporate structure and solved a complex SECP compliance issue that had halted our expansions. Their FBR tax planning saved us millions in withholding tax. Highly professional and dependable!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    tag: 'Corporate Tax & SECP'
  },
  {
    id: '2',
    name: 'Sarah Jenkins',
    role: 'Founder & CEO',
    company: 'Apex Digital Solutions UK',
    location: 'London, United Kingdom',
    content: 'Managing UK HMRC Self-Assessment and VAT while operating remotely was a headache until I hired Raja Gulfam Kayani. His team handles our quarterly CT600 and payroll flawlessly. Excellent cross-border expertise.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    tag: 'HMRC & Cross-Border Tax'
  },
  {
    id: '3',
    name: 'Chaudhry Bilal Ahmed',
    role: 'CEO & Founder',
    company: 'Karakoram Logistics & Freight',
    location: 'Islamabad, Pakistan',
    content: 'When we required an emergency statutory audit for our banking line credit, RGC Accountants completed the audit within 5 days with zero errors. Raja Gulfam personally guided us through financial forecasting.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    tag: 'Audit & Credit Support'
  },
  {
    id: '4',
    name: 'David Vance',
    role: 'Chief Operating Officer',
    company: 'Vance Capital Partners',
    location: 'Dubai, UAE / USA',
    content: 'The forensic accounting work done by Raja Gulfam & Co. during our partnership dispute was court-admissible and exceptionally thorough. Their advocate background makes a massive difference in high-stakes financial cases.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    tag: 'Forensic & Legal Dispute'
  }
];

export const caseStudiesData: CaseStudy[] = [
  {
    id: 'cs1',
    clientIndustry: 'Manufacturing & Export',
    challenge: 'Heavy withholding tax accumulation and FBR audit notice threatening PKR 15M penalty.',
    solution: 'Restructured supply chain accounting, appealed notice at Appellate Tribunal, and claimed legitimate tax exemptions.',
    results: [
      'PKR 15M penalty completely annulled',
      'Secured PKR 4.2M FBR tax refund',
      'Attained active Filer status with zero penalty record'
    ],
    metric: '100%',
    metricLabel: 'Penalty Annulled'
  },
  {
    id: 'cs2',
    clientIndustry: 'UK Tech Startup',
    challenge: 'Need for multi-currency cloud accounting and HMRC Corporation Tax filing with cross-border team.',
    solution: 'Implemented Xero ERP with automated currency conversion, multi-tier payroll, and R&D tax relief claim.',
    results: [
      'Claimed £38,000 in HMRC R&D Tax Relief',
      'Automated 90% of bookkeeping workflow',
      'Flawless SECP & HMRC annual filing'
    ],
    metric: '£38k+',
    metricLabel: 'Tax Relief Claimed'
  },
  {
    id: 'cs3',
    clientIndustry: 'Construction & Real Estate Group',
    challenge: 'Partnership dispute over PKR 80M capital contribution and unverified ledger entries.',
    solution: 'Conducted detailed 3-year forensic audit with verified bank trail analysis and expert legal advisory.',
    results: [
      'Uncovered PKR 12.5M concealed funds',
      'Drafted legally binding settlement deed',
      'Saved 2+ years of protracted court litigation'
    ],
    metric: 'PKR 12.5M',
    metricLabel: 'Assets Recovered'
  }
];

export const taxDeadlinesData: TaxDeadline[] = [
  {
    title: 'FBR Annual Income Tax Return Filing',
    date: 'September 30',
    jurisdiction: 'Pakistan (FBR)',
    description: 'Deadline for individuals, salaried employees, and business entities to file annual tax returns.',
    urgent: true
  },
  {
    title: 'HMRC Self-Assessment Tax Return',
    date: 'January 31',
    jurisdiction: 'UK (HMRC)',
    description: 'Deadline for online tax return filing and payment of tax owed for self-employed individuals.',
    urgent: false
  },
  {
    title: 'SECP Annual Return Filing (Form A / 29)',
    date: '30 Days post-AGM',
    jurisdiction: 'Pakistan (SECP)',
    description: 'Mandatory filing of company board changes and audited financial accounts with SECP.',
    urgent: true
  },
  {
    title: 'Monthly Sales Tax Return (FBR & KPRA)',
    date: '15th of every month',
    jurisdiction: 'Pakistan (FBR & Regional)',
    description: 'Filing of monthly sales tax invoice summary and annexures for registered businesses.',
    urgent: false
  }
];

export const faqsData = [
  {
    question: 'Why choose Raja Gulfam & Co. over conventional accounting firms?',
    answer: 'Raja Gulfam & Co. combines dual expertise in Chartered Management Accounting and Legal Advisory (Advocate). Unlike standard accountants who only file forms, Raja Gulfam Kayani and our team provide complete tax optimization, SECP legal protection, and court-admissible forensic accounting under one roof.'
  },
  {
    question: 'How does the FBR Filer status benefit my business in Pakistan?',
    answer: 'Being an active FBR Filer drastically reduces withholding tax rates on bank transactions, property purchases, vehicle registrations, and imports (saving up to 50% on taxes). It also eliminates risk of heavy non-filer penalties and audit notices.'
  },
  {
    question: 'Do you support international clients operating in the UK, USA, or Gulf?',
    answer: 'Yes! We serve clients across Pakistan, the UK (HMRC CT600 & Self-Assessment), the US (IRS Tax Returns), and the Gulf region (Corporate Tax & VAT). We specialize in cross-border tax advisory and cloud accounting setups.'
  },
  {
    question: 'What documents do I need for a free initial consultation?',
    answer: 'For tax filing or audit inquiries, simple copies of your latest bank statements, previous tax returns (if any), registration certificates (NTN/CNIC/SECP), or financial statements are sufficient. We treat all client information with 100% legal confidentiality.'
  },
  {
    question: 'How quickly can you incorporate a company with SECP?',
    answer: 'Under our express corporate advisory service, SECP company incorporation (Private Limited or SMC-Pvt Ltd) is completed within 48 to 72 hours, including NTN registration and bank account authorization assistance.'
  }
];
