import type { ServiceItem } from '../types';

export const servicesData: ServiceItem[] = [
  {
    id: 'audit-assurance',
    title: 'Statutory Audit & Assurance',
    category: 'Audit',
    icon: 'ShieldCheck',
    shortDesc: 'Independent statutory audits, internal control assessments, and regulatory compliance reports.',
    fullDesc: 'We deliver comprehensive statutory and internal audit solutions aligned with International Standards on Auditing (ISA), FBR, SECP, HMRC, and GAAP requirements. Our rigorous assurance procedures build stakeholder confidence and optimize financial integrity.',
    jurisdictions: ['PK', 'UK', 'USA', 'GULF'],
    features: [
      'Statutory Financial Statement Audits',
      'Internal Control & Governance Reviews',
      'Regulatory Compliance Audits (SECP, FBR, HMRC)',
      'Risk Assessment & Mitigation Planning',
      'Due Diligence for M&A & Investments'
    ],
    benefits: [
      'Full statutory compliance with zero penalty risk',
      'Enhanced credit rating and banking credibility',
      'Identification of operational bottlenecks & leakages'
    ],
    deliverables: [
      'Auditor Report & Opinion Letter',
      'Management Letter on Internal Control Vulnerabilities',
      'Certified Financial Statements'
    ]
  },
  {
    id: 'taxation-global',
    title: 'Tax Planning & Global Filing',
    category: 'Taxation',
    icon: 'Calculator',
    shortDesc: 'Income Tax, Sales Tax/VAT, Corporate Tax, and cross-border international tax optimization.',
    fullDesc: 'Navigating complex global tax frameworks requires strategic foresight. Raja Gulfam & Co. provides end-to-end tax advisory, filing, and dispute resolution across Pakistan (FBR), UK (HMRC), US (IRS), and Gulf VAT regulatory regimes.',
    jurisdictions: ['PK', 'UK', 'USA', 'GULF'],
    features: [
      'Annual Income Tax & Sales Tax Return Filing',
      'UK HMRC Self-Assessment & Corporation Tax (CT600)',
      'US IRS Form 1040, 1120 & Foreign Asset Reporting',
      'Withholding Tax Management & Exemption Certificates',
      'Transfer Pricing & Cross-Border Tax Structuring'
    ],
    benefits: [
      'Legitimate tax liability reduction by up to 35%',
      'Active FBR Filer status with maximum withholding tax refunds',
      'Seamless multi-jurisdiction compliance'
    ],
    deliverables: [
      'Tax Returns Submission Proof & Wealth Statements',
      'Tax Exemption & Filer Status Certificates',
      'Annual Strategic Tax Plan'
    ]
  },
  {
    id: 'legal-corporate',
    title: 'SECP Legal & Corporate Advisory',
    category: 'Legal',
    icon: 'Scale',
    shortDesc: 'Company formation, SECP corporate filings, contract vetting, and business legal compliance.',
    fullDesc: 'Directly supervised by Raja Gulfam Kayani (Advocate), our corporate law legal division provides unmatched protection. From company incorporation to complex shareholder agreements and cross-border commercial litigation support.',
    jurisdictions: ['PK', 'UK', 'USA', 'GULF'],
    features: [
      'Company Incorporation (Private Limited, LLC, LLP, SMC)',
      'SECP Annual Returns (Form 29, Form A, Form 45)',
      'Drafting & Vetting Commercial Contracts & MoUs',
      'Joint Ventures & Foreign Direct Investment (FDI) Structuring',
      'Trademark, Copyright & Intellectual Property Protection'
    ],
    benefits: [
      '100% legal protection against regulatory liabilities',
      'Fast-track company setup within 48-72 hours',
      'Expert representation in legal & regulatory tribunals'
    ],
    deliverables: [
      'Certificate of Incorporation & Form 29/A',
      'Vetted Contracts & Shareholder Agreements',
      'SECP Compliance Verification'
    ]
  },
  {
    id: 'financial-advisory',
    title: 'Virtual CFO & Financial Advisory',
    category: 'Advisory',
    icon: 'TrendingUp',
    shortDesc: 'Strategic financial modeling, cash flow forecasting, budgeting, and corporate restructuring.',
    fullDesc: 'Empower your enterprise with executive-level financial management without the overhead of a full-time CFO. We assist executive boards in strategic financial planning, capital raising, and cash flow optimization.',
    jurisdictions: ['PK', 'UK', 'USA', 'GULF'],
    features: [
      'Rolling 12-Month Financial Forecasting & Budgeting',
      'Executive Financial Dashboards & KPI Monitoring',
      'Working Capital & Cash Flow Optimization',
      'Business Valuation & Capital Raising Pitch Decks',
      'Corporate Restructuring & Debt Refinancing'
    ],
    benefits: [
      'Accelerated profit margins through cost management',
      'Investor-ready financial projections and pitch decks',
      'Data-driven decision making at executive level'
    ],
    deliverables: [
      'Monthly Executive Financial Performance Report',
      'Interactive Financial Model (Excel / BI)',
      'Quarterly Board Strategy Deck'
    ]
  },
  {
    id: 'forensic-accounting',
    title: 'Forensic Accounting & Fraud Audit',
    category: 'Forensic',
    icon: 'Search',
    shortDesc: 'Investigative accounting, fraud detection, litigation support, and court-admissible evidence.',
    fullDesc: 'When financial anomalies, fraud, or disputes arise, our expert forensic team uncovers truth. Led by experienced advocates and auditors, we provide clear court-admissible forensic reports for corporate litigation and arbitration.',
    jurisdictions: ['PK', 'UK', 'USA', 'GULF'],
    features: [
      'Financial Crime & Embezzlement Investigations',
      'Asset Tracing & Misappropriation Audits',
      'Shareholder & Partnership Dispute Financial Analysis',
      'Court-Admissible Expert Witness Testimony',
      'Internal Control Fraud Vulnerability Audits'
    ],
    benefits: [
      'Asset recovery and quantification of financial loss',
      'Legally binding court evidence prepared by advocates',
      'Prevention of insider fraud and leakages'
    ],
    deliverables: [
      'Comprehensive Forensic Audit Report with Trail Evidence',
      'Expert Witness Affidavit for Legal Proceedings',
      'Corrective Remediation Plan'
    ]
  },
  {
    id: 'bookkeeping-cloud',
    title: 'Cloud Bookkeeping & ERP Setup',
    category: 'Accounting',
    icon: 'Database',
    shortDesc: 'Full-cycle bookkeeping, Tally ERP, QuickBooks, Xero integration, and payroll management.',
    fullDesc: 'Streamline your daily accounts with cloud-based automated bookkeeping. We set up, migrate, and manage modern accounting systems ensuring real-time financial transparency.',
    jurisdictions: ['PK', 'UK', 'USA', 'GULF'],
    features: [
      'Day-to-Day Transaction Entry & Ledger Maintenance',
      'Bank & Credit Card Reconciliation',
      'QuickBooks Online, Xero, Tally ERP Setup & Training',
      'Payroll Processing & Monthly EOBR / Social Security',
      'Custom Financial Reporting & Management Accounts'
    ],
    benefits: [
      'Real-time access to business P&L and Balance Sheet',
      'Save 15+ hours per week on administrative accounting',
      'Flawless year-end tax audit readiness'
    ],
    deliverables: [
      'Configured Cloud Accounting Platform',
      'Monthly Ledger Reconciliation Statement',
      'Monthly Payslips & Statutory Returns'
    ]
  }
];
