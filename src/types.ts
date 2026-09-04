export type Region = 'PK' | 'UK' | 'USA' | 'GULF' | 'GLOBAL';
export type PageView = 'home' | 'faqs' | 'team' | 'admin';

export interface ServiceItem {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  category: 'Audit' | 'Taxation' | 'Legal' | 'Advisory' | 'Forensic' | 'Accounting';
  icon: string;
  features: string[];
  jurisdictions: Region[];
  benefits: string[];
  deliverables: string[];
}

export interface TaxEstimationParams {
  region: Region;
  entityType: 'individual' | 'sole_proprietor' | 'partnership' | 'company';
  annualIncome: number; // In local currency or USD
  expenses?: number;
  serviceInterest: string[];
}

export interface TaxEstimationResult {
  estimatedTaxableIncome: number;
  estimatedTaxLiability: number;
  effectiveTaxRate: number;
  currency: string;
  taxBracket: string;
  estimatedServiceFee: number;
  recommendations: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  location: string;
  content: string;
  rating: number;
  avatar: string;
  tag: string;
}

export interface CaseStudy {
  id: string;
  clientIndustry: string;
  challenge: string;
  solution: string;
  results: string[];
  metric: string;
  metricLabel: string;
}

export interface TaxDeadline {
  title: string;
  date: string;
  jurisdiction: string;
  description: string;
  urgent?: boolean;
}
