import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Region } from '../types';

interface TaxCalculatorProps {
  onOpenBooking: () => void;
}

export const TaxCalculator: React.FC<TaxCalculatorProps> = ({ onOpenBooking }) => {
  const [region, setRegion] = useState<Region>('PK');
  const [entityType, setEntityType] = useState<'individual' | 'company'>('company');
  const [annualIncome, setAnnualIncome] = useState<number>(3500000);

  const calculateTax = () => {
    let currencySymbol = 'PKR ';
    let tax = 0;
    let feeEstimate = 0;

    if (region === 'PK') {
      currencySymbol = 'PKR ';
      if (entityType === 'individual') {
        if (annualIncome <= 600000) tax = 0;
        else if (annualIncome <= 1200000) tax = (annualIncome - 600000) * 0.025;
        else if (annualIncome <= 2400000) tax = 15000 + (annualIncome - 1200000) * 0.125;
        else tax = 165000 + (annualIncome - 2400000) * 0.225;
        feeEstimate = 25000;
      } else {
        tax = annualIncome * 0.29;
        feeEstimate = 75000;
      }
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
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Interactive Tool
          </span>
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
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'individual', label: 'Salaried Individual' },
                  { id: 'company', label: 'Pvt Ltd Company' },
                ].map((ent) => (
                  <button
                    key={ent.id}
                    onClick={() => setEntityType(ent.id as any)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
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
