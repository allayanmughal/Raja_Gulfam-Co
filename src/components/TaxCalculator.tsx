import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Region } from '../types';

interface TaxCalculatorProps {
  onOpenBooking: () => void;
}

type PkEntityType = 'individual' | 'business' | 'company';

/**
 * A standard progressive bracket: once `income` passes `upTo`, tax owed is
 * `base` (the tax accumulated by every lower bracket) plus `rate` applied to
 * the portion of income above `from`. `upTo: null` means "and everything above".
 */
interface Bracket {
  upTo: number | null;
  base: number;
  from: number;
  rate: number;
}

const ENTITY_TYPES: { id: PkEntityType; label: string }[] = [
  { id: 'individual', label: 'Salaried Individual' },
  { id: 'business', label: 'Business Individual' },
  { id: 'company', label: 'Pvt Ltd Company' },
];

// Category A — Salaried Individual (PKR)
const PK_SALARIED_BRACKETS: Bracket[] = [
  { upTo: 600000, base: 0, from: 0, rate: 0 },
  { upTo: 1200000, base: 0, from: 600000, rate: 0.01 },
  { upTo: 2200000, base: 6000, from: 1200000, rate: 0.11 },
  { upTo: 3200000, base: 116000, from: 2200000, rate: 0.2 },
  { upTo: 4100000, base: 316000, from: 3200000, rate: 0.25 },
  { upTo: 5600000, base: 541000, from: 4100000, rate: 0.29 },
  { upTo: 7000000, base: 976000, from: 5600000, rate: 0.32 },
  { upTo: null, base: 1424000, from: 7000000, rate: 0.35 },
];

// Category B — Business Individual / Non-Salaried (PKR)
const PK_BUSINESS_BRACKETS: Bracket[] = [
  { upTo: 600000, base: 0, from: 0, rate: 0 },
  { upTo: 1200000, base: 0, from: 600000, rate: 0.15 },
  { upTo: 1600000, base: 90000, from: 1200000, rate: 0.2 },
  { upTo: 3200000, base: 170000, from: 1600000, rate: 0.3 },
  { upTo: 5600000, base: 650000, from: 3200000, rate: 0.4 },
  { upTo: null, base: 1610000, from: 5600000, rate: 0.45 },
];

// Category C — Pvt Ltd Company (PKR): flat rate, no brackets.
const PK_COMPANY_RATE = 0.29;

// Service fee is driven by revenue bracket, not by entity type.
const PK_FEE_BRACKETS: { upTo: number | null; fee: number }[] = [
  { upTo: 2000000, fee: 25000 },
  { upTo: 5000000, fee: 50000 },
  { upTo: 10000000, fee: 75000 },
  { upTo: null, fee: 120000 },
];

function progressiveTax(income: number, brackets: Bracket[]): number {
  const match = brackets.find((b) => b.upTo === null || income <= b.upTo);
  if (!match) return 0;
  return match.base + Math.max(0, income - match.from) * match.rate;
}

function feeForRevenue(revenue: number): number {
  const match = PK_FEE_BRACKETS.find((b) => b.upTo === null || revenue <= b.upTo);
  return match ? match.fee : 0;
}

export const TaxCalculator: React.FC<TaxCalculatorProps> = ({ onOpenBooking }) => {
  const [region, setRegion] = useState<Region>('PK');
  const [entityType, setEntityType] = useState<PkEntityType>('company');
  const [annualIncome, setAnnualIncome] = useState<number>(3500000);

  const calculateTax = () => {
    let currencySymbol = 'PKR ';
    let tax = 0;
    let feeEstimate = 0;

    if (region === 'PK') {
      currencySymbol = 'PKR ';
      if (entityType === 'individual') {
        tax = progressiveTax(annualIncome, PK_SALARIED_BRACKETS);
      } else if (entityType === 'business') {
        tax = progressiveTax(annualIncome, PK_BUSINESS_BRACKETS);
      } else {
        tax = annualIncome * PK_COMPANY_RATE;
      }
      feeEstimate = feeForRevenue(annualIncome);
    } else if (region === 'UK') {
      currencySymbol = '£ ';
      tax = entityType === 'company' ? annualIncome * 0.19 : (annualIncome - 12570) * 0.2;
      feeEstimate = 850;
    } else {
      currencySymbol = '$ ';
      tax = annualIncome * 0.21;
      feeEstimate = 1200;
    }

    return { currencySymbol, tax: Math.max(0, Math.round(tax)), feeEstimate };
  };

  const calc = calculateTax();

  return (
    <section id="calculator" className="py-24 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors">
      <div className="max-w-4xl mx-auto px-6 sm:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-3 max-w-xl mx-auto mb-12"
        >
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Tax & Service Fee Estimator
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Select your jurisdiction and annual income to see estimated tax liabilities.
          </p>
        </motion.div>

        {/* Calculator Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, type: 'spring', stiffness: 90 }}
          className="p-8 md:p-12 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-8 shadow-md"
        >
          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Tax Jurisdiction:</label>
              <div className="grid grid-cols-3 gap-2">
                {(['PK', 'UK', 'USA'] as Region[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setRegion(r);
                      if (r === 'PK') setAnnualIncome(3500000);
                      if (r === 'UK') setAnnualIncome(45000);
                      if (r === 'USA') setAnnualIncome(75000);
                    }}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      region === r
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white border border-slate-200 dark:border-transparent'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Entity Type:</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {ENTITY_TYPES.map((ent) => (
                  <button
                    key={ent.id}
                    onClick={() => setEntityType(ent.id)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                      entityType === ent.id
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white border border-slate-200 dark:border-transparent'
                    }`}
                  >
                    {ent.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Slider */}
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center text-sm font-bold text-slate-900 dark:text-white">
              <span>Annual Revenue / Gross Income:</span>
              <span className="font-heading text-2xl text-blue-600 dark:text-blue-400">
                {calc.currencySymbol}{annualIncome.toLocaleString()}
              </span>
            </div>

            <input
              type="range"
              min={region === 'PK' ? 500000 : 10000}
              max={region === 'PK' ? 20000000 : 200000}
              step={region === 'PK' ? 250000 : 5000}
              value={annualIncome}
              onChange={(e) => setAnnualIncome(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600 dark:accent-blue-500"
            />
          </div>

          {/* Calculation Output */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Estimated Tax Liability</span>
              <p className="font-heading text-2xl font-extrabold text-rose-600 dark:text-rose-400">
                {calc.currencySymbol}{calc.tax.toLocaleString()}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Est. Service Package Fee</span>
              <p className="font-heading text-2xl font-extrabold text-blue-600 dark:text-blue-400">
                {calc.currencySymbol}{calc.feeEstimate.toLocaleString()}
              </p>
            </div>
          </div>

          <button
            onClick={onOpenBooking}
            className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <span>Book Consultation & Claim Review</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>

      </div>
    </section>
  );
};
